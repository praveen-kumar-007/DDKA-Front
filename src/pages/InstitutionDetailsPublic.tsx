import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const InstitutionDetailsPublic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inst, setInst] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchInst = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/institutions/public/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Institution not found');
        setInst(json.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load institution');
      } finally {
        setLoading(false);
      }
    };
    fetchInst();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !inst) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Not found'}</div>;

  return (
    <>
      <Helmet>
        <title>{`${inst.instName} | Affiliated Institution — DDKA`}</title>
        <link rel="canonical" href={`${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/institution/${inst._id}`} />
        <meta name="description" content={`${inst.instName} - ${inst.instType}. Affiliated to DDKA`} />
        {/* Public organization structured data without personal phone numbers */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": inst.instName,
            "url": `${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/institution/${inst._id}`,
            "logo": inst.instLogoUrl || `${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/logo.png`,
            "description": inst.description || `${inst.instName} affiliated with DDKA`,
            // Include email only (no phone numbers)
            "contactPoint": inst.email ? [{ "@type": "ContactPoint", "email": inst.email, "contactType": "membership" }] : undefined,
            "address": inst.address || undefined
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
          <div className="flex items-center gap-6">
            {inst.instLogoUrl ? <img src={inst.instLogoUrl} alt={inst.instName} className="w-28 h-28 object-contain rounded-md" /> : null}
            <div>
              <h1 className="text-2xl font-bold">{inst.instName}</h1>
              <p className="text-sm text-slate-600">{inst.instType} &middot; Established {inst.year}</p>
            </div>
          </div>

          {/* Key Details - show non-personal fields like email, head and secretary names, but hide phones and surfaceType */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            {inst.email && (
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Email</div>
                <div className="font-medium text-slate-900">{inst.email}</div>
              </div>
            )}

            {inst.headName && (
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Head / Principal</div>
                <div className="font-medium text-slate-900">{inst.headName}</div>
              </div>
            )}

            {inst.secretaryName && (
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Secretary</div>
                <div className="font-medium text-slate-900">{inst.secretaryName}</div>
              </div>
            )}

            {inst.totalPlayers !== undefined && (
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Total Registered Players</div>
                <div className="font-medium text-slate-900">{`${inst.totalPlayers}+`}</div>
              </div>
            )}

            {inst.address && (
              <div className="md:col-span-2">
                <div className="text-xs text-slate-500 uppercase tracking-wide">Address</div>
                <div className="font-medium text-slate-900">{inst.address}</div>
              </div>
            )}
          </div>

          {inst.description && <div className="mt-6 text-slate-700 whitespace-pre-line">{inst.description}</div>}

          {inst.website && <p className="mt-4">Website: <a href={inst.website} target="_blank" rel="noreferrer" className="text-blue-600">{inst.website}</a></p>}
        </div>
      </div>
    </>
  );
};

export default InstitutionDetailsPublic;