import React, { useEffect, useState } from 'react';
import { Shield, UserCog, Mail, Trash2, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';
import AdminPageHeader from '../components/admin/AdminPageHeader';

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
  canAccessDonations: boolean;            // Donations tab
  canAccessImportantDocs: boolean;        // Important Docs dropdown
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

  const [showModuleModal, setShowModuleModal] = useState(false);

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
      canAccessDonations: value,
      canAccessImportantDocs: value,
      canDelete: value,
    };

    // Apply updated permissions
    updateAdmin(admin._id, { permissions: newPermissions });
  };

  // Change admin role
  const changeRole = (admin: AdminItem, newRole: 'superadmin' | 'admin') => {
    if (admin.role === newRole) return;
    if (!confirm(`Change role for ${admin.username} to ${newRole.toUpperCase()}?`)) return;
    updateAdmin(admin._id, { role: newRole });
  };



  const ModuleToggles: React.FC = () => {
    if (role !== 'superadmin') return null;
    return (
      <div className="text-sm text-slate-500">
        Module toggles have been removed from this page to reduce clutter. Manage modules from the dedicated Settings page or contact another SUPERADMIN if you need changes.
      </div>
    );
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
              <AdminPageHeader
                title="Admin Management"
                subtitle="Superadmin can control roles and module access for each admin."
                showManageModules={true}
                onManageModules={() => setShowModuleModal(true)}
                actions={null}
              />
            </div>
          </div>

          {/* Mobile fallback: small Manage Modules button */}
        </div>

        <div className="md:hidden mb-4 space-y-2">
          <button
            onClick={() => setShowModuleModal(true)}
            className="w-full px-3 py-2 rounded-full bg-white text-blue-700 text-sm font-semibold border border-slate-200"
          >
            Manage Modules
          </button>
          <button
            onClick={() => (window.location.href = '/admin-portal-access')}
            className="w-full px-3 py-2 rounded-full bg-blue-900 text-white text-sm font-semibold"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Manage Modules Modal */}
        {showModuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModuleModal(false)} />
            <div className="bg-white rounded-xl shadow p-6 z-60 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Manage Modules</h2>
                <button
                  onClick={() => setShowModuleModal(false)}
                  className="text-slate-500 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
              <ModuleToggles />
            </div>
          </div>
        )}

        {/* Mobile-friendly vertical cards instead of a wide table */}
        <div className="space-y-4">
          {admins.map((admin) => {
            const allOn = admin.permissions?.canAccessGallery
              && admin.permissions?.canAccessNews
              && admin.permissions?.canAccessContacts
              && admin.permissions?.canAccessChampions
              && admin.permissions?.canAccessReferees
              && admin.permissions?.canAccessTechnicalOfficials
              && admin.permissions?.canAccessPlayerDetails
              && admin.permissions?.canAccessInstitutionDetails
              && admin.permissions?.canDelete;

            const permissionEntries: { key: keyof AdminPermissions; label: string }[] = [
              { key: 'canAccessGallery', label: 'Gallery' },
              { key: 'canAccessNews', label: 'News' },
              { key: 'canAccessContacts', label: 'Contact Forms' },
              { key: 'canAccessChampions', label: 'Our Champions' },
              { key: 'canAccessReferees', label: 'Referee Board' },
              { key: 'canAccessTechnicalOfficials', label: 'Technical Officials' },
              { key: 'canAccessPlayerDetails', label: 'Player Details' },
              { key: 'canAccessInstitutionDetails', label: 'Institution Details' },
              { key: 'canAccessDonations', label: 'Donations' },
              { key: 'canAccessImportantDocs', label: 'Important Docs' },
              { key: 'canDelete', label: 'Delete' },
            ];

            return (
              <div
                key={admin._id}
                className="border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col gap-4 bg-slate-50/40"
              >
                {/* Header: admin identity + role */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1">
                      <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                        <UserCog size={16} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-2">
                        {admin.username}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600">
                          {admin.role === 'superadmin' ? 'SUPERADMIN' : 'ADMIN'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 break-words">
                        <Mail size={12} /> <span className="break-words">{admin.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Role</span>
                    <select
                      value={admin.role}
                      onChange={(e) => changeRole(admin, e.target.value as 'superadmin' | 'admin')}
                      className="border border-slate-300 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest bg-white"
                    >
                      <option value="superadmin">SUPERADMIN</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                </div>

                {/* All access toggle */}
                <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-3 py-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">All Access</p>
                    <p className="text-[11px] text-slate-400">Grant or remove all module permissions in one tap.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllAccess(admin, !allOn)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all ${
                      allOn
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    {allOn ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {allOn ? 'All On' : 'All Off'}
                  </button>
                </div>

                {/* Permissions grid - vertical on mobile, compact on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  {permissionEntries.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePermission(admin, key)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                        admin.permissions?.[key]
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <span>{label}</span>
                      {admin.permissions?.[key] ? (
                        <ToggleRight size={16} />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-1 text-xs text-slate-400">
          <p className="flex items-center gap-1">
            <Trash2 size={12} /> Only admins with <span className="font-semibold">Delete</span> permission can see delete buttons in the portal; backend enforces delete permission (superadmin always allowed).
          </p>
          <p>
            <span className="font-semibold">Players &amp; Officials</span> controls access to Player Details, Institution Details, Our Champions, Referee Board, and Technical Officials tabs on the dashboard.
          </p>
          <p>
            <span className="font-semibold">Contact Forms</span> controls the Contact Forms tab; <span className="font-semibold">News</span>, <span className="font-semibold">Gallery</span>, <span className="font-semibold">Donations</span> and <span className="font-semibold">Important Docs</span> match those respective admin sections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManageAdmins;
