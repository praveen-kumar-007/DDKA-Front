import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Trash2, 
  Users, Building, RefreshCcw, Search, Eye,
  LogOut, IndianRupee, Newspaper, Image as ImageIcon, Mail, Wallet
  // Removed unused Clock, Download, and FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Language } from '../translations';

interface AdminDashboardProps {
  lang: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang: _lang }) => { 
  const [activeTab, setActiveTab] = useState<'players' | 'institutions'>('players');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    window.location.href = '/admin-portal-access';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'players' ? '/api/players' : '/api/institutions';
      const response = await fetch(`${API_URL}${endpoint}`);
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

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const updateStatus = async (id: string, newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    try {
      const endpoint = activeTab === 'players' ? '/api/players/status' : '/api/institutions/status';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      } else {
        alert("Delete failed on server");
      }
    } catch (error) {
      alert("Error deleting entry");
    }
  };

  const filteredData = data.filter(item => 
    (item.fullName || item.instName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.phone || item.email || '').includes(searchTerm)
  );

  const getReceiptUrl = (item: any) => {
    return item.receiptUrl || item.screenshotUrl || null;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-oswald font-bold text-blue-900 uppercase tracking-tight">DDKA CONTROL CENTER</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Admin Portal • Team DDKA (Est. 2017)
            </p>
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
          <a href="/admin/gallery" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow border hover:bg-blue-50 transition-all">
            <ImageIcon size={32} className="text-blue-700 mb-2" />
            <span className="font-bold text-xs text-blue-900">Manage Gallery</span>
          </a>
          <Link to="/admin-news-upload" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow border hover:bg-blue-50 transition-all">
            <Newspaper size={32} className="text-blue-700 mb-2" />
            <span className="font-bold text-xs text-blue-900">Manage News</span>
          </Link>
          <a href="/admin/contact" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow border hover:bg-blue-50 transition-all">
            <Mail size={28} className="text-blue-700 mb-2" />
            <span className="font-bold text-xs text-blue-900">Contact Forms</span>
          </a>
          <Link to="/admin/player-ids" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow border hover:bg-blue-50 transition-all">
            <Wallet size={32} className="text-blue-700 mb-2" />
            <span className="font-bold text-xs text-blue-900">Player IDs</span>
          </Link>
          <a href="#" onClick={() => setActiveTab('players')} className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${activeTab === 'players' ? 'bg-blue-900 text-white' : 'bg-white hover:bg-blue-50 text-blue-900'}`}> 
            <Users size={28} className={activeTab === 'players' ? 'text-orange-400' : 'text-blue-900'} />
            <span className="font-bold text-xs">Player Details</span>
          </a>
          <a href="#" onClick={() => setActiveTab('institutions')} className={`flex flex-col items-center justify-center p-4 rounded-xl shadow border transition-all ${activeTab === 'institutions' ? 'bg-blue-900 text-white' : 'bg-white hover:bg-blue-50 text-blue-900'}`}> 
            <Building size={28} className={activeTab === 'institutions' ? 'text-orange-400' : 'text-blue-900'} />
            <span className="font-bold text-xs">Institution Details</span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder={`Search by name, Transaction ID or phone...`} 
            className="w-full pl-16 pr-6 py-4 bg-white border-4 border-white rounded-[2rem] shadow-xl focus:ring-8 focus:ring-blue-50 outline-none transition-all font-medium text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-100">
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Basic Information</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Payment Reference</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest text-center">Receipt</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest">Status</th>
                  <th className="p-6 font-oswald uppercase text-slate-400 text-xs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-32 text-center"><RefreshCcw className="animate-spin mx-auto text-blue-900 mb-4" size={48} /></td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={5} className="p-32 text-center text-slate-300 font-bold uppercase tracking-widest">No records found</td></tr>
                ) : filteredData.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                          {(item.fullName || item.instName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-blue-950 text-base leading-tight">{item.fullName || item.instName}</p>
                          <p className="text-xs text-slate-400 font-bold">{item.phone || item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                        <IndianRupee size={14} className="text-slate-500" />
                        <span className="font-mono text-xs font-black text-slate-700 uppercase">{item.transactionId || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      {getReceiptUrl(item) ? (
                        <a href={getReceiptUrl(item)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-xs font-black hover:bg-blue-700 hover:text-white transition-all shadow-sm">
                          <Eye size={16} /> VIEW
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">No File</span>
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border-2 ${
                        item.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                        item.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
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
                        <button 
                          onClick={() => deleteEntry(item._id)} 
                          className="p-2 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-950 hover:text-white transition-all active:scale-90"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <a
                          href={activeTab === 'players' ? `/admin/registration/${item._id}` : `/admin/institution/${item._id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                          title="View More"
                        >
                          <Eye size={18} />
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