import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Users, Clock, Target, Shield, AlertCircle, CheckCircle, Award, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Language } from '../translations';

interface KabaddiRulesProps {
  lang: Language;
}

const KabaddiRules: React.FC<KabaddiRulesProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  return (
    <>
      <Helmet>
        <title>
          {isHi
            ? 'कबड्डी नियम | धनबाद जिला कबड्डी संघ (DDKA)'
            : 'Kabaddi Rules | Dhanbad District Kabaddi Association (DDKA), Jharkhand'}
        </title>
        <meta
          name="description"
          content={
            isHi
              ? 'DDKA द्वारा अपनाए गए कबड्डी के विस्तृत नियम, कोर्ट के माप, टीम संरचना, रेड और डिफेंस के नियम, फाउल और स्कोरिंग सिस्टम – AKFI मानकों के अनुरूप।'
              : 'Detailed Kabaddi rules followed by Dhanbad District Kabaddi Association (DDKA) – court dimensions, team composition, raid and defense rules, fouls and scoring system as per AKFI standards.'
          }
        />
        <meta
          name="keywords"
          content="Kabaddi rules Dhanbad, Kabaddi rules Jharkhand, AKFI kabaddi rules, DDKA kabaddi rules, kabaddi dhanbad jharkhand, jaan kabaddi rules, jan kabaddi rules"
        />
      </Helmet>
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="bg-blue-900 pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/20 rounded-2xl mb-6 border border-orange-500/30">
              <Trophy className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-oswald font-bold text-white mb-6 uppercase tracking-tight">
              {isHi ? 'DDKA कबड्डी नियमावली' : 'DDKA Kabaddi Rules'}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {isHi
                ? 'धनबाद जिला कबड्डी संघ (DDKA) द्वारा अपनाए गए कबड्डी के आधिकारिक नियम और विनियम, जो अमेचर कबड्डी फेडरेशन ऑफ इंडिया (AKFI) के मानकों के अनुरूप हैं।'
                : 'Official Kabaddi rules and regulations followed by Dhanbad District Kabaddi Association (DDKA), aligned with Amateur Kabaddi Federation of India (AKFI) standards.'}
            </p>
            <div className="mt-8 flex justify-center">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white">
                {isHi ? 'AKFI विनियमों के आधार पर' : 'Based on AKFI Regulations'}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-10 pb-20 relative z-20">
          {/* Introduction Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200 p-8 md:p-10 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Shield className="w-8 h-8 text-blue-900" />
              </div>
              <div>
                <h3 className="text-2xl font-oswald font-bold text-blue-900 mb-4 uppercase">
                  {isHi ? 'कबड्डी के बारे में' : 'About Kabaddi'}
                </h3>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    {isHi
                      ? 'कबड्डी भारत की प्राचीन खेल परंपरा से निकला एक संपर्क टीम खेल है। इसमें कुश्ती, टैग और दोनों तरह के कौशल – आक्रमण (रेड) और बचाव (डिफेंस) – शामिल होते हैं। खेल दो टीमों के बीच खेला जाता है, प्रत्येक टीम में सात खिलाड़ी मैदान पर होते हैं।'
                      : 'Kabaddi is a contact team sport that originated in ancient India. It combines elements of wrestling and tag, and requires both offensive and defensive skills. The game is played between two teams of seven players each.'}
                  </p>
                  <p>
                    {isHi
                      ? 'DDKA, AKFI द्वारा निर्धारित सभी नियमों और झारखंड राज्य कबड्डी संघ के दिशा-निर्देशों का पालन करते हुए निष्पक्ष खेल, खेल भावना और मानकीकृत प्रतियोगिता सुनिश्चित करता है।'
                      : 'DDKA follows all rules and regulations established by the Amateur Kabaddi Federation of India (AKFI) and Jharkhand State Kabaddi Association to ensure fair play and standardized competition.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Court Specifications */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '1. मैदान के माप एवं विन्यास' : '1. Court Specifications'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {isHi ? '1.1 मैदान के आयाम (श्रेणी वार)' : '1.1 Court Dimensions (Category Wise)'}
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="space-y-4">
                      <div className="border-b border-slate-200 pb-3">
                        <h4 className="font-bold text-blue-900 mb-1 text-sm uppercase">{isHi ? 'सीनियर और जूनियर (पुरुष/लड़के)' : 'Senior & Junior (Men/Boys)'}</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{isHi ? 'आकार:' : 'Size:'} 13m x 10m</span>
                          <span className="text-slate-600">{isHi ? 'लॉबी:' : 'Lobby:'} 1m</span>
                        </div>
                      </div>
                      <div className="border-b border-slate-200 pb-3">
                        <h4 className="font-bold text-blue-900 mb-1 text-sm uppercase">{isHi ? 'सीनियर और जूनियर (महिला/लड़कियां)' : 'Senior & Junior (Women/Girls)'}</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{isHi ? 'आकार:' : 'Size:'} 12m x 8m</span>
                          <span className="text-slate-600">{isHi ? 'लॉबी:' : 'Lobby:'} 1m</span>
                        </div>
                      </div>
                      <div className="border-b border-slate-200 pb-3">
                        <h4 className="font-bold text-blue-900 mb-1 text-sm uppercase">{isHi ? 'सब-जूनियर (लड़के)' : 'Sub-Junior (Boys)'}</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{isHi ? 'आकार:' : 'Size:'} 11m x 9m</span>
                          <span className="text-slate-600">{isHi ? 'लॉबी:' : 'Lobby:'} 1m</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1 text-sm uppercase">{isHi ? 'सब-जूनियर (लड़कियां)' : 'Sub-Junior (Girls)'}</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{isHi ? 'आकार:' : 'Size:'} 11m x 8m</span>
                          <span className="text-slate-600">{isHi ? 'लॉबी:' : 'Lobby:'} 1m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {isHi ? '1.2 मैदान की रेखाएँ' : '1.2 Court Markings'}
                  </h3>
                  <ul className="space-y-3">
                    {[
                      isHi ? 'सभी रेखाएँ 5 सेमी चौड़ी होनी चाहिए।' : 'All lines must be 5 cm wide.',
                      isHi ? 'लॉबी क्षेत्र: दोनों किनारों पर 1 मीटर।' : 'Lobby areas: 1 meter on both sides.',
                      isHi ? 'सभी रेखाएँ खेल क्षेत्र का हिस्सा हैं।' : 'Lines are part of the playing area.',
                      isHi ? 'सतह समतल और सुरक्षित होनी चाहिए।' : 'Surface must be flat and safe.'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Team Composition */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '2. टीम संरचना' : '2. Team Composition'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { label: isHi ? 'प्लेइंग सेवन' : 'Playing Seven', value: '07', icon: Users },
                  { label: isHi ? 'सब्सटीट्यूट' : 'Substitutes', value: '05', icon: Users },
                  { label: isHi ? 'कुल खिलाड़ी' : 'Total Squad', value: '12', icon: Users },
                ].map((stat, i) => (
                  <div key={i} className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center">
                    <stat.icon className="w-8 h-8 text-blue-900 mx-auto mb-3" />
                    <div className="text-3xl font-oswald font-bold text-blue-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {isHi ? 'खिलाड़ी की भूमिकाएँ' : 'Player Positions'}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { role: isHi ? 'रेडर' : 'Raiders', desc: isHi ? 'आक्रमण करने वाले खिलाड़ी' : 'Offensive players' },
                      { role: isHi ? 'डिफेंडर' : 'Defenders', desc: isHi ? 'रक्षा करने वाले खिलाड़ी' : 'Defensive players' },
                      { role: isHi ? 'ऑल-राउंडर' : 'All-Rounders', desc: isHi ? 'दोनों में सक्षम' : 'Proficient in both' },
                    ].map((pos, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-blue-900">{pos.role}</span>
                        <span className="text-slate-600 text-sm">{pos.desc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      {isHi ? 'आउट और पुनर्जीवन (Revival)' : 'Out & Revival Rule'}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {isHi 
                        ? 'जब कोई खिलाड़ी आउट होता है, तो वह मैदान से बाहर चला जाता है। जब उसकी टीम अंक प्राप्त करती है, तो खिलाड़ी उसी क्रम में वापस आते हैं जिस क्रम में वे आउट हुए थे।' 
                        : 'When a player is out, they leave the court. When their team scores a point, players are revived and return to the court in the same order they were put out.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {isHi ? 'वेशभूषा नियम' : 'Uniform Rules'}
                  </h3>
                  <ul className="space-y-3">
                    {[
                      isHi ? '1 से 12 तक की स्पष्ट जर्सी संख्या।' : 'Jerseys numbered 1-12.',
                      isHi ? 'नंगे पाँव खेलना अनिवार्य है।' : 'Must play barefoot.',
                      isHi ? 'कोई आभूषण पहनना निषिद्ध है।' : 'No jewelry permitted.',
                      isHi ? 'पूरी टीम की ड्रेस एक जैसी होनी चाहिए।' : 'Uniforms must be identical.'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Game Duration */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '3. मैच अवधि एवं समय' : '3. Match Duration'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="relative pl-8 border-l-2 border-orange-500">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-orange-500 rounded-full"></div>
                    <h4 className="text-lg font-bold text-blue-900 mb-2">{isHi ? 'कुल समय' : 'Total Time'}</h4>
                    <p className="text-slate-700">{isHi ? '40 मिनट (20-5-20)' : '40 minutes (20-5-20 format)'}</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-blue-900">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-900 rounded-full"></div>
                    <h4 className="text-lg font-bold text-blue-900 mb-2">{isHi ? 'टाइम-आउट' : 'Time-Outs'}</h4>
                    <p className="text-slate-700">{isHi ? 'प्रति हाफ 1 टाइम-आउट (30 सेकंड)' : '1 time-out per half (30 seconds)'}</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-orange-500">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-orange-500 rounded-full"></div>
                    <h4 className="text-lg font-bold text-blue-900 mb-2">{isHi ? 'रेड समय' : 'Raid Time'}</h4>
                    <p className="text-slate-700">{isHi ? 'अधिकतम 30 सेकंड प्रति रेड' : 'Maximum 30 seconds per raid'}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                    {isHi ? 'विशेष नियम' : 'Special Rules'}
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-blue-100">
                      <p className="font-bold text-blue-900 mb-1">{isHi ? 'गोल्डन रेड' : 'Golden Raid'}</p>
                      <p className="text-sm text-slate-700">{isHi ? 'टाई होने पर विजेता तय करने के लिए।' : 'To determine winner in case of a tie.'}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-blue-100">
                      <p className="font-bold text-blue-900 mb-1">{isHi ? 'खाली रेड' : 'Empty Raid'}</p>
                      <p className="text-sm text-slate-700">{isHi ? 'यदि रेडर बिना अंक लिए लौटता है।' : 'If raider returns without scoring.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Scoring System */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '4. स्कोरिंग प्रणाली' : '4. Scoring System'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: isHi ? 'स्पर्श अंक' : 'Touch Point', pts: '01', desc: isHi ? 'प्रति खिलाड़ी' : 'Per player' },
                  { title: isHi ? 'बोनस अंक' : 'Bonus Point', pts: '01', desc: isHi ? '6+ खिलाड़ी पर' : 'With 6+ defenders' },
                  { title: isHi ? 'सुपर टैकल' : 'Super Tackle', pts: '02', desc: isHi ? '3 या कम खिलाड़ी' : '3 or fewer defenders' },
                  { title: isHi ? 'लोना (Lona)' : 'Lona (All Out)', pts: '02', desc: isHi ? 'पूरी टीम आउट' : 'Team All Out' },
                  { title: isHi ? 'तकनीकी अंक' : 'Technical', pts: '01', desc: isHi ? 'नियम उल्लंघन' : 'Rule violation' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center hover:border-orange-500 transition-colors group">
                    <div className="text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-wider">{item.title}</div>
                    <div className="text-3xl font-oswald font-bold text-blue-900 mb-1 group-hover:text-orange-500 transition-colors">{item.pts}</div>
                    <div className="text-[10px] font-medium text-slate-600">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-orange-500" />
                  {isHi ? 'स्कोरिंग विवरण' : 'Scoring Details'}
                </h4>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">
                  <p>
                    {isHi 
                      ? 'बोनस अंक केवल तब मिलता है जब विपक्षी टीम में 6 या 7 खिलाड़ी मैदान पर हों। रेडर का एक पैर बोनस लाइन के पार और दूसरा हवा में होना चाहिए।' 
                      : 'Bonus point is only awarded when there are 6 or 7 defenders on court. Raider must cross the bonus line with one foot while the other is in the air.'}
                  </p>
                  <p>
                    {isHi 
                      ? 'लोना (Lona) तब दिया जाता है जब एक टीम विपक्षी टीम के सभी खिलाड़ियों को आउट कर देती है। इसके लिए 2 अतिरिक्त अंक मिलते हैं।' 
                      : 'Lona is awarded when a team manages to put out the entire opposing team. 2 extra points are awarded for a Lona.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Raid Rules */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '5. रेड (आक्रमण) के नियम' : '5. Raid Rules'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {isHi ? '5.1 रेड प्रक्रिया' : '5.1 Raid Procedure'}
                  </h3>
                  <ul className="space-y-3">
                    {[
                      isHi ? 'रेडर को "कबड्डी-कबड्डी" का जाप (Cant) एक ही सांस में करना अनिवार्य है।' : 'Raider must maintain the "Kabaddi" cant in a single breath.',
                      isHi ? 'रेड 30 सेकंड के भीतर पूरी होनी चाहिए।' : 'Raid must be completed within 30 seconds.',
                      isHi ? 'रेडर को बॉक लाइन पार करनी होगी (सफल रेड के लिए)।' : 'Must cross baulk line for a valid raid.',
                      isHi ? 'संघर्ष (Struggle) शुरू होने के बाद लॉबी खेल क्षेत्र का हिस्सा बन जाती है।' : 'Lobbies become part of the court once a struggle begins.',
                      isHi ? 'वापसी के समय मध्य रेखा को शरीर के किसी भी हिस्से से छूना आवश्यक है।' : 'Must touch mid-line with any part of the body to return safely.'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                    {isHi ? 'डू-ऑर-डाई रेड' : 'Do-or-Die Raid'}
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {isHi 
                      ? 'लगातार दो खाली रेड के बाद तीसरी रेड "डू-ऑर-डाई" होती है। इसमें रेडर को अंक लेना अनिवार्य है, अन्यथा वह आउट माना जाएगा।' 
                      : 'After two consecutive empty raids, the third raid is "Do-or-Die". The raider must score a point or will be declared out.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Defending Rules */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '6. डिफेंस नियम एवं तकनीक' : '6. Defending Rules'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {isHi ? 'वैध तकनीकें' : 'Legal Techniques'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      isHi ? 'एंकल होल्ड' : 'Ankle Hold',
                      isHi ? 'थाई होल्ड' : 'Thigh Hold',
                      isHi ? 'वेस्ट होल्ड' : 'Waist Hold',
                      isHi ? 'चेन टैकल' : 'Chain Tackle',
                      isHi ? 'डैश' : 'Dash',
                      isHi ? 'ब्लॉक' : 'Block'
                    ].map((tech, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm font-bold text-blue-900">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {isHi ? 'डिफेंडर की गलतियाँ' : 'Defender Violations'}
                  </h3>
                  <ul className="space-y-3">
                    {[
                      isHi ? 'सीमा रेखा के बाहर पैर रखना।' : 'Stepping out of bounds.',
                      isHi ? 'रेडर के लौटने से पहले मध्य रेखा पार करना।' : 'Crossing mid-line prematurely.',
                      isHi ? 'अवैध पकड़ (बाल खींचना, मारना)।' : 'Illegal holds (hair, hitting).',
                      isHi ? 'गंभीर असदाचार।' : 'Unsportsmanlike conduct.'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Substitutions */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '7. सब्सटीट्यूशन' : '7. Substitution Rules'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-blue-900 uppercase tracking-wider text-sm">{isHi ? 'प्रक्रिया' : 'Procedure'}</h4>
                    <ul className="space-y-2">
                      <li className="text-slate-700 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>
                        {isHi ? 'केवल खेल रुके होने के दौरान संभव।' : 'Only during a break in play.'}
                      </li>
                      <li className="text-slate-700 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>
                        {isHi ? 'रेफरी की अनुमति अनिवार्य।' : 'Referee permission required.'}
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-blue-900 uppercase tracking-wider text-sm">{isHi ? 'प्रतिबंध' : 'Restrictions'}</h4>
                    <ul className="space-y-2">
                      <li className="text-slate-700 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {isHi ? 'सक्रिय रेड के दौरान मना।' : 'No substitution during active raid.'}
                      </li>
                      <li className="text-slate-700 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {isHi ? 'ड्रेस कोड का पालन आवश्यक।' : 'Must follow dress code.'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: Fouls & Cards */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '8. फाउल एवं कार्ड' : '8. Fouls & Cards'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { color: 'bg-green-500', title: isHi ? 'ग्रीन कार्ड' : 'Green Card', desc: isHi ? 'चेतावनी' : 'Warning' },
                  { color: 'bg-yellow-500', title: isHi ? 'येलो कार्ड' : 'Yellow Card', desc: isHi ? '2 मिनट निलंबन' : '2-min Suspension' },
                  { color: 'bg-red-500', title: isHi ? 'रेड कार्ड' : 'Red Card', desc: isHi ? 'मैच से बाहर' : 'Expulsion' },
                ].map((card, i) => (
                  <div key={i} className="p-6 rounded-xl border border-slate-200 text-center">
                    <div className={`w-12 h-16 ${card.color} mx-auto mb-4 rounded-md shadow-md`}></div>
                    <div className="font-bold text-blue-900 mb-1">{card.title}</div>
                    <div className="text-xs text-slate-700 font-medium uppercase">{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 9: Officials */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '9. मैच अधिकारी' : '9. Match Officials'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { role: isHi ? 'रेफरी' : 'Referee', count: '01' },
                  { role: isHi ? 'अंपायर' : 'Umpires', count: '02' },
                  { role: isHi ? 'स्कोरर' : 'Scorers', count: '02' },
                  { role: isHi ? 'कमिश्नर' : 'Commissioner', count: '01' },
                ].map((off, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-2xl font-oswald font-bold text-blue-900">{off.count}</div>
                    <div className="text-xs font-bold text-slate-700 uppercase">{off.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 10: Tie-Breaker */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
            <div className="bg-blue-900 px-8 py-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                {isHi ? '10. टाई-ब्रेक' : '10. Tie-Breaker'}
              </h2>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3">{isHi ? 'अतिरिक्त समय' : 'Extra Time'}</h4>
                  <p className="text-sm text-slate-700">{isHi ? '5-5 मिनट के दो हाफ खेले जाएंगे।' : 'Two halves of 5 minutes each will be played.'}</p>
                </div>
                <div className="flex-1 p-6 bg-orange-50 rounded-xl border border-orange-100">
                  <h4 className="font-bold text-blue-900 mb-3">{isHi ? 'गोल्डन रेड' : 'Golden Raid'}</h4>
                  <p className="text-sm text-slate-700">{isHi ? 'यदि फिर भी टाई रहे, तो गोल्डन रेड से विजेता तय होगा।' : 'If still tied, golden raid determines the winner.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DDKA Commitment */}
          <div className="bg-blue-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-oswald font-bold text-white mb-6 uppercase">
                {isHi ? 'DDKA की प्रतिबद्धता' : 'DDKA Commitment'}
              </h3>
              <p className="text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                {isHi
                  ? 'धनबाद जिला कबड्डी संघ (DDKA) AKFI द्वारा निर्धारित सभी नियमों का कठोरता से पालन करता है। हम निष्पक्ष खेल और उच्च स्तर की खेल भावना सुनिश्चित करते हैं।'
                  : 'Dhanbad District Kabaddi Association (DDKA) strictly adheres to all AKFI regulations. We ensure fair play and the highest standards of sportsmanship.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 uppercase tracking-wider text-sm"
                >
                  {isHi ? 'DDKA से जुड़ें' : 'Join DDKA'}
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 uppercase tracking-wider text-sm"
                >
                  {isHi ? 'संपर्क करें' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 text-sm">
              {isHi
                ? '© 2025 धनबाद जिला कबड्डी संघ (DDKA). सर्वाधिकार सुरक्षित।'
                : '© 2025 Dhanbad District Kabaddi Association (DDKA). All rights reserved.'}
            </p>
            <p className="text-slate-600 text-xs mt-2">
              {isHi
                ? 'AKFI (अमेचर कबड्डी फेडरेशन ऑफ इंडिया) विनियमों पर आधारित'
                : 'Based on Amateur Kabaddi Federation of India (AKFI) Regulations'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KabaddiRules;
