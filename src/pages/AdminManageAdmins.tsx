import React, { useEffect, useState } from 'react';
import { Shield, UserCog, Mail, Trash2, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AdminPermissions {
  canAccessGallery: boolean;              // Manage Gallery tab
  canAccessNews: boolean;                 // Manage News tab
  canAccessContacts: boolean;             // Contact Forms tab
  canAccessChampions: boolean;            // Our Champions tab
  canAccessReferees: boolean;             // Referee Board tab
  canAccessTechnicalOfficials: boolean;   // Technical Officials tab
  canAccessPlayerDetails: boolean;        // Player Details tab
  canAccessInstitutionDetails: boolean;   // Institution Details tab
  canDelete: boolean;                     // Delete actions
}

interface AdminItem {
  _id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
  permissions: AdminPermissions;
}

const AdminManageAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('adminRole') : null;

  useEffect(() => {
    if (role !== 'superadmin') {
      setError('Only SUPERADMIN can manage admins.');
      setLoading(false);
      return;
    }

    const fetchAdmins = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const result = await res.json();
        if (result.success) {
          setAdmins(result.admins);
        } else {
          setError(result.message || 'Failed to load admins');
        }
      } catch (err) {
        console.error('Fetch admins error', err);
        setError('Failed to load admins');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [role, token]);

  const updateAdmin = async (id: string, update: Partial<Pick<AdminItem, 'role' | 'permissions'>>) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(update),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setAdmins(prev => prev.map(a => (a._id === id ? result.admin : a)));
      } else {
        console.error('Update admin failed', { status: res.status, result });
        alert(result.message || `Failed to update admin (status ${res.status})`);
      }
    } catch (err) {
      console.error('Update admin error', err);
      alert('Failed to update admin');
    }
  };

  const togglePermission = (admin: AdminItem, key: keyof AdminPermissions) => {
    const newPermissions = { ...admin.permissions, [key]: !admin.permissions[key] };
    updateAdmin(admin._id, { permissions: newPermissions });
  };

  const setAllAccess = (admin: AdminItem, value: boolean) => {
    const newPermissions: AdminPermissions = {
      canAccessGallery: value,
      canAccessNews: value,
      canAccessContacts: value,
      canAccessChampions: value,
      canAccessReferees: value,
      canAccessTechnicalOfficials: value,
      canAccessPlayerDetails: value,
      canAccessInstitutionDetails: value,
      canDelete: value,
    };
    updateAdmin(admin._id, { permissions: newPermissions });
  };

  const changeRole = (admin: AdminItem, newRole: 'superadmin' | 'admin') => {
    if (admin.role === newRole) return;
    if (!window.confirm(`Change role of ${admin.username} to ${newRole.toUpperCase()}?`)) return;
    updateAdmin(admin._id, { role: newRole });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-semibold">Loading admins...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button
          onClick={() => (window.location.href = '/admin-portal-access')}
          className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-900" size={32} />
            <div>
              <h1 className="text-2xl md:text-3xl font-oswald font-bold text-blue-900 uppercase tracking-tight">
                Admin Management
              </h1>
              <p className="text-slate-500 text-sm">Superadmin can control roles and module access for each admin.</p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = '/admin-portal-access')}
            className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-3 py-3 font-semibold text-slate-500">Admin</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Role</th>
                <th className="px-3 py-3 font-semibold text-slate-500">All Access</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Gallery</th>
                <th className="px-3 py-3 font-semibold text-slate-500">News</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Contact Forms</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Our Champions</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Referee Board</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Technical Officials</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Player Details</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Institution Details</th>
                <th className="px-3 py-3 font-semibold text-slate-500">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 flex flex-col">
                    <span className="font-semibold text-slate-900 flex items-center gap-2">
                      <UserCog size={16} /> {admin.username}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Mail size={12} /> {admin.email}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={admin.role}
                      onChange={(e) => changeRole(admin, e.target.value as 'superadmin' | 'admin')}
                      className="border border-slate-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white"
                    >
                      <option value="superadmin">SUPERADMIN</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </td>
                  {/* All Access toggle to quickly give/remove all module permissions */}
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        const allOn = admin.permissions?.canAccessGallery
                          && admin.permissions?.canAccessNews
                          && admin.permissions?.canAccessContacts
                          && admin.permissions?.canAccessChampions
                          && admin.permissions?.canAccessReferees
                          && admin.permissions?.canAccessTechnicalOfficials
                          && admin.permissions?.canAccessPlayerDetails
                          && admin.permissions?.canAccessInstitutionDetails
                          && admin.permissions?.canDelete;
                        setAllAccess(admin, !allOn);
                      }}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                        admin.permissions?.canAccessGallery
                        && admin.permissions?.canAccessNews
                        && admin.permissions?.canAccessContacts
                        && admin.permissions?.canAccessChampions
                        && admin.permissions?.canAccessReferees
                        && admin.permissions?.canAccessTechnicalOfficials
                        && admin.permissions?.canAccessPlayerDetails
                        && admin.permissions?.canAccessInstitutionDetails
                        && admin.permissions?.canDelete
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {admin.permissions?.canAccessGallery
                      && admin.permissions?.canAccessNews
                      && admin.permissions?.canAccessContacts
                      && admin.permissions?.canAccessChampions
                      && admin.permissions?.canAccessReferees
                      && admin.permissions?.canAccessTechnicalOfficials
                      && admin.permissions?.canAccessPlayerDetails
                      && admin.permissions?.canAccessInstitutionDetails
                      && admin.permissions?.canDelete ? (
                        <ToggleRight size={16} />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                      All
                    </button>
                  </td>
                  {([
                    'canAccessGallery',
                    'canAccessNews',
                    'canAccessContacts',
                    'canAccessChampions',
                    'canAccessReferees',
                    'canAccessTechnicalOfficials',
                    'canAccessPlayerDetails',
                    'canAccessInstitutionDetails',
                    'canDelete',
                  ] as (keyof AdminPermissions)[]).map((key) => (
                    <td key={key} className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => togglePermission(admin, key)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                          admin.permissions?.[key]
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {admin.permissions?.[key] ? (
                          <ToggleRight size={16} />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                        {admin.permissions?.[key] ? 'On' : 'Off'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-1 text-xs text-slate-400">
          <p className="flex items-center gap-1">
            <Trash2 size={12} /> Only admins with <span className="font-semibold">Delete</span> permission can see delete buttons in the portal; backend also enforces superadmin-only deletes.
          </p>
          <p>
            <span className="font-semibold">Players &amp; Officials</span> controls access to Player Details, Institution Details, Our Champions, Referee Board, and Technical Officials tabs on the dashboard.
          </p>
          <p>
            <span className="font-semibold">Contact Forms</span> controls the Contact Forms tab; <span className="font-semibold">News</span> and <span className="font-semibold">Gallery</span> match those tabs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManageAdmins;
