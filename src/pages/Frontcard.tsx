
import React from 'react';
import type { IDCardData } from '../types';

interface Props {
  data: IDCardData;
}

export const IDCardFront: React.FC<Props> = ({ data }) => {
  // Format DOB properly
  const formatDOB = (dobString: string) => {
    try {
      const date = new Date(dobString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dobString;
    }
  };

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
              DDKA - OFFICIAL ID
            </h1>
            <p className="text-white text-[5px] font-bold uppercase tracking-widest mt-0.5">
              Dhanbad District Kabaddi
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

      {/* Photo Section - Orange/White Frame */}
      <div className="flex justify-center py-3 relative shrink-0">
        <div className="relative p-1.5 shadow-lg rounded-lg" 
             style={{ 
               width: '70px', 
               height: '85px',
               background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
             }}>
          <div className="w-full h-full bg-white overflow-hidden rounded">
            <img 
              src={data.photoUrl} 
              alt={data.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ID Number Badge */}
      <div className="flex justify-center mb-1">
        <div className="bg-white text-orange-600 text-[7px] font-black px-3 py-1 rounded-full border-2 border-orange-600 shadow-md">
          ID: {data.idNo}
        </div>
      </div>

      {/* Player Name */}
      <div className="px-3 py-1.5 text-center border-b-2 border-orange-200">
        <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-tight">
          {data.name}
        </h2>
        <p className="text-orange-600 text-[5.5px] font-black uppercase tracking-widest mt-0.5">
          KABADDI PLAYER
        </p>
      </div>

      {/* Details Grid - Simple & Clear */}
      <div className="flex-grow px-2.5 py-1.5 space-y-1 overflow-hidden">
        {/* Row 1: DOB and Blood Group */}
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-white px-1.5 py-0.75 rounded border border-slate-300">
            <span className="text-[4px] text-slate-500 font-bold uppercase block tracking-wide">DOB</span>
            <span className="text-[7px] font-bold text-slate-900 leading-tight">{formatDOB(data.dob)}</span>
          </div>
          <div className="bg-white px-1.5 py-0.75 rounded border border-slate-300">
            <span className="text-[4px] text-slate-500 font-bold uppercase block tracking-wide">Blood</span>
            <span className="text-[7.5px] font-black text-slate-900 leading-tight">{data.bloodGroup}</span>
          </div>
        </div>

        {/* Row 2: Phone */}
        <div className="bg-white border border-slate-300 px-1.5 py-0.75 rounded">
          <span className="text-[4px] text-slate-500 font-bold uppercase block tracking-wide">Phone</span>
          <span className="text-[6.5px] font-bold text-slate-900 tracking-wider leading-tight">{data.phone}</span>
        </div>

        {/* Row 3: Father's Name */}
        <div className="bg-white px-1.5 py-0.75 rounded border border-slate-300">
          <span className="text-[4px] text-slate-500 font-bold uppercase block tracking-wide">Father</span>
          <p className="text-[6px] font-semibold text-slate-800 leading-tight truncate">
            {data.fathersName}
          </p>
        </div>

        {/* Row 4: Address */}
        <div className="bg-white px-1.5 py-0.75 rounded border border-slate-300 flex-grow">
          <span className="text-[4px] text-slate-500 font-bold uppercase block tracking-wide">Address</span>
          <p className="text-[6px] font-medium text-slate-700 leading-tight line-clamp-2">
            {data.address}
          </p>
        </div>
      </div>

      {/* Footer - Orange Gradient */}
      <div className="px-2 py-1.5 mt-auto shrink-0 flex items-center justify-between" 
           style={{ background: 'linear-gradient(90deg, #ff6b35, #f7931e)' }}>
        <span className="text-white text-[5px] font-black tracking-[0.15em] uppercase">OFFICIAL MEMBER CARD</span>
        <span className="text-white text-[5px] font-bold">Est. 2017</span>
      </div>
    </div>
  );
};
