import React from 'react';
import type { Language } from '../translations';
import { translations } from '../translations';
import { ShieldCheck, Award, Users, Star, UserCheck, ScrollText, Medal, Megaphone } from 'lucide-react';

interface AboutProps {
  lang: Language;
}

export const About: React.FC<AboutProps> = ({ lang }) => {
  const t = translations[lang];

  // The Top 4 Leaders (With Images)
  const coreLeadership = [
    {
      name: lang === 'hi' ? 'राजीव श्रीवास्तव' : 'Rajeev Shrivastava',
      role: lang === 'hi' ? 'अध्यक्ष' : 'President',
      org: 'DDKA',
      image: "https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766755551/Gemini_Generated_Image_ct0q4vct0q4vct0q_gavscz.png",
      icon: <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
    },
    {
      name: lang === 'hi' ? 'मिंटू ठाकुर' : 'Mintoo Thakur',
      role: lang === 'hi' ? 'सचिव' : 'Secretary',
      org: 'DDKA',
      image: "https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766756133/Gemini_Generated_Image_qer0xhqer0xhqer0_oynz0o.png",
      icon: <Award className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
    },
    {
      name: lang === 'hi' ? 'पप्पू कुमार यादव' : 'Pappu Kumar Yadav',
      role: lang === 'hi' ? 'कोषाध्यक्ष और कोच' : 'Treasurer & Coach',
      org: 'DDKA',
      image: "https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766755331/WhatsApp_Image_2025-12-26_at_9.37.43_AM_kxzdyb.jpg",
      icon: <Star className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
    },
    {
      name: lang === 'hi' ? 'प्रवीण कुमार' : 'Praveen Kumar',
      role: lang === 'hi' ? 'मीडिया प्रभारी' : 'Media Incharge',
      org: 'DDKA',
      // 👇 PASTE PRAVEEN'S IMAGE LINK INSIDE THE QUOTES BELOW 👇
      image: "https://res.cloudinary.com/dmmll82la/image/upload/v1765632491/sp-club/passports/passport-1765632490936-299511838.jpg", 
      icon: <Megaphone className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
    }
  ];

  // The Rest of the Committee
  const committee = {
    chairman: {
      title: lang === 'hi' ? 'चेयरमैन' : 'Chairman',
      names: [lang === 'hi' ? 'प्रदीप कुमार मंडल' : 'Pradeep Kr. Mandal']
    },
    vicePresidents: {
      title: lang === 'hi' ? 'उपाध्यक्ष' : 'Vice Presidents',
      names: [
        lang === 'hi' ? 'बी. सी. मंडल' : 'B. C. Mandal',
        lang === 'hi' ? 'रविंद्र महतो' : 'Ravindra Mahto',
        lang === 'hi' ? 'राजीव सोनी' : 'Rajeev Soni',
        lang === 'hi' ? 'नीतू कुमारी' : 'Nitu Kumari'
      ]
    },
    asstSecretaries: {
      title: lang === 'hi' ? 'सहायक सचिव' : 'Asst. Secretaries',
      names: [
        lang === 'hi' ? 'मुकेश प्रसाद' : 'Mukesh Prasad',
        lang === 'hi' ? 'निरंजन महतो' : 'Niranjan Mahto',
        lang === 'hi' ? 'डी. एन. बैठा' : 'D. N. Baitha',
        lang === 'hi' ? 'लालमणि महतो' : 'Lalmani Mahto'
      ]
    },
    patrons: {
      title: lang === 'hi' ? 'मुख्य संरक्षक' : 'Chief Patrons',
      names: [
        lang === 'hi' ? 'मथुरा प्रसाद महतो (MLA टुंडी)' : 'Mathura Prasad Mahto (MLA Tundi)',
        lang === 'hi' ? 'कुणाल राज भारद्वाज (राष्ट्रीय खिलाड़ी)' : 'Kunal Raj Bhardwaj (National Player)',
        lang === 'hi' ? 'एस. के. भारती (SSE/TRS/RIY)' : 'S.K. Bharti (SSE/TRS/RIY)',
        lang === 'hi' ? 'राजीव रंजन महतो (अधिवक्ता)' : 'Rajeev Ranjan Mahto (Advocate)'
      ]
    }
  };

  return (
    <div className="py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50">
      <div className="max-w-[90rem] mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-5xl md:text-7xl font-oswald font-bold text-blue-900 mb-6 uppercase tracking-tight">
            {t.nav.about}
          </h1>
          <div className="w-32 h-2 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full shadow-lg"></div>
          <p className="mt-6 text-slate-500 font-light text-xl uppercase tracking-widest">
             {lang === 'hi' ? 'परंपरा • अनुशासन • गौरव' : 'Tradition • Discipline • Glory'}
          </p>
        </div>

        {/* Main Banner Image */}
        <div className="relative mb-24 max-w-7xl mx-auto group hidden md:block">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
             <img 
              src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766755173/Gemini_Generated_Image_p2t0etp2t0etp2t0_xheh79.png" 
              className="w-full h-64 md:h-[550px] object-cover transform transition duration-700 group-hover:scale-105"
              alt="About DDKA Kabaddi"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent flex items-end justify-center pb-12">
               <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full shadow-2xl">
                 <p className="text-xl md:text-2xl font-oswald uppercase tracking-widest font-bold">
                   {lang === 'hi' ? 'धनबाद जिला कबड्डी संघ' : 'Dhanbad District Kabaddi Association'}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Mobile Banner (Simplified) */}
        <div className="md:hidden mb-16 relative">
             <img 
              src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766755173/Gemini_Generated_Image_p2t0etp2t0etp2t0_xheh79.png" 
              className="w-full h-56 object-cover rounded-3xl shadow-lg border-2 border-white"
              alt="About DDKA"
            />
        </div>

        {/* Vision & Mission Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-20 md:mb-28">
          {/* Vision */}
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 md:mb-8">
                  <ShieldCheck className="text-orange-600 w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl md:text-4xl font-oswald font-bold text-blue-900 mb-4 md:mb-6 uppercase">
                {lang === 'hi' ? 'हमारा विजन' : 'Our Vision'}
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-lg">
                {lang === 'hi' 
                    ? 'DDKA का विजन: कबड्डी को झारखंड के प्रमुख खेल के रूप में पुनर्स्थापित करना और कोयला राजधानी से अंतर्राष्ट्रीय प्रतिभाओं को खोजना।'
                    : 'DDKA vision: Restore Kabaddi as Jharkhand\'s premier sport and scout international talent from the Coal Capital.'}
                </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-blue-900 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
            <div className="relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-4 md:mb-8 border border-white/10">
                  <Users className="text-orange-400 w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl md:text-4xl font-oswald font-bold mb-4 md:mb-6 uppercase text-orange-400">
                {lang === 'hi' ? 'हमारा मिशन' : 'Our Mission'}
                </h2>
                <p className="text-blue-100 leading-relaxed text-sm md:text-lg">
                {lang === 'hi'
                    ? 'अनुशासन, टीम वर्क और फिटनेस के माध्यम से युवाओं को सशक्त बनाना। हम जमीनी स्तर पर विश्व स्तरीय प्रशिक्षण प्रदान करने के लिए प्रतिबद्ध हैं।'
                    : 'Empowering youth through discipline, teamwork, and fitness. Committed to providing world-class training at the grassroots level.'}
                </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CORE LEADERSHIP (CARDS) - 2 PER ROW ON MOBILE */}
        {/* ------------------------------------------------------------------ */}
        <div className="mb-28">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-oswald font-bold text-blue-900 uppercase tracking-tight">
              {lang === 'hi' ? 'कार्यकारी नेतृत्व' : 'Executive Leadership'}
            </h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* GRID UPDATE: grid-cols-2 for mobile, grid-cols-4 for lg */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {coreLeadership.map((member, index) => (
              <div key={index} className="group relative bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100">
                
                {/* Image Area */}
                <div className="aspect-[3/4] md:aspect-[4/5] bg-slate-200 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 p-2 text-center">
                       <Users className="w-12 h-12 md:w-20 md:h-20 text-slate-400 mb-2" />
                       <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">Image Pending</p>
                    </div>
                  )}
                  
                  {/* Floating Icon Badge - Adjusted size for mobile */}
                  <div className="absolute top-2 right-2 md:top-6 md:right-6 z-20 bg-white/30 backdrop-blur-md border border-white/40 p-1.5 md:p-3 rounded-lg md:rounded-2xl shadow-lg text-white">
                    {member.icon}
                  </div>
                </div>

                {/* Text Content - Overlapping Effect */}
                <div className="relative z-20 -mt-6 md:-mt-10 mx-2 md:mx-4 mb-3 md:mb-4 bg-white p-3 md:p-6 text-center rounded-xl md:rounded-3xl shadow-lg border border-slate-50">
                  <h3 className="text-sm md:text-xl font-oswald font-bold text-blue-900 uppercase tracking-tight mb-1 leading-tight line-clamp-2 md:line-clamp-none">
                    {member.name}
                  </h3>
                  <div className="w-8 md:w-12 h-0.5 md:h-1 bg-orange-500 mx-auto rounded-full mb-1 md:mb-3"></div>
                  <p className="text-orange-600 font-bold uppercase text-[10px] md:text-xs tracking-wider md:tracking-widest">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* EXTENDED COMMITTEE LIST */}
        {/* ------------------------------------------------------------------ */}
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600"></div>
          
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-oswald font-bold text-blue-900 uppercase">
              {lang === 'hi' ? 'संघ के पदाधिकारी' : 'Association Office Bearers'}
            </h2>
            <p className="text-slate-500 mt-2 md:mt-3 font-light text-sm md:text-base">
               Dhanbad District Kabaddi Association Team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
            
            {/* Left Column: Chairman & Patrons */}
            <div className="space-y-8 md:space-y-12">
               {/* Chairman Block */}
               <div className="bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border-l-4 md:border-l-8 border-blue-900 shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                     <UserCheck className="text-blue-900 w-6 h-6 md:w-8 md:h-8" />
                     <h3 className="text-lg md:text-2xl font-oswald font-bold text-blue-900 uppercase">
                        {committee.chairman.title}
                     </h3>
                  </div>
                  <ul className="space-y-2">
                     {committee.chairman.names.map((name, i) => (
                        <li key={i} className="text-base md:text-xl text-slate-700 font-medium pl-2">{name}</li>
                     ))}
                  </ul>
               </div>

               {/* Patrons Block */}
               <div className="bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border-l-4 md:border-l-8 border-orange-500 shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                     <Medal className="text-orange-600 w-6 h-6 md:w-8 md:h-8" />
                     <h3 className="text-lg md:text-2xl font-oswald font-bold text-blue-900 uppercase">
                        {committee.patrons.title}
                     </h3>
                  </div>
                  <ul className="space-y-2 md:space-y-3">
                     {committee.patrons.names.map((name, i) => (
                        <li key={i} className="text-sm md:text-base text-slate-600 border-b border-slate-200 pb-2 last:border-0">
                           {name}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Right Column: VPs and Asst Secretaries */}
            <div className="space-y-8 md:space-y-12">
               {/* Vice Presidents */}
               <div>
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                        <Users size={16} className="md:w-5 md:h-5" />
                     </div>
                     <h3 className="text-base md:text-xl font-bold text-slate-400 uppercase tracking-widest">
                        {committee.vicePresidents.title}
                     </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                     {committee.vicePresidents.names.map((name, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-3 md:p-4 rounded-xl shadow-sm flex items-center gap-3">
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
                           <span className="text-sm md:text-base font-semibold text-slate-700">{name}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Asst Secretaries */}
               <div>
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-800">
                        <ScrollText size={16} className="md:w-5 md:h-5" />
                     </div>
                     <h3 className="text-base md:text-xl font-bold text-slate-400 uppercase tracking-widest">
                        {committee.asstSecretaries.title}
                     </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                     {committee.asstSecretaries.names.map((name, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-3 md:p-4 rounded-xl shadow-sm flex items-center gap-3">
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500"></div>
                           <span className="text-sm md:text-base font-semibold text-slate-700">{name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Bottom Contact CTA */}
        <div className="mt-16 md:mt-24 text-center pb-12">
          <p className="text-slate-400 text-xs md:text-sm mb-4 uppercase tracking-widest">Want to join us?</p>
          <button className="bg-blue-900 hover:bg-orange-600 text-white px-8 py-4 md:px-12 md:py-5 rounded-full font-bold text-base md:text-lg transition-all shadow-xl hover:-translate-y-1 hover:shadow-orange-500/20">
            {lang === 'hi' ? 'संपर्क करें' : 'Contact Association'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default About;