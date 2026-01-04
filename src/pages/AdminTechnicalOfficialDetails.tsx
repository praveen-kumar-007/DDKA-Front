import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck } from 'lucide-react';

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
  createdAt: string;
}

const AdminTechnicalOfficialDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [official, setOfficial] = useState<TechnicalOfficial | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOfficial = async () => {
      if (!id) return;
      setLoading(true);
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
      } catch (err: any) {
        console.error('Error fetching technical official details:', err);
        setError(err.message || 'Failed to fetch technical official details');
      } finally {
        setLoading(false);
      }
    };

    fetchOfficial();
  }, [API_URL, id]);

  const badgeColor = (status: TechnicalOfficial['status']) => {
    if (status === 'Approved') return 'bg-green-100 text-green-800';
    if (status === 'Rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
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
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-oswald font-bold uppercase">Technical Official Details</h1>
              <p className="text-xs text-blue-100">Review complete profile and application info</p>
            </div>
          </div>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${badgeColor(official.status)}`}>
            {official.status}
          </span>
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
                <p className="text-sm text-slate-900">{official.dob ? new Date(official.dob).toLocaleDateString() : '-'}</p>
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

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Admin Remarks</p>
              <p className="text-sm text-slate-900 min-h-[2.5rem]">{official.remarks || 'No remarks added yet.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTechnicalOfficialDetails;
