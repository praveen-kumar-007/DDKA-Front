import React, { useState, useEffect } from 'react';
import { X, Edit2, Eye } from 'lucide-react';
import { Newspaper, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AdminPermissions {
  canDelete?: boolean;
}

const AdminNewsUpload = () => {
  const [form, setForm] = useState({ title: '', content: '', category: '', isHighlight: false });
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'published'|'draft'>('all');
  const [editModal, setEditModal] = useState<{open: boolean, news: any|null}>({open: false, news: null});
  const [viewModal, setViewModal] = useState<{open: boolean, news: any|null}>({open: false, news: null});
  const navigate = useNavigate();
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);
    // Edit news handler
    const handleEdit = (item: any) => {
      setEditModal({ open: true, news: item });
    };

    // Save edited news
    const handleEditSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editModal.news) return;
      const { _id, title, content, category, isHighlight } = editModal.news;
      await fetch(`${API_URL}/api/news/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, isHighlight })
      });
      setEditModal({ open: false, news: null });
      fetchNews();
    };
  // Fetch all news for admin management
  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/news`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();
      if (result.success) setNews(result.data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
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

  const canDelete = adminRole === 'superadmin' && !!adminPermissions?.canDelete;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess(false);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('category', form.category);
    formData.append('isHighlight', String(form.isHighlight));
    images.forEach(img => formData.append('images', img));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/news`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setForm({ title: '', content: '', category: '', isHighlight: false });
        setImages([]);
        setSuccess(true);

      } else {
        setError(result.message || 'Failed to post news');
      }
      fetchNews();
    } catch (e) {
      setError('Failed to post news');
    } finally {
      setUploading(false);
    }
  };

  // Admin: update news status (publish/draft)
  const handleStatus = async (id: string, status: 'published' | 'draft') => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/news/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });
    fetchNews();
  };

  // Admin: delete news
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this news post?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/news/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-2">
      <div className="max-w-4xl mx-auto">
        <AdminPageHeader
          title="Admin News Management"
          actions={(
            <></>
          )}
        />
      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 flex flex-col md:flex-row gap-10 mb-16 items-stretch">
        {/* Left: Form Fields */}
        <div className="flex-1 flex flex-col gap-5 justify-center">
          <input required className="border border-slate-200 p-3 rounded-lg text-lg focus:ring-2 focus:ring-blue-200" placeholder="Heading/Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
          <input className="border border-slate-200 p-3 rounded-lg text-lg focus:ring-2 focus:ring-blue-200" placeholder="Category (optional)" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} />
          <textarea required className="border border-slate-200 p-3 rounded-lg min-h-[100px] text-lg focus:ring-2 focus:ring-blue-200" placeholder="News Content" value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} />
          <label className="flex items-center gap-2 cursor-pointer text-base font-medium">
            <input type="checkbox" checked={form.isHighlight} onChange={e => setForm(f => ({...f, isHighlight: e.target.checked}))} />
            Highlight
          </label>
          <button type="submit" disabled={uploading} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all w-fit mt-2">{uploading ? 'Posting...' : 'Post News'}</button>
          {success && <div className="text-green-600 font-bold mt-2">News posted successfully!</div>}
          {error && <div className="text-red-600 font-bold mt-2">{error}</div>}
        </div>
        {/* Right: Image Upload Preview */}
        <div className="flex-1 flex flex-col items-center gap-4 justify-center border-l border-slate-100 pl-6">
          <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
            <ImageIcon size={40} className="text-blue-400" />
            <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files || []))} className="hidden" />
            <span className="text-sm text-slate-400">Choose images (multiple allowed)</span>
          </label>
          {images.length > 0 && (
            <div className="flex gap-3 mt-2 w-full flex-wrap justify-center">
              {images.map((img, i) => (
                <div key={i} className="w-32 h-28 bg-slate-100 rounded-xl border flex items-center justify-center overflow-hidden relative shadow mb-2">
                  <img src={URL.createObjectURL(img)} alt="preview" className="object-cover w-full h-full" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"><X size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Divider */}
      <div className="w-full h-0.5 bg-gradient-to-r from-blue-200 via-slate-100 to-orange-100 mb-12 rounded-full" />

      {/* News Management Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <input type="text" placeholder="Search news..." value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded w-64" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="text-slate-500 text-sm">Total: {news.length}</div>
      </div>

      {/* News Management Cards */}
      <h2 className="text-2xl font-bold mb-4">All News</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news
            .filter(item => (statusFilter === 'all' ? true : item.status === statusFilter))
            .filter(item =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.content.toLowerCase().includes(search.toLowerCase()) ||
              (item.category || '').toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow border p-6 flex flex-col relative group">
              {/* Card Actions */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setViewModal({ open: true, news: item })} className="p-1 rounded hover:bg-blue-50 text-blue-600"><Eye size={18}/></button>
                <button onClick={() => handleEdit(item)} className="p-1 rounded hover:bg-yellow-50 text-yellow-600"><Edit2 size={18}/></button>
                {canDelete && (
                  <button onClick={() => handleDelete(item._id)} className="p-1 rounded hover:bg-red-50 text-red-600"><X size={18}/></button>
                )}
              </div>
              {item.images && item.images.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {item.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt="news-img" className="w-24 h-20 object-cover rounded-lg border" />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold uppercase">{item.category}</span>
                {item.isHighlight && <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-bold">Highlight</span>}
                <div className="flex items-center gap-2">
                  <StatusMark status={item.status} className="w-6 h-6" title={item.status} />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 line-clamp-1">{item.title}</h3>
              <div className="text-xs text-slate-400 mb-2">{new Date(item.createdAt).toLocaleDateString()}</div>
              <div className="text-slate-700 text-sm mb-4 line-clamp-3">{item.content}</div>
              <div className="flex gap-2 mt-auto">
                {item.status === 'draft' && (
                  <button onClick={() => handleStatus(item._id, 'published')} className="px-3 py-1 rounded bg-green-600 text-white text-xs font-bold hover:bg-green-700">Publish</button>
                )}
                {item.status === 'published' && (
                  <button onClick={() => handleStatus(item._id, 'draft')} className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-bold hover:bg-yellow-600">Set Draft</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit News Modal */}
      {editModal.open && editModal.news && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button onClick={() => setEditModal({ open: false, news: null })} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-4">Edit News</h2>
            <form onSubmit={handleEditSave} className="flex flex-col gap-4">
              <input required className="border p-2 rounded" placeholder="Heading/Title" value={editModal.news.title} onChange={e => setEditModal(m => ({...m, news: {...m.news, title: e.target.value}}))} />
              <input className="border p-2 rounded" placeholder="Category (optional)" value={editModal.news.category} onChange={e => setEditModal(m => ({...m, news: {...m.news, category: e.target.value}}))} />
              <textarea required className="border p-2 rounded min-h-[80px]" placeholder="News Content" value={editModal.news.content} onChange={e => setEditModal(m => ({...m, news: {...m.news, content: e.target.value}}))} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editModal.news.isHighlight} onChange={e => setEditModal(m => ({...m, news: {...m.news, isHighlight: e.target.checked}}))} />
                Highlight
              </label>
              <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-all w-fit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* View News Modal */}
      {viewModal.open && viewModal.news && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button onClick={() => setViewModal({ open: false, news: null })} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-2">{viewModal.news.title}</h2>
            <div className="flex gap-2 mb-2">
              {viewModal.news.images && viewModal.news.images.map((img: string, idx: number) => (
                <img key={idx} src={img} alt="news-img" className="w-24 h-20 object-cover rounded-lg border" />
              ))}
            </div>
            <div className="mb-2 text-xs text-slate-500 flex items-center gap-2">{new Date(viewModal.news.createdAt).toLocaleDateString()}</div>
            <div className="mb-2 text-xs text-blue-700 font-bold uppercase">{viewModal.news.category}</div>
            <div className="text-slate-700 whitespace-pre-line mb-4">{viewModal.news.content}</div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminNewsUpload;
