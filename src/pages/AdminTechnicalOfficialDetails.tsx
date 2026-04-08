import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Trash2, UserCheck, XCircle } from 'lucide-react';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';
import { formatDateMDY } from '../utils/date';
import LoginActivityCard from '../components/admin/LoginActivityCard';
import type { LoginActivityEntry } from '../components/admin/LoginActivityCard';

interface TechnicalOfficial {
  _id: string;
  candidateName: string;
  parentName: string;
  dob: string;
  address: string;
  aadharNumber: string;
  gender: string;
  bloodGroup?: string;
  playerLevel: string;
  work: string;
  mobile: string;
  education: string;
  email: string;
  transactionId?: string;
  examFee?: number;
  receiptUrl?: string;
  signatureUrl: string;
  photoUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
  grade?: 'A' | 'B' | 'C' | '';
  examScore?: number | null;
  idCardDownloadUrl?: string;
  certificateDownloadUrl?: string;
  createdAt: string;
  loginActivities?: LoginActivityEntry[];
}

interface AdminPermissions {
  canDelete?: boolean;
}

const AdminTechnicalOfficialDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialOfficial = (location.state as { official?: TechnicalOfficial } | null)?.official || null;
  const [official, setOfficial] = useState<TechnicalOfficial | null>(initialOfficial);
  const [loading, setLoading] = useState<boolean>(!initialOfficial);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState<string>(initialOfficial?.grade || '');
  const [examScore, setExamScore] = useState<string>(
    initialOfficial && typeof initialOfficial.examScore === 'number'
      ? String(initialOfficial.examScore)
      : ''
  );
  const [savingGrade, setSavingGrade] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [downloadingAsset, setDownloadingAsset] = useState<'id-card' | 'certificate' | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Load admin role & permissions for delete access control
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

    const fetchOfficial = async () => {
      if (!id) return;
      if (!initialOfficial || initialOfficial._id !== id) {
        setLoading(true);
      }
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/technical-officials/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch technical official details');
        }

        setOfficial(data.data);
        setGrade(data.data.grade || '');
        setExamScore(
          typeof data.data.examScore === 'number' && !Number.isNaN(data.data.examScore)
            ? String(data.data.examScore)
            : ''
        );
      } catch (err: any) {
        console.error('Error fetching technical official details:', err);
        setError(err.message || 'Failed to fetch technical official details');
      } finally {
        setLoading(false);
      }
    };

    fetchOfficial();
  }, [API_URL, id, initialOfficial]);

  const canDelete = adminRole === 'superadmin' || !!adminPermissions?.canDelete;

  const getFilenameFromDisposition = (contentDisposition: string | null): string | null => {
    if (!contentDisposition) return null;
    const utf8Name = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Name && utf8Name[1]) return decodeURIComponent(utf8Name[1]);
    const quoted = contentDisposition.match(/filename="([^"]+)"/i);
    if (quoted && quoted[1]) return quoted[1];
    const plain = contentDisposition.match(/filename=([^;]+)/i);
    return plain && plain[1] ? plain[1].trim() : null;
  };

  const forceDownloadBlob = (blob: Blob, filename: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const triggerTemplateDownload = (url: string, filenameBase: string) => {
    const downloadWindow = window.open(url, '_blank');
    if (!downloadWindow) {
      window.location.href = url;
      return;
    }

    const closeTimer = window.setTimeout(() => {
      try { downloadWindow.close(); } catch { /* ignore */ }
    }, 12000);

    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data || {};
      if (data.type !== 'ddka:certificate') return;

      try {
        const format = String(data.format || 'pdf').toLowerCase();
        const ext = format === 'jpg' || format === 'jpeg' ? 'jpg' : (format === 'png' ? 'png' : 'pdf');
        if (data.blob) {
          forceDownloadBlob(data.blob as Blob, `${filenameBase}.${ext}`);
        } else if (data.dataUrl) {
          const link = document.createElement('a');
          link.href = String(data.dataUrl);
          link.download = `${filenameBase}.${ext}`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      } catch (error) {
        console.error('Template postMessage download failed', error);
      } finally {
        window.removeEventListener('message', handler as any);
        window.clearTimeout(closeTimer);
        try { downloadWindow.close(); } catch { /* ignore */ }
      }
    };

    window.addEventListener('message', handler as any);

    setTimeout(() => {
      window.removeEventListener('message', handler as any);
    }, 45000);
  };

  const downloadOfficialAsset = async (assetType: 'id-card' | 'certificate') => {
    if (!official?._id) return;

    const token = localStorage.getItem('token') || '';
    const safeName = (official.candidateName || 'technical_official').replace(/\s+/g, '_');
    const fallbackFilename = assetType === 'id-card' ? `ID_${safeName}.pdf` : `${safeName}_Certificate.pdf`;
    const templateFilenameBase = assetType === 'id-card' ? `DDKA-ID-${safeName}` : `DDKA-Certificate-${safeName}`;

    const dbProvidedUrl = assetType === 'id-card'
      ? (official.idCardDownloadUrl || '')
      : (official.certificateDownloadUrl || '');

    const normalizedDbUrl = dbProvidedUrl
      ? (dbProvidedUrl.startsWith('http') ? dbProvidedUrl : `${API_URL}${dbProvidedUrl}`)
      : '';

    const endpointCandidates = [
      normalizedDbUrl,
      `${API_URL}/api/technical-officials/${official._id}/${assetType}/download`,
      `${API_URL}/api/technical-officials/${official._id}/download/${assetType}`,
      `${API_URL}/api/admin/technical-officials/${official._id}/${assetType}/download`,
      `${API_URL}/api/admin/technical-officials/${official._id}/download/${assetType}`
    ].filter(Boolean);

    const uniqueEndpoints = Array.from(new Set(endpointCandidates));

    setDownloadingAsset(assetType);
    try {
      let lastMessage = 'Backend download endpoint not available.';

      for (const endpoint of uniqueEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            credentials: 'include'
          });

          if (!response.ok) {
            let message = `${response.status} ${response.statusText}`;
            try {
              const json = await response.json();
              if (json?.message) message = json.message;
            } catch {
              // Ignore non-JSON responses
            }
            lastMessage = message;
            continue;
          }

          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await response.json();
            if (data?.downloadUrl) {
              triggerTemplateDownload(String(data.downloadUrl), templateFilenameBase);
              return;
            }
            lastMessage = data?.message || 'Download URL not provided by backend.';
            continue;
          }

          const blob = await response.blob();
          const filename = getFilenameFromDisposition(response.headers.get('content-disposition')) || fallbackFilename;
          forceDownloadBlob(blob, filename);
          return;
        } catch (downloadError) {
          console.error(`Failed downloading from ${endpoint}`, downloadError);
        }
      }

      alert(`Unable to download ${assetType.replace('-', ' ')}. ${lastMessage}`);
    } finally {
      setDownloadingAsset(null);
    }
  };

  const handleStatusChange = async (newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    if (!official) return;
    if (newStatus === 'Rejected' && !window.confirm('Are you sure you want to reject this application?')) return;

    try {
      const response = await fetch(`${API_URL}/api/technical-officials/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ id: official._id, status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setOfficial(prev => (prev ? { ...prev, status: newStatus } : prev));
        alert('Status updated successfully.');
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleDeleteOfficial = async () => {
    if (!official?._id) return;
    if (!window.confirm('Permanently delete this technical official? This cannot be undone.')) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/technical-officials/${official._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Technical official deleted successfully.');
        navigate('/admin/technical-officials');
      } else {
        alert(data.message || 'Failed to delete technical official');
      }
    } catch (error) {
      console.error('Error deleting technical official:', error);
      alert('Error deleting technical official');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900" />
        </div>
      </div>
    );
  }

  if (error || !official) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
          <p className="text-red-700 font-medium">{error || 'Technical Official not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <AdminPageHeader
          title="Technical Official Details"
          subtitle={official ? official.candidateName : ''}
          showBack={false}
          actions={(
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-900"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          )}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-oswald font-bold uppercase">Technical Official Details</h1>
              <p className="text-xs text-blue-100">Review complete profile and application info</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <StatusMark status={official.status} title={official.status} className="w-8 h-8" />
              <span className="sr-only">{official.status}</span>
            </div>
            <div className="text-sm text-blue-100">
              <div className="text-xs font-semibold">Reg No:</div>
              <div className="font-mono text-[13px]">{official._id ? `DDKA-2026-${official._id.slice(-4).toUpperCase()}` : 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            {official.photoUrl && (
              <img
                src={official.photoUrl}
                alt={official.candidateName}
                className="w-40 h-40 rounded-xl object-cover border border-slate-200 shadow-sm"
              />
            )}
            {official.signatureUrl && (
              <div className="w-full">
                <p className="text-xs font-semibold text-slate-600 mb-1">Signature</p>
                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                  <img
                    src={official.signatureUrl}
                    alt={`${official.candidateName} Signature`}
                    className="max-h-20 object-contain"
                  />
                </div>
              </div>
            )}
            {official.receiptUrl && (
              <div className="w-full">
                <p className="text-xs font-semibold text-slate-600 mb-1">Payment Screenshot</p>
                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                  <img
                    src={official.receiptUrl}
                    alt={`${official.candidateName} Payment Receipt`}
                    className="max-h-40 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Name</p>
                <p className="text-sm font-medium text-slate-900">{official.candidateName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Parent Name</p>
                <p className="text-sm text-slate-900">{official.parentName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</p>
                <p className="text-sm text-slate-900">{official.dob ? formatDateMDY(official.dob) : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Aadhar Number</p>
                <p className="text-sm text-slate-900 tracking-wide">{official.aadharNumber}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Mobile</p>
                <p className="text-sm text-slate-900">+91 {official.mobile}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                <p className="text-sm text-slate-900 break-words">{official.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Gender</p>
                <p className="text-sm text-slate-900">{official.gender}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Player Level</p>
                <p className="text-sm text-slate-900">{official.playerLevel}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Blood Group</p>
                <p className="text-sm text-slate-900">{official.bloodGroup || 'NA'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Exam Fee</p>
                <p className="text-sm text-slate-900">₹{official.examFee || 1000}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Transaction ID</p>
                <p className="text-xs text-slate-900 break-words font-mono">{official.transactionId || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Referee Exam Score</p>
                <p className="text-sm text-slate-900">{typeof official.examScore === 'number' ? official.examScore : '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Work / Occupation</p>
                <p className="text-sm text-slate-900">{official.work}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Education</p>
                <p className="text-sm text-slate-900">{official.education}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Address</p>
              <p className="text-sm text-slate-900 whitespace-pre-line">{official.address}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <p className="font-semibold uppercase">Application ID</p>
                <p className="font-mono text-[11px] text-slate-700 break-words">{official._id}</p>
              </div>
              <div>
                <p className="font-semibold uppercase">Submitted On</p>
                <p className="text-slate-700">{official.createdAt ? new Date(official.createdAt).toLocaleString() : '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Registration Number</p>
                <p className="text-sm text-slate-900 font-mono">
                  {official._id && official.grade
                    ? `DDKA-2026-${official._id.slice(-4).toUpperCase()}`
                    : 'DDKA-2026-____'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Referee Exam Score & Grade (Admin)</p>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    name="examScore"
                    value={examScore}
                    onChange={(e) => {
                      const val = e.target.value;
                      setExamScore(val);

                      const trimmed = val.trim();
                      const numericScore = trimmed === '' ? NaN : Number(trimmed);

                      if (Number.isNaN(numericScore)) {
                        setGrade('');
                      } else if (numericScore >= 71 && numericScore <= 100) {
                        setGrade('A');
                      } else if (numericScore >= 61 && numericScore <= 70) {
                        setGrade('B');
                      } else if (numericScore >= 50 && numericScore <= 60) {
                        setGrade('C');
                      } else {
                        // Outside bands: no grade
                        setGrade('');
                      }
                    }}
                    placeholder="Score (e.g. 85)"
                    className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                  <select
                    value={grade}
                    disabled
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="">Select grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                  <button
                    type="button"
                    disabled={savingGrade || !official._id}
                    onClick={async () => {
                      if (!official?._id) return;

                      const trimmed = examScore.trim();
                      const numericScore = trimmed === '' ? NaN : Number(trimmed);
                      if (trimmed !== '' && (Number.isNaN(numericScore) || numericScore < 0)) {
                        alert('Please enter a valid non-negative exam score.');
                        return;
                      }

                      setSavingGrade(true);
                      try {
                        const response = await fetch(`${API_URL}/api/technical-officials/${official._id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                          },
                          body: JSON.stringify({
                            // grade is auto-calculated from score on backend; we still send
                            // the current grade value for completeness, but server derives it
                            // from examScore according to configured bands.
                            grade: grade || null,
                            examScore: numericScore,
                          })
                        });
                        const data = await response.json();
                        if (!response.ok || !data.success) {
                          throw new Error(data.message || 'Failed to update exam score / grade');
                        }
                        setOfficial(data.data);
                        setGrade(data.data.grade || '');
                        setExamScore(
                          typeof data.data.examScore === 'number' && !Number.isNaN(data.data.examScore)
                            ? String(data.data.examScore)
                            : ''
                        );
                        alert('Referee exam score and grade updated successfully.');
                      } catch (err: any) {
                        console.error('Error updating exam score / grade:', err);
                        alert(err.message || 'Failed to update exam score / grade');
                      } finally {
                        setSavingGrade(false);
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 disabled:opacity-60"
                  >
                    {savingGrade ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Score and grade will appear on the Technical Official certificate and in the candidate account.</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Admin Remarks</p>
              <p className="text-sm text-slate-900 min-h-[2.5rem]">{official.remarks || 'No remarks added yet.'}</p>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {canDelete && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={async () => {
                    if (!official?._id) return;
                    const confirmed = window.confirm('Delete certificate details (grade & registration number) for this Technical Official? The application record will remain.');
                    if (!confirmed) return;
                    setDeleting(true);
                    try {
                      const response = await fetch(`${API_URL}/api/technical-officials/${official._id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                        },
                        body: JSON.stringify({ grade: null })
                      });
                      const data = await response.json();
                      if (!response.ok || !data.success) {
                        throw new Error(data.message || 'Failed to delete certificate details');
                      }
                      setOfficial(data.data);
                      setGrade('');
                      alert('Certificate details deleted. You can set grade again later if needed.');
                    } catch (err: any) {
                      console.error('Error deleting certificate details:', err);
                      alert(err.message || 'Failed to delete certificate details');
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest hover:bg-red-200 disabled:opacity-60"
                  title="Delete only certificate details (grade & registration) for this Technical Official"
                >
                  {deleting ? 'Deleting...' : 'Delete Certificate'}
                </button>
              )}
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <button
                  type="button"
                  disabled={official.status !== 'Approved' || !official.grade || downloadingAsset === 'id-card'}
                  onClick={() => { downloadOfficialAsset('id-card'); }}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-600"
                  title={official.status !== 'Approved'
                    ? 'ID card available only after approval'
                    : !official.grade
                      ? 'Set a grade to generate ID card'
                      : 'Download Technical Official ID card from backend'}
                >
                  {downloadingAsset === 'id-card' ? 'Downloading ID Card...' : 'Download ID Card'}
                </button>
                <button
                  type="button"
                  disabled={official.status !== 'Approved' || !official.grade || downloadingAsset === 'certificate'}
                  onClick={() => { downloadOfficialAsset('certificate'); }}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600"
                  title={official.status !== 'Approved'
                    ? 'Certificate available only after approval'
                    : !official.grade
                      ? 'Set a grade to generate certificate'
                      : 'Download Technical Official certificate from backend'}
                >
                  {downloadingAsset === 'certificate' ? 'Downloading Certificate...' : 'Download Certificate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {adminRole === 'superadmin' && (
        <LoginActivityCard
          activities={official.loginActivities}
          title="Official Login History"
          subtitle="Last 3 recorded sessions"
        />
      )}

      {/* Final admin action bar for status & delete */}
      <div className="mt-6 flex justify-end">
        <div className="flex flex-wrap gap-2">
          {official.status !== 'Rejected' && (
            <button
              type="button"
              onClick={() => handleStatusChange('Rejected')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
          )}
          {official.status !== 'Approved' && (
            <button
              type="button"
              onClick={() => handleStatusChange('Approved')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve</span>
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              disabled={deleting}
              onClick={handleDeleteOfficial}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTechnicalOfficialDetails;
