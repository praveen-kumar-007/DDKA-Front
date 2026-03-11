import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

type MiniTournamentForm = {
  miniTournamentEnabled: boolean;
  miniTournamentBadge: string;
  miniTournamentTitle: string;
  miniTournamentMediaImageUrl: string;
  miniTournamentMediaVideoUrl: string;
  miniTournamentWhenWhereTitle: string;
  miniTournamentWhenWhereText: string;
  miniTournamentWhoCanPlayTitle: string;
  miniTournamentWhoCanPlayText: string;
  miniTournamentHowToRegisterTitle: string;
  miniTournamentBullet1: string;
  miniTournamentBullet2: string;
  miniTournamentPrimaryCtaLabel: string;
  miniTournamentPrimaryCtaUrl: string;
  miniTournamentSecondaryCtaLabel: string;
  miniTournamentSecondaryCtaUrl: string;
  miniTournamentAffiliationButtonLabel: string;
  miniTournamentAffiliationFeeText: string;
  miniTournamentRegistrationFeeLabel: string;
  miniTournamentRegistrationFeeValue: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaults: MiniTournamentForm = {
  miniTournamentEnabled: true,
  miniTournamentBadge: '',
  miniTournamentTitle: '',
  miniTournamentMediaImageUrl: '',
  miniTournamentMediaVideoUrl: '',
  miniTournamentWhenWhereTitle: '',
  miniTournamentWhenWhereText: '',
  miniTournamentWhoCanPlayTitle: '',
  miniTournamentWhoCanPlayText: '',
  miniTournamentHowToRegisterTitle: '',
  miniTournamentBullet1: '',
  miniTournamentBullet2: '',
  miniTournamentPrimaryCtaLabel: '',
  miniTournamentPrimaryCtaUrl: '',
  miniTournamentSecondaryCtaLabel: '',
  miniTournamentSecondaryCtaUrl: '',
  miniTournamentAffiliationButtonLabel: '',
  miniTournamentAffiliationFeeText: '',
  miniTournamentRegistrationFeeLabel: '',
  miniTournamentRegistrationFeeValue: '',
};

const AdminHomeMiniTournamentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MiniTournamentForm>(defaults);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [clearImage, setClearImage] = useState(false);
  const [clearVideo, setClearVideo] = useState(false);

  const setField = <K extends keyof MiniTournamentForm>(key: K, value: MiniTournamentForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json?.success && json?.data) {
          const data = json.data;
          setForm((prev) => ({
            ...prev,
            ...Object.fromEntries(Object.keys(prev).map((k) => [k, typeof data[k] === 'undefined' ? prev[k as keyof MiniTournamentForm] : data[k]])),
          }));
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load section settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const previewImage = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : form.miniTournamentMediaImageUrl), [imageFile, form.miniTournamentMediaImageUrl]);
  const previewVideo = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : form.miniTournamentMediaVideoUrl), [videoFile, form.miniTournamentMediaVideoUrl]);

  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(previewImage);
      if (videoFile) URL.revokeObjectURL(previewVideo);
    };
  }, [imageFile, videoFile, previewImage, previewVideo]);

  const save = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, typeof v === 'boolean' ? String(v) : v));
      fd.append('clearMiniTournamentImage', String(clearImage));
      fd.append('clearMiniTournamentVideo', String(clearVideo));
      if (imageFile) fd.append('miniTournamentImage', imageFile);
      if (videoFile) fd.append('miniTournamentVideo', videoFile);

      const res = await fetch(`${API_URL}/api/settings/home-mini-tournament`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json?.message || 'Failed to save section');
        return;
      }

      setForm((prev) => ({ ...prev, ...json.data }));
      setImageFile(null);
      setVideoFile(null);
      setClearImage(false);
      setClearVideo(false);
      window.dispatchEvent(new CustomEvent('ddka-settings-updated', { detail: json.data || {} }));
      alert('Section updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen p-6 bg-slate-50">Loading section settings...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-oswald font-bold text-blue-900 uppercase tracking-tight">Home Tournament Section</h1>
            <p className="text-slate-500 text-sm">Customize the exact announcement block shown below hero on Home page.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin-portal-access')} className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-60">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            <section className="bg-white border rounded-xl p-5">
              <h2 className="font-bold text-slate-800 mb-3">Visibility & Main</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">Show section</span>
                  <input type="checkbox" checked={form.miniTournamentEnabled} onChange={(e) => setField('miniTournamentEnabled', e.target.checked)} />
                </label>
                <input className="border rounded-lg px-3 py-2" placeholder="Badge text" value={form.miniTournamentBadge} onChange={(e) => setField('miniTournamentBadge', e.target.value)} />
                <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Section title" value={form.miniTournamentTitle} onChange={(e) => setField('miniTournamentTitle', e.target.value)} />
              </div>
            </section>

            <section className="bg-white border rounded-xl p-5">
              <h2 className="font-bold text-slate-800 mb-3">Media</h2>
              <div className="grid grid-cols-1 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="Video URL" value={form.miniTournamentMediaVideoUrl} onChange={(e) => setField('miniTournamentMediaVideoUrl', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Fallback image URL" value={form.miniTournamentMediaImageUrl} onChange={(e) => setField('miniTournamentMediaImageUrl', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="file" accept="image/*" className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  <input type="file" accept="video/*" className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={clearImage} onChange={(e) => setClearImage(e.target.checked)} /> Clear image</label>
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={clearVideo} onChange={(e) => setClearVideo(e.target.checked)} /> Clear video</label>
                </div>
              </div>
            </section>

            <section className="bg-white border rounded-xl p-5">
              <h2 className="font-bold text-slate-800 mb-3">Content Blocks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="When & Where heading" value={form.miniTournamentWhenWhereTitle} onChange={(e) => setField('miniTournamentWhenWhereTitle', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="When & Where text" value={form.miniTournamentWhenWhereText} onChange={(e) => setField('miniTournamentWhenWhereText', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Who can play heading" value={form.miniTournamentWhoCanPlayTitle} onChange={(e) => setField('miniTournamentWhoCanPlayTitle', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Who can play text" value={form.miniTournamentWhoCanPlayText} onChange={(e) => setField('miniTournamentWhoCanPlayText', e.target.value)} />
                <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="How to register heading" value={form.miniTournamentHowToRegisterTitle} onChange={(e) => setField('miniTournamentHowToRegisterTitle', e.target.value)} />
                <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} placeholder="Bullet 1" value={form.miniTournamentBullet1} onChange={(e) => setField('miniTournamentBullet1', e.target.value)} />
                <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} placeholder="Bullet 2" value={form.miniTournamentBullet2} onChange={(e) => setField('miniTournamentBullet2', e.target.value)} />
              </div>
            </section>

            <section className="bg-white border rounded-xl p-5">
              <h2 className="font-bold text-slate-800 mb-3">Buttons & Fees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="Primary CTA label" value={form.miniTournamentPrimaryCtaLabel} onChange={(e) => setField('miniTournamentPrimaryCtaLabel', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Primary CTA URL" value={form.miniTournamentPrimaryCtaUrl} onChange={(e) => setField('miniTournamentPrimaryCtaUrl', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Secondary CTA label" value={form.miniTournamentSecondaryCtaLabel} onChange={(e) => setField('miniTournamentSecondaryCtaLabel', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Secondary CTA URL" value={form.miniTournamentSecondaryCtaUrl} onChange={(e) => setField('miniTournamentSecondaryCtaUrl', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Affiliation button label" value={form.miniTournamentAffiliationButtonLabel} onChange={(e) => setField('miniTournamentAffiliationButtonLabel', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Affiliation fee text" value={form.miniTournamentAffiliationFeeText} onChange={(e) => setField('miniTournamentAffiliationFeeText', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Registration fee label" value={form.miniTournamentRegistrationFeeLabel} onChange={(e) => setField('miniTournamentRegistrationFeeLabel', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Registration fee value" value={form.miniTournamentRegistrationFeeValue} onChange={(e) => setField('miniTournamentRegistrationFeeValue', e.target.value)} />
              </div>
            </section>
          </div>

          <aside className="bg-white border rounded-xl p-5 h-fit">
            <h2 className="font-bold text-slate-800 mb-3">Preview Media</h2>
            <div className="space-y-3">
              {previewVideo ? (
                <video src={previewVideo} className="w-full h-40 rounded object-cover" autoPlay muted loop playsInline />
              ) : (
                <div className="w-full h-40 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">No video</div>
              )}
              {previewImage ? (
                <img src={previewImage} alt="Section preview" className="w-full h-40 rounded object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">No image</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeMiniTournamentManagement;
