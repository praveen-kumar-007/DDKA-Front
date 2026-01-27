import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { IDCardFront } from "./Frontcard";
import { IDCardBack } from "./Backcard";
import type { IDCardData } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PlayerIDCardPage = () => {
  const { idNo } = useParams<{ idNo: string }>();
  const [cardData, setCardData] = useState<IDCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIdsToUsers, setShowIdsToUsers] = useState<boolean | null>(null);

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
  }, [idNo]);

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

      {showIdsToUsers === false ? (
        <div className="bg-yellow-50 rounded-lg p-6 text-yellow-800">ID visibility is currently disabled by the association. You can view profile details but the ID number and ID card are hidden.</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-8 justify-center items-start bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col items-center">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">Front Side</h2>
              <IDCardFront data={cardData} />
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">Back Side</h2>
              <IDCardBack data={cardData} />
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="mt-6 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-full"
          >
            Print / Download ID Card
          </button>
        </>
      )}
    </div>
  </>
  );
};

export default PlayerIDCardPage;
