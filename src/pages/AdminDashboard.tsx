import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Trash2, 
  Users, Building, RefreshCcw, Search, Eye,
  LogOut, Newspaper, Image as ImageIcon, Mail, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Language } from '../translations';

interface AdminDashboardProps {
  lang: Language;
}

interface AdminPermissions {
  canAccessGallery?: boolean;
  canAccessNews?: boolean;
  canAccessContacts?: boolean;
  canAccessChampions?: boolean;
  canAccessReferees?: boolean;
  canAccessTechnicalOfficials?: boolean;
  canAccessPlayerDetails?: boolean;
  canAccessInstitutionDetails?: boolean;
  canDelete?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang: _lang }) => { 
  const [activeTab, setActiveTab] = useState<'players' | 'institutions'>('players');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [ageFilter, setAgeFilter] = useState<'All Ages' | 'Under 10' | '10-14' | '14-16' | '16-19' | '19-25' | 'Over 25'>('All Ages');

  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogout = () => {
    // Clear authentication flags and admin JWT
    localStorage.removeItem('token');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminPermissions');
    sessionStorage.removeItem('isAdminAuthenticated');
    window.location.href = '/admin-portal-access';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'players' ? '/api/players' : '/api/institutions';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Resolve admin role from localStorage or JWT token once on mount
  useEffect(() => {
    let storedRole = localStorage.getItem('adminRole');
    const storedPermsRaw = localStorage.getItem('adminPermissions');

    if (storedPermsRaw) {
      try {
        const parsed: AdminPermissions = JSON.parse(storedPermsRaw);
        setAdminPermissions(parsed);
      } catch (e) {
        console.error('Failed to parse adminPermissions from storage', e);
      }
    }

    if (!storedRole) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payloadPart = token.split('.')[1];
          const decoded = JSON.parse(atob(payloadPart));
          if (decoded && typeof decoded.role === 'string') {
            storedRole = decoded.role;
            localStorage.setItem('adminRole', decoded.role);
          }
        } catch (e) {
          console.error('Failed to decode admin role from token', e);
        }
      }
    }

    if (storedRole) {
      setAdminRole(storedRole);
    }
  }, []);

  // Refresh permissions and role from backend so Admin Management changes apply without re-login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.admin) {
          const { role, permissions } = result.admin;
          if (role) {
            setAdminRole(role);
            localStorage.setItem('adminRole', role);
          }
          if (permissions) {
            setAdminPermissions(permissions);
            localStorage.setItem('adminPermissions', JSON.stringify(permissions));
          }
        }
      } catch (e) {
        console.error('Failed to refresh admin profile', e);
      }
    };

    fetchMe();
  }, [API_URL]);

  const updateStatus = async (id: string, newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    try {
      const endpoint = activeTab === 'players' ? '/api/players/status' : '/api/institutions/status';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) {
        fetchData();
      } else {
        const errData = await response.json();
        alert(errData.message || "Error updating status");
      }
    } catch (error) {
      alert("Error updating status");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm("Permanently delete this record? This cannot be undone.")) return;
    try {
      const endpoint = activeTab === 'players' ? `/api/players/${id}` : `/api/institutions/${id}`;
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        fetchData();
      } else {
        alert("Delete failed on server");
      }
    } catch (error) {
      alert("Error deleting entry");
    }
  };

  const calculateAge = (dob?: string) => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return null;
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const getAgeGroup = (dob?: string) => {
    const age = calculateAge(dob);
    if (age === null) return 'N/A';
    if (age < 10) return 'Under 10';
    if (age <= 14) return '10-14';
    if (age <= 16) return '14-16';
    if (age <= 19) return '16-19';
    if (age <= 25) return '19-25';
    return 'Over 25';
  };

  const searchFiltered = data.filter(item => 
    (item.fullName || item.instName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.aadharNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.phone || item.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusFiltered = searchFiltered.filter(item => {
    if (statusFilter === 'All') return true;
    return (item.status || 'Pending') === statusFilter;
  });

  const filteredData = statusFiltered.filter(item => {
    if (activeTab !== 'players' || ageFilter === 'All Ages') return true;
    const group = getAgeGroup(item.dob);
    return group === ageFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-oswald font-bold text-blue-900 uppercase tracking-tight">DDKA CONTROL CENTER</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Admin Portal • Team DDKA (Build with Passion ❤️)
            </p>
            {adminRole && (
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                Admin Type: {adminRole === 'superadmin' ? 'SUPERADMIN' : 'ADMIN'}
              </p>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-black shadow-sm border-2 border-red-50 hover:bg-red-600 hover:text-white transition-all active:scale-95"
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div>

        {/* Admin Management Panel */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {/* Gallery - requires canAccessGallery */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessGallery) {
                window.location.href = '/admin/gallery';
              } else {
                alert('You do not have permission to manage gallery. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              adminRole === 'superadmin' || adminPermissions?.canAccessGallery
                ? 'bg-white hover:bg-blue-50 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ImageIcon
              size={32}
              className={`${
                adminRole === 'superadmin' || adminPermissions?.canAccessGallery
                  ? 'text-blue-700 mb-2'
                  : 'text-slate-400 mb-2'
              }`}
            />
            <span className="font-bold text-xs">Manage Gallery</span>
          </button>

          {/* News - requires canAccessNews */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessNews) {
                window.location.href = '/admin-news-upload';
              } else {
                alert('You do not have permission to manage news. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              adminRole === 'superadmin' || adminPermissions?.canAccessNews
                ? 'bg-white hover:bg-blue-50 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Newspaper
              size={32}
              className={`${
                adminRole === 'superadmin' || adminPermissions?.canAccessNews
                  ? 'text-blue-700 mb-2'
                  : 'text-slate-400 mb-2'
              }`}
            />
            <span className="font-bold text-xs">Manage News</span>
          </button>

          {/* Contacts - requires canAccessContacts */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessContacts) {
                window.location.href = '/admin/contact';
              } else {
                alert('You do not have permission to manage contact forms. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              adminRole === 'superadmin' || adminPermissions?.canAccessContacts
                ? 'bg-white hover:bg-blue-50 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Mail
              size={28}
              className={`${
                adminRole === 'superadmin' || adminPermissions?.canAccessContacts
                  ? 'text-blue-700 mb-2'
                  : 'text-slate-400 mb-2'
              }`}
            />
            <span className="font-bold text-xs">Contact Forms</span>
          </button>

          {/* Our Champions - requires canAccessChampions */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessChampions) {
                window.location.href = '/admin/players';
              } else {
                alert('You do not have permission to manage champions. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              adminRole === 'superadmin' || adminPermissions?.canAccessChampions
                ? 'bg-white hover:bg-orange-50 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Users
              size={28}
              className={`${
                adminRole === 'superadmin' || adminPermissions?.canAccessChampions
                  ? 'text-orange-700 mb-2'
                  : 'text-slate-400 mb-2'
              }`}
            />
            <span className="font-bold text-xs">Our Champions</span>
          </button>

          {/* Referee Board - requires canAccessReferees */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessReferees) {
                window.location.href = '/admin/referees';
              } else {
                alert('You do not have permission to manage referees. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              adminRole === 'superadmin' || adminPermissions?.canAccessReferees
                ? 'bg-white hover:bg-slate-50 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Users
              size={28}
              className={`${
                adminRole === 'superadmin' || adminPermissions?.canAccessReferees
                  ? 'text-slate-700 mb-2'
                  : 'text-slate-400 mb-2'
              }`}
            />
            <span className="font-bold text-xs">Referee Board</span>
          </button>

          {/* Technical Officials - requires canAccessTechnicalOfficials */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessTechnicalOfficials) {
                window.location.href = '/admin/technical-officials';
              } else {
                alert('You do not have permission to manage technical officials. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              adminRole === 'superadmin' || adminPermissions?.canAccessTechnicalOfficials
                ? 'bg-white hover:bg-slate-50 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <UserCheck
              size={28}
              className={`${
                adminRole === 'superadmin' || adminPermissions?.canAccessTechnicalOfficials
                  ? 'text-emerald-700 mb-2'
                  : 'text-slate-400 mb-2'
              }`}
            />
            <span className="font-bold text-xs">Technical Officials</span>
          </button>
          {adminRole === 'superadmin' && (
            <Link to="/admin/manage-admins" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow border hover:bg-red-50 transition-all">
              <Users size={28} className="text-red-700 mb-2" />
              <span className="font-bold text-xs text-red-900">Manage Admins</span>
            </Link>
          )}
          {/* Player Details tab - requires canAccessPlayerDetails */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessPlayerDetails) {
                setActiveTab('players');
              } else {
                alert('You do not have permission to view player details. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              activeTab === 'players'
                ? 'bg-blue-900 text-white'
                : (adminRole === 'superadmin' || adminPermissions?.canAccessPlayerDetails)
                    ? 'bg-white hover:bg-blue-50 text-blue-900'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Users
              size={28}
              className={
                activeTab === 'players'
                  ? 'text-orange-400'
                  : (adminRole === 'superadmin' || adminPermissions?.canAccessPlayerDetails)
                      ? 'text-blue-900'
                      : 'text-slate-400'
              }
            />
            <span className="font-bold text-xs">Player Details</span>
          </button>

          {/* Institution Details tab - requires canAccessInstitutionDetails */}
          <button
            type="button"
            onClick={() => {
              if (adminRole === 'superadmin' || adminPermissions?.canAccessInstitutionDetails) {
                setActiveTab('institutions');
              } else {
                alert('You do not have permission to view institution details. Please contact the superadmin.');
              }
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${
              activeTab === 'institutions'
                ? 'bg-blue-900 text-white'
                : (adminRole === 'superadmin' || adminPermissions?.canAccessInstitutionDetails)
                    ? 'bg-white hover:bg-blue-50 text-blue-900'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Building
              size={28}
              className={
                activeTab === 'institutions'
                  ? 'text-orange-400'
                  : (adminRole === 'superadmin' || adminPermissions?.canAccessInstitutionDetails)
                      ? 'text-blue-900'
                      : 'text-slate-400'
              }
            />
            <span className="font-bold text-xs">Institution Details</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone, Aadhar, or transaction ID..." 
            className="w-full pl-16 pr-6 py-4 bg-white border-4 border-white rounded-[2rem] shadow-xl focus:ring-8 focus:ring-blue-50 outline-none transition-all font-medium text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters: Status + Age Group */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                  statusFilter === status
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {activeTab === 'players' && (
            <div className="flex flex-wrap gap-2">
              {([
                'All Ages',
                'Under 10',
                '10-14',
                '14-16',
                '16-19',
                '19-25',
                'Over 25',
              ] as const).map((age) => (
                <button
                  key={age}
                  onClick={() => setAgeFilter(age)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                    ageFilter === age
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-100">
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Photo</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Name</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Email</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Phone</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Age Group / Type</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Role</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Status</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {loading ? (
                  <tr><td colSpan={8} className="p-32 text-center"><RefreshCcw className="animate-spin mx-auto text-blue-900 mb-4" size={48} /></td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={8} className="p-32 text-center text-slate-300 font-bold uppercase tracking-widest">No records found</td></tr>
                ) : filteredData.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                    {/* Photo */}
                    <td className="p-6">
                      <div className="flex items-center justify-center">
                        {item.photo || item.photoUrl || item.instLogoUrl || item.instLogo || item.logo ? (
                          <img
                            src={item.photo || item.photoUrl || item.instLogoUrl || item.instLogo || item.logo}
                            alt={item.fullName || item.instName || 'Photo'}
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                            {(item.fullName || item.instName || 'U')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="p-6">
                      <p className="font-black text-blue-950 text-base leading-tight">{item.fullName || item.instName}</p>
                    </td>

                    {/* Email */}
                    <td className="p-6">
                      <p className="text-sm text-slate-700 font-medium">{item.email || '-'}</p>
                    </td>

                    {/* Phone */}
                    <td className="p-6">
                      <p className="text-sm text-slate-700 font-medium">{item.phone || item.officePhone || '-'}</p>
                    </td>

                    {/* Age Group / Type */}
                    <td className="p-6">
                      {activeTab === 'players' ? (
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-slate-100 text-blue-700 text-xs font-black uppercase tracking-widest">
                          {getAgeGroup(item.dob)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-slate-100 text-blue-700 text-xs font-black uppercase tracking-widest">
                          {item.instType || 'N/A'}
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="p-6">
                      <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest">
                        {activeTab === 'players' ? (item.memberRole || 'Player') : 'Institution'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-6">
                      <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border-2 ${
                        item.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                        item.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => updateStatus(item._id, 'Approved')} 
                          className="p-2 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all active:scale-90"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => updateStatus(item._id, 'Rejected')} 
                          className="p-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                        {adminRole === 'superadmin' && adminPermissions?.canDelete && (
                          <button 
                            onClick={() => deleteEntry(item._id)} 
                            className="p-2 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-950 hover:text-white transition-all active:scale-90"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <a
                          href={activeTab === 'players' ? `/admin/registration/${item._id}` : `/admin/institution/${item._id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                          title="View Details"
                        >
                          <Eye size={16} /> View Details
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;