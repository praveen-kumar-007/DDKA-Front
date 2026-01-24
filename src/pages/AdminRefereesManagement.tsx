import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Shield, Save, X } from 'lucide-react';

interface Referee {
  _id: string;
  name: string;
  qualification: string;
}

interface AdminPermissions {
  canDelete?: boolean;
}

const AdminRefereesManagement: React.FC = () => {
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    qualification: ''
  });

  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);

  useEffect(() => {
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

    fetchReferees();
  }, []);

  const canDelete = adminRole === 'superadmin' || !!adminPermissions?.canDelete;

  const fetchReferees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setReferees(data);
    } catch (error) {
      console.error('Error fetching referees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/admin/referees/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/admin/referees`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingId ? 'Referee updated successfully!' : 'Referee added successfully!');
        resetForm();
        fetchReferees();
      } else {
        alert('Failed to save referee');
      }
    } catch (error) {
      console.error('Error saving referee:', error);
      alert('Error saving referee');
    }
  };

  const handleEdit = (referee: Referee) => {
    setFormData({
      name: referee.name,
      qualification: referee.qualification
    });
    setEditingId(referee._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this referee?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/referees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Referee deleted successfully!');
        fetchReferees();
      } else {
        alert('Failed to delete referee');
      }
    } catch (error) {
      console.error('Error deleting referee:', error);
      alert('Error deleting referee');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      qualification: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-oswald font-bold text-blue-900 uppercase">Referees Management</h1>
          <p className="text-slate-600 mt-2">Manage DDKA's referee board</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { window.location.href = '/admin-portal-access'; }}
            className="px-4 py-2 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-2 font-bold"
          >
            {showForm ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {showForm ? 'Cancel' : 'Add Referee'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            {editingId ? 'Edit Referee' : 'Add New Referee'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Referee Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Enter referee name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Qualification *
                </label>
                <input
                  type="text"
                  required
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="e.g., NIS KABADDI, BPED, MPED"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-2 font-bold"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Update Referee' : 'Add Referee'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Referees List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">#</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Name</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Qualification</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {referees.map((referee, index) => (
                  <tr key={referee._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-700 font-bold">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-600" />
                        <span className="text-slate-900 font-bold">{referee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                        {referee.qualification}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(referee)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(referee._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
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
      )}
    </div>
  );
};

export default AdminRefereesManagement;
