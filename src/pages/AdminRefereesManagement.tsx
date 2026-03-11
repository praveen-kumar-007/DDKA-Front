import React, { useEffect, useState } from 'react';
import { Download, Eye, EyeOff, Shield, Trash2 } from 'lucide-react';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import ExportCsvModal from '../components/admin/ExportCsvModal';

interface Referee {
  _id: string;
  source?: 'legacy' | 'technical';
  name: string;
  qualification?: string;
  boardPost?: string;
  photoUrl?: string;
  showOnRefereeBoard?: boolean;
  status?: string;
}

interface AdminPermissions {
  canDelete?: boolean;
}

const AdminRefereesManagement: React.FC = () => {
  const [referees, setReferees] = useState<Referee[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingPostId, setSavingPostId] = useState<string | null>(null);
  const [savingLegacyId, setSavingLegacyId] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [postDrafts, setPostDrafts] = useState<Record<string, string>>({});
  const [legacyNameDrafts, setLegacyNameDrafts] = useState<Record<string, string>>({});
  const [legacyQualificationDrafts, setLegacyQualificationDrafts] = useState<Record<string, string>>({});
  const [newLegacyName, setNewLegacyName] = useState('');
  const [newLegacyQualification, setNewLegacyQualification] = useState('');
  const [newLegacyPost, setNewLegacyPost] = useState('');
  const [addingLegacy, setAddingLegacy] = useState(false);

  const canManageVisibility = adminRole === 'superadmin';

  useEffect(() => {
    setAdminRole(localStorage.getItem('adminRole'));
    const permsRaw = localStorage.getItem('adminPermissions');
    if (permsRaw) {
      try {
        setAdminPermissions(JSON.parse(permsRaw));
      } catch (error) {
        console.error('Failed to parse admin permissions', error);
      }
    }
    fetchReferees();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchReferees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setReferees(list);
      const initialDrafts: Record<string, string> = {};
      const initialNameDrafts: Record<string, string> = {};
      const initialQualificationDrafts: Record<string, string> = {};
      list.forEach((item: Referee) => {
        initialDrafts[item._id] = item.boardPost || '';
        initialNameDrafts[item._id] = item.name || '';
        initialQualificationDrafts[item._id] = item.qualification || '';
      });
      setPostDrafts(initialDrafts);
      setLegacyNameDrafts(initialNameDrafts);
      setLegacyQualificationDrafts(initialQualificationDrafts);
    } catch (error) {
      console.error('Error fetching referees:', error);
      setReferees([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (referee: Referee) => {
    if (!canManageVisibility) {
      alert('Only superadmin can hide/show referee board members.');
      return;
    }

    try {
      setUpdatingId(referee._id);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees/${referee._id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          showOnRefereeBoard: !(referee.showOnRefereeBoard !== false),
          source: referee.source,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const updated = json?.data;
        if (updated) {
          setReferees((prev) => prev.map((item) => (item._id === referee._id ? { ...item, ...updated } : item)));
        }
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to update referee visibility');
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Error updating referee visibility');
    } finally {
      setUpdatingId(null);
    }
  };

  const savePost = async (referee: Referee) => {
    try {
      setSavingPostId(referee._id);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees/${referee._id}/post`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          source: referee.source,
          boardPost: postDrafts[referee._id] || '',
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const updated = json?.data;
        if (updated) {
          setReferees((prev) => prev.map((item) => (item._id === referee._id ? { ...item, ...updated } : item)));
          setPostDrafts((prev) => ({ ...prev, [referee._id]: updated.boardPost || '' }));
        }
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    } finally {
      setSavingPostId(null);
    }
  };

  const visibleCount = referees.filter((r) => r.showOnRefereeBoard !== false).length;
  const hiddenCount = referees.length - visibleCount;
  const canDeleteLegacy = adminRole === 'superadmin' || !!adminPermissions?.canDelete;

  const deleteLegacyEntry = async (referee: Referee) => {
    if (referee.source !== 'legacy') return;
    if (!canDeleteLegacy) {
      alert('You do not have permission to delete entries.');
      return;
    }

    if (!confirm(`Delete legacy referee entry for ${referee.name}?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees/${referee._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ source: 'legacy' }),
      });

      if (response.ok) {
        setReferees((prev) => prev.filter((item) => item._id !== referee._id));
        setSelectedIds((prev) => prev.filter((id) => id !== referee._id));
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to delete legacy referee');
      }
    } catch (error) {
      console.error('Error deleting legacy referee:', error);
      alert('Error deleting legacy referee');
    }
  };

  const saveLegacyEntry = async (referee: Referee) => {
    if (referee.source !== 'legacy') return;

    const name = (legacyNameDrafts[referee._id] || '').trim();
    const qualification = (legacyQualificationDrafts[referee._id] || '').trim();

    if (!name || !qualification) {
      alert('Name and qualification are required.');
      return;
    }

    try {
      setSavingLegacyId(referee._id);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees/${referee._id}/legacy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          source: 'legacy',
          name,
          qualification,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const updated = json?.data;
        if (updated) {
          setReferees((prev) => prev.map((item) => (item._id === referee._id ? { ...item, ...updated } : item)));
          setLegacyNameDrafts((prev) => ({ ...prev, [referee._id]: updated.name || '' }));
          setLegacyQualificationDrafts((prev) => ({ ...prev, [referee._id]: updated.qualification || '' }));
        }
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to update legacy entry');
      }
    } catch (error) {
      console.error('Error updating legacy referee:', error);
      alert('Error updating legacy referee');
    } finally {
      setSavingLegacyId(null);
    }
  };

  const addLegacyEntry = async () => {
    const name = newLegacyName.trim();
    const qualification = newLegacyQualification.trim();
    const boardPost = newLegacyPost.trim();

    if (!name || !qualification) {
      alert('Name and qualification are required to add an entry.');
      return;
    }

    try {
      setAddingLegacy(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees/legacy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, qualification, boardPost }),
      });

      if (response.ok) {
        const json = await response.json();
        const created = json?.data;
        if (created) {
          setReferees((prev) => [...prev, created]);
          setLegacyNameDrafts((prev) => ({ ...prev, [created._id]: created.name || '' }));
          setLegacyQualificationDrafts((prev) => ({ ...prev, [created._id]: created.qualification || '' }));
          setPostDrafts((prev) => ({ ...prev, [created._id]: created.boardPost || '' }));
        }
        setNewLegacyName('');
        setNewLegacyQualification('');
        setNewLegacyPost('');
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to add legacy entry');
      }
    } catch (error) {
      console.error('Error adding legacy referee:', error);
      alert('Error adding legacy entry');
    } finally {
      setAddingLegacy(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageHeader
        title="Referee Board Management"
        subtitle="Combined list from legacy referees and technical officials"
        actions={(
          <button onClick={() => setShowExportModal(true)} className="w-full sm:w-auto px-4 py-2 bg-white border rounded-xl shadow-sm text-blue-900 hover:bg-blue-50 flex items-center gap-2 font-semibold">
            <Download className="w-4 h-4" /> Export
          </button>
        )}
      />

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Total Officials</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{referees.length}</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Visible on Hall of Fame</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{visibleCount}</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Hidden</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{hiddenCount}</div>
        </div>
      </div>

      <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-bold text-slate-800 mb-3">Add More Legacy Entries</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            value={newLegacyName}
            onChange={(e) => setNewLegacyName(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="Name"
          />
          <input
            value={newLegacyQualification}
            onChange={(e) => setNewLegacyQualification(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="Qualification"
          />
          <select
            value={newLegacyPost}
            onChange={(e) => setNewLegacyPost(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">No Post</option>
            <option value="Chairman">Chairman</option>
            <option value="Secretary">Secretary</option>
            <option value="Member">Member</option>
          </select>
          <button
            onClick={addLegacyEntry}
            disabled={addingLegacy}
            className="px-3 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {addingLegacy ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </div>

      {!canManageVisibility && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-medium">
          You can view entries, but only superadmin can hide/show members on the public referee board.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900"></div>
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          {referees.map((referee, index) => {
            const isVisible = referee.showOnRefereeBoard !== false;
            return (
              <div key={referee._id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="shrink-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedIds.includes(referee._id)}
                      onChange={(e) => {
                        if (e.currentTarget.checked) setSelectedIds((prev) => Array.from(new Set([...prev, referee._id])));
                        else setSelectedIds((prev) => prev.filter((id) => id !== referee._id));
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-500">#{index + 1}</div>
                    <div className="font-bold text-slate-900 truncate">{referee.name}</div>
                    <div className="mt-1 text-xs text-slate-600 wrap-break-word">{referee.qualification || 'Technical Official'}</div>
                    <div className="mt-1 text-xs text-blue-700 font-semibold">Post: {referee.boardPost || 'None'}</div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{referee.source === 'legacy' ? 'Legacy Referee' : 'Technical Official'}</div>
                    <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {isVisible ? 'Visible' : 'Hidden'}
                    </div>
                  </div>
                  <button
                    disabled={!canManageVisibility || updatingId === referee._id}
                    onClick={() => toggleVisibility(referee)}
                    className={`px-3 py-2 rounded-md text-xs font-semibold text-white ${isVisible ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'} disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={postDrafts[referee._id] || ''}
                    onChange={(e) => setPostDrafts((prev) => ({ ...prev, [referee._id]: e.target.value }))}
                    className="flex-1 px-2 py-2 border rounded-md text-sm"
                  >
                    <option value="">No Post</option>
                    <option value="Chairman">Chairman</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Member">Member</option>
                  </select>
                  <button
                    onClick={() => savePost(referee)}
                    disabled={savingPostId === referee._id}
                    className="px-3 py-2 rounded-md text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
                  >
                    Save Post
                  </button>
                  {referee.source === 'legacy' && canDeleteLegacy && (
                    <button
                      onClick={() => deleteLegacyEntry(referee)}
                      className="px-3 py-2 rounded-md text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                      title="Delete legacy referee"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {referee.source === 'legacy' && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      value={legacyNameDrafts[referee._id] || ''}
                      onChange={(e) => setLegacyNameDrafts((prev) => ({ ...prev, [referee._id]: e.target.value }))}
                      className="px-2 py-2 border rounded-md text-sm"
                      placeholder="Referee name"
                    />
                    <input
                      value={legacyQualificationDrafts[referee._id] || ''}
                      onChange={(e) => setLegacyQualificationDrafts((prev) => ({ ...prev, [referee._id]: e.target.value }))}
                      className="px-2 py-2 border rounded-md text-sm"
                      placeholder="Qualification"
                    />
                    <button
                      onClick={() => saveLegacyEntry(referee)}
                      disabled={savingLegacyId === referee._id}
                      className="px-3 py-2 rounded-md text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
                    >
                      Save Entry
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 form-checkbox"
                      checked={referees.length > 0 && selectedIds.length === referees.length}
                      onChange={(e) => {
                        if (e.currentTarget.checked) setSelectedIds(referees.map((r) => r._id));
                        else setSelectedIds([]);
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">#</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Profile</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Source</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Post</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Qualification</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Status</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Visibility</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Edit Post</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Edit Legacy Entry</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {referees.map((referee, index) => {
                  const isVisible = referee.showOnRefereeBoard !== false;
                  return (
                    <tr key={referee._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(referee._id)}
                          onChange={(e) => {
                            if (e.currentTarget.checked) setSelectedIds((prev) => Array.from(new Set([...prev, referee._id])));
                            else setSelectedIds((prev) => prev.filter((id) => id !== referee._id));
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-bold">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {referee.photoUrl ? (
                            <img src={referee.photoUrl} alt={referee.name} className="w-10 h-10 rounded-full object-cover border" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border">
                              <Shield className="w-5 h-5 text-slate-500" />
                            </div>
                          )}
                          <span className="text-slate-900 font-bold">{referee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${referee.source === 'legacy' ? 'bg-slate-200 text-slate-700' : 'bg-cyan-100 text-cyan-700'}`}>
                          {referee.source === 'legacy' ? 'Legacy Referee' : 'Technical Official'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${referee.boardPost ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {referee.boardPost || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                          {referee.qualification || 'Technical Official'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${referee.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : referee.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {referee.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVisibility(referee)}
                          disabled={!canManageVisibility || updatingId === referee._id}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isVisible ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                          title={isVisible ? 'Hide from public referee board' : 'Show on public referee board'}
                        >
                          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {isVisible ? 'Hide' : 'Show'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={postDrafts[referee._id] || ''}
                            onChange={(e) => setPostDrafts((prev) => ({ ...prev, [referee._id]: e.target.value }))}
                            className="px-2 py-2 border rounded-md text-sm min-w-[140px]"
                          >
                            <option value="">No Post</option>
                            <option value="Chairman">Chairman</option>
                            <option value="Secretary">Secretary</option>
                            <option value="Member">Member</option>
                          </select>
                          <button
                            onClick={() => savePost(referee)}
                            disabled={savingPostId === referee._id}
                            className="px-3 py-2 rounded-md text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
                          >
                            Save
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {referee.source === 'legacy' ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={legacyNameDrafts[referee._id] || ''}
                              onChange={(e) => setLegacyNameDrafts((prev) => ({ ...prev, [referee._id]: e.target.value }))}
                              className="px-2 py-2 border rounded-md text-sm w-36"
                              placeholder="Name"
                            />
                            <input
                              value={legacyQualificationDrafts[referee._id] || ''}
                              onChange={(e) => setLegacyQualificationDrafts((prev) => ({ ...prev, [referee._id]: e.target.value }))}
                              className="px-2 py-2 border rounded-md text-sm w-44"
                              placeholder="Qualification"
                            />
                            <button
                              onClick={() => saveLegacyEntry(referee)}
                              disabled={savingLegacyId === referee._id}
                              className="px-3 py-2 rounded-md text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Only legacy entries</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {referee.source === 'legacy' && canDeleteLegacy ? (
                          <button
                            onClick={() => deleteLegacyEntry(referee)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                            title="Delete legacy referee"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Not allowed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ExportCsvModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        records={selectedIds.length ? referees.filter((r) => selectedIds.includes(r._id)) : referees}
        fields={[
          { key: 'source', label: 'source' },
          { key: 'name', label: 'name' },
          { key: 'boardPost', label: 'boardPost' },
          { key: 'qualification', label: 'qualification' },
          { key: 'status', label: 'status' },
          { key: 'showOnRefereeBoard', label: 'showOnRefereeBoard' },
        ]}
        filenamePrefix="referee-board-technical-officials"
      />
    </div>
  );
};

export default AdminRefereesManagement;

