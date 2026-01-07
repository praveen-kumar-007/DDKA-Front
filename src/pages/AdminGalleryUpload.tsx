import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AdminPermissions {
  canDelete?: boolean;
}

const AdminGalleryUpload = () => {
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not admin
    if (sessionStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/');
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
  }, [navigate]);

  const canDelete = adminRole === 'superadmin' && !!adminPermissions?.canDelete;

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/gallery`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();
      if (result.success) setGallery(result.data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess(false);
    const formData = new FormData();
    images.forEach(img => formData.append('images', img));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setImages([]);
        setSuccess(true);
        fetchGallery();
      } else {
        setError(result.message || 'Failed to upload images');
      }
    } catch (e) {
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    fetchGallery();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold flex items-center gap-3 text-blue-900 drop-shadow"><ImageIcon size={32}/> Admin Gallery Management</h1>
          <button
            onClick={() => navigate('/admin-portal-access')}
            className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 flex flex-col md:flex-row gap-10 mb-16 items-stretch">
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
          <div className="flex-1 flex flex-col gap-5 justify-center">
            <button type="submit" disabled={uploading} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all w-fit mt-2">{uploading ? 'Uploading...' : 'Upload Images'}</button>
            {success && <div className="text-green-600 font-bold mt-2">Images uploaded successfully!</div>}
            {error && <div className="text-red-600 font-bold mt-2">{error}</div>}
          </div>
        </form>
        <div className="w-full h-0.5 bg-gradient-to-r from-blue-200 via-slate-100 to-orange-100 mb-12 rounded-full" />
        <h2 className="text-2xl font-bold mb-4">Gallery Images</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((img) => (
              <div key={img._id} className="relative group bg-white rounded-xl shadow border p-2 flex flex-col items-center">
                <img src={img.url} alt="gallery-img" className="w-full h-40 object-cover rounded-lg" />
                {canDelete && (
                  <button onClick={() => handleDelete(img._id)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryUpload;
