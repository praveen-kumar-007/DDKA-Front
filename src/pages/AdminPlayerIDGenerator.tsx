import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, LayoutGrid, List, Search, AlertCircle, Loader } from 'lucide-react';
import { IDCardFront } from './Frontcard';
import { IDCardBack } from './BackCard';
import { IDCardData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PlayerData {
  _id: string;
  fullName: string;
  fathersName: string;
  dob: string;
  bloodGroup: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
  transactionId: string;
  status: string;
}

const AdminPlayerIDGenerator = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('isAdminAuthenticated')) {
      navigate('/admin-portal-access');
      return;
    }
    fetchPlayers();
  }, [navigate]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/players`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch players');
      
      const data = await response.json();
      const approvedPlayers = data.filter((p: PlayerData) => p.status === 'Approved');
      setPlayers(approvedPlayers);
      setFilteredPlayers(approvedPlayers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = players.filter(player =>
      player.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.phone.includes(searchQuery)
    );
    setFilteredPlayers(filtered);
  }, [searchQuery, players]);

  const convertToIDCardData = (player: PlayerData): IDCardData => {
    return {
      idNo: `DDKA-${player.transactionId.slice(-6).toUpperCase()}`,
      name: player.fullName,
      fathersName: player.fathersName,
      dob: player.dob,
      bloodGroup: player.bloodGroup,
      phone: player.phone,
      address: player.address,
      photoUrl: player.photoUrl,
      transactionId: player.transactionId,
    };
  };

  const downloadIDCard = (player: PlayerData) => {
    const element = document.getElementById(`card-${player._id}`);
    if (!element) return;

    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 760; // Front + Back
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // For demo, we'll use html2canvas or similar library
    // For now, alert user about browser download
    alert(`ID Card for ${player.fullName} is ready to download.\n\nPlease use Print to PDF feature for high-quality output.`);
    
    // Trigger print dialog
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      const cardHTML = element.innerHTML;
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Card - ${player.fullName}</title>
            <style>
              body { font-family: Poppins, sans-serif; margin: 20px; }
              .card-container { display: flex; gap: 30px; justify-content: center; }
              .card { width: 240px; }
            </style>
          </head>
          <body>
            <div class="card-container">${cardHTML}</div>
            <script>
              window.print();
              window.onafterprint = () => window.close();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Player ID Generator</h1>
          <p className="text-slate-600 mt-2">Generate and download official ID cards for approved players</p>
        </div>
        <button
          onClick={() => navigate('/admin-portal-access')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, transaction ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-2 bg-white border border-slate-300 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-800">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-blue-600 mr-3" />
          <span className="text-slate-600">Loading approved players...</span>
        </div>
      )}

      {/* Players Grid */}
      {!loading && filteredPlayers.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredPlayers.map((player) => (
            <div
              key={player._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition border border-slate-200 overflow-hidden"
            >
              <div className="p-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{player.fullName}</h3>
                  <p className="text-sm text-slate-600">ID: DDKA-{player.transactionId.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-slate-500 mt-1">{player.phone}</p>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                  {player.status}
                </div>
              </div>

              {/* Photo Preview */}
              <div className="px-4 py-2">
                <img
                  src={player.photoUrl}
                  alt={player.fullName}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-slate-50 flex gap-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSelectedPlayer(player);
                    setShowPreview(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition text-sm"
                >
                  <Eye size={16} /> Preview
                </button>
                <button
                  onClick={() => downloadIDCard(player)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition text-sm"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Players Found</h3>
          <p className="text-slate-600">{searchQuery ? 'No players match your search.' : 'No approved players available yet.'}</p>
        </div>
      )}

      {/* ID Card Preview Modal */}
      {showPreview && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedPlayer.fullName} - ID Card Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-2xl hover:bg-slate-800 p-1 rounded w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-8 flex gap-8 justify-center flex-wrap">
              <div id={`card-${selectedPlayer._id}`}>
                <h3 className="text-center font-bold text-slate-700 mb-4">Front</h3>
                <IDCardFront data={convertToIDCardData(selectedPlayer)} />
              </div>
              <div>
                <h3 className="text-center font-bold text-slate-700 mb-4">Back</h3>
                <IDCardBack data={convertToIDCardData(selectedPlayer)} />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-100 border-t border-slate-200 p-4 flex gap-4 justify-center">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded transition"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  downloadIDCard(selectedPlayer);
                  setShowPreview(false);
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition flex items-center gap-2"
              >
                <Download size={18} /> Download ID Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayerIDGenerator;
