import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Phone, Info, Download, Mail, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminInstitutionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this institution? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/institutions/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        navigate('/admin-portal-access');
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      alert("Error deleting institution");
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
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

    fetch(`${API_URL}/api/institutions/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found');
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error('Not found');
        }
      })
      .catch(() => setError('Institution registration not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error || !data) return <div className="flex justify-center items-center min-h-screen">{error || 'Not found'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
        {/* LEFT COLUMN: Institution Logo + Payment Screenshot */}
        <div className="flex flex-col gap-8 min-w-[320px]">
          {data.instLogoUrl && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="font-bold text-lg mb-4 w-full text-center">Institution Logo</div>
              <img
                src={data.instLogoUrl}
                alt="Institution Logo"
                className="w-32 h-32 object-cover rounded-full border mb-3 bg-white"
              />
            </div>
          )}

          {data.screenshotUrl && (
            <div className="bg-white rounded-xl shadow border p-6 flex flex-col items-center justify-start h-full">
              <div className="font-bold text-lg mb-4 w-full text-center">Payment Screenshot</div>
              <img src={data.screenshotUrl} alt="Payment Screenshot" className="w-60 h-40 object-cover rounded border mb-3" />
              <a
                href={data.screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 rounded flex items-center justify-center gap-2 border"
              >
                <Download size={16} /> View / Download
              </a>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Main Info */}
        <div className="flex flex-col gap-6 w-full">
          {/* Back + Dashboard (sticky) */}
          <div className="sticky top-6 z-30 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-900 font-bold hover:underline w-fit"
            >
              <ArrowLeft size={22} /> Back
            </button>
            <button
              onClick={() => navigate('/admin-portal-access')}
              className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
            >
              Go to Dashboard
            </button>
            {adminRole === 'superadmin' && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100"
              >
                <Trash2 size={16} /> Delete Record
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">{data.instName}</h1>
              <div className="text-blue-700 text-base font-medium flex items-center gap-2">
                <Mail size={16} /> {data.email}
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 md:gap-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${
                  data.status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : data.status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {data.status}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Registered: {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Institution Information */}
          <div className="bg-white rounded-xl shadow border p-6 w-full">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-purple-500 bg-purple-100 rounded-full p-1" size={28} />
              <span className="font-extrabold text-lg text-purple-700 tracking-wide">INSTITUTION INFORMATION</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="font-semibold">Institution Name:</span> {data.instName}
              </div>
              <div>
                <span className="font-semibold">Type:</span> {data.instType}
              </div>
              <div>
                <span className="font-semibold">Registration No:</span> {data.regNo}
              </div>
              <div>
                <span className="font-semibold">Est. Year:</span> {data.year}
              </div>
              <div>
                <span className="font-semibold">Principal / Head Name:</span> {data.headName}
              </div>
              <div>
                <span className="font-semibold">Secretary Name:</span> {data.secretaryName}
              </div>
              <div>
                <span className="font-semibold">Surface Type:</span> {data.surfaceType}
              </div>
              <div>
                <span className="font-semibold">Field Area (sqft):</span> {data.area}
              </div>
              <div>
                <span className="font-semibold">Total Players:</span> {data.totalPlayers}
              </div>
              <div>
                <span className="font-semibold">Office Phone:</span> {data.officePhone}
              </div>
              {data.altPhone && (
                <div>
                  <span className="font-semibold">Alternate Phone:</span> {data.altPhone}
                </div>
              )}
              <div className="md:col-span-2">
                <span className="font-semibold">Address:</span> {data.address}
              </div>
            </div>
          </div>

          {/* Other Details */}
          <div className="bg-white rounded-xl shadow border p-6 w-full">
            <div className="flex items-center gap-2 mb-4">
              <Info className="text-green-500 bg-green-100 rounded-full p-1" size={28} />
              <span className="font-extrabold text-lg text-green-700 tracking-wide">OTHER DETAILS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="font-semibold">Transaction ID:</span> {data.transactionId}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-blue-500" size={16} />
                <span className="font-semibold mr-1">Contact:</span> {data.officePhone}
              </div>
              <div>
                <span className="font-semibold">Registered At:</span> {new Date(data.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    data.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : data.status === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {data.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInstitutionDetails;
