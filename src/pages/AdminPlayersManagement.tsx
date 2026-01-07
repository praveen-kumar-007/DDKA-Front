import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Star, Award, Trophy, Save, X } from 'lucide-react';

interface Player {
  _id: string;
  name: string;
  category: string;
  gender: string;
  achievements: string;
}

interface AdminPermissions {
  canDelete?: boolean;
}

const AdminPlayersManagement: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'National Player',
    gender: 'Male',
    achievements: ''
  });

  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);

  useEffect(() => {
    fetchPlayers();
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
  }, []);

  const canDelete = adminRole === 'superadmin' && !!adminPermissions?.canDelete;

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/champion-players`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/champion-players/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/champion-players`;
      
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
        alert(editingId ? 'Player updated successfully!' : 'Player added successfully!');
        resetForm();
        fetchPlayers();
      } else {
        alert('Failed to save player');
      }
    } catch (error) {
      console.error('Error saving player:', error);
      alert('Error saving player');
    }
  };

  const handleEdit = (player: Player) => {
    setFormData({
      name: player.name,
      category: player.category,
      gender: player.gender,
      achievements: player.achievements
    });
    setEditingId(player._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/champion-players/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Player deleted successfully!');
        fetchPlayers();
      } else {
        alert('Failed to delete player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Error deleting player');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'National Player',
      gender: 'Male',
      achievements: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'National Player') return <Star className="w-5 h-5" />;
    if (category === 'Federation Cup') return <Award className="w-5 h-5" />;
    return <Trophy className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string) => {
    if (category === 'National Player') return 'bg-blue-100 text-blue-800';
    if (category === 'Federation Cup') return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-oswald font-bold text-blue-900 uppercase">Players Management</h1>
          <p className="text-slate-600 mt-2">Manage DDKA's champion players</p>
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
            {showForm ? 'Cancel' : 'Add Player'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            {editingId ? 'Edit Player' : 'Add New Player'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Player Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="National Player">National Player</option>
                  <option value="Federation Cup">Federation Cup</option>
                  <option value="Jharkhand Premier League">Jharkhand Premier League</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Gender *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Achievements
                </label>
                <input
                  type="text"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Optional achievements"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-2 font-bold"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Update Player' : 'Add Player'}
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

      {/* Players List */}
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
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Category</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Gender</th>
                  <th className="px-6 py-4 text-left font-bold uppercase text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {players.map((player, index) => (
                  <tr key={player._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-700 font-bold">{index + 1}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold">{player.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(player.category)}`}>
                        {getCategoryIcon(player.category)}
                        {player.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${player.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                        {player.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(player)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(player._id)}
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

export default AdminPlayersManagement;
