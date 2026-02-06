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
                <p className="text-sm text-slate-900 break-words font-mono text-xs">{official.transactionId || '-'}</p>
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
                {(() => {
                  const buildCertificateUrl = (autoDownload?: boolean) => {
                    if (!official) return '';
                    const suffix = (official._id || '').slice(-4).toUpperCase();
                    const params = new URLSearchParams();
                    if (API_URL) params.set('api', API_URL);
                    if (API_URL) params.set('api', API_URL);
                    params.set('name', official.candidateName);
                    params.set('father', official.parentName);
                    if (suffix && official.grade) params.set('regSuffix', suffix);
                    // Use event date (fixed) for certificate
                    params.set('date', '2026-01-18');
                    if (official.grade) params.set('grade', official.grade);
                    if (official.photoUrl) params.set('photoUrl', official.photoUrl);
                    // Auto-download PDF at a comfortable resolution (no 8K oversize)
                    if (autoDownload) { params.set('download', 'pdf'); }
                    return `/important-docs/official-certificate.html?${params.toString()}`;
                  };

                  const buildIdCardUrl = (autoDownload?: boolean) => {
                    if (!official) return '';
                    const suffix = (official._id || '').slice(-4).toUpperCase();
                    const params = new URLSearchParams();
                    if (API_URL) params.set('api', API_URL);
                    params.set('name', official.candidateName);
                    if (suffix) {
                      params.set('sno', suffix);
                    }
                    if (official.aadharNumber) {
                      params.set('uid', official.aadharNumber);
                    }
                    const dobDate = official.dob ? new Date(official.dob) : null;
                    if (dobDate && !Number.isNaN(dobDate.getTime())) {
                      params.set('dob', dobDate.toISOString().slice(0, 10));
                    }
                    if (official.grade) params.set('grade', official.grade);
                    if (official.photoUrl) params.set('photoUrl', official.photoUrl);
                    if (official.bloodGroup) params.set('bloodGroup', official.bloodGroup);
                    if (autoDownload) { params.set('download', 'pdf'); }
                    return `/important-docs/technical-id-card.html?${params.toString()}`;
                  };

                  const triggerDownload = (url: string, filenameBase?: string) => {
                    if (!url) return;
                    const win = window.open(url, '_blank');
                    if (!win) {
                      // fallback to navigation if popup blocked
                      window.location.href = url;
                      return;
                    }

                    const handler = (e: MessageEvent) => {
                      if (e.origin !== window.location.origin) return;
                      const data = e.data || {};
                      if (data.type !== 'ddka:certificate') return;

                      try {
                        if (data.format === 'png') {
                          if (data.blob) {
                            const url = URL.createObjectURL(data.blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${(filenameBase || 'DDKA-Certificate')}.png`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          } else if (data.dataUrl) {
                            const a = document.createElement('a');
                            a.href = data.dataUrl;
                            a.download = `${(filenameBase || 'DDKA-Certificate')}.png`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }
                        } else if (data.format === 'pdf') {
                          // Blob may be posted directly
                          if (data.blob) {
                            const url = URL.createObjectURL(data.blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${(filenameBase || 'DDKA-Certificate')}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          } else if (data.dataUrl) {
                            const a = document.createElement('a');
                            a.href = data.dataUrl;
                            a.download = `${(filenameBase || 'DDKA-Certificate')}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }
                        }
                      } catch (err) {
                        console.error('Download handler failed', err);
                      } finally {
                        window.removeEventListener('message', handler as any);
                        try { win.close(); } catch (e) {}
                      }
                    };

                    window.addEventListener('message', handler as any);
                  };

                  return (
                    <>
                <button
                  type="button"
                  disabled={official.status !== 'Approved' || !official.grade}
                  onClick={() => {
                    const url = buildIdCardUrl(false);
                    if (!url) return;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-600"
                  title={official.status !== 'Approved'
                    ? 'ID card available only after approval'
                    : !official.grade
                      ? 'Set a grade to generate ID card'
                      : 'Open Technical Official ID card'}
                >
                  View / Download ID Card
                </button>
                <button
                  type="button"
                  disabled={official.status !== 'Approved' || !official.grade}
                  onClick={() => {
                    const url = buildIdCardUrl(true);
                    if (!url) return;
                    const filenameBase = official ? `ID_${official.candidateName?.replace(/\s+/g, '_') || 'technical_official'}` : 'technical_official';
                    triggerDownload(url, filenameBase);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 disabled:bg-slate-300 disabled:text-slate-600 border border-indigo-200"
                  title={official.status !== 'Approved'
                    ? 'ID card download available only after approval'
                    : !official.grade
                      ? 'Set a grade to generate ID card'
                      : 'Download Technical Official ID card'}
                >
                  Download ID Card
                </button>
                <button
                  type="button"
                  disabled={official.status !== 'Approved' || !official.grade}
                  onClick={() => {
                    const url = buildCertificateUrl(false);
                    if (!url) return;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600"
                  title={official.status !== 'Approved'
                    ? 'Certificate available only after approval'
                    : !official.grade
                      ? 'Set a grade to generate certificate'
                      : 'Open Technical Official certificate'}
                >
                  View Certificate
                </button>
                <button
                  type="button"
                  disabled={official.status !== 'Approved' || !official.grade}
                  onClick={() => {
                    const url = buildCertificateUrl(true);
                    if (!url) return;
                    const filenameBase = official ? (official.candidateName || 'certificate').replace(/\s+/g, '_') : 'certificate';
                    triggerDownload(url, filenameBase);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest hover:bg-emerald-100 disabled:bg-slate-300 disabled:text-slate-600 border border-emerald-200"
                  title={official.status !== 'Approved'
                    ? 'Certificate available only after approval'
                    : !official.grade
                      ? 'Set a grade to generate certificate'
                      : 'Download Technical Official certificate'}
                >
                  Download Certificate
                </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

          <LoginActivityCard
            activities={official.loginActivities}
            title="Official Login History"
            subtitle="Last 3 recorded sessions"
          />

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
