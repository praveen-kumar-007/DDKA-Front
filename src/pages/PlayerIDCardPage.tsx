import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { IDCardFront } from "./Frontcard";
import { IDCardBack } from "./Backcard";
import type { IDCardData } from "../types";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PlayerIDCardPage = () => {
  const { idNo } = useParams<{ idNo: string }>();
  const [searchParams] = useSearchParams();
  const [cardData, setCardData] = useState<IDCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIdsToUsers, setShowIdsToUsers] = useState<boolean | null>(null);
  const [allowSelfAccess, setAllowSelfAccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const frontCardRef = useRef<HTMLDivElement | null>(null);
  const backCardRef = useRef<HTMLDivElement | null>(null);

  const downloadCombinedIdPdf = async () => {
    if (!cardData || !frontCardRef.current || !backCardRef.current || downloading) return;

    setDownloading(true);
    try {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.gap = '12px';
      container.style.background = '#ffffff';
      container.style.padding = '0';
      container.style.margin = '0';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.width = '432px';
      container.style.height = '330px';

      const frontClone = frontCardRef.current.cloneNode(true) as HTMLElement;
      const backClone = backCardRef.current.cloneNode(true) as HTMLElement;
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
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      const safeName = (cardData.name || 'Player').replace(/\s+/g, '_');
      const safeId = (cardData.idNo || 'DDKA-ID').replace(/\s+/g, '_');
      pdf.save(`${safeName}_${safeId}_ID_Card.pdf`);

      document.body.removeChild(container);
    } catch (downloadErr) {
      console.error('Failed to download combined ID card PDF', downloadErr);
      alert('Unable to download ID card right now. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!idNo) return;

    const fetchPlayerByIdNo = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch public settings to determine if IDs are visible
        try {
          const s = await fetch(`${API_URL}/api/settings/public`);
          const sjson = await s.json();
          if (sjson && sjson.success && typeof sjson.data?.showIdsToUsers === 'boolean') {
            setShowIdsToUsers(sjson.data.showIdsToUsers);

            // Allow a logged-in player to view their own card even when public ID visibility is disabled.
            if (sjson.data.showIdsToUsers === false && searchParams.get('self') === '1' && idNo) {
              try {
                const token = localStorage.getItem('userToken') || localStorage.getItem('token') || '';
                if (token) {
                  const meRes = await fetch(`${API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  const meJson = await meRes.json();
                  if (meRes.ok && meJson?.success && meJson?.profile) {
                    const myIdNo = String(meJson.profile.idNo || '').trim().toUpperCase();
                    const requestedIdNo = String(idNo).trim().toUpperCase();
                    if (myIdNo && requestedIdNo && myIdNo === requestedIdNo) {
                      setAllowSelfAccess(true);
                    }
                  }
                }
              } catch (selfErr) {
                console.error('Failed self-access check for ID card', selfErr);
              }
            }
          }
        } catch (se) {
          console.error('Failed to fetch public settings', se);
          setShowIdsToUsers(true);
        }

        const res = await fetch(`${API_URL}/api/players/card/${encodeURIComponent(idNo)}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Player not found");
        }

        const player = json.data;
        const mapped: IDCardData = {
          idNo: player.idNo || idNo,
          name: player.fullName,
          fathersName: player.fathersName,
          dob: player.dob,
          bloodGroup: player.bloodGroup,
          phone: player.phone,
          address: player.address,
          photoUrl: player.photo, // mapped in controller
          transactionId: player.transactionId,
          memberRole: player.memberRole || 'Player',
        };
        setCardData(mapped);
      } catch (err: any) {
        setError(err.message || "Failed to load ID card");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerByIdNo();
  }, [idNo, searchParams]);

  useEffect(() => {
    if (!cardData) return;
    if (showIdsToUsers === false && !allowSelfAccess) return;
    if (searchParams.get('download') !== '1') return;

    const t = window.setTimeout(() => {
      void downloadCombinedIdPdf();
    }, 250);

    return () => window.clearTimeout(t);
  }, [cardData, searchParams, showIdsToUsers, allowSelfAccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <span className="text-slate-600 text-sm">Loading ID card...</span>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-lg shadow px-6 py-4 text-center">
          <p className="text-red-600 font-semibold mb-1">Unable to load ID card</p>
          <p className="text-slate-600 text-sm">{error || "No data available"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${cardData.name} — DDKA Player ID ${cardData.idNo || ''}`}</title>
        <link rel="canonical" href={`${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/id-card/${cardData.idNo}`} />
        <meta name="description" content={`DDKA Player ID Card for ${cardData.name}. Download or print the official membership card.`} />
        <meta name="robots" content="index,follow" />

        {/* Structured Data for the player */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": cardData.name,
            "jobTitle": cardData.memberRole || 'Player',
            "image": cardData.photoUrl || `${window.location?.origin || 'https://dhanbadkabaddiassociation.tech'}/logo.png`,
            "address": cardData.address,
            "telephone": cardData.phone,
            "identifier": cardData.idNo
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold text-slate-800 mb-4">DDKA Player ID Card{showIdsToUsers ? ` - ${cardData.idNo}` : ''}</h1>

        {showIdsToUsers === false && !allowSelfAccess ? (
          <div className="bg-yellow-50 rounded-lg p-6 text-yellow-800">ID visibility is currently disabled by the association. You can view profile details but the ID number and ID card are hidden.</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-8 justify-center items-start bg-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col items-center">
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Front Side</h2>
                <div ref={frontCardRef} style={{ width: '210px', height: '330px' }}>
                  <IDCardFront data={cardData} />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Back Side</h2>
                <div ref={backCardRef} style={{ width: '210px', height: '330px' }}>
                  <IDCardBack data={cardData} />
                </div>
              </div>
            </div>

            <button
              onClick={() => { void downloadCombinedIdPdf(); }}
              disabled={downloading}
              className="mt-6 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-full disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {downloading ? 'Downloading...' : 'Download ID Card (Single Page)'}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PlayerIDCardPage;
