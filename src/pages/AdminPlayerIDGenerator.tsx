import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, LayoutGrid, List, Search, AlertCircle, Loader } from 'lucide-react';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatusMark from '../components/admin/StatusMark';
import { IDCardFront } from './Frontcard';
import { IDCardBack } from './Backcard';
import type { IDCardData } from '../types';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  idNo?: string;
  memberRole?: string;
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
      idNo: player.idNo || `DDKA-${player.transactionId.slice(-6).toUpperCase()}`,
      name: player.fullName,
      fathersName: player.fathersName,
      dob: player.dob,
      bloodGroup: player.bloodGroup,
      phone: player.phone,
      address: player.address,
      photoUrl: player.photoUrl,
      transactionId: player.transactionId,
      memberRole: player.memberRole || 'Player',
    };
  };

  const downloadIDCard = (player: PlayerData) => {
    const element = document.getElementById(`card-${player._id}`);
    if (!element) return;

    // Current fallback: open print dialog for quick PDF
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

  const downloadIDCardPDF = async (player: PlayerData) => {
    try {
      // Capture the preview wrapper which contains both front & back
      const wrapper = document.getElementById(`card-both-${player._id}`);
      if (!wrapper) return alert('Could not find ID card elements to export.');

      // Prefer capturing only the actual card elements (front & back) to avoid extra headings/spacing
      const frontEl = document.getElementById(`card-front-${player._id}`);
      const backEl = document.getElementById(`card-back-${player._id}`);
      if (!frontEl || !backEl) return alert('Could not find ID card elements to export.');

      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.gap = '12px';
      container.style.background = '#ffffff';
      container.style.padding = '0';
      container.style.margin = '0';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      // exact pixel sizing: two cards side-by-side
      const cardW = 210;
      const cardH = 330;
      container.style.width = `${cardW * 2 + 12}px`;
      container.style.height = `${cardH}px`;

      const frontClone = frontEl.cloneNode(true) as HTMLElement;
      const backClone = backEl.cloneNode(true) as HTMLElement;
      frontClone.style.margin = '0';
      backClone.style.margin = '0';
      container.appendChild(frontClone);
      container.appendChild(backClone);

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
            const href = link.getAttribute('href') || '';
            if (href.includes('fonts.googleapis.com')) {
              link.parentNode?.removeChild(link);
            }
          });
        },
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      const filename = `${player.fullName.replace(/\s+/g, '_')}_ID_${(player.idNo || ('DDKA-' + player.transactionId.slice(-6).toUpperCase()))}.pdf`;
      pdf.save(filename);

      document.body.removeChild(container);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadIDCardImage = async (player: PlayerData) => {
    try {
      const wrapper = document.getElementById(`card-both-${player._id}`);
      if (!wrapper) return alert('Could not find ID card elements to export.');

      const frontEl = document.getElementById(`card-front-${player._id}`);
      const backEl = document.getElementById(`card-back-${player._id}`);
      if (!frontEl || !backEl) return alert('Could not find ID card elements to export.');

      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.gap = '12px';
      container.style.background = '#ffffff';
      container.style.padding = '0';
      container.style.margin = '0';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      const cardW = 210;
      const cardH = 330;
      container.style.width = `${cardW * 2 + 12}px`;
      container.style.height = `${cardH}px`;

      const frontClone = frontEl.cloneNode(true) as HTMLElement;
      const backClone = backEl.cloneNode(true) as HTMLElement;
      frontClone.style.margin = '0';
      backClone.style.margin = '0';
      container.appendChild(frontClone);
      container.appendChild(backClone);

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
            const href = link.getAttribute('href') || '';
            if (href.includes('fonts.googleapis.com')) {
              link.parentNode?.removeChild(link);
            }
          });
        },
      });
      const dataUrl = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = dataUrl;
      const filename = `${player.fullName.replace(/\s+/g, '_')}_ID_${(player.idNo || ('DDKA-' + player.transactionId.slice(-6).toUpperCase()))}.png`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      document.body.removeChild(container);
    } catch (err) {
      console.error(err);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <AdminPageHeader
        title="Player ID Generator"
        subtitle="Generate and download official ID cards for approved players"
        actions={(
          <></>
        )}
      />

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
                <div className="flex items-center gap-2">
                  <StatusMark status={player.status} className="w-6 h-6" title={player.status} />
                  <span className="sr-only">{player.status}</span>
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
                  onClick={async () => {
                    await downloadIDCardImage(player);
                  }}
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

            <div id={`card-both-${selectedPlayer._id}`} className="p-8 flex gap-8 justify-center flex-wrap" style={{ background: '#ffffff' }}>
              <div id={`card-${selectedPlayer._id}`}>
                <h3 className="text-center font-bold text-slate-700 mb-4">Front</h3>
                <div id={`card-front-${selectedPlayer._id}`} style={{ width: '210px', height: '330px' }}>
                  <IDCardFront data={convertToIDCardData(selectedPlayer)} />
                </div>
              </div>
              <div id={`card-back-wrapper-${selectedPlayer._id}`}>
                <h3 className="text-center font-bold text-slate-700 mb-4">Back</h3>
                <div id={`card-back-${selectedPlayer._id}`} style={{ width: '210px', height: '330px' }}>
                  <IDCardBack data={convertToIDCardData(selectedPlayer)} />
                </div>
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

              <button
                onClick={async () => {
                  await downloadIDCardPDF(selectedPlayer);
                  setShowPreview(false);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition flex items-center gap-2"
              >
                <Download size={18} /> Download PDF (Front & Back)
              </button>

              <button
                onClick={async () => {
                  await downloadIDCardImage(selectedPlayer);
                  setShowPreview(false);
                }}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded transition flex items-center gap-2"
              >
                <Download size={18} /> Download PNG (Direct)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayerIDGenerator;
