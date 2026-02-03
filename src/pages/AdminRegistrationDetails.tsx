import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, User, Phone, Info, Building2, Wallet } from "lucide-react";
import { formatDateMDY } from '../utils/date';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_ROLES = ['Player', 'Captain', 'Vice Captain', 'Goalkeeper'];

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
  const initialState = (location.state as { data?: any; type?: 'player' | 'institution' } | null) || null;
  const initialData = initialState?.data || null;
  const initialType = initialState?.type || null;
  const fromPath = (location.state as { from?: string } | null)?.from || null;
  const [data, setData] = useState<any>(initialData);
  const [type, setType] = useState<'player' | 'institution' | null>(initialType);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [showIdOptions, setShowIdOptions] = useState(false);
  const [memberRole, setMemberRole] = useState<string>('Player');
  const [customRole, setCustomRole] = useState<string>('');
  const [customIdInput, setCustomIdInput] = useState<string>('');

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

  useEffect(() => {
    if (!id) return;
    setError(null);
    if (!initialData || initialData._id !== id) {
      setLoading(true);
    }
    // Resolve admin role from localStorage or JWT token
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

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error || !data) return <div className="flex justify-center items-center min-h-screen">{error || 'Not found'}</div>;

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
            <div className="flex flex-wrap items-center justify-end gap-2">
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
                className="px-3 py-2 h-9 rounded-full bg-white text-slate-700 text-xs font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ArrowLeft size={14} /> Back
              </button>
              {type === 'player' && data?.status === 'Approved' && (
                <>
                  {data?.idNo ? (
                    <button
                      onClick={handleViewIdCard}
                      className="px-3 py-2 h-9 rounded-full bg-green-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <Wallet size={16} /> View ID Card
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowIdOptions((prev) => !prev)}
                    className="px-3 py-2 h-9 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
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
          {/* Passport Photo Card */}
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
          {/* Aadhar Card Documents Card */}
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
          {/* Payment Receipt Card */}
          {type === 'player' && data.receipt && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="font-bold text-lg mb-2 w-full text-center">Payment Receipt</div>
              <img src={data.receipt} alt="Receipt" className="w-40 h-28 object-cover rounded border mb-2" />
              <a href={data.receipt} target="_blank" rel="noopener noreferrer" className="w-full mt-2 text-center bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold py-2 rounded flex items-center justify-center gap-2 border"><Download size={16} />Download Receipt</a>
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

    </div>
  );
};

export default AdminRegistrationDetails;
