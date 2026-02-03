import React, { useEffect, useMemo, useState } from 'react';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import { Mail, Send, RefreshCcw } from 'lucide-react';

interface Recipient {
  id: string;
  type: string;
  name: string;
  email: string;
  status?: string;
}

const AdminBulkEmail: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Player' | 'Institution' | 'Technical Official' | 'Newsletter' | 'Contact'>('All');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [manualEmails, setManualEmails] = useState('');
  const [sending, setSending] = useState(false);

  const keyFor = (r: Recipient) => `${r.type}:${r.id}`;

  const loadRecipients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/bulk-email/recipients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setRecipients(json.data || []);
      } else {
        alert(json.message || 'Failed to load recipients');
      }
    } catch (err) {
      alert('Failed to load recipients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const filtered = useMemo(() => {
    return recipients.filter(r => {
      const status = (r.status || 'Pending') as any;
      if (statusFilter !== 'All' && status !== statusFilter) return false;
      if (typeFilter === 'All') {
        if (r.type === 'Newsletter' || r.type === 'Contact') return false;
      } else if (r.type !== typeFilter) {
        return false;
      }
      const hay = `${r.name} ${r.email} ${r.type}`.toLowerCase();
      return hay.includes(search.toLowerCase());
    });
  }, [recipients, search, statusFilter, typeFilter]);

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedKeys(filtered.map(r => keyFor(r)));
    } else {
      setSelectedKeys([]);
    }
  };

  const toggleOne = (key: string, checked: boolean) => {
    setSelectedKeys(prev => {
      if (checked) return Array.from(new Set([...prev, key]));
      return prev.filter(k => k !== key);
    });
  };

  const selectedRecipients = useMemo(() => {
    const set = new Set(selectedKeys);
    return recipients.filter(r => set.has(keyFor(r)));
  }, [selectedKeys, recipients]);

  const parseManualEmails = () => {
    const raw = manualEmails
      .split(/[\s,;]+/)
      .map(e => e.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(raw.map(e => e.toLowerCase())));
    const invalid = unique.filter(e => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    return { emails: unique, invalid };
  };

  const sendEmails = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Subject and message are required');
      return;
    }
    const { emails: manualList, invalid } = parseManualEmails();
    if (invalid.length > 0) {
      alert(`Invalid email(s): ${invalid.join(', ')}`);
      return;
    }
    const manualRecipients = manualList.map(email => ({
      email,
      name: '',
      type: 'Manual',
      noGreeting: true
    }));
    const allRecipients = [...selectedRecipients, ...manualRecipients];
    if (allRecipients.length === 0) {
      alert('Select at least one recipient or add manual emails');
      return;
    }
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/bulk-email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject,
          message,
          recipients: allRecipients.map(r => ({
            email: r.email,
            name: r.name,
            type: r.type,
            status: 'status' in r ? (r as Recipient).status : undefined,
            noGreeting: 'noGreeting' in r ? (r as any).noGreeting : undefined
          }))
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.message || 'Failed to send emails');
        return;
      }
      alert(`Sent: ${json.data.sent}, Failed: ${json.data.failed}`);
      setManualEmails('');
    } catch (err) {
      alert('Failed to send emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Bulk Email"
          subtitle="Send a message to selected players, institutions, technical officials, newsletter subscribers, or contacts."
          actions={
            <button
              onClick={loadRecipients}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-white text-slate-700 text-xs font-bold border border-slate-200 hover:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={14} /> Refresh
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="p-4 border-b flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name/email/type"
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm w-full sm:w-64"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm w-full sm:w-auto"
                >
                  {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm w-full sm:w-auto"
                >
                  {['All', 'Player', 'Institution', 'Technical Official', 'Newsletter', 'Contact'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="text-xs font-bold text-slate-500 lg:whitespace-nowrap">Selected: {selectedRecipients.length}</div>
            </div>

            <div className="overflow-auto hidden md:block">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3">
                      <input
                        type="checkbox"
                        checked={filtered.length > 0 && selectedKeys.length === filtered.length}
                        onChange={(e) => toggleAll(e.currentTarget.checked)}
                      />
                    </th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="p-6" colSpan={5}>Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td className="p-6" colSpan={5}>No recipients found</td></tr>
                  ) : (
                    filtered.map(r => {
                      const key = keyFor(r);
                      return (
                        <tr key={key} className="border-t">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedKeys.includes(key)}
                              onChange={(e) => toggleOne(key, e.currentTarget.checked)}
                            />
                          </td>
                          <td className="p-3 font-semibold text-slate-700">{r.name}</td>
                          <td className="p-3 text-slate-600">{r.email}</td>
                          <td className="p-3 text-slate-600">{r.type}</td>
                          <td className="p-3 text-slate-600">{r.status || 'Pending'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden">
              {loading ? (
                <div className="p-6 text-sm">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-sm">No recipients found</div>
              ) : (
                <div className="divide-y">
                  {filtered.map(r => {
                    const key = keyFor(r);
                    return (
                      <label key={key} className="flex gap-3 p-4">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={selectedKeys.includes(key)}
                          onChange={(e) => toggleOne(key, e.currentTarget.checked)}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{r.name}</div>
                          <div className="text-xs text-slate-500 break-all">{r.email}</div>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{r.type}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{r.status || 'Pending'}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={18} className="text-slate-700" />
              <h3 className="font-black text-slate-800">Compose Email</h3>
            </div>
            <label className="text-xs font-bold text-slate-500">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 mb-4 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
              placeholder="Subject"
            />
            <label className="text-xs font-bold text-slate-500">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 mb-4 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm min-h-[160px]"
              placeholder="Type your message..."
            />
            <label className="text-xs font-bold text-slate-500">Add manual emails</label>
            <textarea
              value={manualEmails}
              onChange={(e) => setManualEmails(e.target.value)}
              className="mt-1 mb-4 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm min-h-[80px]"
              placeholder="Enter emails separated by comma or space"
            />
            <button
              onClick={sendEmails}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition-all disabled:opacity-60"
            >
              <Send size={16} /> {sending ? 'Sending...' : 'Send Email'}
            </button>
            <p className="text-xs text-slate-400 mt-3">Manual emails are sent without any greeting line.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBulkEmail;
