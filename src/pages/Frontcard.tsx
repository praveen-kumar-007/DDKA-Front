
import { IDCardData } from '../types';
import { ASSOCIATION_INFO, COLORS, LOGOS } from '../constants';

interface Props {
  data: IDCardData;
}

export const IDCardFront: React.FC<Props> = ({ data }) => {
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
        className="relative h-16 flex items-center px-3 overflow-hidden shrink-0"
        style={{ background: COLORS.primary }}
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600 -skew-x-[25deg] translate-x-10 translate-y-[-10%] opacity-20" />
        
        <div className="relative z-10 flex items-center gap-2 w-full">
          <div className="bg-white rounded-full p-0.5 shadow-md w-10 h-10 flex items-center justify-center shrink-0">
            <img src={LOGOS.AKFI} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-white text-[8px] font-black leading-tight tracking-tight uppercase">
              {ASSOCIATION_INFO.name}
            </h1>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="text-orange-500 text-[7px] font-bold uppercase tracking-widest shrink-0">Dhanbad District</span>
              <div className="h-[0.5px] w-full bg-white/30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Accent */}
      <div className="h-1 w-full shrink-0" style={{ 
        background: `linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent})`,
      }} />

      {/* Photo Section - Scaled down to allow more text room */}
      <div className="mt-3 flex justify-center relative shrink-0">
        <div className="relative p-0.5 bg-gradient-to-b from-orange-500 to-amber-300 shadow-lg" 
             style={{ 
               clipPath: 'polygon(50% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%, 0% 15%)',
               width: '95px',
               height: '110px'
             }}>
          <div className="w-full h-full bg-white overflow-hidden" 
               style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%, 0% 15%)' }}>
            <img 
              src={data.photoUrl} 
              alt={data.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute -bottom-1.5 bg-slate-900 text-white text-[7px] font-black px-3 py-0.5 rounded-full border border-orange-500 shadow-md">
          {data.idNo}
        </div>
      </div>

      {/* Player Identity & Details Section */}
      <div className="flex-grow flex flex-col px-4 pt-4 pb-2">
        <div className="text-center mb-2">
          <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-tight leading-none">
            {data.name}
          </h2>
          <p className="text-orange-600 text-[8px] font-black uppercase tracking-[0.15em] mt-0.5">
            KABADDI PLAYER
          </p>
        </div>

        {/* Dense Data Grid */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
             <div className="bg-slate-50 px-2 py-1 rounded-md border-l-2 border-orange-500 flex flex-col">
                <span className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider">DOB</span>
                <span className="text-[8.5px] font-bold text-slate-800 leading-none">{data.dob}</span>
             </div>
             <div className="bg-slate-50 px-2 py-1 rounded-md border-l-2 border-red-500 flex flex-col">
                <span className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider">Blood</span>
                <span className="text-[8.5px] font-bold text-red-600 leading-none">{data.bloodGroup}</span>
             </div>
          </div>
          
          <div className="bg-slate-900 text-white px-2 py-1 rounded-md flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[5.5px] text-slate-400 font-bold uppercase tracking-[0.1em]">Phone Number</span>
              <span className="text-[9px] font-bold tracking-wider leading-none">{data.phone}</span>
            </div>
            <div className="w-4 h-4 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
               <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            </div>
          </div>

          <div className="px-1 space-y-1">
             <div>
               <span className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider block">Father's Name</span>
               <p className="text-[8.5px] font-semibold text-slate-800 leading-none truncate">
                 {data.fathersName}
               </p>
             </div>
             
             <div className="pt-1 border-t border-slate-100">
               <span className="text-[5.5px] text-slate-400 font-bold uppercase tracking-wider block">Address</span>
               <p className="text-[8px] font-medium text-slate-700 leading-tight">
                 {data.address}
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="bg-slate-900 h-6 flex items-center justify-between px-4 mt-auto shrink-0">
        <span className="text-white/30 text-[6.5px] font-black tracking-[0.2em] uppercase italic">Official Player Card</span>
        <div className="flex gap-1">
          <div className="w-4 h-0.5 bg-orange-500 rounded-full"></div>
          <div className="w-2 h-0.5 bg-orange-500/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
