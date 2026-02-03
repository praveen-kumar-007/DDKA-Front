import React, { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { Search, Eye } from 'lucide-react';
// No client-side Link needed; use full navigation for details
import AdminPageHeader from '../components/admin/AdminPageHeader';

interface UnifiedRecord {
  id: string;
  group: 'Player' | 'Institution' | 'Official';
  name: string;
  email?: string;
  phone?: string;
  phoneAlt?: string;
  aadharNumber?: string;
  transactionId?: string;
  idLabel?: string;
  status?: string;
  createdAt?: string;
  raw?: any;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminUnifiedSearch: React.FC = () => {
  const [records, setRecords] = useState<UnifiedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Player' | 'Institution' | 'Official'>('All');
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [canAccessUnifiedSearch, setCanAccessUnifiedSearch] = useState<boolean>(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('adminRole');
    if (storedRole) setAdminRole(storedRole);

    const loadMe = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/me`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const json = await res.json();
        if (json && json.success && json.admin?.permissions) {
          setCanAccessUnifiedSearch(!!json.admin.permissions.canAccessUnifiedSearch);
        }
      } catch (e) {
        setCanAccessUnifiedSearch(true);
      }
    };

    loadMe();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const [playersRes, instRes, officialsRes] = await Promise.all([
          fetch(`${API_URL}/api/players`, { headers }),
          fetch(`${API_URL}/api/institutions`, { headers }),
          fetch(`${API_URL}/api/technical-officials`, { headers })
        ]);

        const [playersJson, instJson, officialsJson] = await Promise.all([
          playersRes.ok ? playersRes.json() : null,
          instRes.ok ? instRes.json() : null,
          officialsRes.ok ? officialsRes.json() : null
        ]);

        const players = Array.isArray(playersJson)
          ? playersJson
          : (playersJson?.data || []);
        const institutions = Array.isArray(instJson)
          ? instJson
          : (instJson?.data || []);
        const officials = Array.isArray(officialsJson)
          ? officialsJson
          : (officialsJson?.data || []);

        const playerRecords: UnifiedRecord[] = players.map((p: any) => ({
          id: p._id,
          group: 'Player',
          name: p.fullName,
          email: p.email,
          phone: p.phone,
          phoneAlt: p.parentsPhone,
          aadharNumber: p.aadharNumber,
          transactionId: p.transactionId,
          idLabel: p.idNo || (p.transactionId ? `DDKA-${String(p.transactionId).slice(-6).toUpperCase()}` : ''),
          status: p.status || 'Pending',
          createdAt: p.createdAt,
          raw: p
        }));

        const institutionRecords: UnifiedRecord[] = institutions.map((i: any) => ({
          id: i._id,
          group: 'Institution',
          name: i.instName,
          email: i.email,
          phone: i.officePhone,
          aadharNumber: i.regNo,
          transactionId: i.transactionId,
          idLabel: i.regNo || (i._id ? `INST-${String(i._id).slice(-4).toUpperCase()}` : ''),
          status: i.status || 'Pending',
          createdAt: i.createdAt,
          raw: i
        }));

        const officialRecords: UnifiedRecord[] = officials.map((o: any) => ({
          id: o._id,
          group: 'Official',
          name: o.candidateName,
          email: o.email,
          phone: o.mobile,
          aadharNumber: o.aadharNumber,
          transactionId: o.transactionId,
          idLabel: o._id ? `DDKA-2026-${String(o._id).slice(-4).toUpperCase()}` : '',
          status: o.status || 'Pending',
          createdAt: o.createdAt,
          raw: o
        }));

        const merged = [...playerRecords, ...institutionRecords, ...officialRecords].sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });

        setRecords(merged);
      } catch (err: any) {
        setError(err?.message || 'Failed to load unified search data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (!canAccessUnifiedSearch && adminRole !== 'superadmin') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <AdminPageHeader
            title="Unified Search"
            subtitle="Access restricted by Superadmin"
          />
          <div className="bg-white rounded-2xl shadow border border-slate-200 p-6 text-slate-600">
            Unified Search has been disabled by the Superadmin. Please contact them to enable access.
          </div>
        </div>
      </div>
    );
  }

  const filteredRecords = useMemo(() => {
    const q = deferredSearchTerm.trim().toLowerCase();
    return records.filter((r) => {
      if (typeFilter !== 'All' && r.group !== typeFilter) return false;
      if (statusFilter !== 'All' && (r.status || 'Pending') !== statusFilter) return false;
      if (!q) return true;
      return (
        (r.name || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.phone || '').toLowerCase().includes(q) ||
        (r.phoneAlt || '').toLowerCase().includes(q) ||
        (r.aadharNumber || '').toLowerCase().includes(q) ||
        (r.transactionId || '').toLowerCase().includes(q) ||
        (r.idLabel || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q)
      );
    });
  }, [records, deferredSearchTerm, statusFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Unified Search"
          subtitle="Search across Players, Institutions, and Officials"
          actions={(
            <div className="text-xs text-slate-500">Total: {filteredRecords.length}</div>
          )}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone, Aadhar..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(['All', 'Player', 'Institution', 'Official'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  typeFilter === t
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                statusFilter === s
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-b text-left text-xs font-semibold uppercase text-slate-500">Type</th>
                  <th className="px-4 py-3 border-b text-left text-xs font-semibold uppercase text-slate-500">Name</th>
                  <th className="px-4 py-3 border-b text-left text-xs font-semibold uppercase text-slate-500">Email</th>
                  <th className="px-4 py-3 border-b text-left text-xs font-semibold uppercase text-slate-500">Phone</th>
                  <th className="px-4 py-3 border-b text-left text-xs font-semibold uppercase text-slate-500">ID Number</th>
                  <th className="px-4 py-3 border-b text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th className="px-4 py-3 border-b text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="opacity-90">
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-40 bg-slate-200 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-48 bg-slate-200 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-28 bg-slate-200 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></td>
                      <td className="px-4 py-3 text-right"><div className="inline-block h-8 w-24 bg-slate-200 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-red-600">{error}</td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-semibold">No records found</td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => {
                    const statusValue = r.status || 'Pending';
                    const statusKey = String(statusValue).toLowerCase();
                    const statusClass = statusKey === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : statusKey === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700';

                    const typeBadge = r.group === 'Player'
                      ? 'bg-blue-100 text-blue-700'
                      : r.group === 'Institution'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-amber-100 text-amber-700';

                    const detailPath = r.group === 'Player'
                      ? `/admin/registration/${r.id}`
                      : r.group === 'Institution'
                        ? `/admin/institution/${r.id}`
                        : `/admin/technical-officials/${r.id}`;

                    return (
                      <tr key={`${r.group}-${r.id}`} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${typeBadge}`}>{r.group}</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{r.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 break-words">{r.email || '-'}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{r.phone || '-'}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 font-mono">{r.idLabel || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>{statusValue}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => { window.location.href = detailPath; }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                          >
                            <Eye size={14} /> View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUnifiedSearch;
