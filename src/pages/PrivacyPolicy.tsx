import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Language } from '../translations';

const PrivacyPolicy: React.FC<{ lang: Language }> = ({ lang }) => {
  const isHi = lang === 'hi';
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-2xl mb-6">
            <Shield className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {isHi ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy'}
            </span>
          </h1>
          {!isHi && (
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Dhanbad District Kabaddi Association (DDKA) is committed to protecting the personal information of all registered members and institutions.
            </p>
          )}
          {isHi && (
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              धनबाद जिला कबड्डी एसोसिएशन (DDKA) सभी पंजीकृत खिलाड़ियों और संस्थानों की व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध है।
            </p>
          )}
          <p className="text-sm text-slate-500 mt-4">Last Updated: January 1, 2026</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="text-slate-300 space-y-4">
            {!isHi && (
              <>
                <p className="text-lg leading-relaxed">
                  This Privacy Policy explains how DDKA ("we", "us" or "our") collects, uses, stores and safeguards the information that you provide when you register as a player or institution, participate in our activities, or use our digital platforms.
                </p>
                <p className="leading-relaxed">
                  By submitting a registration form or continuing to use DDKA services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with any part of it, you should not complete registration or should request cancellation of membership.
                </p>
              </>
            )}
            {isHi && (
              <p className="leading-relaxed text-sm text-slate-300">
                यह प्राइवेसी पॉलिसी बताती है कि DDKA आपके द्वारा खिलाड़ी या संस्थान के रूप में पंजीकरण, हमारी गतिविधियों में भागीदारी या डिजिटल प्लेटफ़ॉर्म के उपयोग के दौरान दी गई जानकारी को कैसे एकत्रित, उपयोग, संग्रहित और सुरक्षित रखता है। पंजीकरण फॉर्म जमा करके या सेवाओं का उपयोग जारी रखकर आप यह स्वीकार करते हैं कि आपने इस नीति को पढ़ और समझ लिया है; यदि आप किसी भी भाग से सहमत नहीं हैं तो कृपया पंजीकरण पूर्ण न करें या सदस्यता रद्द करने का अनुरोध करें।
              </p>
            )}
          </div>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '1. हम कौन‑सी जानकारी एकत्र करते हैं' : '1. Information We Collect'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            {!isHi && (
              <>
                <div className="pl-6 border-l-2 border-blue-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">1.1 Personal Information</h3>
                  <p className="mb-3">Depending on the type of registration, we may collect the following information:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li><strong>Identity Details:</strong> Name, parent/guardian name, date of birth, gender and recent photograph.</li>
                    <li><strong>Contact Details:</strong> Mobile number, email address and residential address.</li>
                    <li><strong>Sports Details:</strong> Playing position, previous kabaddi experience and participation history.</li>
                    <li><strong>Institution Details:</strong> Name of school / college / academy, address and authorised contact person (for institutional registration).</li>
                    <li><strong>Emergency Contact:</strong> Name and phone number of parent / guardian or responsible person.</li>
                    <li><strong>Payment Information:</strong> Records of fee payments and transaction references (we do not store full card / UPI credentials).</li>
                  </ul>
                </div>

                <div className="pl-6 border-l-2 border-blue-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">1.2 Automatically Collected Information</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Basic technical information when you visit our website (such as IP address, browser type and device information).</li>
                    <li>Attendance logs, training participation data and performance observations maintained by coaches.</li>
                    <li>Copies of communications with DDKA through email, forms or messaging platforms.</li>
                    <li>Photographs or videos taken during DDKA events for legitimate documentation and promotional purposes.</li>
                  </ul>
                </div>

                <div className="pl-6 border-l-2 border-blue-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">1.3 Sensitive Information</h3>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p>
                      In limited cases we may record information such as blood group or relevant medical notes shared for safety reasons. Such data is used only in emergencies or to protect member health and is handled with extra care.
                    </p>
                  </div>
                </div>
              </>
            )}

            {isHi && (
              <p className="text-sm text-slate-300 mt-2">
                पंजीकरण के प्रकार के आधार पर हम आपका नाम, माता‑पिता / अभिभावक का नाम, जन्म तिथि, लिंग, हाल का फोटो, संपर्क नंबर, ई‑मेल, निवास पता, खेल संबंधी विवरण, संस्थान का नाम व पता, अधिकृत प्रतिनिधि का नाम, आपातकालीन संपर्क और शुल्क भुगतान से जुड़े लेन‑देन रेकॉर्ड जैसी जानकारी एकत्र कर सकते हैं। वेबसाइट उपयोग के दौरान तकनीकी विवरण, उपस्थिति‑डेटा तथा आयोजन के समय खींचे गए फोटो / वीडियो भी संग्रहीत हो सकते हैं। रक्त समूह या स्वास्थ्य संबंधी नोट्स जैसी संवेदनशील जानकारी केवल सुरक्षा और आपात स्थिति में सीमित उपयोग के लिए रखी जाती है।
              </p>
            )}
          </div>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '2. जानकारी का उपयोग कैसे होता है' : '2. How We Use the Information'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            {!isHi && (
              <>
                <div className="pl-6 border-l-2 border-purple-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">2.1 Main Purposes</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Processing and managing member and institution registrations.</li>
                    <li>Organising training sessions, trials, tournaments and kabaddi development programmes.</li>
                    <li>Maintaining contact with members regarding schedules, notices and important updates.</li>
                    <li>Preparing identity cards, certificates and official records.</li>
                    <li>Managing accounts, fee payments and financial compliance.</li>
                    <li>Responding to queries, complaints or support requests.</li>
                  </ul>
                </div>

                <div className="pl-6 border-l-2 border-purple-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">2.2 Additional Uses</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Improving coaching methods and player development plans.</li>
                    <li>Creating non‑commercial promotional material to showcase kabaddi activities in Dhanbad (photos / videos may be used with appropriate consent).</li>
                    <li>Complying with directions from district, state or national sports bodies and legal authorities.</li>
                  </ul>
                </div>
              </>
            )}

            {isHi && (
              <p className="text-sm text-slate-300 mt-2">
                आपकी जानकारी का उपयोग सदस्यता और संस्थागत पंजीकरण को संसाधित करने, प्रशिक्षण सत्र, ट्रायल, टूर्नामेंट और कबड्डी विकास कार्यक्रमों के आयोजन, समय‑सारिणी, नोटिस और महत्वपूर्ण अपडेट भेजने, आईडी कार्ड व प्रमाण‑पत्र तैयार करने, शुल्क एवं लेखा प्रबंधन तथा आपकी शंकाओं और शिकायतों के समाधान के लिए किया जाता है। इसके अतिरिक्त, कोचिंग और खिलाड़ी विकास योजनाओं में सुधार, गैर‑वाणिज्यिक प्रचार सामग्री तैयार करने तथा जिला / राज्य / राष्ट्रीय खेल निकायों और कानूनी प्राधिकरणों के निर्देशों के अनुपालन के लिए भी सीमित रूप से जानकारी उपयोग की जा सकती है।
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Information Sharing */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '3. जानकारी साझा करना एवं प्रकटीकरण' : '3. Information Sharing & Disclosure'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            {!isHi && (
              <>
                <div className="pl-6 border-l-2 border-amber-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">3.1 When We Share</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>With tournament organisers, district / state associations or AKFI when registration details are required.</li>
                    <li>With basic service providers such as payment gateways or hosting services that help us run our systems (under confidentiality obligations).</li>
                    <li>With medical professionals or emergency responders where it is necessary to protect life or health.</li>
                    <li>With government or law‑enforcement agencies when legally required.</li>
                  </ul>
                </div>

                <div className="pl-6 border-l-2 border-amber-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">3.2 What We Do Not Do</h3>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">DDKA will not:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Sell or rent your personal data to commercial advertisers.</li>
                      <li>Share your contact details for unrelated marketing campaigns.</li>
                      <li>Disclose sensitive medical information except in emergencies or when required by law.</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {isHi && (
              <p className="text-sm text-slate-300 mt-2">
                आपकी जानकारी केवल आवश्यक होने पर ही साझा की जाती है, जैसे टूर्नामेंट आयोजकों, जिला / राज्य संघों या AKFI के साथ पंजीकरण विवरण प्रदान करना, भुगतान या होस्टिंग जैसी बुनियादी सेवाएँ देने वाले सेवा‑प्रदाताओं के साथ सिस्टम चलाने हेतु आवश्यक जानकारी साझा करना (उचित गोपनीयता शर्तों के साथ), आपात स्थिति में चिकित्सा टीम या आपदा‑प्रतिसाद दल के साथ और क़ानून द्वारा आवश्यक होने पर सरकारी या क़ानून‑प्रवर्तन एजेंसियों के साथ। DDKA आपका व्यक्तिगत डेटा किसी व्यावसायिक विज्ञापनदाता को नहीं बेचता / किराये पर नहीं देता और संवेदनशील चिकित्सा जानकारी को केवल आपात स्थितियों या कानूनी दायित्व के तहत ही साझा करता है।
              </p>
            )}
          </div>
        </div>

        {/* Section 4: Data Security */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '4. डेटा सुरक्षा एवं भंडारण अवधि' : '4. Data Security & Retention'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            {!isHi && (
              <>
                <div className="pl-6 border-l-2 border-green-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">4.1 Protection Measures</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Access to member data is restricted to authorised DDKA officials for specific duties.</li>
                    <li>Digital records are stored on secured systems with reasonable technical and organisational safeguards.</li>
                    <li>Physical documents, where maintained, are stored in controlled locations.</li>
                  </ul>
                </div>

                <div className="pl-6 border-l-2 border-green-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">4.2 Retention</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Basic registration and result records may be retained for as long as needed for sporting, legal or archival purposes.</li>
                    <li>Financial records are kept for the period required under applicable law.</li>
                    <li>Where data is no longer required, DDKA will take reasonable steps to delete or anonymise it.</li>
                  </ul>
                </div>

                <div className="pl-6 border-l-2 border-green-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">4.3 Data Incident Response</h3>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p>
                      If DDKA becomes aware of any significant unauthorised access to member data, we will, where practicable, inform affected individuals and take steps to contain and investigate the issue.
                    </p>
                  </div>
                </div>
              </>
            )}

            {isHi && (
              <p className="text-sm text-slate-300 mt-2">
                सदस्य डेटा तक पहुँच केवल अधिकृत डीडीकेए अधिकारियों तक सीमित है और रेकॉर्ड सुरक्षित प्रणालियों में संग्रहीत किए जाते हैं। बुनियादी पंजीकरण, परिणाम और वित्तीय रेकॉर्ड को उतनी अवधि तक रखा जा सकता है जितनी खेल, कानूनी या अभिलेखी प्रयोजनों के लिए आवश्यक हो। जब किसी डेटा की आवश्यकता नहीं रह जाती, तो उसे हटाने या गुमनाम करने के लिए उचित कदम उठाए जाते हैं। यदि कभी गंभीर अनधिकृत पहुँच या डेटा उल्लंघन का पता चलता है, तो जहाँ संभव हो प्रभावित सदस्यों को सूचित किया जाएगा और स्थिति को नियंत्रित व जाँचने के लिए आवश्यक कार्यवाही की जाएगी।
              </p>
            )}
          </div>
        </div>

        {/* Section 5: Your Rights */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '5. आपके विकल्प और अधिकार' : '5. Your Choices & Rights'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            {!isHi && (
              <>
                <div className="pl-6 border-l-2 border-cyan-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">5.1 Member Rights</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Request access to the personal information held about you.</li>
                    <li>Ask for correction of inaccurate or incomplete details.</li>
                    <li>Request deletion of certain data, subject to legal and organisational requirements.</li>
                    <li>Withdraw consent for non‑essential uses such as promotional photos or marketing messages.</li>
                  </ul>
                </div>

                <div className="pl-6 border-l-2 border-cyan-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">5.2 How to Exercise These Rights</h3>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <p className="mb-3">You can exercise your rights by contacting DDKA using the details given in the Contact section below. We may ask for reasonable proof of identity before acting on a request.</p>
                  </div>
                </div>

                <div className="pl-6 border-l-2 border-cyan-500/50">
                  <h3 className="text-xl font-semibold text-white mb-3">5.3 Minors</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>For members under 18 years, consent of a parent or legal guardian is mandatory.</li>
                    <li>Parents / guardians may review, correct or request deletion of their ward&apos;s information.</li>
                  </ul>
                </div>
              </>
            )}

            {isHi && (
              <p className="text-sm text-slate-300 mt-2">
                आपको अपने बारे में संग्रहीत व्यक्तिगत जानकारी की प्रति देखने, गलत या अधूरी जानकारी को सुधारने, कुछ डेटा को हटाने (जहाँ कानूनी या संगठनात्मक दायित्व इसकी अनुमति दें) और प्रचारात्मक फोटो या संदेशों जैसे गैर‑आवश्यक उपयोगों के लिए दी गई सहमति वापस लेने का अधिकार है। 18 वर्ष से कम आयु के सदस्यों के लिए पंजीकरण और डेटा से संबंधित सभी अधिकार उनके माता‑पिता या वैधानिक अभिभावक के माध्यम से प्रयोग किए जाएँगे, जो आवश्यकता पड़ने पर जानकारी देखने, सुधारने या हटाने का अनुरोध कर सकते हैं।
              </p>
            )}
          </div>
        </div>

        {/* Section 6: Website & Cookies */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/40 to-purple-500/40 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '6. वेबसाइट एवं ऑनलाइन सेवाएँ' : '6. Website & Online Services'}
            </h2>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="pl-6 border-l-2 border-indigo-500/50">
              {!isHi && (
                <>
                  <h3 className="text-xl font-semibold text-white mb-3">6.1 Cookies &amp; Analytics</h3>
                  <p className="mb-3">
                    Our website may use basic cookies and analytics tools to understand usage patterns and improve user experience. These typically collect aggregated, non‑identifying information.
                  </p>
                  <p className="text-sm text-slate-400">
                    You can adjust your browser settings to control or block cookies; however, some features may not work correctly if cookies are disabled.
                  </p>
                </>
              )}
              {isHi && (
                <p className="text-sm text-slate-300">
                  हमारी वेबसाइट उपयोग‑पैटर्न समझने और अनुभव बेहतर करने के लिए बुनियादी कुकीज़ और एनालिटिक्स टूल का उपयोग कर सकती है, जो सामान्यतः समेकित और पहचान‑रहित जानकारी एकत्र करते हैं। आप अपने ब्राउज़र की सेटिंग्स में जाकर कुकीज़ को नियंत्रित या ब्लॉक कर सकते हैं, लेकिन ऐसा करने पर कुछ सुविधाएँ ठीक से कार्य नहीं कर सकतीं।
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 7: Changes & Contact */}
        <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/40 to-red-500/40 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isHi ? '7. परिवर्तन एवं संपर्क जानकारी' : '7. Changes & Contact Information'}
            </h2>
          </div>

            <div className="space-y-6 text-slate-300">
              {!isHi && (
                <>
                  <div className="pl-6 border-l-2 border-orange-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">7.1 Updates to This Policy</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>DDKA may revise this Privacy Policy from time to time.</li>
                      <li>When changes are made, the updated policy and &quot;Last Updated&quot; date will be posted on the website.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-orange-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">7.2 Contact Details</h3>
                    <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Dhanbad District Kabaddi Association (DDKA)</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Email:</strong> dhanbaddistrictkabaddi@gmail.com</p>
                        <p><strong>Address:</strong> Retired Rly Colony, Gomoh, Dhanbad, Jharkhand 828401</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {isHi && (
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm text-slate-300">
                    DDKA समय‑समय पर इस प्राइवेसी पॉलिसी में संशोधन कर सकता है। जब भी बदलाव किए जाएँगे, अद्यतन नीति और "Last Updated" तिथि वेबसाइट पर प्रकाशित की जाएगी।
                  </p>
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Dhanbad District Kabaddi Association (DDKA)</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> dhanbaddistrictkabaddi@gmail.com</p>
                      <p><strong>Address:</strong> Retired Rly Colony, Gomoh, Dhanbad, Jharkhand 828401</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* Acceptance Statement */}
        <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-green-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {isHi ? 'DDKA के साथ आपकी गोपनीयता' : 'Your Privacy with DDKA'}
              </h3>
              {!isHi && (
                <>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    By registering with Dhanbad District Kabaddi Association (DDKA), you agree that your information may be used in the manner described in this Privacy Policy.
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    If you have any doubts or concerns about how we handle your data, please contact us before completing registration.
                  </p>
                </>
              )}
              {isHi && (
                <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                  डीडीकेए में पंजीकरण कराते समय आप यह स्वीकार करते हैं कि आपकी जानकारी का उपयोग इस प्राइवेसी पॉलिसी में बताए गए तरीके से किया जा सकता है। यदि आपको अपने डेटा के उपयोग या सुरक्षा को लेकर कोई शंका हो तो पंजीकरण पूरा करने से पहले हमसे संपर्क करें, ताकि हम आपकी जिज्ञासाओं का समाधान कर सकें।
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                >
                  Player Registration
                </Link>
                <Link
                  to="/institution"
                  className="inline-flex items-center px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300"
                >
                  Institution Registration
                </Link>
                <Link
                  to="/terms-conditions"
                  className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300"
                >
                  View Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          {!isHi && (
            <>
              <p>This Privacy Policy is intended to align with applicable Indian law relating to information technology and data protection.</p>
              <p className="mt-2">© {new Date().getFullYear()} Dhanbad District Kabaddi Association (DDKA). All rights reserved.</p>
            </>
          )}
          {isHi && (
            <>
              <p>यह प्राइवेसी पॉलिसी भारत में सूचना प्रौद्योगिकी तथा डेटा संरक्षण से संबंधित लागू क़ानूनों की मंशा के अनुरूप तैयार की गई है।</p>
              <p className="mt-2">© {new Date().getFullYear()} Dhanbad District Kabaddi Association (DDKA). सर्वाधिकार सुरक्षित।</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
