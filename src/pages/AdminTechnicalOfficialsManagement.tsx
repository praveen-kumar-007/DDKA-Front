import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Edit2, Trash2, UserCheck, Save, X } from 'lucide-react';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';

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
  createdAt: string;
}

interface AdminPermissions {
  canDelete?: boolean;
}

const AdminTechnicalOfficialsManagement: React.FC = () => {
  const [officials, setOfficials] = useState<TechnicalOfficial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TechnicalOfficial | null>(null);
  const [editForm, setEditForm] = useState<Partial<TechnicalOfficial>>({});

  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchOfficials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/technical-officials`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOfficials(data.data);
      } else {
        alert(data.message || 'Failed to fetch officials');
      }
    } catch (error) {
      console.error('Error fetching technical officials:', error);
      alert('Error fetching technical officials');
    } finally {
      setLoading(false);
    }
  };

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

    fetchOfficials();
  }, []);

  // Mobile detection for responsive admin views
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const canDelete = adminRole === 'superadmin' || !!adminPermissions?.canDelete;

  const handleStatusChange = async (id: string, status: 'Pending' | 'Approved' | 'Rejected') => {
    if (status === 'Rejected' && !window.confirm('Are you sure you want to reject this application?')) return;

    try {
      const response = await fetch(`${API_URL}/api/technical-officials/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ id, status })
      });
      const data = await response.json();
      if (data.success) {
        fetchOfficials();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this technical official? This cannot be undone.')) return;

    try {
      const response = await fetch(`${API_URL}/api/technical-officials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOfficials(prev => prev.filter(o => o._id !== id));
      } else {
        alert(data.message || 'Failed to delete official');
      }
    } catch (error) {
      console.error('Error deleting official:', error);
      alert('Error deleting official');
    }
  };

  const openEdit = (official: TechnicalOfficial) => {
    setEditing(official);
    setEditForm({ ...official });
  };

  const closeEdit = () => {
    setEditing(null);
    setEditForm({});
  };

  const handleEditChange = (field: keyof TechnicalOfficial, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const response = await fetch(`${API_URL}/api/technical-officials/${editing._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          candidateName: editForm.candidateName,
          parentName: editForm.parentName,
          dob: editForm.dob,
          address: editForm.address,
          aadharNumber: editForm.aadharNumber,
          gender: editForm.gender,
          playerLevel: editForm.playerLevel,
          work: editForm.work,
          mobile: editForm.mobile,
          education: editForm.education,
          email: editForm.email,
          remarks: editForm.remarks
        })
      });
      const data = await response.json();
      if (data.success) {
        closeEdit();
        fetchOfficials();
      } else {
        alert(data.message || 'Failed to update official');
      }
    } catch (error) {
      console.error('Error updating official:', error);
      alert('Error updating official');
    }
  };

  const badgeColor = (status: TechnicalOfficial['status']) => {
    if (status === 'Approved') return 'bg-green-100 text-green-800';
    if (status === 'Rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <AdminPageHeader
        title="Technical Officials"
        subtitle="Manage DDKA Technical Officials applications"
        actions={null}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900" />
        </div>
      ) : (
        isMobile ? (
          <div className="space-y-4">
            {officials.map((off) => (
              <div key={off._id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {off.photoUrl ? (
                      <img src={off.photoUrl} alt={off.candidateName} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{off.candidateName}</div>
                    <div className="text-xs text-slate-600 break-words">{off.email} • +91 {off.mobile}</div>
                    <div className="text-xs text-slate-600 mt-1">{off.playerLevel} • {off.gender}</div>
                    <div className="text-sm font-semibold mt-2">₹{off.examFee || 1000}</div>
                    <div className="text-xs text-slate-500 mt-1 break-words">TXN: {off.transactionId || '-'}</div>
                    <div className="mt-2">{off.receiptUrl ? <a href={off.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline break-words">View Receipt</a> : <span className="text-slate-400">No receipt</span>}</div>
                    <div className="mt-2 text-xs break-words">{off.remarks || '-'}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <button onClick={() => navigate(`/admin/technical-officials/${off._id}`)} className="flex-1 min-w-0 px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm">View</button>
                  <button onClick={() => handleStatusChange(off._id, 'Approved')} className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md text-sm">Approve</button>
                  <button onClick={() => handleStatusChange(off._id, 'Rejected')} className="px-3 py-2 bg-red-50 text-red-700 rounded-md text-sm">Reject</button>
                  <button onClick={() => openEdit(off)} className="px-3 py-2 bg-slate-50 text-slate-700 rounded-md text-sm">Edit</button>
                  {canDelete && <button onClick={() => handleDelete(off._id)} className="px-3 py-2 bg-red-500 text-white rounded-md text-sm">Delete</button>}
                </div>
              </div>
            ))} 
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Remarks</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {officials.map((off) => (
                    <tr key={off._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {off.photoUrl ? (
                            <img
                              src={off.photoUrl}
                              alt={off.candidateName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                        <div>{off.candidateName}</div>
                        <div className="text-xs text-slate-500">Aadhar: {off.aadharNumber}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <div>{off.email}</div>
                        <div className="text-xs text-slate-500">+91 {off.mobile}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <div>{off.playerLevel}</div>
                        <div className="text-xs text-slate-500">{off.gender}</div>
                        <div className="text-xs text-slate-500">Blood: {off.bloodGroup || 'NA'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        <div className="font-semibold">₹{off.examFee || 1000}</div>
                        <div className="text-[11px] text-slate-500 break-words">
                          TXN: {off.transactionId || '-'}
                        </div>
                        {off.receiptUrl && (
                          <button
                            type="button"
                            onClick={() => window.open(off.receiptUrl, '_blank')}
                            className="mt-1 inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold hover:bg-blue-100"
                          >
                            View Receipt
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <StatusMark status={off.status} className="w-6 h-6" title={off.status} />
                          <span className="sr-only">{off.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">
                        {off.remarks || '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-xs">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/technical-officials/${off._id}`)}
                            className="inline-flex items-center justify-center px-3 h-8 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
                            title="View more"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleStatusChange(off._id, 'Approved')}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(off._id, 'Rejected')}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-700 hover:bg-red-100"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(off)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(off._id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-700 hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-oswald font-bold text-blue-900 uppercase flex items-center gap-2">
                <Edit2 className="w-5 h-5" /> Edit Technical Official
              </h2>
              <button onClick={closeEdit} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Name</label>
                  <input
                    value={editForm.candidateName || ''}
                    onChange={(e) => handleEditChange('candidateName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Parent Name</label>
                  <input
                    value={editForm.parentName || ''}
                    onChange={(e) => handleEditChange('parentName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">DOB</label>
                  <input
                    type="date"
                    value={editForm.dob ? editForm.dob.substring(0, 10) : ''}
                    onChange={(e) => handleEditChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Aadhar</label>
                  <input
                    value={editForm.aadharNumber || ''}
                    onChange={(e) => handleEditChange('aadharNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mobile</label>
                  <input
                    value={editForm.mobile || ''}
                    onChange={(e) => handleEditChange('mobile', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                  <select
                    value={editForm.gender || ''}
                    onChange={(e) => handleEditChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Player Level</label>
                  <select
                    value={editForm.playerLevel || ''}
                    onChange={(e) => handleEditChange('playerLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="District">District</option>
                    <option value="State">State</option>
                    <option value="National">National</option>
                    <option value="Never Played">Never Played</option>
                    <option value="Official">Official</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Work / Job</label>
                <input
                  value={editForm.work || ''}
                  onChange={(e) => handleEditChange('work', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Education</label>
                <input
                  value={editForm.education || ''}
                  onChange={(e) => handleEditChange('education', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Address</label>
                <textarea
                  value={editForm.address || ''}
                  onChange={(e) => handleEditChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Remarks</label>
                <textarea
                  value={editForm.remarks || ''}
                  onChange={(e) => handleEditChange('remarks', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20"
                  placeholder="Internal notes about this application (optional)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 text-white text-sm font-semibold flex items-center gap-1"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTechnicalOfficialsManagement;
