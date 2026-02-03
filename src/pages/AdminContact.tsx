import React, { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, CheckCircle, XCircle, RefreshCcw, Eye, ListChecks, Download } from 'lucide-react';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';
import ExportCsvModal from '../components/admin/ExportCsvModal';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AdminPermissions {
  canDelete?: boolean;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'New' | 'Read' | 'Rejected';
  createdAt: string;
}

const AdminContact: React.FC = () => {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<{ _id: string; email: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contacts' | 'newsletter'>('contacts');
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);

  const navigate = useNavigate();

  // Selection & export state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  const contactFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { key: 'message', label: 'Message' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Received At' }
  ];

  const newsletterFields = [
    { key: 'email', label: 'Email' },
    { key: 'createdAt', label: 'Subscribed At' }
  ];

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/contact`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();
      if (result.success) setItems(result.data);
    } catch (e) {
      console.error('Failed to load contact messages', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/contact/newsletter/all`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();
      if (result.success) setNewsletters(result.data);
    } catch (e) {
      console.error('Failed to load newsletter subscriptions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Simple auth check: redirect if not logged in
    if (sessionStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/admin-portal-access');
      return;
    }
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
    fetchContacts();
  }, [navigate]);

  const canDelete = adminRole === 'superadmin' && !!adminPermissions?.canDelete;

  const updateStatus = async (id: string, status: 'New' | 'Read' | 'Rejected') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/contact/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchContacts();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) fetchContacts();
    } catch (e) {
      console.error('Failed to delete message', e);
    }
  };

  const deleteNewsletter = async (id: string) => {
    if (!window.confirm('Delete this subscriber?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/contact/newsletter/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) fetchNewsletters();
    } catch (e) {
      console.error('Failed to delete newsletter subscription', e);
    }
  };

  // NOTE: Export handled via ExportCsvModal component for better UX and mobile support
  // Use selectedIds to export only selected rows, or export all items/newsletters



  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminPageHeader
          title="Admin Inbox"
          subtitle="Manage contact messages and newsletter subscriptions"
          actions={(
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <button
                onClick={() => { setActiveTab('contacts'); setSelectedIds([]); fetchContacts(); }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm flex items-center gap-2 ${activeTab === 'contacts' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-blue-900 hover:bg-blue-50'}`}>
                <Mail size={14} /> Contacts
              </button>

              <button
                onClick={() => { setActiveTab('newsletter'); setSelectedIds([]); fetchNewsletters(); }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm flex items-center gap-2 ${activeTab === 'newsletter' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-blue-900 hover:bg-blue-50'}`}>
                <ListChecks size={14} /> Newsletter
              </button>

              <button
                onClick={activeTab === 'contacts' ? fetchContacts : fetchNewsletters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm text-sm font-bold text-blue-900 hover:bg-blue-50">
                <RefreshCcw size={16} /> Refresh
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                disabled={activeTab === 'contacts' ? items.length === 0 : newsletters.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm text-sm font-bold text-blue-900 hover:bg-blue-50 w-full sm:w-auto disabled:opacity-50">
                <Download size={16} /> Export CSV
              </button>
            </div>
          )}
        />

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-24 flex justify-center">
              <RefreshCcw className="animate-spin text-blue-900" size={40} />
            </div>
          ) : activeTab === 'contacts' ? (
            items.length === 0 ? (
              <div className="p-24 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                No contact messages yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-100">
                      <th className="p-4"><input type="checkbox" className="h-4 w-4" checked={items.length>0 && selectedIds.length===items.length} onChange={(e) => { if (e.currentTarget.checked) setSelectedIds(items.map(it => it._id)); else setSelectedIds([]); }} /></th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">From</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Received</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.map((item) => (
                    <tr key={item._id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-4">
                        <input type="checkbox" className="h-4 w-4" checked={selectedIds.includes(item._id)} onChange={(e) => {
                          if (e.currentTarget.checked) setSelectedIds(prev => Array.from(new Set([...prev, item._id])));
                          else setSelectedIds(prev => prev.filter(id => id !== item._id));
                        }} />
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-blue-900 text-sm">{item.name}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={12} /> {item.email}
                          </span>
                          {item.phone && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Phone size={12} /> {item.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-700 max-w-xs truncate">
                        {item.subject || 'No subject'}
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusMark status={item.status} className="w-6 h-6" title={item.status} />
                          <span className="sr-only">{item.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelected(item)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                            title="View full message"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => updateStatus(item._id, 'Read')}
                            className="p-2 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all active:scale-90"
                            title="Mark as Read"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => updateStatus(item._id, 'Rejected')}
                            className="p-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
                            title="Mark as Rejected"
                          >
                            <XCircle size={16} />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => deleteMessage(item._id)}
                              className="p-2 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-950 hover:text-white transition-all active:scale-90"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : newsletters.length === 0 ? (
            <div className="p-24 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
              No newsletter subscribers yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100">
                    <th className="p-4"><input type="checkbox" className="h-4 w-4" checked={newsletters.length>0 && selectedIds.length===newsletters.length} onChange={(e) => { if (e.currentTarget.checked) setSelectedIds(newsletters.map(n => n._id)); else setSelectedIds([]); }} /></th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subscribed At</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {newsletters.map((n) => (
                    <tr key={n._id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-4">
                        <input type="checkbox" className="h-4 w-4" checked={selectedIds.includes(n._id)} onChange={(e) => {
                          if (e.currentTarget.checked) setSelectedIds(prev => Array.from(new Set([...prev, n._id])));
                          else setSelectedIds(prev => prev.filter(id => id !== n._id));
                        }} />
                      </td>
                      <td className="p-4 text-sm text-slate-800 flex items-center gap-2">
                        <Mail size={14} className="text-orange-500" /> {n.email}
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(n.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          {canDelete && (
                            <button
                              onClick={() => deleteNewsletter(n._id)}
                              className="p-2 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-950 hover:text-white transition-all active:scale-90"
                              title="Delete subscriber"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Export modal (contacts/newsletter) */}
        <ExportCsvModal
          visible={showExportModal}
          onClose={() => setShowExportModal(false)}
          records={selectedIds.length ? (activeTab === 'contacts' ? items.filter(i => selectedIds.includes(i._id)) : newsletters.filter(n => selectedIds.includes(n._id))) : (activeTab === 'contacts' ? items : newsletters)}
          fields={activeTab === 'contacts' ? contactFields : newsletterFields}
          filenamePrefix={activeTab === 'contacts' ? 'contacts' : 'newsletters'}
        />

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
              >
                <XCircle size={24} />
              </button>
              <h2 className="text-xl font-bold text-blue-900 mb-2">{selected.subject || 'No subject'}</h2>
              <p className="text-sm text-slate-600 mb-4">
                From <span className="font-semibold">{selected.name}</span> · {selected.email}
                {selected.phone ? ` · ${selected.phone}` : ''}
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Received: {new Date(selected.createdAt).toLocaleString()}
              </p>
              <div className="text-slate-800 whitespace-pre-line text-sm max-h-80 overflow-y-auto border-t pt-3">
                {selected.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContact;
