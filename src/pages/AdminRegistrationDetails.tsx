import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, Trash2, User, Phone, Info, Building2, Wallet, XCircle } from "lucide-react";
import { formatDateMDY } from '../utils/date';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_ROLES = ['Player', 'Captain', 'Vice Captain', 'Goalkeeper'];

interface AdminPermissions {
  canDelete?: boolean;
}

const getAgeGroup = (dob?: string) => {
  if (!dob) return 'N/A';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 'N/A';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  if (age < 10) return 'Under 10';
  if (age <= 14) return '10-14';
  if (age <= 16) return '14-16';
  if (age <= 19) return '16-19';
  if (age <= 25) return '19-25';
  return 'Over 25';
};

const AdminRegistrationDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = (location.state as { data?: any; type?: 'player' | 'institution'; autoEdit?: boolean } | null) || null;
  const initialData = initialState?.data || null;
  const initialType = initialState?.type || null;
  const fromPath = (location.state as { from?: string } | null)?.from || null;
  const [data, setData] = useState<any>(initialData);
  const [type, setType] = useState<'player' | 'institution' | null>(initialType);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);
  const [showIdOptions, setShowIdOptions] = useState(false);
  const [memberRole, setMemberRole] = useState<string>('Player');
  const [customRole, setCustomRole] = useState<string>('');
  const [customIdInput, setCustomIdInput] = useState<string>('');

  const [editingDetails, setEditingDetails] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [editFiles, setEditFiles] = useState<{
    photo?: File | null;
    front?: File | null;
    back?: File | null;
    receipt?: File | null;
    screenshot?: File | null;
    instLogo?: File | null;
  }>({});
  const [autoEditRequested] = useState<boolean>(Boolean(initialState?.autoEdit));

  const handleDeleteId = async () => {
    if (!data || type !== 'player' || !data.idNo) return;
    const confirmed = window.confirm('Are you sure you want to delete this ID?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/players/clear-id`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: data._id, transactionId: data.transactionId }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete ID');
      }

      setData((prev: any) => (prev ? { ...prev, idNo: null, memberRole: 'Player' } : prev));
      alert('ID deleted successfully.');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to delete ID. Please try again.');
    }
  };

  const beginEditDetails = () => {
    if (!data || !type) return;
    if (type === 'player') {
      setEditForm({
        fullName: data.fullName || '',
        fathersName: data.fathersName || '',
        gender: data.gender || 'Male',
        dob: data.dob ? String(data.dob).slice(0, 10) : '',
        bloodGroup: data.bloodGroup || '',
        email: data.email || '',
        phone: data.phone || '',
        parentsPhone: data.parentsPhone || '',
        address: data.address || '',
        aadharNumber: data.aadharNumber || '',
        sportsExperience: data.sportsExperience || '',
        reasonForJoining: data.reasonForJoining || '',
        memberRole: data.memberRole || 'Player',
      });
    } else if (type === 'institution') {
      setEditForm({
        instName: data.instName || '',
        instType: data.instType || 'School',
        regNo: data.regNo || '',
        year: data.year || '',
        headName: data.headName || '',
        secretaryName: data.secretaryName || '',
        totalPlayers: data.totalPlayers || '',
        area: data.area || '',
        surfaceType: data.surfaceType || '',
        officePhone: data.officePhone || '',
        altPhone: data.altPhone || '',
        email: data.email || '',
        address: data.address || '',
        description: data.description || '',
      });
    }
    setEditFiles({});
    setEditingDetails(true);
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditFileChange = (
    field: 'photo' | 'front' | 'back' | 'receipt' | 'screenshot' | 'instLogo',
    file: File | null
  ) => {
    setEditFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !type) return;

    try {
      setSavingEdit(true);
      const endpoint = type === 'player' ? `/api/players/${data._id}` : `/api/institutions/${data._id}`;
      const token = localStorage.getItem('token');

      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          formData.append(key, String(editForm[key]));
        }
      });

      if (type === 'player') {
        if (editFiles.photo) formData.append('photo', editFiles.photo);
        if (editFiles.front) formData.append('front', editFiles.front);
        if (editFiles.back) formData.append('back', editFiles.back);
        if (editFiles.receipt) formData.append('receipt', editFiles.receipt);
      } else if (type === 'institution') {
        if (editFiles.screenshot) formData.append('screenshot', editFiles.screenshot);
        if (editFiles.instLogo) formData.append('instLogo', editFiles.instLogo);
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to update details');
      }

      if (result.data) {
        setData(result.data);
      }
      setEditingDetails(false);
      alert('Details updated successfully.');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to update details');
    } finally {
      setSavingEdit(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setError(null);
    if (!initialData || initialData._id !== id) {
      setLoading(true);
    }
    // Resolve admin role and permissions from localStorage or JWT token
    let storedRole = localStorage.getItem('adminRole');
    if (!storedRole) {
      const tokenRaw = localStorage.getItem('token');
      if (tokenRaw) {
        try {
          const payloadPart = tokenRaw.split('.')[1];
          const decoded = JSON.parse(atob(payloadPart));
          if (decoded && typeof decoded.role === 'string') {
            storedRole = decoded.role;
            localStorage.setItem('adminRole', decoded.role);
          }
        } catch (e) {
          console.error('Failed to decode admin role from token', e);
        }
      }
    }
    if (storedRole) {
      setAdminRole(storedRole);
    }
    const permsRaw = localStorage.getItem('adminPermissions');
    if (permsRaw) {
      try {
        setAdminPermissions(JSON.parse(permsRaw));
      } catch (e) {
        console.error('Failed to parse adminPermissions', e);
      }
    }
    const token = localStorage.getItem('token');

    const fetchPlayer = async () => {
      const res = await fetch(`${API_URL}/api/players/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) return null;
      const result = await res.json();
      if (result?.success) return result.data;
      return null;
    };

    const fetchInstitution = async () => {
      const res = await fetch(`${API_URL}/api/institutions/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) return null;
      const result = await res.json();
      if (result?.success) return result.data;
      return null;
    };

    const hydrateRole = (payload: any) => {
      if (!payload) return;
      setMemberRole(payload.memberRole || 'Player');
      setCustomIdInput(payload.idNo || '');
      setCustomRole('');
    };

    const run = async () => {
      try {
        if (initialType === 'player') {
          const player = await fetchPlayer();
          if (player) {
            setData(player);
            setType('player');
            hydrateRole(player);
            return;
          }
        }

        if (initialType === 'institution') {
          const institution = await fetchInstitution();
          if (institution) {
            setData(institution);
            setType('institution');
            return;
          }
        }

        const player = await fetchPlayer();
        if (player) {
          setData(player);
          setType('player');
          hydrateRole(player);
          return;
        }

        const institution = await fetchInstitution();
        if (institution) {
          setData(institution);
          setType('institution');
          return;
        }

        throw new Error('Not found');
      } catch {
        setError('Registration not found');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, initialData, initialType]);

  useEffect(() => {
    if (autoEditRequested && data && type && !editingDetails) {
      beginEditDetails();
    }
  }, [autoEditRequested, data, type, editingDetails]);

  const handleViewIdCard = () => {
    if (type === 'player' && data?.idNo) {
      window.open(`/id-card/${data.idNo}`, '_blank');
    }
  };

  const handleSaveIdSettings = async () => {
    if (!data || type !== 'player') return;

    const baseId = (customIdInput || data.idNo || '').trim();
    if (!baseId) {
      alert('ID number is required to save.');
      return;
    }

    const chosenRole = memberRole === 'Custom'
      ? (customRole.trim() || 'Player')
      : memberRole;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/players/assign-id`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: data._id,
          idNo: baseId.toUpperCase(),
          memberRole: chosenRole,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save ID settings');
      }

      const updated = result.data;
      setData(updated);
      setMemberRole(updated.memberRole || 'Player');
      setCustomIdInput(updated.idNo || '');
      setCustomRole('');
      alert('ID and role updated successfully.');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save ID settings. Please try again.');
    }
  };

  const handleStatusChange = async (newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    if (!data || !type) return;
    if (newStatus === 'Rejected' && !window.confirm('Are you sure you want to reject this registration?')) return;

    try {
      const endpoint = type === 'player' ? '/api/players/status' : '/api/institutions/status';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: data._id, status: newStatus }),
      });

      if (response.ok) {
        const resJson = await response.json();

        // Prefer server-returned payload so newly generated IDs (idNo) are visible immediately
        if (resJson && resJson.data) {
          setData(resJson.data);

          // Re-hydrate player-specific ID/role state when applicable
          if (type === 'player') {
            setMemberRole(resJson.data.memberRole || 'Player');
            setCustomIdInput(resJson.data.idNo || '');
            setCustomRole('');
          }
        } else {
          // Fallback: at least update status locally
          setData((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
        }

        if (resJson.emailSkipped) {
          const reason = resJson.emailSkipReason ? ` (${resJson.emailSkipReason})` : '';
          alert(`Email skipped${reason}`);
        } else if (resJson.emailSent) {
          const typeLabel = resJson.emailType === 'rejection'
            ? 'Rejection'
            : resJson.emailType === 'approval'
              ? 'Approval'
              : 'Notification';
          alert(`${typeLabel} email sent`);
        }
      } else {
        const errData = await response.json().catch(() => null);
        alert(errData?.message || 'Error updating status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const handleDeleteRegistration = async () => {
    if (!data || !type) return;
    if (!window.confirm('Permanently delete this record? This cannot be undone.')) return;

    try {
      const endpoint = type === 'player' ? `/api/players/${data._id}` : `/api/institutions/${data._id}`;
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        alert('Record deleted successfully.');
        if (fromPath) {
          navigate(fromPath);
        } else {
          navigate(`/admin/registrations?tab=${type === 'institution' ? 'institutions' : 'players'}`);
        }
      } else {
        alert('Delete failed on server');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting entry');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!data) return <div className="flex justify-center items-center min-h-screen">{error || 'Not found'}</div>;

  const statusValue = data?.status || 'Pending';
  const statusKey = String(statusValue).toLowerCase();
  const statusClass = statusKey === 'approved'
    ? 'bg-emerald-100 text-emerald-700'
    : statusKey === 'rejected'
      ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700';
  const ageGroup = type === 'player' ? getAgeGroup(data?.dob) : 'N/A';
  const idDisplay = data?.idNo ? data.idNo : 'Not assigned yet';

  // --- Layout: Two columns on desktop, stacked on mobile ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-4">
        <AdminPageHeader
          title={type === 'player' ? data.fullName : data.instName}
          subtitle={type === 'player' ? data.email : 'Institution registration'}
          actions={(
            <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (fromPath) {
                    navigate(fromPath);
                    return;
                  }
                  if (window.history.length > 1) {
                    navigate(-1);
                    return;
                  }
                  navigate(`/admin/registrations?tab=${type === 'institution' ? 'institutions' : 'players'}`);
                }}
                className="w-full sm:w-auto px-3 py-2 h-9 rounded-full bg-white text-slate-700 text-xs font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={14} /> Back
              </button>
              {type && (
                <button
                  type="button"
                  onClick={() => (editingDetails ? setEditingDetails(false) : beginEditDetails())}
                  className="w-full sm:w-auto px-3 py-2 h-9 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {editingDetails ? 'Cancel Edit' : 'Edit Details'}
                </button>
              )}
              {statusKey !== 'approved' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('Approved')}
                  className="w-full sm:w-auto px-3 py-2 h-9 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} /> Approve
                </button>
              )}
              {type === 'player' && data?.status === 'Approved' && (
                <>
                  {data?.idNo ? (
                    <button
                      onClick={handleViewIdCard}
                      className="w-full sm:w-auto px-3 py-2 h-9 rounded-full bg-green-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Wallet size={16} /> View ID Card
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowIdOptions((prev) => !prev)}
                    className="w-full sm:w-auto px-3 py-2 h-9 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Wallet size={16} /> {showIdOptions ? 'Close ID Settings' : 'Edit ID / Role'}
                  </button>

                  {data?.idNo && adminRole === 'superadmin' && (
                    <button
                      onClick={handleDeleteId}
                      className="px-3 py-2 h-9 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all"
                    >
                      Delete ID
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
        {/* LEFT COLUMN: Photo & Documents */}
        <div className="flex flex-col gap-8 min-w-[320px]">
          {/* Passport Photo Card (Player) */}
          {type === 'player' && data.photo && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="flex flex-col items-center w-full">
                <img src={data.photo} alt="Photo" className="w-40 h-40 object-cover rounded-lg border mb-4" />
                <div className="font-bold text-lg mb-2">Passport Size Photo</div>
              </div>
              <a href={data.photo} target="_blank" rel="noopener noreferrer" className="w-full mt-2 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 rounded flex items-center justify-center gap-2 border"><Download size={16} />Download Photo</a>
              <span className="mt-3 inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">Verified</span>
            </div>
          )}
          {/* Aadhar Card Documents Card (Player) */}
          {type === 'player' && (data.front || data.back) && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="font-bold text-lg mb-4 w-full text-center">Aadhar Card Documents</div>
              <div className="grid grid-cols-2 gap-4 w-full">
                {data.front && (
                  <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center justify-start h-full">
                    <img src={data.front} alt="Aadhar Front" className="w-32 h-20 object-cover rounded border mb-2" />
                    <a href={data.front} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 rounded flex items-center justify-center gap-2 border"><Download size={14} />Download Front Side</a>
                    <span className="mt-2 inline-block bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">Verified</span>
                  </div>
                )}
                {data.back && (
                  <div className="bg-purple-50 rounded-lg p-3 flex flex-col items-center justify-start h-full">
                    <img src={data.back} alt="Aadhar Back" className="w-32 h-20 object-cover rounded border mb-2" />
                    <a href={data.back} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-1 rounded flex items-center justify-center gap-2 border"><Download size={14} />Download Back Side</a>
                    <span className="mt-2 inline-block bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded-full font-bold">Verified</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Payment Receipt Card (Player) */}
          {type === 'player' && data.receipt && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="font-bold text-lg mb-2 w-full text-center">Payment Receipt</div>
              <img src={data.receipt} alt="Receipt" className="w-40 h-28 object-cover rounded border mb-2" />
              <a href={data.receipt} target="_blank" rel="noopener noreferrer" className="w-full mt-2 text-center bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold py-2 rounded flex items-center justify-center gap-2 border"><Download size={16} />Download Receipt</a>
            </div>
          )}

          {/* Institution Logo Card (Institution) */}
          {type === 'institution' && (data.instLogoUrl || data.instLogo) && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="flex flex-col items-center w-full">
                <img
                  src={data.instLogoUrl || data.instLogo}
                  alt="Institution Logo"
                  className="w-32 h-32 object-contain rounded-lg border mb-4 bg-white"
                />
                <div className="font-bold text-lg mb-2">Institution Logo</div>
              </div>
              <a
                href={data.instLogoUrl || data.instLogo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 rounded flex items-center justify-center gap-2 border"
              >
                <Download size={16} /> Download Logo
              </a>
            </div>
          )}

          {/* Institution Payment Screenshot Card (Institution) */}
          {type === 'institution' && data.screenshotUrl && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="font-bold text-lg mb-2 w-full text-center">Payment Screenshot</div>
              <img
                src={data.screenshotUrl}
                alt="Payment Screenshot"
                className="w-40 h-28 object-cover rounded border mb-2"
              />
              <a
                href={data.screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 text-center bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold py-2 rounded flex items-center justify-center gap-2 border"
              >
                <Download size={16} /> Download Screenshot
              </a>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Main Info */}
        <div className="flex flex-col gap-6 w-full">


          {/* Member Role / ID now handled automatically when approved */}

          {/* Summary Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {type === 'player' ? data.fullName : data.instName}
                </h1>
                {type === 'player' && (
                  <p className="text-slate-600 text-sm mt-1">{data.email}</p>
                )}
                {type === 'player' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">ID: {idDisplay}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Age Group: {ageGroup}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Role: {data.memberRole || 'Player'}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>{statusValue}</span>
                <span className="text-xs text-slate-500 whitespace-nowrap">Registered: {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* PLAYER: Sectioned Details */}
          {type === 'player' && (
            <div className="flex flex-col gap-6 w-full">
              {editingDetails && (
                <form onSubmit={handleSaveDetails} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-lg text-slate-900 tracking-wide">Edit Player Details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Full Name</p>
                      <input
                        type="text"
                        value={editForm.fullName || ''}
                        onChange={(e) => handleEditInputChange('fullName', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Father's Name</p>
                      <input
                        type="text"
                        value={editForm.fathersName || ''}
                        onChange={(e) => handleEditInputChange('fathersName', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Gender</p>
                      <select
                        value={editForm.gender || 'Male'}
                        onChange={(e) => handleEditInputChange('gender', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Date of Birth</p>
                      <input
                        type="date"
                        value={editForm.dob || ''}
                        onChange={(e) => handleEditInputChange('dob', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Blood Group</p>
                      <input
                        type="text"
                        value={editForm.bloodGroup || ''}
                        onChange={(e) => handleEditInputChange('bloodGroup', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Email</p>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => handleEditInputChange('email', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Phone</p>
                      <input
                        type="text"
                        value={editForm.phone || ''}
                        onChange={(e) => handleEditInputChange('phone', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Parent's Phone</p>
                      <input
                        type="text"
                        value={editForm.parentsPhone || ''}
                        onChange={(e) => handleEditInputChange('parentsPhone', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Address</p>
                      <textarea
                        value={editForm.address || ''}
                        onChange={(e) => handleEditInputChange('address', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Aadhar Number</p>
                      <input
                        type="text"
                        value={editForm.aadharNumber || ''}
                        onChange={(e) => handleEditInputChange('aadharNumber', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Sports Experience</p>
                      <textarea
                        value={editForm.sportsExperience || ''}
                        onChange={(e) => handleEditInputChange('sportsExperience', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Reason For Joining</p>
                      <textarea
                        value={editForm.reasonForJoining || ''}
                        onChange={(e) => handleEditInputChange('reasonForJoining', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Current Passport Photo</p>
                        <div className="mt-1">
                          {data.photo ? (
                            <img src={data.photo} alt="Current passport" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No image</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">New Passport Photo</p>
                        <div className="mt-1 mb-2">
                          {editFiles.photo ? (
                            <img src={URL.createObjectURL(editFiles.photo)} alt="New passport preview" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No new file selected</p>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditFileChange('photo', e.target.files?.[0] || null)}
                          className="w-full text-xs"
                        />
                      </div>
                    </div>
                    <div className="bg-slate-50 border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Current Aadhar Front</p>
                        <div className="mt-1">
                          {data.front ? (
                            <img src={data.front} alt="Current Aadhar front" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No image</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">New Aadhar Front</p>
                        <div className="mt-1 mb-2">
                          {editFiles.front ? (
                            <img src={URL.createObjectURL(editFiles.front)} alt="New Aadhar front preview" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No new file selected</p>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditFileChange('front', e.target.files?.[0] || null)}
                          className="w-full text-xs"
                        />
                      </div>
                    </div>
                    <div className="bg-slate-50 border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Current Aadhar Back</p>
                        <div className="mt-1">
                          {data.back ? (
                            <img src={data.back} alt="Current Aadhar back" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No image</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">New Aadhar Back</p>
                        <div className="mt-1 mb-2">
                          {editFiles.back ? (
                            <img src={URL.createObjectURL(editFiles.back)} alt="New Aadhar back preview" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No new file selected</p>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditFileChange('back', e.target.files?.[0] || null)}
                          className="w-full text-xs"
                        />
                      </div>
                    </div>
                    <div className="bg-slate-50 border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Current Payment Receipt</p>
                        <div className="mt-1">
                          {data.receipt ? (
                            <img src={data.receipt} alt="Current receipt" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No image</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">New Payment Receipt</p>
                        <div className="mt-1 mb-2">
                          {editFiles.receipt ? (
                            <img src={URL.createObjectURL(editFiles.receipt)} alt="New receipt preview" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No new file selected</p>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditFileChange('receipt', e.target.files?.[0] || null)}
                          className="w-full text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingDetails(false)}
                      className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-slate-600 bg-white hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-800 disabled:opacity-60"
                    >
                      {savingEdit ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
              {/* ID & Role Management */}
              {showIdOptions && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="text-indigo-600 bg-indigo-100 rounded-full p-1" size={28} />
                      <span className="font-extrabold text-lg text-slate-900 tracking-wide">ID & Role Management</span>
                    </div>
                    <span className="text-xs text-slate-500">Current ID: {idDisplay}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Member Role</p>
                      <select
                        value={memberRole}
                        onChange={(e) => setMemberRole(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {DEFAULT_ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    {memberRole === 'Custom' && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Custom Role</p>
                        <input
                          type="text"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          placeholder="Enter custom role"
                          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Player ID Number</p>
                      <input
                        type="text"
                        value={customIdInput}
                        onChange={(e) => setCustomIdInput(e.target.value)}
                        placeholder={data.idNo || 'DDKA-1234'}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        ID is automatically generated when approved as DDKA-1234 style. Admins can update it here if needed.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveIdSettings}
                      className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all"
                    >
                      Save ID Settings
                    </button>
                  </div>
                </div>
              )}
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <User className="text-orange-600 bg-orange-100 rounded-full p-1" size={28} />
                  <span className="font-extrabold text-lg text-slate-900 tracking-wide">Personal Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Full Name</p>
                    <p className="font-semibold text-slate-900">{data.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Father's Name</p>
                    <p className="font-semibold text-slate-900">{data.fathersName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Date of Birth</p>
                    <p className="font-semibold text-slate-900">{formatDateMDY(data.dob)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Gender</p>
                    <p className="font-semibold text-slate-900">{data.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Blood Group</p>
                    <p className="font-semibold text-slate-900">{data.bloodGroup || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Aadhar Number</p>
                    <p className="font-semibold text-slate-900">{data.aadharNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-slate-500">Address</p>
                    <p className="font-semibold text-slate-900">{data.address}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="text-blue-600 bg-blue-100 rounded-full p-1" size={28} />
                  <span className="font-extrabold text-lg text-slate-900 tracking-wide">Contact Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900 break-words">{data.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-900">{data.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Parent's Phone</p>
                    <p className="font-semibold text-slate-900">{data.parentsPhone}</p>
                  </div>
                </div>
              </div>

              {/* Club Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-emerald-600 bg-emerald-100 rounded-full p-1" size={28} />
                  <span className="font-extrabold text-lg text-slate-900 tracking-wide">Club Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Role</p>
                    <p className="font-semibold text-slate-900">{data.memberRole || 'Player'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Age Group</p>
                    <p className="font-semibold text-slate-900">{ageGroup}</p>
                  </div>
                  {data.sportsExperience && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500">Sports Experience</p>
                      <p className="font-semibold text-slate-900">{data.sportsExperience}</p>
                    </div>
                  )}
                  {data.reasonForJoining && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500">Reason for Joining</p>
                      <p className="font-semibold text-slate-900">{data.reasonForJoining}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="text-indigo-600 bg-indigo-100 rounded-full p-1" size={28} />
                  <span className="font-extrabold text-lg text-slate-900 tracking-wide">Registration Details</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Transaction ID</p>
                    <p className="font-semibold text-slate-900">{data.transactionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Registered At</p>
                    <p className="font-semibold text-slate-900">{new Date(data.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>{statusValue}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSTITUTION: Sectioned Details */}
          {type === 'institution' && (
            <div className="flex flex-col gap-6 w-full">
              {editingDetails && (
                <form onSubmit={handleSaveDetails} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full space-y-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-lg text-slate-900 tracking-wide">Edit Institution Details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Institution Name</p>
                      <input
                        type="text"
                        value={editForm.instName || ''}
                        onChange={(e) => handleEditInputChange('instName', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Type</p>
                      <select
                        value={editForm.instType || 'School'}
                        onChange={(e) => handleEditInputChange('instType', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="School">School</option>
                        <option value="College">College</option>
                        <option value="Club">Club</option>
                        <option value="Academy">Academy</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Registration No</p>
                      <input
                        type="text"
                        value={editForm.regNo || ''}
                        onChange={(e) => handleEditInputChange('regNo', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Est. Year</p>
                      <input
                        type="number"
                        value={editForm.year || ''}
                        onChange={(e) => handleEditInputChange('year', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Principal/Head Name</p>
                      <input
                        type="text"
                        value={editForm.headName || ''}
                        onChange={(e) => handleEditInputChange('headName', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Secretary Name</p>
                      <input
                        type="text"
                        value={editForm.secretaryName || ''}
                        onChange={(e) => handleEditInputChange('secretaryName', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Surface Type</p>
                      <input
                        type="text"
                        value={editForm.surfaceType || ''}
                        onChange={(e) => handleEditInputChange('surfaceType', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Field Area (sqft)</p>
                      <input
                        type="number"
                        value={editForm.area || ''}
                        onChange={(e) => handleEditInputChange('area', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Total Players</p>
                      <input
                        type="number"
                        value={editForm.totalPlayers || ''}
                        onChange={(e) => handleEditInputChange('totalPlayers', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Office Phone</p>
                      <input
                        type="text"
                        value={editForm.officePhone || ''}
                        onChange={(e) => handleEditInputChange('officePhone', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Alternate Phone</p>
                      <input
                        type="text"
                        value={editForm.altPhone || ''}
                        onChange={(e) => handleEditInputChange('altPhone', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Email</p>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => handleEditInputChange('email', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Address</p>
                      <textarea
                        value={editForm.address || ''}
                        onChange={(e) => handleEditInputChange('address', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Description</p>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => handleEditInputChange('description', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Current Payment Screenshot</p>
                        <div className="mt-1">
                          {data.screenshotUrl ? (
                            <img src={data.screenshotUrl} alt="Current payment screenshot" className="w-full max-w-[200px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No image</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">New Payment Screenshot</p>
                        <div className="mt-1 mb-2">
                          {editFiles.screenshot ? (
                            <img src={URL.createObjectURL(editFiles.screenshot)} alt="New payment screenshot preview" className="w-full max-w-[200px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No new file selected</p>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditFileChange('screenshot', e.target.files?.[0] || null)}
                          className="w-full text-xs"
                        />
                      </div>
                    </div>
                    <div className="bg-slate-50 border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Current Institution Logo</p>
                        <div className="mt-1">
                          {data.instLogoUrl ? (
                            <img src={data.instLogoUrl} alt="Current institution logo" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No image</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 mb-1">New Institution Logo</p>
                        <div className="mt-1 mb-2">
                          {editFiles.instLogo ? (
                            <img src={URL.createObjectURL(editFiles.instLogo)} alt="New institution logo preview" className="w-full max-w-[160px] rounded-lg border object-cover" />
                          ) : (
                            <p className="text-xs text-slate-400">No new file selected</p>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditFileChange('instLogo', e.target.files?.[0] || null)}
                          className="w-full text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingDetails(false)}
                      className="px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest text-slate-600 bg-white hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-800 disabled:opacity-60"
                    >
                      {savingEdit ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
              {/* Institution Information */}
              <div className="bg-white rounded-xl shadow border p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="text-purple-500 bg-purple-100 rounded-full p-1" size={28} />
                  <span className="font-extrabold text-lg text-purple-700 tracking-wide">INSTITUTION INFORMATION</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div><span className="font-semibold">Institution Name:</span> {data.instName}</div>
                  <div><span className="font-semibold">Type:</span> {data.instType}</div>
                  <div><span className="font-semibold">Registration No:</span> {data.regNo}</div>
                  <div><span className="font-semibold">Est. Year:</span> {data.year}</div>
                  <div><span className="font-semibold">Principal/Head Name:</span> {data.headName}</div>
                  <div><span className="font-semibold">Secretary Name:</span> {data.secretaryName}</div>
                  <div><span className="font-semibold">Surface Type:</span> {data.surfaceType}</div>
                  <div><span className="font-semibold">Field Area (sqft):</span> {data.area}</div>
                  <div><span className="font-semibold">Total Players:</span> {data.totalPlayers}</div>
                  <div><span className="font-semibold">Office Phone:</span> {data.officePhone}</div>
                  <div className="md:col-span-2"><span className="font-semibold">Address:</span> {data.address}</div>
                </div>
              </div>

              {/* Other Details */}
              <div className="bg-white rounded-xl shadow border p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-green-500 bg-green-100 rounded-full p-1" size={28} />
                  <span className="font-extrabold text-lg text-green-700 tracking-wide">OTHER DETAILS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center gap-2"><span className="font-semibold">Status:</span> <StatusMark status={data.status} /></div>
                  <div><span className="font-semibold">Transaction ID:</span> {data.transactionId}</div>
                  <div><span className="font-semibold">Registered At:</span> {new Date(data.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Final action bar for admin controls (bottom: reject & delete only) */}
      <div className="max-w-6xl mx-auto mt-8 flex justify-end">
        <div className="flex flex-wrap gap-2">
          {statusKey !== 'rejected' && (
            <button
              type="button"
              onClick={() => handleStatusChange('Rejected')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
              <XCircle size={16} />
              <span>Reject</span>
            </button>
          )}
          {(adminRole === 'superadmin' || adminPermissions?.canDelete) && (
            <button
              type="button"
              onClick={handleDeleteRegistration}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminRegistrationDetails;
