import React, { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Eye, RefreshCcw, Search, Trash2, XCircle } from 'lucide-react';
import ExportCsvModal from '../components/admin/ExportCsvModal';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';

interface AdminPermissions {
  canAccessPlayerDetails?: boolean;
  canAccessInstitutionDetails?: boolean;
  canDelete?: boolean;
}

const AdminRegistrations: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'players' | 'institutions'>('players');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [ageFilter, setAgeFilter] = useState<'All Ages' | 'Under 10' | '10-14' | '14-16' | '16-19' | '19-25' | 'Over 25'>('All Ages');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);

  const [publicSettings, setPublicSettings] = useState<{ allowExportAll?: boolean; allowExportPlayers?: boolean; allowExportInstitutions?: boolean }>({});

  const playerExportFields = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'dob', label: 'DOB' },
    { key: 'aadharNumber', label: 'Aadhar' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'memberRole', label: 'Role' },
    { key: 'idNo', label: 'ID Number' },
    { key: 'status', label: 'Status' }
  ];

  const institutionExportFields = [
    { key: 'instName', label: 'Institution Name' },
    { key: 'instType', label: 'Type' },
    { key: 'officePhone', label: 'Office Phone' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'regNo', label: 'Reg No' },
    { key: 'status', label: 'Status' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'institutions') setActiveTab('institutions');
    else setActiveTab('players');
  }, [location.search]);

  useEffect(() => {
    const storedRole = localStorage.getItem('adminRole');
    const permsRaw = localStorage.getItem('adminPermissions');
    setAdminRole(storedRole);
    if (permsRaw) {
      try {
        setAdminPermissions(JSON.parse(permsRaw));
      } catch (e) {
        console.error('Failed to parse adminPermissions', e);
      }
    }
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const loadPublicSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings/public`);
        const json = await res.json();
        if (json && json.success && json.data) {
          setPublicSettings({
            allowExportAll: typeof json.data.allowExportAll === 'boolean' ? json.data.allowExportAll : true,
            allowExportPlayers: typeof json.data.allowExportPlayers === 'boolean' ? json.data.allowExportPlayers : true,
            allowExportInstitutions: typeof json.data.allowExportInstitutions === 'boolean' ? json.data.allowExportInstitutions : true,
          });
        }
      } catch (e) {
        console.error('Failed to fetch public settings', e);
      }
    };
    loadPublicSettings();
  }, [API_URL]);

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
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

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
        const resJson = await response.json();
        fetchData();
        if (resJson.emailSkipped) {
          const reason = resJson.emailSkipReason ? ` (${resJson.emailSkipReason})` : '';
          alert(`Email skipped${reason}`);
        } else if (resJson.emailSent) {
          const type = resJson.emailType === 'rejection' ? 'Rejection' : resJson.emailType === 'approval' ? 'Approval' : 'Notification';
          alert(`${type} email sent`);
        }
      } else {
        const errData = await response.json();
        alert(errData.message || 'Error updating status');
      }
    } catch (error) {
      alert('Error updating status');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Permanently delete this record? This cannot be undone.')) return;
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
        alert('Delete failed on server');
      }
    } catch (error) {
      alert('Error deleting entry');
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

  const filteredData = useMemo(() => {
    const q = deferredSearchTerm.trim().toLowerCase();
    return data.filter((item) => {
      if (q) {
        const match = (
          (item.fullName || item.instName || '').toLowerCase().includes(q) ||
          (item.transactionId || '').toLowerCase().includes(q) ||
          (item.aadharNumber || '').toLowerCase().includes(q) ||
          (item.idNo || '').toLowerCase().includes(q) ||
          (item.phone || item.email || '').toLowerCase().includes(q)
        );
        if (!match) return false;
      }

      if (statusFilter !== 'All' && (item.status || 'Pending') !== statusFilter) return false;

      if (activeTab === 'players' && ageFilter !== 'All Ages') {
        const group = getAgeGroup(item.dob);
        if (group !== ageFilter) return false;
      }

      return true;
    });
  }, [data, deferredSearchTerm, statusFilter, ageFilter, activeTab]);

  const canSeePlayers = adminRole === 'superadmin' || adminPermissions?.canAccessPlayerDetails;
  const canSeeInstitutions = adminRole === 'superadmin' || adminPermissions?.canAccessInstitutionDetails;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Registrations"
          subtitle="Manage player and institution approvals"
        />

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => canSeePlayers ? setActiveTab('players') : alert('You do not have permission to view player details.')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all w-full min-h-[92px] ${
              activeTab === 'players'
                ? 'bg-blue-900 text-white'
                : canSeePlayers
                  ? 'bg-white hover:bg-blue-50 text-blue-900'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="font-bold text-xs">Player Details</span>
          </button>

          <button
            type="button"
            onClick={() => canSeeInstitutions ? setActiveTab('institutions') : alert('You do not have permission to view institution details.')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all w-full min-h-[92px] ${
              activeTab === 'institutions'
                ? 'bg-blue-900 text-white'
                : canSeeInstitutions
                  ? 'bg-white hover:bg-blue-50 text-blue-900'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="font-bold text-xs">Institution Details</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Records</h2>
            <p className="text-sm text-slate-500">Search and filter registrations</p>
          </div>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or Aadhar"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
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
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    ageFilter === age
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setSelectedIds([])}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 rounded-full text-xs font-bold border bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Clear Selection
            </button>

            {publicSettings.allowExportAll !== false && (
              <button
                onClick={() => setShowExportModal(true)}
                disabled={filteredData.length === 0}
                className="w-full sm:w-auto px-4 py-2 rounded-full text-xs font-bold border bg-white text-blue-900 hover:bg-blue-50 disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Download size={14} /> Export
              </button>
            )}
          </div>
        </div>

        <ExportCsvModal
          visible={showExportModal}
          onClose={() => setShowExportModal(false)}
          records={selectedIds.length ? filteredData.filter(i => selectedIds.includes(i._id)) : filteredData}
          fields={activeTab === 'players' ? playerExportFields : institutionExportFields}
          filenamePrefix={activeTab === 'players' ? 'players' : 'institutions'}
        />

        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
          {!isMobile ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100">
                    {publicSettings.allowExportAll !== false && !showExportModal && (
                      <th className="p-3 md:p-6">
                        <input type="checkbox" className="h-4 w-4" checked={filteredData.length > 0 && selectedIds.length === filteredData.length} onChange={(e) => { if (e.currentTarget.checked) setSelectedIds(filteredData.map(d => d._id)); else setSelectedIds([]); }} />
                      </th>
                    )}
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Photo</th>
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Name</th>
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Email</th>
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Phone</th>
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Age Group / Type</th>
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Role</th>
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Status</th>
                    <th className="p-3 md:p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-50">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="opacity-90">
                        <td className="p-4 md:p-6"><div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div></td>
                        <td className="p-4 md:p-6"><div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse"></div></td>
                        <td className="p-4 md:p-6"><div className="h-4 w-40 bg-slate-200 rounded animate-pulse"></div></td>
                        <td className="p-4 md:p-6"><div className="h-4 w-56 bg-slate-200 rounded animate-pulse"></div></td>
                        <td className="p-4 md:p-6"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div></td>
                        <td className="p-4 md:p-6"><div className="h-4 w-44 bg-slate-200 rounded animate-pulse"></div></td>
                        <td className="p-4 md:p-6"><div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div></td>
                        <td className="p-4 md:p-6"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div></td>
                        <td className="p-4 md:p-6 text-right"><div className="inline-block h-8 w-20 bg-slate-200 rounded animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : filteredData.length === 0 ? (
                    <tr><td colSpan={9} className="p-12 md:p-32 text-center text-slate-300 font-bold uppercase tracking-widest">No records found</td></tr>
                  ) : filteredData.map((item) => {
                    const statusValue = (item.status || 'Pending');
                    const statusKey = statusValue.toLowerCase();
                    const statusClass = statusKey === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : statusKey === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700';
                    const canApprove = statusKey !== 'approved';
                    const canReject = statusKey !== 'rejected';

                    return (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      {publicSettings.allowExportAll !== false && !showExportModal && (
                        <td className="p-3 md:p-6">
                          <input type="checkbox" className="h-4 w-4" checked={selectedIds.includes(item._id)} onChange={(e) => {
                            if (e.currentTarget.checked) setSelectedIds(prev => Array.from(new Set([...prev, item._id])));
                            else setSelectedIds(prev => prev.filter(id => id !== item._id));
                          }} />
                        </td>
                      )}

                      <td className="p-3 md:p-6">
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

                      <td className="p-3 md:p-6">
                        <p className="font-black text-blue-950 text-base leading-tight">{item.fullName || item.instName}</p>
                      </td>

                      <td className="p-3 md:p-6">
                        <p className="text-sm text-slate-700 font-medium">{item.email || '-'}</p>
                      </td>

                      <td className="p-3 md:p-6">
                        <p className="text-sm text-slate-700 font-medium">{item.phone || item.officePhone || '-'}</p>
                      </td>

                      <td className="p-3 md:p-6">
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

                      <td className="p-3 md:p-6">
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest">
                          {activeTab === 'players' ? (item.memberRole || 'Player') : 'Institution'}
                        </span>
                      </td>

                      <td className="p-3 md:p-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                          {statusValue}
                        </span>
                      </td>

                      <td className="p-3 md:p-6">
                        <div className="flex justify-end flex-wrap gap-2">
                          {/* View always first for clarity */}
                          <button
                            type="button"
                            onClick={() => {
                              const target = activeTab === 'players'
                                ? `/admin/registration/${item._id}`
                                : `/admin/institution/${item._id}`;
                              navigate(target, {
                                state: {
                                  data: item,
                                  type: activeTab === 'players' ? 'player' : 'institution',
                                  from: location.pathname + location.search,
                                },
                              });
                            }}
                            className="px-3 py-2 h-9 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                            title="View Details"
                          >
                            <Eye size={16} /> View
                          </button>

                          {canApprove && (
                            <button
                              onClick={() => updateStatus(item._id, 'Approved')}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all active:scale-90"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}

                          {canReject && (
                            <button
                              onClick={() => updateStatus(item._id, 'Rejected')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-90"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          )}

                          {(adminRole === 'superadmin' || adminPermissions?.canDelete) && (
                            <button
                              onClick={() => deleteEntry(item._id)}
                              className="p-2 bg-slate-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-90"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {loading ? (
                <div className="p-8 text-center"><RefreshCcw className="animate-spin mx-auto text-blue-900 mb-4" size={40} /></div>
              ) : filteredData.length === 0 ? (
                <div className="p-8 text-center text-slate-300 font-bold uppercase tracking-widest">No records found</div>
              ) : filteredData.map((item) => (
                <div key={item._id} className="p-4 rounded-lg border bg-slate-50 shadow-sm flex items-start gap-4">
                  {publicSettings.allowExportAll !== false && !showExportModal && (
                    <div className="flex-shrink-0">
                      <input type="checkbox" checked={selectedIds.includes(item._id)} onChange={(e) => {
                        if (e.currentTarget.checked) setSelectedIds(prev => Array.from(new Set([...prev, item._id])));
                        else setSelectedIds(prev => prev.filter(id => id !== item._id));
                      }} />
                    </div>
                  )}
                  <div className="flex-shrink-0">
                    {item.photo || item.photoUrl || item.instLogoUrl || item.instLogo || item.logo ? (
                      <img src={item.photo || item.photoUrl || item.instLogoUrl || item.instLogo || item.logo} alt={item.fullName || item.instName || 'Photo'} className="w-14 h-14 rounded-full object-cover border-2 border-slate-200" />
                    ) : (
                      <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {(item.fullName || item.instName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-black text-blue-950 text-base leading-tight">{item.fullName || item.instName}</p>
                        <p className="text-sm text-slate-600">{item.email || item.phone || '-'}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                        <StatusMark status={item.status} className="w-6 h-6" title={item.status || 'Pending'} />
                        <span className="sr-only">{item.status || 'Pending'}</span>
                      </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const target = activeTab === 'players'
                            ? `/admin/registration/${item._id}`
                            : `/admin/institution/${item._id}`;
                          navigate(target, {
                            state: {
                              data: item,
                              type: activeTab === 'players' ? 'player' : 'institution',
                              from: location.pathname + location.search,
                            },
                          });
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-black"
                      >
                        View
                      </button>
                      {(item.status || 'Pending').toLowerCase() !== 'approved' && (
                        <button onClick={() => updateStatus(item._id, 'Approved')} className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black">Approve</button>
                      )}
                      {(item.status || 'Pending').toLowerCase() !== 'rejected' && (
                        <button onClick={() => updateStatus(item._id, 'Rejected')} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-black">Reject</button>
                      )}
                      {(adminRole === 'superadmin' || adminPermissions?.canDelete) && (
                        <button onClick={() => deleteEntry(item._id)} className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-xs font-black">Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              )) }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;
