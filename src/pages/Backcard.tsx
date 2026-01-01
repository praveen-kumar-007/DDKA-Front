import React from 'react';
import type { IDCardData } from '../types';

interface Props {
  data: IDCardData;
}

export const IDCardBack: React.FC<Props> = ({ data }) => {
  const qrData = `DDKA:${data.idNo}:${data.name}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}&color=ff6b35`;

  return (
    <div 
      className="relative flex flex-col bg-white overflow-hidden shadow-2xl"
      style={{ 
        width: '240px', 
        height: '380px', 
        borderRadius: '16px',
        fontFamily: "'Poppins', sans-serif",
        border: '3px solid #ff6b35'
      }}
    >
      {/* Watermark Logos Background */}
      <div className="absolute inset-0 pointer-events-none opacity-8">
        <div className="absolute top-4 left-4 text-2xl font-black text-blue-900">AKFI</div>
        <div className="absolute bottom-4 right-4 text-2xl font-black text-blue-900">JH-KBD</div>
      </div>

      {/* Header Section - Orange Gradient */}
      <div 
        className="relative px-3 py-3 shrink-0"
        style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' }}
      >
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-white">
            <span className="text-[10px] font-black text-orange-600">🇮🇳</span>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-white text-[8px] font-black leading-tight tracking-tight uppercase">
              CLUB DETAILS
            </h1>
            <p className="text-white text-[5px] font-bold uppercase tracking-widest mt-0.5">
              Member Verification
            </p>
          </div>
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-white">
            <span className="text-[10px] font-black">🏏</span>
          </div>
        </div>
      </div>

      {/* Accent Line - Vibrant */}
      <div className="h-1 w-full shrink-0" style={{ 
        background: 'linear-gradient(90deg, #ff6b35, #f7931e, #ff6b35)',
      }} />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col px-2.5 py-2 space-y-1.5 justify-between overflow-hidden">
        {/* ID Number */}
        <div className="bg-white text-orange-600 px-2 py-1 rounded text-center border-2 border-orange-600">
          <p className="text-[4.5px] text-slate-600 font-bold uppercase tracking-wider">Member ID</p>
          <p className="text-[9px] font-black tracking-[0.1em] mt-0.5">{data.idNo}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center py-1">
          <div className="p-1.5 bg-white border-2 border-orange-600 rounded shadow-md">
            <img src={qrUrl} alt="QR Code" className="w-12 h-12" />
          </div>
        </div>

        {/* Club Information Grid */}
        <div className="space-y-0.75">
          {/* Club Name */}
          <div className="bg-white border border-slate-300 px-1.5 py-0.5 rounded">
            <p className="text-[4px] text-slate-500 font-bold uppercase tracking-wide">Club Name</p>
            <p className="text-[6.5px] font-bold text-slate-900 leading-tight">Dhanbad District Kabaddi</p>
          </div>

          {/* Club Phone */}
          <div className="bg-white border border-slate-300 px-1.5 py-0.5 rounded">
            <p className="text-[4px] text-slate-500 font-bold uppercase tracking-wide">Club Phone</p>
            <p className="text-[6.5px] font-bold text-slate-900 leading-tight">+91-6542-8765-43</p>
          </div>

          {/* Club Email */}
          <div className="bg-white border border-slate-300 px-1.5 py-0.5 rounded">
            <p className="text-[4px] text-slate-500 font-bold uppercase tracking-wide">Email</p>
            <p className="text-[6px] font-bold text-slate-900 leading-tight truncate">ddka@kabaddi.in</p>
          </div>

          {/* Club Address */}
          <div className="bg-white border border-slate-300 px-1.5 py-0.5 rounded flex-grow">
            <p className="text-[4px] text-slate-500 font-bold uppercase tracking-wide">Address</p>
            <p className="text-[6px] font-medium text-slate-800 leading-tight line-clamp-2">Dhanbad, Jharkhand, India</p>
          </div>
        </div>
      </div>

      {/* Footer - Orange Gradient */}
      <div className="px-2 py-1.5 mt-auto shrink-0 flex items-center justify-between"
           style={{ background: 'linear-gradient(90deg, #ff6b35, #f7931e)' }}>
        <span className="text-white text-[5px] font-black tracking-[0.15em] uppercase">DDKA MEMBER</span>
        <span className="text-white text-[5px] font-bold">Est. 2017</span>
      </div>
    </div>
  );
};
