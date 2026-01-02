import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Users, Clock, Target, Shield, AlertCircle, CheckCircle } from 'lucide-react';
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
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-2xl mb-6">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              {isHi ? 'DDKA कबड्डी नियमावली' : 'DDKA Kabaddi Rules'}
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {isHi
              ? 'धनबाद जिला कबड्डी संघ (DDKA) द्वारा अपनाए गए कबड्डी के आधिकारिक नियम और विनियम, जो अमेचर कबड्डी फेडरेशन ऑफ इंडिया (AKFI) के मानकों के अनुरूप हैं।'
              : 'Official Kabaddi rules and regulations followed by Dhanbad District Kabaddi Association (DDKA), aligned with Amateur Kabaddi Federation of India (AKFI) standards.'}
          </p>
          <p className="text-sm text-slate-500 mt-4">
            {isHi
              ? 'AKFI (अमेचर कबड्डी फेडरेशन ऑफ इंडिया) विनियमों के आधार पर'
              : 'Based on Amateur Kabaddi Federation of India (AKFI) Regulations'}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Trophy className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {isHi ? 'कबड्डी के बारे में' : 'About Kabaddi'}
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                {isHi
                  ? 'कबड्डी भारत की प्राचीन खेल परंपरा से निकला एक संपर्क टीम खेल है। इसमें कुश्ती, टैग और दोनों तरह के कौशल – आक्रमण (रेड) और बचाव (डिफेंस) – शामिल होते हैं। खेल दो टीमों के बीच खेला जाता है, प्रत्येक टीम में सात खिलाड़ी मैदान पर होते हैं। उद्देश्य यह है कि रेडर विरोधी आधे हिस्से में जाकर अधिक से अधिक डिफेंडरों को स्पर्श करे और पकड़ में आए बिना अपनी आधी में सुरक्षित लौट आए।'
                  : 'Kabaddi is a contact team sport that originated in ancient India. It combines elements of wrestling and tag, and requires both offensive and defensive skills. The game is played between two teams of seven players each, with the objective of scoring points by raiding the opponent\'s half and touching as many defenders as possible without getting caught.'}
              </p>
              <p className="text-slate-300 leading-relaxed">
                {isHi
                  ? 'DDKA, AKFI द्वारा निर्धारित सभी नियमों और झारखंड राज्य कबड्डी संघ के दिशा-निर्देशों का पालन करते हुए निष्पक्ष खेल, खेल भावना और मानकीकृत प्रतियोगिता सुनिश्चित करता है।'
                  : 'DDKA follows all rules and regulations established by the Amateur Kabaddi Federation of India (AKFI) and Jharkhand State Kabaddi Association to ensure fair play, sportsmanship, and standardized competition at district level.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Court Specifications */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '1. मैदान के माप एवं विन्यास' : '1. Court Specifications & Measurements'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-blue-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '1.1 मैदान के आयाम' : '1.1 Court Dimensions'}
              </h3>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <ul className="space-y-2">
                  <li>
                    <strong className="text-white">{isHi ? 'कुल लंबाई:' : 'Total Length:'}</strong>{' '}
                    {isHi ? 'पुरुष वर्ग के लिए 13 मीटर / महिला और जूनियर वर्ग के लिए 12 मीटर' : '13 meters (for men) / 12 meters (for women and juniors)'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'कुल चौड़ाई:' : 'Total Width:'}</strong>{' '}
                    {isHi ? '10 मीटर' : '10 meters'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'मध्य रेखा:' : 'Mid Line:'}</strong>{' '}
                    {isHi ? 'मैदान को दो बराबर हिस्सों में विभाजित करती है' : 'Divides the court into two equal halves'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'बॉक लाइन:' : 'Baulk Line:'}</strong>{' '}
                    {isHi ? 'पुरुष वर्ग के लिए मध्य रेखा से 3.75 मीटर / महिला और जूनियर वर्ग के लिए 3 मीटर' : '3.75 meters from the mid line (men) / 3 meters (women & juniors)'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'बोनस लाइन:' : 'Bonus Line:'}</strong>{' '}
                    {isHi ? 'बॉक लाइन से 1 मीटर की दूरी पर' : '1 meter from the baulk line'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'एंड लाइन:' : 'End Line:'}</strong>{' '}
                    {isHi ? 'प्रत्येक आधे हिस्से की पीछे की सीमा रेखा' : 'Back boundary of each half'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-blue-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '1.2 मैदान की रेखाएँ' : '1.2 Court Markings'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'सभी रेखाएँ 5 सेमी चौड़ी और स्पष्ट रूप से चिन्हित होनी चाहिए।'
                    : 'All lines must be 5 cm wide and clearly marked.'}
                </li>
                <li>
                  {isHi
                    ? 'लॉबी क्षेत्र: दोनों किनारों पर 1 मीटर तथा दोनों छोर पर 2 मीटर (अनुशंसित)।'
                    : 'Lobby areas: 1 meter on both sides, 2 meters at the ends (optional but recommended).'}
                </li>
                <li>
                  {isHi
                    ? 'सभी रेखाएँ खेल क्षेत्र का हिस्सा मानी जाएँगी।'
                    : 'Lines are considered part of the playing area.'}
                </li>
                <li>
                  {isHi
                    ? 'मैदान की सतह समतल, मुलायम और किसी भी खतरनाक वस्तु से मुक्त होनी चाहिए।'
                    : 'Court surface must be flat, soft, and free from any dangerous objects.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Team Composition */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '2. टीम संरचना एवं खिलाड़ी' : '2. Team Composition & Player Requirements'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-green-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '2.1 टीम संरचना' : '2.1 Team Structure'}
              </h3>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <ul className="space-y-2">
                  <li>
                    <strong className="text-white">{isHi ? 'प्लेइंग सेवन:' : 'Playing Seven:'}</strong>{' '}
                    {isHi ? 'एक समय में मैदान पर 7 खिलाड़ी' : '7 players on court at a time'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'सब्सटीट्यूट:' : 'Substitutes:'}</strong>{' '}
                    {isHi ? 'अधिकतम 5 अतिरिक्त खिलाड़ी' : 'Maximum 5 substitute players'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'कुल दल:' : 'Total Squad:'}</strong>{' '}
                    {isHi ? 'प्रति टीम अधिकतम 12 खिलाड़ी' : '12 players per team'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'कप्तान:' : 'Captain:'}</strong>{' '}
                    {isHi ? 'एक खिलाड़ी को टीम कप्तान नामित किया जाएगा' : 'One player designated as team captain'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'कोच:' : 'Coach:'}</strong>{' '}
                    {isHi ? 'प्रत्येक टीम के लिए एक कोच, निर्धारित क्षेत्र में' : 'One coach per team allowed in the designated area'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-green-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '2.2 खिलाड़ी की भूमिकाएँ' : '2.2 Player Positions'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>{isHi ? 'रेडर:' : 'Raiders:'}</strong>{' '}
                  {isHi ? 'आक्रमण करने वाले खिलाड़ी जो विपक्षी आधे में जाकर अंक बनाते हैं।' : 'Offensive players who enter opponent\'s half to score points.'}
                </li>
                <li>
                  <strong>{isHi ? 'डिफेंडर / एंटी:' : 'Defenders/Antis:'}</strong>{' '}
                  {isHi ? 'रक्षा करने वाले खिलाड़ी, जो रेडर को अंक बनाने से रोकते हैं।' : 'Defensive players who prevent raiders from scoring.'}
                </li>
                <li>
                  <strong>{isHi ? 'ऑल-राउंडर:' : 'All-Rounders:'}</strong>{' '}
                  {isHi ? 'ऐसे खिलाड़ी जो रेड और डिफेंस दोनों में सक्षम हों।' : 'Players proficient in both raiding and defending.'}
                </li>
                <li>
                  <strong>{isHi ? 'लेफ्ट कॉर्नर:' : 'Left Corner:'}</strong>{' '}
                  {isHi ? 'मैदान के बाएँ कोने पर स्थित डिफेंडर।' : 'Defender positioned at left corner of court.'}
                </li>
                <li>
                  <strong>{isHi ? 'राइट कॉर्नर:' : 'Right Corner:'}</strong>{' '}
                  {isHi ? 'मैदान के दाएँ कोने पर स्थित डिफेंडर।' : 'Defender positioned at right corner of court.'}
                </li>
                <li>
                  <strong>{isHi ? 'कवर डिफेंडर:' : 'Cover Defenders:'}</strong>{' '}
                  {isHi ? 'मध्य भाग में खेलते हुए मुख्य रक्षात्मक खिलाड़ी।' : 'Central defensive players.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-green-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '2.3 खिलाड़ियों की वेशभूषा' : '2.3 Player Uniform Requirements'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'खिलाड़ियों को 1 से 12 तक की स्पष्ट जर्सी संख्या आगे और पीछे दोनों ओर प्रदर्शित करनी होगी।'
                    : 'Players must wear numbered jerseys (1-12) clearly visible front and back.'}
                </li>
                <li>
                  {isHi
                    ? 'शॉर्ट्स घुटने से ऊपर और खेल के अनुकूल होने चाहिए।'
                    : 'Shorts must be above the knee and comfortable for movement.'}
                </li>
                <li>
                  {isHi
                    ? 'खिलाड़ियों को नंगे पाँव खेलना होगा (जूते या मोज़े मान्य नहीं)।'
                    : 'Players must play barefoot (no shoes or socks allowed).'}
                </li>
                <li>
                  {isHi
                    ? 'खेल के दौरान कोई आभूषण, घड़ी या नुकीली वस्तु पहनना निषिद्ध है।'
                    : 'No jewelry, watches, or sharp objects permitted during play.'}
                </li>
                <li>
                  {isHi
                    ? 'पूरी टीम की ड्रेस एक जैसी रंग और डिज़ाइन की होनी चाहिए।'
                    : 'Team uniforms must be of the same color and design.'}
                </li>
                <li>
                  {isHi
                    ? 'जर्सी पर अंक (नंबर) कम से कम 10 सेमी ऊँचे होने चाहिए।'
                    : 'Numbers must be at least 10 cm in height.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Game Duration */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '3. मैच अवधि एवं समय नियम' : '3. Game Duration & Time Rules'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-purple-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '3.1 मैच की अवधि' : '3.1 Match Duration'}
              </h3>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                <ul className="space-y-3">
                  <li>
                    <strong className="text-white">{isHi ? 'कुल अवधि:' : 'Total Duration:'}</strong>{' '}
                    {isHi ? '40 मिनट (प्रत्येक हाफ 20 मिनट)' : '40 minutes (20 minutes per half)'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'हाफ टाइम ब्रेक:' : 'Half-Time Break:'}</strong>{' '}
                    {isHi ? '5 मिनट' : '5 minutes'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'अतिरिक्त समय (यदि आवश्यक हो):' : 'Extra Time (if required):'}</strong>{' '}
                    {isHi ? 'प्रत्येक 5-5 मिनट के दो हाफ' : '2 halves of 5 minutes each'}
                  </li>
                  <li>
                    <strong className="text-white">{isHi ? 'गोल्डन रेड:' : 'Golden Raid:'}</strong>{' '}
                    {isHi ? 'अतिरिक्त समय के बाद भी स्कोर बराबर होने पर विजेता तय करने के लिए गोल्डन रेड।' : 'If still tied after extra time, golden raid determines winner.'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-purple-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '3.2 टाइम-आउट' : '3.2 Time-Outs'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'प्रत्येक टीम को एक मैच में अधिकतम 2 टाइम-आउट (प्रति हाफ 1) की अनुमति है।'
                    : 'Each team is allowed 2 time-outs per match (1 per half).'}
                </li>
                <li>
                  {isHi
                    ? 'प्रत्येक टाइम-आउट की अवधि 30 सेकंड होगी।'
                    : 'Each time-out lasts 30 seconds.'}
                </li>
                <li>
                  {isHi
                    ? 'टाइम-आउट केवल डेड बॉल (रेड के बीच) की स्थिति में लिया जा सकता है।'
                    : 'Time-outs can only be called when the ball is dead (between raids).'}
                </li>
                <li>
                  {isHi
                    ? 'केवल कप्तान या कोच ही टाइम-आउट का अनुरोध कर सकते हैं।'
                    : 'Only the captain or coach can request a time-out.'}
                </li>
                <li>
                  {isHi
                    ? 'पहले हाफ का बचा हुआ टाइम-आउट दूसरे हाफ में नहीं जोड़ा जाएगा।'
                    : 'Unused time-outs from first half cannot be carried to second half.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-purple-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '3.3 रेड समय सीमा' : '3.3 Raid Time Limits'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>{isHi ? 'रेड समय:' : 'Raid Time:'}</strong>{' '}
                  {isHi ? 'प्रत्येक रेड के लिए अधिकतम 30 सेकंड।' : '30 seconds maximum per raid.'}
                </li>
                <li>
                  {isHi
                    ? 'रेडर को 30 सेकंड के भीतर बॉक लाइन पार करनी होगी।'
                    : 'Raider must cross the baulk line within 30 seconds.'}
                </li>
                <li>
                  {isHi
                    ? 'ऐसा न करने पर वह "खाली रेड" मानी जाएगी और कोई अंक नहीं मिलेगा।'
                    : 'Failure to do so results in "Empty Raid" - no points awarded.'}
                </li>
                <li>
                  {isHi
                    ? 'संघर्ष या अन्य रोक के समय रेफरी की सीटी बजने पर घड़ी रोक दी जाती है।'
                    : 'Clock stops when referee blows whistle for struggle or other stoppages.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Scoring System */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/40 to-yellow-500/40 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '4. स्कोरिंग प्रणाली एवं अंक' : '4. Scoring System & Points'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-amber-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '4.1 रेड अंक' : '4.1 Raid Points'}
              </h3>
              <div className="space-y-3">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">
                    {isHi ? 'स्पर्श अंक:' : 'Touch Points:'}
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>
                      {isHi
                        ? '✓ रेडर द्वारा स्पर्श किए गए प्रत्येक डिफेंडर के लिए 1 अंक।'
                        : '✓ 1 point for each defender touched by raider.'}
                    </li>
                    <li>
                      {isHi
                        ? '✓ रेडर को बिना पकड़े अपनी आधी में सुरक्षित लौटना होगा।'
                        : '✓ Raider must return to own half without being tackled.'}
                    </li>
                    <li>
                      {isHi
                        ? '✓ एक ही रेड में कई खिलाड़ियों को छूने पर बहु-अंक मिलेंगे।'
                        : '✓ Multiple touches in single raid = multiple points.'}
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">
                    {isHi ? 'बोनस अंक:' : 'Bonus Points:'}
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>
                      {isHi
                        ? '✓ रेडर द्वारा बोनस लाइन पार करने पर 1 बोनस अंक।'
                        : '✓ 1 bonus point if raider crosses bonus line.'}
                    </li>
                    <li>
                      {isHi
                        ? '✓ विपक्षी टीम के मैदान पर कम से कम 6 डिफेंडर होने चाहिए।'
                        : '✓ Must have minimum 6 defenders on court.'}
                    </li>
                    <li>
                      {isHi
                        ? '✓ बोनस लेने से पहले रेडर किसी भी डिफेंडर को स्पर्श नहीं करेगा।'
                        : '✓ Must not touch any defender before crossing bonus line.'}
                    </li>
                    <li>
                      {isHi
                        ? '✓ दोनों पैर बोनस लाइन पार करें।'
                        : '✓ Both feet must cross the bonus line.'}
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">
                    {isHi ? 'टेक्निकल अंक:' : 'Technical Points:'}
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>
                      {isHi
                        ? '✓ यदि डिफेंडर टीम का कोई खिलाड़ी सीमा रेखा के बाहर चला जाए।'
                        : '✓ 1 point if defending team goes out of bounds.'}
                    </li>
                    <li>
                      {isHi
                        ? '✓ डिफेंडर टीम द्वारा फाउल करने पर।'
                        : '✓ 1 point if defending team commits a foul.'}
                    </li>
                    <li>
                      {isHi
                        ? '✓ "डू ऑर डाई" रेड से संबंधित तकनीकी अंक (नीचे वर्णित)।'
                        : '✓ 1 point for "do or die" raid (explained below).'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-amber-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '4.2 टैकल अंक' : '4.2 Tackle Points'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>{isHi ? 'सफल टैकल:' : 'Successful Tackle:'}</strong>{' '}
                  {isHi ? 'डिफेंडरों द्वारा रेडर को रोकने पर 1 अंक।' : '1 point when defenders catch/tackle the raider.'}
                </li>
                <li>
                  <strong>{isHi ? 'सुपर टैकल:' : 'Super Tackle:'}</strong>{' '}
                  {isHi
                    ? 'जब डिफेंडर टीम के केवल 3 या उससे कम खिलाड़ी रेडर को मिलकर पकड़ते हैं, तो 2 अंक।'
                    : '2 points if 3 or fewer defenders tackle the raider.'}
                </li>
                <li>
                  {isHi
                    ? 'रेडर को अपनी आधी में लौटने से रोकना आवश्यक है।'
                    : 'Raider must be prevented from returning to their half.'}
                </li>
                <li>
                  {isHi
                    ? 'टैकल होने पर रेडर "आउट" माना जाएगा और मैदान से बाहर जाएगा।'
                    : 'Tackled raider is declared "out" and leaves the court.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-amber-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '4.3 ऑल आउट' : '4.3 All Out'}
              </h3>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="font-semibold text-white mb-2">
                  {isHi
                    ? 'जब किसी टीम के सभी 7 खिलाड़ी आउट हो जाएँ:'
                    : 'When all 7 players of a team are out:'}
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    {isHi
                      ? '✓ विपक्षी टीम को 2 अतिरिक्त बोनस अंक (ऑल आउट पॉइंट) मिलते हैं।'
                      : '✓ Opposing team scores 2 additional bonus points (All Out Points).'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ "ऑल आउट" हुई टीम के सभी खिलाड़ी पुनः मैदान पर लौटते हैं।'
                      : '✓ All players of the team that was "all out" return to court.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ खेल सामान्य रूप से जारी रहता है।'
                      : '✓ Game continues normally.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ एक ही मैच में कई बार ऑल आउट हो सकता है।'
                      : '✓ Multiple all-outs can occur in a single match.'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-amber-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '4.4 खिलाड़ियों की वापसी (रीवाइवल)' : '4.4 Revival of Players'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'जब रेडर स्पर्श अंक बनाता है, तो उसकी टीम का एक आउट खिलाड़ी पुनः जीवित (रीवाइव) होता है।'
                    : 'When a raider scores a touch point, one out player from their team revives.'}
                </li>
                <li>
                  {isHi
                    ? 'रीवाइवल का क्रम उसी क्रम में होगा जिस क्रम में खिलाड़ी आउट हुए थे (पहले आउट, पहले इन)।'
                    : 'Players revive in the order they were declared out (first out, first in).'}
                </li>
                <li>
                  {isHi
                    ? 'रीवाइव खिलाड़ी तुरंत मैदान पर लौट आएगा।'
                    : 'Revived player returns to court immediately.'}
                </li>
                <li>
                  {isHi
                    ? 'केवल स्पर्श अंक से ही खिलाड़ी रीवाइव होंगे, बोनस अंक से नहीं।'
                    : 'Bonus points do not revive players.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5: Raiding Rules */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500/40 to-orange-500/40 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '5. रेड से संबंधित नियम' : '5. Raiding Rules & Regulations'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-red-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '5.1 काउंट (कबड्डी-कबड्डी बोलना)' : '5.1 Cant (Raiding Chant)'}
              </h3>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <ul className="space-y-2">
                  <li>
                    {isHi
                      ? '✓ रेडर को पूरे रेड के दौरान लगातार स्पष्ट रूप से "कबड्डी-कबड्डी" बोलते रहना होगा।'
                      : '✓ Raider must continuously chant "Kabaddi-Kabaddi" without pause.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ काउंट रेफरी को साफ़-साफ़ सुनाई देना चाहिए।'
                      : '✓ Must be clearly audible to the referee.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ काउंट एक ही सांस में होना चाहिए, बीच में सांस लेने पर काउंट टूट माना जाएगा।'
                      : '✓ Cant must be in one continuous breath.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ रेड के दौरान सांस लेने या काउंट टूटने पर रेडर तुरंत आउट माना जाएगा।'
                      : '✓ If raider takes a breath (breaks cant), they are declared out.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ काउंट शुरू होना मध्य रेखा पार करने से पहले आवश्यक है।'
                      : '✓ Cant must start before crossing the mid-line.'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-red-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '5.2 वैध रेड' : '5.2 Valid Raid'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'रेडर को कम से कम एक पैर के साथ बॉक लाइन पार करनी होगी।'
                    : 'Raider must cross the baulk line with at least one foot.'}
                </li>
                <li>
                  {isHi
                    ? 'पूरी रेड के दौरान काउंट निरंतर बनाए रखना होगा।'
                    : 'Must maintain continuous cant throughout the raid.'}
                </li>
                <li>
                  {isHi
                    ? 'रेडर को सीमा रेखा के बाहर नहीं जाना चाहिए।'
                    : 'Must not go out of bounds.'}
                </li>
                <li>
                  {isHi
                    ? 'रेडर को 30 सेकंड के भीतर अपनी आधी में लौटना होगा।'
                    : 'Must return to own half within 30 seconds.'}
                </li>
                <li>
                  {isHi
                    ? 'एक समय में केवल एक ही रेडर रेड कर सकता है।'
                    : 'Only one raider can raid at a time.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-red-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '5.3 डू-ऑर-डाई रेड' : '5.3 Do-or-Die Raid'}
              </h3>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                <p className="font-semibold text-white mb-2">
                  {isHi
                    ? 'जब कोई टीम लगातार दो खाली रेड कर लेती है:'
                    : 'Occurs when a team has two consecutive empty raids:'}
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    {isHi
                      ? '✓ तीसरी रेड "डू-ऑर-डाई" रेड बन जाती है।'
                      : '✓ Third raid becomes "Do-or-Die".'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ रेडर को अनिवार्य रूप से कम से कम 1 अंक बनाना होगा, अन्यथा वह आउट माना जाएगा।'
                      : '✓ Raider MUST score at least one point or be declared out.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ रेडर अंक बना लेता है तो खेल सामान्य रूप से जारी रहता है।'
                      : '✓ If raider scores, normal play continues.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ रेडर असफल रहने पर आउट माना जाएगा और डिफेंडर टीम को 1 अंक मिलेगा।'
                      : '✓ If raider fails, they are out and defending team gets 1 point.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ खाली रेड, केवल बोनस या केवल टेक्निकल अंक डू-ऑर-डाई की शर्त को पूरा नहीं करते।'
                      : '✓ Empty raid, bonus point, or technical point does NOT count as scoring.'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-red-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '5.4 रेडर से संबंधित उल्लंघन' : '5.4 Raider Violations'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>{isHi ? 'सीमा रेखा पार करना:' : 'Out of Bounds:'}</strong>{' '}
                  {isHi
                    ? 'रेडर द्वारा साइड या एंड लाइन पार करने पर वह आउट माना जाएगा।'
                    : 'If raider crosses side or end lines, they are out.'}
                </li>
                <li>
                  <strong>{isHi ? 'काउंट टूटना:' : 'Breaking Cant:'}</strong>{' '}
                  {isHi
                    ? 'रेड के दौरान सांस लेने या काउंट रुकने पर रेडर तुरंत आउट।'
                    : 'Taking a breath during raid results in immediate out.'}
                </li>
                <li>
                  <strong>{isHi ? 'संघर्ष की स्थिति:' : 'Struggling:'}</strong>{' '}
                  {isHi
                    ? 'यदि रेडर पकड़ा जाए और 5 सेकंड तक छूट न पाए तो रेफरी की सीटी पर निर्णय लिया जाएगा।'
                    : 'If raider is held and struggles for 5 seconds without escape.'}
                </li>
                <li>
                  <strong>{isHi ? 'समय सीमा पार करना:' : 'Time Out:'}</strong>{' '}
                  {isHi
                    ? '30 सेकंड के भीतर अपनी आधी में वापस न आना।'
                    : 'Failing to return within 30 seconds.'}
                </li>
                <li>
                  <strong>{isHi ? 'अवैध स्पर्श:' : 'Illegal Touch:'}</strong>{' '}
                  {isHi
                    ? 'रेडर द्वारा किसी भी प्रकार से अनुचित / खतरनाक तरीके से स्पर्श करना।'
                    : 'Using unfair means to touch defenders.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 6: Defending Rules */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '6. डिफेंस नियम एवं तकनीक' : '6. Defending Rules & Techniques'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-cyan-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '6.1 वैध रक्षात्मक तकनीकें' : '6.1 Legal Defense Techniques'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>{isHi ? 'एंकल होल्ड:' : 'Ankle Hold:'}</strong>{' '}
                  {isHi ? 'रेडर के टखने को पकड़कर उसे रोकना।' : "Grabbing raider's ankle to prevent escape."}
                </li>
                <li>
                  <strong>{isHi ? 'थाई होल्ड:' : 'Thigh Hold:'}</strong>{' '}
                  {isHi ? 'जांघ को पकड़कर रेडर की गति रोकना।' : "Holding raider's thigh."}
                </li>
                <li>
                  <strong>{isHi ? 'वेस्ट होल्ड:' : 'Waist Hold:'}</strong>{' '}
                  {isHi ? 'कमर पकड़कर रेडर को नियंत्रित करना।' : "Gripping raider's waist."}
                </li>
                <li>
                  <strong>{isHi ? 'ब्लॉक:' : 'Block:'}</strong>{' '}
                  {isHi ? 'शरीर से रास्ता रोककर रेडर की वापसी रोकना।' : "Using body to block raider's path."}
                </li>
                <li>
                  <strong>{isHi ? 'चेन टैकल:' : 'Chain Tackle:'}</strong>{' '}
                  {isHi ? 'कई डिफेंडरों द्वारा मिलकर समन्वित टैकल करना।' : 'Multiple defenders coordinating to tackle.'}
                </li>
                <li>
                  <strong>{isHi ? 'डैश:' : 'Dash:'}</strong>{' '}
                  {isHi ? 'तेज़ धक्का देकर रेडर को सीमा रेखा से बाहर भेजना।' : 'Quick push to send raider out of bounds.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-cyan-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '6.2 डिफेंडर की उल्लंघनाएँ' : '6.2 Defender Violations'}
              </h3>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
                <p className="font-semibold text-white mb-2">
                  {isHi
                    ? 'निम्न स्थितियों में डिफेंडर आउट माना जाएगा:'
                    : 'Defenders will be declared OUT if they:'}
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    {isHi
                      ? '✗ टैकल करते समय सीमा रेखा के बाहर चले जाएँ।'
                      : '✗ Step out of bounds while attempting to tackle.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ रेडर के लौटने से पहले मध्य रेखा पार कर लें।'
                      : '✗ Cross the mid-line before raider returns.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ बॉक लाइन पार करने से पहले रेडर को पकड़ लें।'
                      : '✗ Hold raider before they cross the baulk line.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ अवैध पकड़ – बाल खींचना, मारना, लात मारना आदि।'
                      : '✗ Use illegal holds (hair pulling, hitting, kicking).'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ किसी भी प्रकार का गंभीर असदाचार / अस्पोर्ट्समैनशिप।'
                      : '✗ Commit unsportsmanlike conduct.'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-cyan-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '6.3 संघर्ष (Struggle) नियम' : '6.3 Struggling Rule'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'जब रेडर को पकड़ा जाता है, रेफरी पूरे संघर्ष पर नज़र रखते हैं।'
                    : 'When raider is held, referee monitors the struggle.'}
                </li>
                <li>
                  {isHi
                    ? 'यदि 5 सेकंड से अधिक संघर्ष होता है और कोई स्पष्ट प्रगति नहीं होती, तो रेफरी सीटी बजाते हैं।'
                    : 'If struggle exceeds 5 seconds with no progress, whistle is blown.'}
                </li>
                <li>
                  {isHi
                    ? 'रेफरी स्थिति के आधार पर निर्णय लेते हैं कि अंक किस पक्ष को दिया जाए।'
                    : 'Referee decides which side gets the point based on advantage.'}
                </li>
                <li>
                  {isHi
                    ? 'आमतौर पर वह टीम लाभ में मानी जाती है जिसके पास पकड़ में स्पष्ट नियंत्रण हो।'
                    : 'Usually awarded to the side with better position at whistle.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 7: Substitutions */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/40 to-purple-500/40 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '7. सब्सटीट्यूशन (खिलाड़ियों का बदलाव)' : '7. Substitution Rules'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-indigo-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '7.1 सब्सटीट्यूशन प्रक्रिया' : '7.1 Substitution Procedure'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'मैच के दौरान आवश्यकता अनुसार कई बार सब्सटीट्यूशन किया जा सकता है।'
                    : 'Unlimited substitutions allowed during the match.'}
                </li>
                <li>
                  {isHi
                    ? 'सब्सटीट्यूशन केवल खेल रुके होने की स्थिति (डेड बॉल) में ही किया जा सकता है।'
                    : 'Substitutions can only be made when play is stopped (dead ball).'}
                </li>
                <li>
                  {isHi
                    ? 'सब्सटीट्यूट खिलाड़ी केवल निर्धारित सब्सटीट्यूशन ज़ोन से ही प्रवेश करेगा।'
                    : 'Substitute must enter from the designated substitution zone.'}
                </li>
                <li>
                  {isHi
                    ? 'जिस खिलाड़ी को बदला जा रहा है, उसके पूरी तरह बाहर जाने के बाद ही नया खिलाड़ी अंदर आएगा।'
                    : 'Player being substituted must leave the court before substitute enters.'}
                </li>
                <li>
                  {isHi
                    ? 'केवल कप्तान या कोच ही सब्सटीट्यूशन का अनुरोध कर सकते हैं।'
                    : 'Only captain or coach can request substitution.'}
                </li>
                <li>
                  {isHi
                    ? 'रेफरी को सूचित करना और उनकी अनुमति लेना अनिवार्य है।'
                    : 'Referee must be informed and must approve the substitution.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-indigo-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '7.2 सब्सटीट्यूशन पर प्रतिबंध' : '7.2 Substitution Restrictions'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'जिस खिलाड़ी को बाहर किया गया है, उसे बाद में दोबारा भी मैदान में लाया जा सकता है (मल्टीपल सब्सटीट्यूशन)।'
                    : 'Substituted player can re-enter the game later (multiple substitutions allowed).'}
                </li>
                <li>
                  {isHi
                    ? 'सक्रिय रेड या खेल के दौरान सब्सटीट्यूशन नहीं किया जाएगा।'
                    : 'No substitution during active play or raid.'}
                </li>
                <li>
                  {isHi
                    ? 'सब्सटीट्यूट खिलाड़ी का ड्रेस कोड और जर्सी नंबर वैध होना चाहिए।'
                    : 'Substitute must wear proper uniform with valid number.'}
                </li>
                <li>
                  {isHi
                    ? 'चोटिल खिलाड़ी को किसी भी ब्रेक या डेड बॉल के समय रेफरी की अनुमति से बदला जा सकता है।'
                    : 'Injured player can be substituted at any stoppage with referee permission.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 8: Fouls & Penalties */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500/40 to-pink-500/40 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '8. फाउल, पेनल्टी एवं कार्ड' : '8. Fouls, Penalties & Cards'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-red-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '8.1 तकनीकी फाउल' : '8.1 Technical Fouls'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi ? 'सीटी से पहले मैदान में प्रवेश करना।' : 'Entering court before whistle.'}
                </li>
                <li>
                  {isHi
                    ? 'निर्धारित टीम क्षेत्र से बिना अनुमति बाहर जाना।'
                    : 'Leaving designated team area without permission.'}
                </li>
                <li>
                  {isHi
                    ? 'रेफरी से बहस करना या असहमति दिखाना।'
                    : 'Arguing with referee or showing dissent.'}
                </li>
                <li>
                  {isHi
                    ? 'जानबूझकर खेल में देरी करना।'
                    : 'Delaying the game intentionally.'}
                </li>
                <li>
                  {isHi
                    ? 'अशोभनीय भाषा या इशारों का प्रयोग।'
                    : 'Using abusive language or gestures.'}
                </li>
                <li>
                  {isHi
                    ? 'गलत / अपूर्ण वेशभूषा या उपकरण।'
                    : 'Incorrect uniform or equipment.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-red-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '8.2 कार्ड प्रणाली' : '8.2 Card System'}
              </h3>
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-semibold text-green-400 mb-2">
                    {isHi ? '🟢 ग्रीन कार्ड (चेतावनी)' : '🟢 GREEN CARD (Warning)'}
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>
                      {isHi
                        ? '• हल्की पहली गलती पर चेतावनी।'
                        : '• First offense for minor violations.'}
                    </li>
                    <li>
                      {isHi
                        ? '• आधिकारिक चेतावनी दर्ज की जाती है।'
                        : '• Official warning recorded.'}
                    </li>
                    <li>
                      {isHi
                        ? '• कोई अंक दंड नहीं।'
                        : '• No point penalty.'}
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-semibold text-yellow-400 mb-2">
                    {isHi ? '🟨 येलो कार्ड (दंड)' : '🟨 YELLOW CARD (Penalty)'}
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>
                      {isHi
                        ? '• दूसरी गलती या मध्यम स्तर के उल्लंघन पर।'
                        : '• Second offense or moderate violation.'}
                    </li>
                    <li>
                      {isHi
                        ? '• विपक्षी टीम को 1 पेनल्टी अंक।'
                        : '• Opposing team awarded 1 penalty point.'}
                    </li>
                    <li>
                      {isHi
                        ? '• खिलाड़ी खेल में बना रह सकता है।'
                        : '• Player can continue playing.'}
                    </li>
                    <li>
                      {isHi
                        ? '• आगे उल्लंघन होने पर रेड कार्ड दिया जा सकता है।'
                        : '• Further violations may lead to red card.'}
                    </li>
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-semibold text-red-400 mb-2">
                    {isHi ? '🟥 रेड कार्ड (निष्कासन)' : '🟥 RED CARD (Expulsion)'}
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>
                      {isHi
                        ? '• गंभीर उल्लंघन या तीसरी बार गलती पर।'
                        : '• Serious violation or third offense.'}
                    </li>
                    <li>
                      {isHi
                        ? '• खिलाड़ी को पूरे मैच से निष्कासित किया जाता है।'
                        : '• Player expelled from the match.'}
                    </li>
                    <li>
                      {isHi
                        ? '• विपक्षी टीम को 2 पेनल्टी अंक दिए जाते हैं।'
                        : '• Opposing team awarded 2 penalty points.'}
                    </li>
                    <li>
                      {isHi
                        ? '• टीम एक खिलाड़ी कम के साथ खेलेगी (यदि वैध सब्सटीट्यूट उपलब्ध न हो)।'
                        : '• Team plays with one less player (unless substitute available).'}
                    </li>
                    <li>
                      {isHi
                        ? '• खिलाड़ी पर आगे अनुशासनात्मक कार्रवाई भी हो सकती है।'
                        : '• Player may face further disciplinary action.'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-red-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '8.3 गंभीर उल्लंघन' : '8.3 Serious Violations'}
              </h3>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="font-semibold text-white mb-2">
                  {isHi ? 'तुरंत रेड कार्ड योग्य अपराध:' : 'Immediate Red Card Offenses:'}
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    {isHi
                      ? '✗ शारीरिक हिंसा या लड़ाई करना।'
                      : '✗ Physical violence or fighting.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ जानबूझकर विपक्षी खिलाड़ी को चोट पहुँचाना।'
                      : '✗ Deliberately injuring opponent.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ रेफरी को गाली देना या धमकी देना।'
                      : '✗ Abusing or threatening referee.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ प्रतिबंधित / नशीले पदार्थों का सेवन।'
                      : '✗ Use of prohibited substances.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ मैच फिक्सिंग या किसी प्रकार का भ्रष्ट आचरण।'
                      : '✗ Match-fixing or corruption.'}
                  </li>
                  <li>
                    {isHi
                      ? '✗ अत्यधिक असदाचार या खेल की भावना के विपरीत व्यवहार।'
                      : '✗ Extreme unsportsmanlike conduct.'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 9: Match Officials */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500/40 to-green-500/40 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-teal-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '9. मैच अधिकारी एवं कर्तव्य' : '9. Match Officials & Their Duties'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-teal-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '9.1 रेफरी (मुख्य अधिकारी)' : '9.1 Referee (Center Official)'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'मैच से संबंधित सभी निर्णयों के लिए सर्वोच्च अधिकृत अधिकारी।'
                    : 'Primary authority for all match decisions.'}
                </li>
                <li>
                  {isHi
                    ? 'रेडर के काउंट और हरकतों पर नज़र रखना।'
                    : "Monitors raider's cant and movements."}
                </li>
                <li>
                  {isHi
                    ? 'खिलाड़ियों को "इन" या "आउट" घोषित करना।'
                    : "Declares players 'in' or 'out'."}
                </li>
                <li>
                  {isHi
                    ? 'अंकों का निर्धारण करना और नियमों को लागू करना।'
                    : 'Awards points and enforces rules.'}
                </li>
                <li>
                  {isHi
                    ? 'फाउल या असदाचार की स्थिति में कार्ड जारी करना।'
                    : 'Issues cards for violations.'}
                </li>
                <li>
                  {isHi
                    ? 'मैच की गति और समय का प्रबंधन करना।'
                    : 'Manages game flow and timing.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-teal-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '9.2 अंपायर (2 अधिकारी)' : '9.2 Umpires (2 Officials)'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'रेफरी की सहायता करते हुए निर्णयों में सहयोग करना।'
                    : 'Assist referee in decision making.'}
                </li>
                <li>
                  {isHi
                    ? 'अपनी-अपनी साइड की सीमा रेखाओं की निगरानी करना।'
                    : 'Monitor boundary lines on their side.'}
                </li>
                <li>
                  {isHi
                    ? 'खिलाड़ियों के सीमा रेखा से बाहर जाने पर संकेत देना।'
                    : 'Signal when players go out of bounds.'}
                </li>
                <li>
                  {isHi
                    ? 'फाउल और उल्लंघनों पर नज़र रखना।'
                    : 'Watch for fouls and violations.'}
                </li>
                <li>
                  {isHi
                    ? 'मैदान पर अनुशासन बनाए रखने में मदद करना।'
                    : 'Help maintain order on court.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-teal-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '9.3 स्कोरर (2 अधिकारी)' : '9.3 Scorers (2 Officials)'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'आधिकारिक स्कोर शीट का रख-रखाव।'
                    : 'Maintain official score sheet.'}
                </li>
                <li>
                  {isHi
                    ? 'सभी अंक, रेड और टैकल का रिकॉर्ड रखना।'
                    : 'Record all points, raids, and tackles.'}
                </li>
                <li>
                  {isHi
                    ? 'खिलाड़ियों के सब्सटीट्यूशन की जानकारी दर्ज करना।'
                    : 'Track player substitutions.'}
                </li>
                <li>
                  {isHi
                    ? 'टाइम-आउट और कार्ड का रिकॉर्ड रखना।'
                    : 'Record time-outs and cards.'}
                </li>
                <li>
                  {isHi
                    ? 'इलेक्ट्रॉनिक स्कोरबोर्ड का संचालन करना (यदि उपलब्ध हो)।'
                    : 'Manage electronic scoreboard.'}
                </li>
              </ul>
            </div>

            <div className="pl-6 border-l-2 border-teal-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '9.4 मैच कमिश्नर' : '9.4 Match Commissioner'}
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  {isHi
                    ? 'पूरे मैच की समग्र देखरेख और पर्यवेक्षण।'
                    : 'Overall supervisor of the match.'}
                </li>
                <li>
                  {isHi
                    ? 'सभी नियमों एवं विनियमों के पालन को सुनिश्चित करना।'
                    : 'Ensures compliance with regulations.'}
                </li>
                <li>
                  {isHi
                    ? 'ऐसे विवादों का निपटारा जो खेल नियमों में स्पष्ट न हों।'
                    : 'Resolves disputes not covered by playing rules.'}
                </li>
                <li>
                  {isHi
                    ? 'प्रशासनिक मामलों में अंतिम अधिकार।'
                    : 'Has final authority on administrative matters.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 10: Tie-Breakers */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/40 to-red-500/40 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '10. टाई-ब्रेक की प्रक्रिया' : '10. Tie-Breaking Procedures'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-orange-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '10.1 नियमित समय समाप्ति पर' : '10.1 End of Regular Time'}
              </h3>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                <p className="font-semibold text-white mb-2">
                  {isHi
                    ? 'यदि 40 मिनट के बाद दोनों टीमों का स्कोर बराबर हो:'
                    : 'If scores are tied after 40 minutes:'}
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>{isHi ? 'चरण 1:' : 'Step 1:'}</strong>{' '}
                    {isHi ? '5 मिनट का ब्रेक।' : '5-minute break.'}
                  </li>
                  <li>
                    <strong>{isHi ? 'चरण 2:' : 'Step 2:'}</strong>{' '}
                    {isHi
                      ? 'अतिरिक्त समय – प्रत्येक 5-5 मिनट के दो हाफ (कुल 10 मिनट)।'
                      : 'Extra time - Two halves of 5 minutes each (10 minutes total).'}
                  </li>
                  <li>
                    <strong>{isHi ? 'चरण 3:' : 'Step 3:'}</strong>{' '}
                    {isHi ? 'अतिरिक्त समय के दोनों हाफ के बीच 1 मिनट का ब्रेक।' : '1-minute break between extra time halves.'}
                  </li>
                  <li>
                    <strong>{isHi ? 'चरण 4:' : 'Step 4:'}</strong>{' '}
                    {isHi
                      ? 'दूसरे अतिरिक्त हाफ से पहले दोनों टीमों के आधे हिस्से बदल दिए जाते हैं।'
                      : 'Teams switch sides for second extra time half.'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="pl-6 border-l-2 border-orange-500/50">
              <h3 className="text-xl font-semibold text-white mb-3">
                {isHi ? '10.2 गोल्डन रेड' : '10.2 Golden Raid'}
              </h3>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="font-semibold text-white mb-2">
                  {isHi
                    ? 'यदि अतिरिक्त समय के बाद भी स्कोर बराबर रहे:'
                    : 'If still tied after extra time:'}
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    {isHi
                      ? '✓ टॉस से तय होगा कि पहली रेड कौन-सी टीम करेगी।'
                      : '✓ Toss decides which team raids first.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ दोनों टीमें बारी-बारी से एक-एक रेड करेंगी।'
                      : '✓ Teams alternate raids (one raid each).'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ जो भी टीम पहले कोई भी अंक बना लेगी, वही विजेता घोषित होगी।'
                      : '✓ First team to score ANY point wins the match.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ यदि पहली रेड में ही रेडर अंक बना ले, तो मैच तुरंत समाप्त।'
                      : '✓ If first raider scores - match ends immediately.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ यदि पहली रेड में अंक न बने, तो दूसरी टीम को मौका मिलेगा।'
                      : "✓ If first raider doesn't score - second team gets chance."}
                  </li>
                  <li>
                    {isHi
                      ? '✓ यह सिलसिला तब तक चलता रहेगा जब तक किसी टीम द्वारा अंक नहीं बनाया जाता।'
                      : '✓ Continues until one team scores.'}
                  </li>
                  <li>
                    {isHi
                      ? '✓ स्पर्श अंक, टैकल अंक, बोनस अंक या टेक्निकल अंक – सभी मान्य होंगे।'
                      : '✓ Touch point, tackle point, bonus point, or technical point - all count.'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* DDKA Compliance */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Trophy className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {isHi ? 'DDKA की प्रतिबद्धता' : 'DDKA Commitment'}
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                {isHi
                  ? 'धनबाद जिला कबड्डी संघ (DDKA) अमेचर कबड्डी फेडरेशन ऑफ इंडिया (AKFI) तथा झारखंड राज्य कबड्डी संघ द्वारा निर्धारित सभी नियमों और विनियमों का कठोरता से पालन करता है। हम सुनिश्चित करते हैं कि हमारे सभी खिलाड़ी, कोच और अधिकारी इन नियमों से भली-भांति परिचित हों ताकि निष्पक्ष खेल और उच्च स्तर की खेल भावना बनी रहे।'
                  : 'Dhanbad District Kabaddi Association (DDKA) strictly adheres to all rules and regulations established by the Amateur Kabaddi Federation of India (AKFI) and Jharkhand State Kabaddi Association. We ensure that all our members, coaches, and officials are well-versed in these rules to maintain the highest standards of fair play and sportsmanship.'}
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                {isHi
                  ? 'DDKA द्वारा आयोजित सभी प्रशिक्षण सत्र, अभ्यास मैच और टूर्नामेंट AKFI और राज्य संघ के दिशा-निर्देशों के अनुसार संचालित किए जाते हैं। हमारा विश्वास है कि खिलाड़ी केवल कौशल में ही नहीं, बल्कि खेल के नियमों और उसकी भावना को समझने और उसका सम्मान करने में भी उत्कृष्ट हों।'
                  : 'All training sessions, practice matches, and tournaments organized by DDKA follow AKFI and state association guidelines. We believe in developing players who not only excel in skills but also understand and respect the spirit of the game.'}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                >
                  {isHi ? 'DDKA से जुड़ें' : 'Join DDKA'}
                </Link>
                <Link
                  to="/terms-conditions"
                  className="inline-flex items-center px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300"
                >
                  {isHi ? 'नियम एवं शर्तें देखें' : 'View Terms & Conditions'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            {isHi
              ? 'ये नियम मुख्य रूप से AKFI (अमेचर कबड्डी फेडरेशन ऑफ इंडिया) विनियमों पर आधारित हैं।'
              : 'These rules are based on AKFI (Amateur Kabaddi Federation of India) regulations.'}
          </p>
          <p className="mt-2">
            {isHi
              ? 'अधिकृत AKFI दस्तावेज़ों और नवीनतम अपडेट के लिए कृपया AKFI की आधिकारिक वेबसाइट देखें।'
              : 'For official AKFI documentation and updates, please visit the AKFI official website.'}
          </p>
          <p className="mt-2">
            {isHi
              ? '© 2025 धनबाद जिला कबड्डी संघ (DDKA). सर्वाधिकार सुरक्षित.'
              : '© 2025 Dhanbad District Kabaddi Association (DDKA). All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default KabaddiRules;
