
import React from 'react';
import { IDCardData } from '../types';
import { COLORS } from '../constants';

interface Props {
  data: IDCardData;
}

export const IDCardBack: React.FC<Props> = ({ data }) => {
  const formattedDate = new Date(data.dob).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const qrData = `DDKA:${data.idNo}:${data.name}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

  return (
    <div 
      className="relative flex flex-col bg-white overflow-hidden shadow-2xl"
      style={{ 
        width: '240px', 
        height: '380px', 
        borderRadius: '20px',
        fontFamily: "'Poppins', sans-serif",
        border: `1.5px solid ${COLORS.primary}`
      }}
    >
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
        backgroundSize: '8px 8px'
      }} />

      {/* Header Section */}
      <div 
        className="relative h-14 flex items-center px-3 overflow-hidden shrink-0"
        style={{ background: COLORS.primary }}
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600 -skew-x-[25deg] translate-x-10 translate-y-[-10%] opacity-20" />
        
        <div className="relative z-10 w-full text-center">
          <h1 className="text-white text-[10px] font-black leading-tight tracking-tight uppercase">
            VERIFICATION
          </h1>
          <p className="text-orange-200 text-[6px] font-bold uppercase tracking-widest mt-0.5">ID Card</p>
        </div>
      </div>

      {/* Visual Accent */}
      <div className="h-1 w-full shrink-0" style={{ 
        background: `linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent})`,
      }} />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col px-3 py-4 space-y-2.5 justify-center">
        
        {/* ID Number - Prominent */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-1.5 rounded-lg text-center">
          <p className="text-[5.5px] text-slate-300 font-bold uppercase tracking-wider">Member ID</p>
          <p className="text-[10px] font-black tracking-[0.08em] mt-0.5">{data.idNo}</p>
        </div>

        {/* QR Code for Verification */}
        <div className="flex justify-center py-2">
          <div className="p-2 bg-white border-2 border-slate-900 rounded shadow-md">
            <img src={qrUrl} alt="QR" className="w-14 h-14" />
          </div>
        </div>

        {/* Important Information Grid */}
        <div className="space-y-1.5 text-center">
          <div className="bg-blue-50 border-l-4 border-blue-600 px-2 py-1 rounded">
            <p className="text-[5px] text-slate-500 font-bold uppercase tracking-wider">Date of Birth</p>
            <p className="text-[8px] font-bold text-slate-900">{formattedDate}</p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 px-2 py-1 rounded">
            <p className="text-[5px] text-slate-500 font-bold uppercase tracking-wider">Blood Group</p>
            <p className="text-[10px] font-black text-red-600">{data.bloodGroup}</p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-yellow-50 border border-yellow-400 rounded px-2 py-1.5 text-center">
          <p className="text-[5px] text-slate-600 font-bold uppercase tracking-wider">Emergency Contact</p>
          <p className="text-[7.5px] font-bold text-slate-800 mt-1">{data.phone}</p>
        </div>

      </div>

      {/* Footer Strip */}
      <div className="bg-slate-900 flex flex-col items-center justify-center py-2 shrink-0 space-y-0.5">
        <p className="text-white/40 text-[5px] font-black tracking-[0.1em] uppercase">Official DDKA Card</p>
        <p className="text-orange-500 text-[5px] font-bold">Scan QR for Verification</p>
      </div>
    </div>
  );
};>
        <div className="h-full flex-1 bg-slate-900"></div>
        <div className="h-full flex-1 bg-orange-600"></div>
        <div className="h-full flex-1 bg-amber-400"></div>
      </div>
    </div>
  );
};
