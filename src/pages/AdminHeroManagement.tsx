import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';

type HeroFormState = {
  heroEnabled: boolean;
  heroShowAffiliations: boolean;
  heroShowStats: boolean;
  heroShowLogos: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroBadge: string;
  heroSlogan: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroAffiliationLine1: string;
  heroAffiliationLine2: string;
  heroAffiliationLine3: string;
  heroStat1Value: string;
  heroStat1Label: string;
  heroStat2Value: string;
  heroStat2Label: string;
  heroStat3Value: string;
  heroStat3Label: string;
  heroStat4Value: string;
  heroStat4Label: string;
  heroLogo1Url: string;
  heroLogo2Url: string;
  heroLogo3Url: string;
  heroImageUrl: string;
  heroVideoUrl: string;
};

const defaultState: HeroFormState = {
  heroEnabled: true,
  heroShowAffiliations: true,
  heroShowStats: true,
  heroShowLogos: true,
  heroTitle: '',
  heroSubtitle: '',
  heroDescription: '',
  heroBadge: '',
  heroSlogan: '',
  heroCtaPrimary: '',
  heroCtaSecondary: '',
  heroAffiliationLine1: '',
  heroAffiliationLine2: '',
  heroAffiliationLine3: '',
  heroStat1Value: '',
  heroStat1Label: '',
  heroStat2Value: '',
  heroStat2Label: '',
  heroStat3Value: '',
  heroStat3Label: '',
  heroStat4Value: '',
  heroStat4Label: '',
  heroLogo1Url: '',
  heroLogo2Url: '',
  heroLogo3Url: '',
  heroImageUrl: '',
  heroVideoUrl: '',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminHeroManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<HeroFormState>(defaultState);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroVideoFile, setHeroVideoFile] = useState<File | null>(null);
  const [clearHeroImage, setClearHeroImage] = useState(false);
  const [clearHeroVideo, setClearHeroVideo] = useState(false);

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
          setForm((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.keys(prev).map((key) => [key, typeof json.data[key] === 'undefined' ? prev[key as keyof HeroFormState] : json.data[key]])
            ),
          }));
        }
      } catch (err) {
        console.error('Failed to load hero settings', err);
        alert('Failed to load hero settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const previewMedia = useMemo(() => {
    const imageSrc = heroImageFile ? URL.createObjectURL(heroImageFile) : form.heroImageUrl.trim();
    const videoSrc = heroVideoFile ? URL.createObjectURL(heroVideoFile) : form.heroVideoUrl.trim();
    return { imageSrc, videoSrc };
  }, [form.heroImageUrl, form.heroVideoUrl, heroImageFile, heroVideoFile]);

  useEffect(() => {
    return () => {
      if (heroImageFile) URL.revokeObjectURL(previewMedia.imageSrc);
      if (heroVideoFile) URL.revokeObjectURL(previewMedia.videoSrc);
    };
  }, [heroImageFile, heroVideoFile, previewMedia.imageSrc, previewMedia.videoSrc]);

  const setField = <K extends keyof HeroFormState>(key: K, value: HeroFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, typeof value === 'boolean' ? String(value) : value);
      });
      formData.append('clearHeroImage', String(clearHeroImage));
      formData.append('clearHeroVideo', String(clearHeroVideo));
      if (heroImageFile) formData.append('heroImage', heroImageFile);
      if (heroVideoFile) formData.append('heroVideo', heroVideoFile);

      const res = await fetch(`${API_URL}/api/settings/hero`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json?.message || 'Failed to update hero settings');
        return;
      }

      const latest = json?.data || {};
      setForm((prev) => ({ ...prev, ...latest }));
      setHeroImageFile(null);
      setHeroVideoFile(null);
      setClearHeroImage(false);
      setClearHeroVideo(false);
      window.dispatchEvent(new CustomEvent('ddka-settings-updated', { detail: latest }));
      alert('Hero settings updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update hero settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-600">Loading hero settings...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-oswald font-bold text-blue-900 uppercase tracking-tight">Hero Studio</h1>
            <p className="text-sm text-slate-500">Dedicated page to fully customize homepage hero content.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin-portal-access')}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-60"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Visibility</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <span className="font-medium text-sm">Show Hero Section</span>
                  <input type="checkbox" checked={form.heroEnabled} onChange={(e) => setField('heroEnabled', e.target.checked)} />
                </label>
                <label className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <span className="font-medium text-sm">Show Affiliations Card</span>
                  <input type="checkbox" checked={form.heroShowAffiliations} onChange={(e) => setField('heroShowAffiliations', e.target.checked)} />
                </label>
                <label className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <span className="font-medium text-sm">Show Stats Panel</span>
                  <input type="checkbox" checked={form.heroShowStats} onChange={(e) => setField('heroShowStats', e.target.checked)} />
                </label>
                <label className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <span className="font-medium text-sm">Show Logos</span>
                  <input type="checkbox" checked={form.heroShowLogos} onChange={(e) => setField('heroShowLogos', e.target.checked)} />
                </label>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Text Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="Badge text" value={form.heroBadge} onChange={(e) => setField('heroBadge', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Slogan text" value={form.heroSlogan} onChange={(e) => setField('heroSlogan', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Hero title" value={form.heroTitle} onChange={(e) => setField('heroTitle', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Hero subtitle" value={form.heroSubtitle} onChange={(e) => setField('heroSubtitle', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Primary CTA label" value={form.heroCtaPrimary} onChange={(e) => setField('heroCtaPrimary', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Secondary CTA label" value={form.heroCtaSecondary} onChange={(e) => setField('heroCtaSecondary', e.target.value)} />
                <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={4} placeholder="Hero description" value={form.heroDescription} onChange={(e) => setField('heroDescription', e.target.value)} />
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Affiliation Lines</h2>
              <div className="grid grid-cols-1 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="Affiliation line 1" value={form.heroAffiliationLine1} onChange={(e) => setField('heroAffiliationLine1', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Affiliation line 2" value={form.heroAffiliationLine2} onChange={(e) => setField('heroAffiliationLine2', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Affiliation line 3" value={form.heroAffiliationLine3} onChange={(e) => setField('heroAffiliationLine3', e.target.value)} />
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 1 value (ex: 50+)" value={form.heroStat1Value} onChange={(e) => setField('heroStat1Value', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 1 label" value={form.heroStat1Label} onChange={(e) => setField('heroStat1Label', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 2 value" value={form.heroStat2Value} onChange={(e) => setField('heroStat2Value', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 2 label" value={form.heroStat2Label} onChange={(e) => setField('heroStat2Label', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 3 value" value={form.heroStat3Value} onChange={(e) => setField('heroStat3Value', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 3 label" value={form.heroStat3Label} onChange={(e) => setField('heroStat3Label', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 4 value" value={form.heroStat4Value} onChange={(e) => setField('heroStat4Value', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Stat 4 label" value={form.heroStat4Label} onChange={(e) => setField('heroStat4Label', e.target.value)} />
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Logos</h2>
              <div className="grid grid-cols-1 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="Logo 1 URL" value={form.heroLogo1Url} onChange={(e) => setField('heroLogo1Url', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Logo 2 URL" value={form.heroLogo2Url} onChange={(e) => setField('heroLogo2Url', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Logo 3 URL" value={form.heroLogo3Url} onChange={(e) => setField('heroLogo3Url', e.target.value)} />
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Background Media</h2>
              <div className="grid grid-cols-1 gap-3">
                <input className="border rounded-lg px-3 py-2" placeholder="Hero image URL" value={form.heroImageUrl} onChange={(e) => setField('heroImageUrl', e.target.value)} />
                <input className="border rounded-lg px-3 py-2" placeholder="Hero video URL" value={form.heroVideoUrl} onChange={(e) => setField('heroVideoUrl', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="file" accept="image/*" className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />
                  <input type="file" accept="video/*" className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setHeroVideoFile(e.target.files?.[0] || null)} />
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={clearHeroImage} onChange={(e) => setClearHeroImage(e.target.checked)} />
                    Clear saved hero image
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={clearHeroVideo} onChange={(e) => setClearHeroVideo(e.target.checked)} />
                    Clear saved hero video
                  </label>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Preview Source</h2>
              <div className="text-xs text-slate-600 space-y-2">
                <p>Background uses video if provided, otherwise image.</p>
                <p>Leave any text field empty to fallback to default translation content.</p>
                <p>Use Save Changes to push all updates in one request.</p>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Media Preview</h2>
              <div className="space-y-3">
                <div className="border rounded-lg p-2">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Image</p>
                  {previewMedia.imageSrc ? (
                    <img src={previewMedia.imageSrc} alt="Hero preview" className="w-full h-32 object-cover rounded" />
                  ) : (
                    <div className="h-32 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-xs">No image selected</div>
                  )}
                </div>
                <div className="border rounded-lg p-2">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Video</p>
                  {previewMedia.videoSrc ? (
                    <video src={previewMedia.videoSrc} className="w-full h-32 object-cover rounded" muted loop autoPlay playsInline />
                  ) : (
                    <div className="h-32 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-xs">No video selected</div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Live Status</h2>
              <div className="inline-flex items-center gap-2 text-sm font-semibold">
                {form.heroEnabled ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-rose-600" />}
                <span className={form.heroEnabled ? 'text-green-700' : 'text-rose-700'}>
                  {form.heroEnabled ? 'Hero visible to users' : 'Hero hidden from users'}
                </span>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminHeroManagement;
