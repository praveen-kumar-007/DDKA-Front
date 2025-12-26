import React from 'react';
import type { Language } from '../translations';
import { translations } from '../translations';
import { ShieldCheck, Award, Users, Star } from 'lucide-react';

interface AboutProps {
  lang: Language;
}

export const About: React.FC<AboutProps> = ({ lang }) => {
  const t = translations[lang];

  const leadership = [
    {
      name: lang === 'hi' ? 'राजीव श्रीवास्तव' : 'Rajeev Shrivastava',
      role: lang === 'hi' ? 'अध्यक्ष' : 'President',
      org: 'DDKA',
      image: "https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766755551/Gemini_Generated_Image_ct0q4vct0q4vct0q_gavscz.png", // Paste image link here
      icon: <ShieldCheck className="w-6 h-6 text-orange-500" />
    },
    {
      name: lang === 'hi' ? 'मिंटू ठाकुर' : 'Mintoo Thakur',
      role: lang === 'hi' ? 'सचिव' : 'Secretary',
      org: 'DDKA',
      image: "https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766756133/Gemini_Generated_Image_qer0xhqer0xhqer0_oynz0o.png", // Paste image link here
      icon: <Award className="w-6 h-6 text-orange-500" />
    },
    {
      name: lang === 'hi' ? 'पप्पू कुमार यादव' : 'Pappu Kumar Yadav',
      role: lang === 'hi' ? 'जिला कोच' : 'District Coach',
      org: 'DDKA',
      image: "https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766755331/WhatsApp_Image_2025-12-26_at_9.37.43_AM_kxzdyb.jpg", // Paste image link here
      icon: <Star className="w-6 h-6 text-orange-500" />
    }
  ];

  return (
    <div className="py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-oswald font-bold text-blue-900 mb-6 uppercase">
            {t.nav.about}
          </h1>
          <div className="w-24 h-2 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Image */}
        <div className="relative mb-20">
          <img 
            src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766755173/Gemini_Generated_Image_p2t0etp2t0etp2t0_xheh79.png" 
            className="w-full h-64 md:h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white"
            alt="About DDKA Kabaddi"
          />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-8 py-6 rounded-2xl shadow-xl w-[90%] md:w-auto text-center">
            <p className="text-lg md:text-xl font-oswald uppercase tracking-widest">
              {lang === 'hi' ? 'धनबाद जिला कबड्डी संघ' : 'Dhanbad District Kabaddi Association'}
            </p>
          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 mt-16 md:mt-0">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-orange-600" />
            </div>
            <h2 className="text-3xl font-oswald font-bold text-blue-900 mb-4 uppercase">
              {lang === 'hi' ? 'हमारा विजन' : 'Our Vision'}
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {lang === 'hi' 
                ? 'धनबाद जिला कबड्डी संघ (DDKA) की स्थापना एक ही विजन के साथ की गई थी: कबड्डी को झारखंड के प्रमुख खेल के रूप में अपने सही स्थान पर वापस लाना और भारत की कोयला राजधानी से अंतरराष्ट्रीय स्तर की प्रतिभाओं को खोजना।'
                : 'DDKA was established with a singular vision: to restore Kabaddi to its rightful place as the premier sport of Jharkhand and scout international-level talent from the Coal Capital of India.'}
            </p>
          </div>

          <div className="bg-blue-900 p-8 rounded-3xl shadow-xl text-white">
            <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center mb-6">
              <Users className="text-orange-400" />
            </div>
            <h2 className="text-3xl font-oswald font-bold mb-4 uppercase text-orange-400">
              {lang === 'hi' ? 'हमारा मिशन' : 'Our Mission'}
            </h2>
            <p className="text-blue-100 leading-relaxed text-lg">
              {lang === 'hi'
                ? 'हमारा मिशन युवाओं को अनुशासन, टीम वर्क और शारीरिक फिटनेस के माध्यम से सशक्त बनाना है, जो कबड्डी के पारंपरिक खेल द्वारा प्रदान की जाती है। हम जमीनी स्तर पर प्रशिक्षण और बुनियादी ढांचा प्रदान करने के लिए प्रतिबद्ध हैं।'
                : 'Our mission is to empower the youth through discipline, teamwork, and physical fitness provided by the traditional sport of Kabaddi. We are committed to providing world-class training and infrastructure at the grassroots level.'}
            </p>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-oswald font-bold text-blue-900 uppercase">
              {lang === 'hi' ? 'प्रमुख नेतृत्व' : 'Key Leadership'}
            </h2>
            <p className="text-slate-500 mt-2">{lang === 'hi' ? 'DDKA को नई ऊंचाइयों पर ले जाने वाली टीम' : 'The team driving DDKA to new heights'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <div key={index} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                {/* Image Placeholder */}
                <div className="aspect-[4/5] bg-slate-200 overflow-hidden relative">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <Users className="w-20 h-20 text-slate-300" />
                    </div>
                  )}
                  {/* Floating Icon */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    {member.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center bg-white relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-1 bg-orange-500 rounded-full"></div>
                  <h3 className="text-2xl font-oswald font-bold text-blue-900 uppercase tracking-tight">
                    {member.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-orange-600 font-bold mt-2 tracking-widest">{member.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Contact CTA */}
        <div className="mt-24 bg-slate-50 rounded-[40px] p-8 md:p-12 text-center border border-slate-200">
          <h3 className="text-2xl md:text-3xl font-oswald font-bold text-blue-900 uppercase mb-4">
            {lang === 'hi' ? 'हमसे जुड़ें' : 'Connect With Us'}
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
            {lang === 'hi' 
              ? 'क्या आपके पास कोई प्रश्न है या आप DDKA के साथ साझेदारी करना चाहते हैं? हमारी टीम आपकी सहायता के लिए यहाँ है।'
              : 'Have questions or want to partner with DDKA? Our team is here to help you grow the game of Kabaddi.'}
          </p>
          <button className="bg-orange-600 hover:bg-blue-900 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-1">
            {lang === 'hi' ? 'संपर्क करें' : 'Contact DDKA'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;