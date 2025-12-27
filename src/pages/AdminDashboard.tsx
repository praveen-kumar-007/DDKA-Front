import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Trash2, Clock, 
  Users, Building, RefreshCcw, Search, Eye,
  LogOut, Download, FileText
} from 'lucide-react';
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

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    window.location.href = '/admin-portal-access';
  };

  // Fetch data from backend
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

  // Handle Status Update
  const updateStatus = async (id: string, newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    try {
      const endpoint = activeTab === 'players' ? '/api/players/status' : '/api/institutions/status';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) fetchData();
    } catch (error) {
      alert("Error updating status");
    }
  };

  // Handle Delete
  const deleteEntry = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    try {
      const endpoint = activeTab === 'players' ? `/api/players/${id}` : `/api/institutions/${id}`;
      const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
      if (response.ok) fetchData();
    } catch (error) {
      alert("Error deleting entry");
    }
  };

  const filteredData = data.filter(item => 
    (item.fullName || item.instName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.phone || '').includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-oswald font-bold text-blue-900 uppercase tracking-tight">DDKA CONTROL CENTER</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Registration Management Portal
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-bold shadow-sm border border-red-100 hover:bg-red-600 hover:text-white transition-all active:scale-95"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Stats & Tabs Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setActiveTab('players')}
            className={`md:col-span-2 cursor-pointer p-6 rounded-3xl transition-all border-2 ${activeTab === 'players' ? 'bg-blue-900 border-blue-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-600'}`}
          >
            <div className="flex justify-between items-center">
              <Users size={32} className={activeTab === 'players' ? 'text-orange-500' : 'text-slate-300'} />
              <span className="text-4xl font-oswald font-bold">{activeTab === 'players' ? filteredData.length : '--'}</span>
            </div>
            <p className="mt-4 font-bold uppercase tracking-widest text-sm">Player Registrations</p>
          </div>

          <div 
            onClick={() => setActiveTab('institutions')}
            className={`md:col-span-2 cursor-pointer p-6 rounded-3xl transition-all border-2 ${activeTab === 'institutions' ? 'bg-blue-900 border-blue-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-600'}`}
          >
            <div className="flex justify-between items-center">
              <Building size={32} className={activeTab === 'institutions' ? 'text-orange-500' : 'text-slate-300'} />
              <span className="text-4xl font-oswald font-bold">{activeTab === 'institutions' ? filteredData.length : '--'}</span>
            </div>
            <p className="mt-4 font-bold uppercase tracking-widest text-sm">Institution Affiliations</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button onClick={fetchData} className="flex-1 lg:flex-none px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <RefreshCcw size={18} /> Refresh
            </button>
            <button className="flex-1 lg:flex-none px-6 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-6 font-oswald uppercase text-slate-500 text-sm tracking-widest">Registrant Info</th>
                  <th className="p-6 font-oswald uppercase text-slate-500 text-sm tracking-widest">Payment Details</th>
                  <th className="p-6 font-oswald uppercase text-slate-500 text-sm tracking-widest text-center">Receipt</th>
                  <th className="p-6 font-oswald uppercase text-slate-500 text-sm tracking-widest">Status</th>
                  <th className="p-6 font-oswald uppercase text-slate-500 text-sm tracking-widest text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center"><RefreshCcw className="animate-spin mx-auto text-blue-900 mb-2" /> <span className="font-bold text-slate-400">Syncing with server...</span></td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-medium">No registrations found matching your search.</td></tr>
                ) : filteredData.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-blue-900 font-bold">
                          {(item.fullName || item.instName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-blue-950 leading-none mb-1">{item.fullName || item.instName}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.phone || item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-700">
                        <FileText size={14} className="text-slate-400" />
                        <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded leading-none">{item.transactionId}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      {item.screenshotUrl ? (
                        <a href={item.screenshotUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                          <Eye size={14} /> View Slip
                        </a>
                      ) : <span className="text-[10px] text-slate-300 font-bold uppercase">No Screenshot</span>}
                    </td>
                    <td className="p-6">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(item._id, 'Approved')} className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => updateStatus(item._id, 'Pending')} className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm" title="Mark Pending">
                          <Clock size={18} />
                        </button>
                        <button onClick={() => updateStatus(item._id, 'Rejected')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Reject">
                          <XCircle size={18} />
                        </button>
                        <button onClick={() => deleteEntry(item._id)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="Delete Permanent">
                          <Trash2 size={18} />
                        </button>
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