import React, { useEffect, useState } from 'react';
import { Download, Check, X, Trash2, Edit2 } from 'lucide-react';
import StatusMark from '../components/admin/StatusMark';

interface Donation {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  currency?: string;
  method?: string;
  txId?: string;
  receiptNumber?: string;
  message?: string;
  receiptUrl?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  createdAt?: string;
}

const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all'|'pending'|'confirmed'|'failed'>('all');

  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<any | null>(null);

  // Edit state for admin updates (txId, receipt number, file)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTxId, setEditTxId] = useState('');
  const [editReceiptNumber, setEditReceiptNumber] = useState('');
  const [editReceiptFile, setEditReceiptFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // PDF generation state
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('adminRole');
    const permsRaw = localStorage.getItem('adminPermissions');
    setAdminRole(storedRole);
    if (permsRaw) {
      try { setAdminPermissions(JSON.parse(permsRaw)); } catch (e) { console.error('Failed to parse adminPermissions', e); }
    }

    fetchDonations();
  }, []);

  const openEdit = (d: Donation) => {
    setEditingId(d._id);
    setEditTxId(d.txId || '');
    setEditReceiptNumber((d as any).receiptNumber || '');
    setEditReceiptFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTxId('');
    setEditReceiptNumber('');
    setEditReceiptFile(null);
    setEditLoading(false);
  };

  const saveEdit = async (id: string) => {
    setEditLoading(true);
    try {
      const form = new FormData();
      form.append('txId', editTxId);
      form.append('receiptNumber', editReceiptNumber);
      if (editReceiptFile) form.append('receipt', editReceiptFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: form
      });

      const data = await res.json();
      if (res.ok && data && data.success) {
        alert('Updated donation details');
        fetchDonations();
        cancelEdit();
      } else {
        alert((data && data.message) || 'Failed to update donation details');
      }
    } catch (err) {
      console.error('Failed to save edit', err);
      alert('Error saving donation details');
    } finally {
      setEditLoading(false);
    }
  };

  // Generate a tax-friendly donation receipt PDF (client-side only)
  const generateReceiptPDF = async (d: Donation) => {
    setGeneratingId(d._id);
    // Dynamic import so dev server doesn't fail if jspdf isn't installed
    let jsPDFmod: any;
    try {
      const moduleName = 'jspdf';
      // @ts-ignore - dynamic import, avoid Vite pre-bundling using @vite-ignore
      jsPDFmod = (await import(/* @vite-ignore */ moduleName)).jsPDF || (await import(/* @vite-ignore */ moduleName)).default;
    } catch (err) {
      console.warn('jsPDF not available:', err);
      alert('The package "jspdf" is not installed. Run `cd DDKA-Front && npm install jspdf` and restart the dev server to enable PDF generation.');
      setGeneratingId(null);
      return;
    }

    try {
      const doc: any = new jsPDFmod({ unit: 'pt', format: 'a4' });

      // Header
      doc.setFontSize(18);
      doc.text('Dhanbad District Kabaddi Association (DDKA)', 40, 60);
      doc.setFontSize(14);
      doc.text('Donation Receipt / Tax Exemption Certificate', 40, 90);

      // Donation info
      doc.setFontSize(12);
      let y = 130;
      doc.text(`Receipt No: ${d.receiptNumber || ''}`, 40, y); y += 20;
      doc.text(`Transaction ID: ${d.txId || ''}`, 40, y); y += 20;
      doc.text(`Donor Name: ${d.name || '-'}`, 40, y); y += 20;
      doc.text(`Email: ${d.email || '-'}`, 40, y); y += 20;
      doc.text(`Amount (INR): ₹${d.amount}`, 40, y); y += 20;
      doc.text(`Date: ${d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}`, 40, y); y += 30;

      // Body
      const note = 'This is to certify that the above donation has been received by Dhanbad District Kabaddi Association (DDKA). This receipt may be used by the donor for claiming tax exemption under applicable laws. Please retain this receipt for your records.';
      doc.setFontSize(11);
      const split = doc.splitTextToSize(note, 520);
      doc.text(split, 40, y);
      y += split.length * 14 + 20;

      // Signature placeholder
      doc.text('For Dhanbad District Kabaddi Association', 40, y + 40);
      doc.text('Authorized Signatory', 40, y + 60);


      // Instead of auto-downloading, create a blob and show preview in-app
      try {
        let blob: Blob | null = null;

        try {
          if (typeof doc.output === 'function') {
            try { blob = doc.output('blob'); } catch (e) { blob = null; }
          }
        } catch (e) { console.warn('doc.output("blob") not available', e); }

        if (!blob) {
          try {
            const ab = doc.output ? doc.output('arraybuffer') : null;
            if (ab) blob = new Blob([ab], { type: 'application/pdf' });
          } catch (e) { console.warn('doc.output("arraybuffer") not available', e); }
        }

        if (!blob) {
          try {
            const dataUri = doc.output ? doc.output('datauristring') : null;
            if (dataUri) {
              const res = await fetch(dataUri);
              blob = await res.blob();
            }
          } catch (e) { console.warn('doc.output("datauristring") approach failed', e); }
        }

        if (!blob) {
          try { // last resort
            const saved = doc.output && doc.output('dataurlstring');
            if (saved) {
              const res = await fetch(saved);
              blob = await res.blob();
            }
          } catch (e) { console.warn('Last-resort dataurl approach failed', e); }
        }

        if (!blob) {
          throw new Error('Could not obtain PDF blob');
        }

        // Create preview URL and open modal
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setShowPreview(true);
        setGeneratingId(null);
      } catch (downloadErr) {
        console.error('PDF generation/preview failed', downloadErr);
        setGeneratingId(null);
        alert('Failed to create PDF preview: ' + (downloadErr && (downloadErr as Error).message ? (downloadErr as Error).message : String(downloadErr)));
      }

      // success - preview created
      setGeneratingId(null);
      alert('Receipt preview ready - you can view or download it from the preview modal');
    } catch (err) {
      console.error('PDF generation failed', err);
      setGeneratingId(null);
      alert('Failed to generate PDF receipt: ' + (err && (err as Error).message ? (err as Error).message : String(err)));
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/donations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setDonations(data);
      else if (data && data.success && Array.isArray(data.data)) setDonations(data.data);
      else console.warn('Unexpected donations response', data);
    } catch (err) {
      console.error('Failed to fetch donations', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending'|'confirmed'|'failed') => {
    if (!confirm(`Confirm changing status to ${status}?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok && data && data.success) {
        alert('Status updated');
        fetchDonations();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status', err);
      alert('Error updating status');
    }
  };

  const filtered = donations.filter(d => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (d.name && d.name.toLowerCase().includes(q)) || (d.email && d.email.toLowerCase().includes(q));
    }
    return true;
  });

  // Mobile detection for responsive layout
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Preview modal state for showing receipts in-app
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const closePreview = () => {
    if (previewUrl) {
      try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
    }
    setPreviewUrl(null);
    setShowPreview(false);
  };

  const statusBadge = (s?: string) => {
    const title = s ? (s[0].toUpperCase() + s.slice(1)) : 'Pending';
    return (
      <div className="flex items-center gap-2">
        <StatusMark status={s} className="w-6 h-6" title={title} />
        <span className="sr-only">{title}</span>
      </div>
    );
  };

  const exportCSV = () => {
    const rows = [
      ['Name','Email','Amount','Currency','Method','Status','Date','Message','ReceiptURL'] ,
      ...donations.map(d => [
        d.name || '', d.email || '', String(d.amount || ''), d.currency || 'INR', d.method || '', d.status || '', d.createdAt || '', (d.message || '').replace(/\n/g, ' '), d.receiptUrl || ''
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <AdminPageHeader
        title="Donations"
        subtitle="Manage incoming donations and payment proofs"
        actions={(
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="px-4 py-2 rounded-full bg-green-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-2"><Download className="w-4 h-4"/> Export CSV</button>
            <button onClick={fetchDonations} className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">Refresh</button>
          </div>
        )}
      />

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" className="px-3 py-2 border rounded-lg w-full sm:w-72" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-3 py-2 border rounded-lg w-full sm:w-40">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="text-sm text-slate-500">{donations.length} donations total • {filtered.length} shown</div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900"></div>
        </div>
      ) : (
        isMobile ? (
          <div className="space-y-4">
            {filtered.map((d, i) => (
              <div key={d._id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm text-slate-500">#{i + 1}</div>
                        <div className="font-bold text-slate-900 truncate">{d.name}</div>
                        <div className="text-xs text-slate-600 break-words">{d.email}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="text-sm font-semibold">₹{d.amount}</div>
                        <div className="text-xs text-slate-500 mt-1">{d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}</div>
                        <div className="text-xs text-slate-500 mt-1">{d.phone ? `Phone: ${d.phone}` : ''}</div>
                        <div className="mt-2">{statusBadge(d.status)}</div>
                      </div>
                    </div>

                    {d.message && (
                      <div className="mt-3 text-sm text-slate-700 break-words">{d.message}</div>
                    )}

                    <div className="mt-3 text-sm">
                      {d.receiptUrl ? (
                        <a href={d.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">View Receipt</a>
                      ) : (
                        <span className="text-slate-400">No receipt</span>
                      )}
                    </div>
                  </div>
                </div>

                {editingId === d._id ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input value={editTxId} onChange={(e) => setEditTxId(e.target.value)} placeholder="Transaction ID (txId)" className="px-3 py-2 border rounded-lg w-full sm:w-48 break-words" />
                      <input value={editReceiptNumber} onChange={(e) => setEditReceiptNumber(e.target.value)} placeholder="Receipt No." className="px-3 py-2 border rounded-lg w-full sm:w-40 break-words" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <input type="file" accept="image/*" onChange={(e) => setEditReceiptFile(e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => saveEdit(d._id)} disabled={editLoading} className="flex-1 px-3 py-2 bg-blue-900 text-white rounded-md text-sm">{editLoading ? 'Saving...' : 'Save'}</button>
                      <button onClick={cancelEdit} className="flex-1 px-3 py-2 bg-slate-200 rounded-md text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <a href={`/donation/${d._id}`} target="_blank" rel="noreferrer" className="flex-1 min-w-0 px-3 py-2 bg-sky-600 text-white rounded-md text-sm flex items-center justify-center gap-2 hover:bg-sky-700 transition-colors">View Receipt</a>
                    <button disabled={generatingId === d._id} onClick={() => generateReceiptPDF(d)} className="flex-1 min-w-0 px-3 py-2 bg-amber-600 disabled:opacity-60 text-white rounded-md text-sm flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors">{generatingId === d._id ? 'Generating...' : (<><Download className="w-4 h-4"/>Receipt</>)}</button>
                    <button onClick={() => openEdit(d)} className="flex-1 min-w-0 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"><Edit2 className="w-4 h-4"/>Edit</button>
                    <button onClick={() => updateStatus(d._id, 'confirmed')} className="flex-1 min-w-0 px-3 py-2 bg-emerald-600 text-white rounded-md text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"><Check className="w-4 h-4"/>Confirm</button>
                    <button onClick={() => updateStatus(d._id, 'failed')} className="flex-1 min-w-0 px-3 py-2 bg-red-600 text-white rounded-md text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"><X className="w-4 h-4"/>Fail</button>
                    {(adminRole === 'superadmin' || adminPermissions?.canDelete) && (
                      <button onClick={async () => {
                        if (!confirm('Are you sure you want to delete this donation?')) return;
                        try {
                          const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/${d._id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                          });
                          if (resp.ok) { alert('Donation deleted'); fetchDonations(); } else { alert('Failed to delete donation'); }
                        } catch (err) { console.error('Delete failed', err); alert('Delete failed'); }
                      }} className="flex-1 min-w-0 px-3 py-2 bg-slate-500 text-white rounded-md text-sm flex items-center justify-center gap-2 hover:bg-slate-600 transition-colors"><Trash2 className="w-4 h-4"/>Delete</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">#</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">Name</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">Email</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">Amount</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">Status</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">Date</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">Receipt</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((d, i) => (
                    <React.Fragment key={d._id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-700 font-bold">{i + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{d.name}</td>
                        <td className="px-6 py-4 text-slate-700">{d.email}</td>
                        <td className="px-6 py-4 text-slate-700">{d.phone || '-'}</td>
                        <td className="px-6 py-4 text-slate-700">₹{d.amount}</td>
                        <td className="px-6 py-4 text-slate-700">{statusBadge(d.status)}</td>
                        <td className="px-6 py-4 text-slate-700">{d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}</td>
                        <td className="px-6 py-4">
                          {d.receiptUrl ? (
                            <a href={d.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">View</a>
                          ) : (
                            <span className="text-slate-400">No receipt</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button title="Edit" onClick={() => openEdit(d)} className="px-2 py-1 bg-indigo-600 text-white rounded-md text-xs flex items-center gap-2 hover:bg-indigo-700"><Edit2 className="w-4 h-4" /></button>
                        <button title="Download receipt (PDF)" disabled={generatingId === d._id} onClick={() => generateReceiptPDF(d)} className="px-2 py-1 bg-amber-600 disabled:opacity-60 text-white rounded-md text-xs flex items-center gap-2 hover:bg-amber-700">{generatingId === d._id ? '...' : <Download className="w-4 h-4" />}</button>                            <a title="View receipt page" href={`/donation/${d._id}`} target="_blank" rel="noreferrer" className="px-2 py-1 bg-sky-600 text-white rounded-md text-xs flex items-center gap-2 hover:bg-sky-700">View</a>                            <div className="flex flex-col items-end gap-2">
                              <button
                                title="Confirm donation"
                                onClick={() => updateStatus(d._id, 'confirmed')}
                                className="w-28 px-3 py-2 bg-green-600 text-white rounded-md text-xs flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Confirm</span>
                              </button>

                              <button
                                title="Mark as failed"
                                onClick={() => updateStatus(d._id, 'failed')}
                                className="w-28 px-3 py-2 bg-red-600 text-white rounded-md text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span className="hidden sm:inline">Fail</span>
                              </button>

                              {(adminRole === 'superadmin' || adminPermissions?.canDelete) && (
                                <button
                                  title="Delete donation"
                                  onClick={async () => {
                                    if (!confirm('Are you sure you want to delete this donation?')) return;
                                    try {
                                      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/${d._id}`, {
                                        method: 'DELETE',
                                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                      });
                                      if (resp.ok) { alert('Donation deleted'); fetchDonations(); } else { alert('Failed to delete donation'); }
                                    } catch (err) { console.error('Delete failed', err); alert('Delete failed'); }
                                  }}
                                  className="w-28 px-3 py-2 bg-slate-500 text-white rounded-md text-xs flex items-center justify-center gap-2 hover:bg-slate-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {editingId === d._id && (
                        <tr>
                          <td colSpan={8} className="bg-slate-50 px-6 py-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div className="flex gap-2 w-full md:w-auto">
                                <input value={editTxId} onChange={(e) => setEditTxId(e.target.value)} placeholder="Transaction ID (txId)" className="px-3 py-2 border rounded-lg w-full md:w-64" />
                                <input value={editReceiptNumber} onChange={(e) => setEditReceiptNumber(e.target.value)} placeholder="Receipt No." className="px-3 py-2 border rounded-lg w-full md:w-48" />
                                <input type="file" accept="image/*" onChange={(e) => setEditReceiptFile(e.target.files ? e.target.files[0] : null)} />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit(d._id)} disabled={editLoading} className="px-4 py-2 bg-blue-900 text-white rounded-md">{editLoading ? 'Saving...' : 'Save'}</button>
                                <button onClick={cancelEdit} className="px-4 py-2 bg-slate-200 rounded-md">Cancel</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* In-app preview modal for generated receipts */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closePreview} />
          <div className="relative bg-white rounded-lg shadow-lg w-[90%] h-[90%] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-bold">Receipt Preview</div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Open in new tab</button>
                <button onClick={() => {
                  try {
                    const a = document.createElement('a');
                    a.href = previewUrl;
                    a.download = `DDKA_Receipt.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  } catch (e) { console.error('Download from preview failed', e); }
                }} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Download</button>
                <button onClick={closePreview} className="px-3 py-1 bg-slate-200 rounded text-sm">Close</button>
              </div>
            </div>
            <div className="w-full h-full">
              <iframe src={previewUrl} title="Receipt Preview" className="w-full h-full border-0" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDonations;
