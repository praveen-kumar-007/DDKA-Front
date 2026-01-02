import React from 'react';
import { Shield, AlertCircle, FileText, Users, Award, CheckCircle, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Language } from '../translations';

const TermsConditions: React.FC<{ lang: Language }> = ({ lang }) => {
  const isHi = lang === 'hi';
  return (
    <div className="bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block">
              <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-400 text-xs font-semibold tracking-wide">
                <Shield className="w-4 h-4 mr-2" />
                Legal Terms & Regulations
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {isHi ? 'नियम एवं शर्तें' : 'Terms & Conditions'}
            </h1>
            {!isHi && (
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                These Terms &amp; Conditions apply to (a) individual players registering through the Player Registration form and (b) institutions / academies affiliating through the Institution Registration form of Dhanbad District Kabaddi Association (DDKA).
              </p>
            )}
            {isHi && (
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                ये नियम और शर्तें (a) खिलाड़ी पंजीकरण फ़ॉर्म के माध्यम से पंजीकरण करने वाले व्यक्तिगत खिलाड़ियों तथा (b) संस्थान / एकेडमी पंजीकरण फ़ॉर्म के माध्यम से संबद्ध होने वाले संस्थानों पर लागू होती हैं।
              </p>
            )}
            <p className="text-sm text-slate-500 mt-4">Last Updated: January 1, 2026</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Introduction */}
          <div className="mb-12 p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-amber-400 mb-2">Important Notice</h2>
                {!isHi && (
                  <p className="text-slate-300 leading-relaxed">
                    By submitting either the Player Registration form or the Institution Registration form to Dhanbad District Kabaddi Association (DDKA), you (player / parent / guardian / institution representative) agree to follow all rules, regulations and policies framed by DDKA and the Jharkhand State Kabaddi Association, recognised by the Amateur Kabaddi Federation of India (AKFI). Breach of these terms may lead to disciplinary action, including suspension or cancellation of membership / affiliation.
                  </p>
                )}
                {isHi && (
                  <p className="text-slate-300 leading-relaxed text-sm">
                    महत्वपूर्ण सूचना: खिलाड़ी पंजीकरण फ़ॉर्म या संस्थान पंजीकरण फ़ॉर्म में से कोई भी जमा करते समय आप (खिलाड़ी / अभिभावक / अधिकृत प्रतिनिधि) यह स्वीकार करते हैं कि आप डीडीकेए तथा झारखंड स्टेट कबड्डी एसोसिएशन (AKFI मान्यता प्राप्त) के सभी नियमों और नीतियों का पालन करेंगे। किसी भी उल्लंघन की स्थिति में सदस्यता / संबद्धता निलंबन या समाप्ति जैसे अनुशासनात्मक कदम लिए जा सकते हैं। यह पेज अंग्रेज़ी और हिन्दी दोनों में जानकारी देता है; किसी भी अंतर की स्थिति में अंग्रेज़ी संस्करण को आधिकारिक माना जाएगा।
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 1: Membership Terms */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '1. सदस्यता नियम' : '1. Membership Terms'}
              </h2>
            </div>

            <div className="space-y-6 text-slate-300">
              {!isHi && (
                <>
                  <div className="pl-6 border-l-2 border-amber-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">1.1 Registration &amp; Eligibility</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>All details filled in the registration form must be correct and verifiable.</li>
                      <li>Members must submit valid identity proof (such as Aadhaar) and active contact information.</li>
                      <li>Admission is subject to approval of the DDKA management committee and may be refused without assigning any reason.</li>
                      <li>DDKA may seek additional documents for age, address or eligibility verification.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-amber-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">1.2 Membership Duration &amp; Renewal</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Membership is normally valid for one competitive season or one year from the approval date, unless otherwise notified by DDKA.</li>
                      <li>Continuation in the next season requires timely renewal and payment of applicable fees.</li>
                      <li>DDKA will publish renewal timelines and updated fees through official notices or online announcements.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-red-500/50 bg-red-500/5 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">1.3 Leaving DDKA / Discontinuation</h3>
                    <div className="space-y-3">
                      <p className="font-semibold text-white flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        Members who wish to discontinue must inform DDKA in writing at least 14 (fourteen) days in advance.
                      </p>
                      <ul className="space-y-2 list-disc list-inside ml-7">
                        <li>Applications for discontinuation may be submitted by email or written letter to the DDKA committee.</li>
                        <li>Leaving without proper notice may be treated as violation of membership terms.</li>
                        <li>Depending on the severity, DDKA may impose actions such as:
                          <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                            <li>Restriction on re‑joining for a defined period</li>
                            <li>Non‑issuance of participation or experience certificates</li>
                            <li>Intimation to district / state kabaddi authorities, if required</li>
                          </ul>
                        </li>
                        <li>During the notice period, members must honour all existing commitments (training, matches, tournaments etc.).</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {isHi && (
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm text-slate-300">
                    सदस्यता लेते समय दिए गए सभी विवरण सही, पूर्ण और सत्यापन योग्य होना आवश्यक है। सदस्यता डीडीकेए प्रबंधन समिति की स्वीकृति पर निर्भर करती है और समिति बिना कारण बताए आवेदन अस्वीकार कर सकती है। सामान्यतः सदस्यता एक प्रतिस्पर्धी सत्र / एक वर्ष के लिए मान्य रहती है तथा अगले सत्र के लिए समय पर नवीनीकरण और शुल्क जमा करना अनिवार्य है।
                  </p>
                  <p className="text-sm text-slate-300">
                    यदि कोई सदस्य डीडीकेए छोड़ना चाहता है तो उसे कम से कम 14 दिन पहले ई‑मेल या लिखित आवेदन के माध्यम से सूचना देनी होगी। बिना सूचना छोड़े जाने की स्थिति में इसे नियमों का उल्लंघन माना जा सकता है और भविष्य की सदस्यता, प्रमाण‑पत्र या संबद्ध अवसरों पर प्रतिबंध लगाया जा सकता है।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: AKFI & Association Regulations */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '2. संघ एवं AKFI नियम' : '2. Association & AKFI Regulations'}
              </h2>
            </div>

            <div className="space-y-6 text-slate-300">
              {!isHi && (
                <>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <p className="text-slate-300 leading-relaxed">
                      <strong className="text-white">Note:</strong> DDKA functions under the guidance of Jharkhand State Kabaddi Association and follows the rules of the Amateur Kabaddi Federation of India (AKFI). All training, competitions and selections are organised in line with these regulations.
                    </p>
                  </div>

                  <div className="pl-6 border-l-2 border-blue-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">2.1 Compliance With Rules</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>All matches and practice sessions are conducted as per the latest AKFI laws of the game.</li>
                      <li>Members may be required to submit age and eligibility certificates as per association norms.</li>
                      <li>Use of banned substances or methods is strictly prohibited.</li>
                      <li>Members are encouraged to read detailed kabaddi rules and guidelines issued by DDKA and AKFI.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-blue-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">2.2 Code of Conduct</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Members must maintain discipline, respect coaches and officials, and display fair play at all times.</li>
                      <li>Abusive language, violence or harassment of any kind will not be tolerated.</li>
                      <li>Decisions of referees and officials must be accepted in the spirit of the game.</li>
                      <li>Damage to the reputation of DDKA in public or on social media may invite disciplinary action.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-blue-500/50 bg-blue-500/5 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">2.3 Playing for Other Clubs / NOC</h3>
                    <div className="space-y-3">
                      <p className="font-semibold text-white flex items-start gap-2">
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        Any DDKA registered member who wishes to represent another club, academy or district must first obtain written permission / NOC from DDKA.
                      </p>
                      <ul className="space-y-2 list-disc list-inside ml-7">
                        <li>Requests for NOC should be submitted in writing well before the proposed event.</li>
                        <li>DDKA may approve, modify or refuse such requests based on player commitments and regulations.</li>
                        <li>Participating elsewhere without consent may lead to suspension or cancellation of DDKA membership.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pl-6 border-l-2 border-blue-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">2.4 Tournaments &amp; Selections</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Team selection for any championship will be carried out by authorised selectors / coaches of DDKA.</li>
                      <li>Selection decisions are final and must be respected by all participants.</li>
                      <li>Members must wear prescribed kit and safety gear during matches and official practice.</li>
                    </ul>
                  </div>
                </>
              )}

              {isHi && (
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm text-slate-300">
                    DDKA झारखंड स्टेट कबड्डी एसोसिएशन के मार्गदर्शन में कार्य करता है और Amateur Kabaddi Federation of India (AKFI) के नियमों का पालन करता है। सभी प्रशिक्षण सत्र, प्रतियोगिताएँ और चयन इन्हीं नियमों के अनुरूप आयोजित किए जाते हैं।
                  </p>
                  <p className="text-sm text-slate-300">
                    खिलाड़ियों से अपेक्षा की जाती है कि वे मैदान के भीतर और बाहर अनुशासन, सम्मान और निष्पक्ष खेल दिखाएँ। बिना लिखित अनुमति किसी अन्य क्लब या टीम के लिए आधिकारिक प्रतिनित्व करना अनुमन्य नहीं है; ऐसा करने पर सदस्यता निलंबित या समाप्त की जा सकती है।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Training & Facility Usage */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '3. प्रशिक्षण एवं सुविधाएँ' : '3. Training & Facilities'}
              </h2>
            </div>

            <div className="space-y-6 text-slate-300">
              {!isHi && (
                <>
                  <div className="pl-6 border-l-2 border-green-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">3.1 Attendance</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Regular attendance in practice sessions is expected from every registered player.</li>
                      <li>Selection for tournaments or special camps may depend on attendance, fitness and discipline.</li>
                      <li>Members should inform coaches in advance in case of unavoidable absence.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-green-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">3.2 Facility Rules</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Grounds, mats and equipment of DDKA must be used carefully and kept clean.</li>
                      <li>Any damage to property should be reported immediately; repair costs may be recovered from responsible persons.</li>
                      <li>Only authorised members and staff are allowed to use association facilities.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-green-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">3.3 Health &amp; Safety</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Participation in kabaddi and related activities is at the member&apos;s own risk.</li>
                      <li>Members should disclose pre‑existing medical conditions to coaches and avoid playing when unfit.</li>
                      <li>DDKA recommends that players maintain personal medical / sports insurance where possible.</li>
                    </ul>
                  </div>
                </>
              )}

              {isHi && (
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm text-slate-300">
                    सभी पंजीकृत खिलाड़ियों से अपेक्षा की जाती है कि वे नियमित रूप से अभ्यास सत्रों में भाग लें। टूर्नामेंट या विशेष शिविरों के चयन में उपस्थिति, फिटनेस और अनुशासन महत्वपूर्ण मानदंड होंगे।
                  </p>
                  <p className="text-sm text-slate-300">
                    डीडीकेए के मैदान, मैट और उपकरणों की देखभाल और स्वच्छता की जिम्मेदारी सभी सदस्यों की साझा होगी। किसी भी प्रकार की क्षति की सूचना तुरंत देनी होगी और आवश्यक होने पर क्षतिपूर्ति संबंधित व्यक्ति से ली जा सकती है। खेल में भाग लेना स्वैच्छिक है तथा स्वास्थ्य संबंधी अंतिम जिम्मेदारी खिलाड़ी / अभिभावक की होगी।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Financial Terms */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '4. शुल्क एवं भुगतान' : '4. Fees & Payments'}
              </h2>
            </div>

            <div className="space-y-6 text-slate-300">
              {!isHi && (
                <>
                  <div className="pl-6 border-l-2 border-purple-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">4.1 Registration Fees</h3>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">Player Registration Fee:</span>
                        <span className="text-2xl font-bold text-purple-400">₹400/-</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Institution / Academy Registration Fee:</span>
                        <span className="text-2xl font-bold text-purple-400">₹2000/-</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-3">*Fees are subject to revision by DDKA. Any change will be communicated through official channels.</p>
                    </div>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Fees are payable at the time of registration and are generally non‑refundable.</li>
                      <li>Separate charges may apply for tournaments, camps, kit or travel.</li>
                      <li>Non‑payment of fees within the notified period may lead to suspension of membership or services.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-purple-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">4.2 Mode of Payment</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>DDKA may accept payments through UPI, bank transfer, cash or other modes announced from time to time.</li>
                      <li>Members are advised to keep payment proof / receipts safely for future reference.</li>
                    </ul>
                  </div>
                </>
              )}

              {isHi && (
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm text-slate-300">
                    वर्तमान संरचना के अनुसार खिलाड़ी पंजीकरण शुल्क ₹400/- तथा संस्थान / एकेडमी पंजीकरण शुल्क ₹2000/- निर्धारित है, जो पंजीकरण के समय जमा करना अनिवार्य है। शुल्क सामान्यतः वापस नहीं किए जाते और डीडीकेए द्वारा आवश्यकतानुसार इसमें परिवर्तन किया जा सकता है, जिसकी सूचना आधिकारिक माध्यमों से दी जाएगी।
                  </p>
                  <p className="text-sm text-slate-300">
                    टूर्नामेंट, शिविर, किट या यात्रा आदि के लिए अतिरिक्त शुल्क लागू हो सकते हैं। भुगतान UPI, बैंक ट्रांसफ़र, नकद या समय‑समय पर अधिसूचित अन्य माध्यमों से स्वीकार किए जा सकते हैं। सदस्यों को अपने भुगतान की रसीद या साक्ष्य सुरक्षित रखने की सलाह दी जाती है।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Disciplinary Actions */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500/40 to-orange-500/40 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '5. अनुशासन एवं सदस्यता समाप्ति' : '5. Discipline & Termination'}
              </h2>
            </div>

            <div className="space-y-6 text-slate-300">
              {!isHi && (
                <>
                  <div className="pl-6 border-l-2 border-red-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">5.1 Grounds for Action</h3>
                    <p className="mb-3">The DDKA committee may take disciplinary action in cases including (but not limited to):</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Violation of these terms, DDKA rules or AKFI regulations.</li>
                      <li>Misconduct, abuse, harassment or behaviour bringing the game or association into disrepute.</li>
                      <li>Playing for other clubs / teams without required permission.</li>
                      <li>Non‑payment of fees or financial irregularities.</li>
                      <li>Deliberate damage to property or facilities of DDKA.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-red-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">5.2 Types of Action</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Verbal or written warnings.</li>
                      <li>Temporary suspension from training, matches or events.</li>
                      <li>Levy of penalties or recovery of damages, where applicable.</li>
                      <li>Termination of membership and blocking of future registration.</li>
                      <li>Reporting serious matters to higher authorities or law‑enforcement.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-red-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">5.3 Appeal</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Members may submit a written appeal against disciplinary decisions within a reasonable time as notified by DDKA.</li>
                      <li>The decision of the designated appeals body / committee of DDKA shall be final.</li>
                    </ul>
                  </div>
                </>
              )}

              {isHi && (
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm text-slate-300">
                    यदि कोई सदस्य इन नियमों, डीडीकेए के आंतरिक नियमों या AKFI के विनियमों का उल्लंघन करता है, दुर्व्यवहार या उत्पीड़न करता है, खेल या संघ की साख को नुकसान पहुँचाता है, बिना अनुमति अन्य क्लब / टीम के लिए खेलता है या शुल्क का भुगतान नहीं करता, तो उसके विरुद्ध अनुशासनात्मक कार्रवाई की जा सकती है।
                  </p>
                  <p className="text-sm text-slate-300">
                    ऐसी कार्रवाई में चेतावनी, अस्थायी निलंबन, जुर्माना, क्षतिपूर्ति वसूली या सदस्यता समाप्ति तथा भविष्य की पंजीकरण पर रोक शामिल हो सकती है। सदस्य निर्धारित समय‑सीमा के भीतर लिखित अपील कर सकते हैं, परंतु अंतिम निर्णय डीडीकेए की नामित अपील समिति का होगा।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: General Provisions */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/40 to-yellow-500/40 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '6. सामान्य प्रावधान' : '6. General Provisions'}
              </h2>
            </div>

            <div className="space-y-6 text-slate-300">
              {!isHi && (
                <>
                  <div className="pl-6 border-l-2 border-amber-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">6.1 Amendments</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>DDKA reserves the right to modify these terms and any associated policies at any time.</li>
                      <li>Updated terms will be published on official platforms or notice boards.</li>
                      <li>Continued participation after such updates will be treated as acceptance of the revised terms.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-amber-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">6.2 Data &amp; Privacy</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Member information is collected and used in accordance with the DDKA Privacy Policy.</li>
                      <li>Basic details may be shared with district / state associations and tournament organisers when required.</li>
                      <li>Members are encouraged to review the separate Privacy Policy page for full details.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-amber-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">6.3 Governing Law &amp; Jurisdiction</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>These terms are governed by the laws of India.</li>
                      <li>Any disputes shall fall under the jurisdiction of competent courts at Dhanbad, Jharkhand.</li>
                    </ul>
                  </div>

                  <div className="pl-6 border-l-2 border-amber-500/50">
                    <h3 className="text-xl font-semibold text-white mb-3">6.4 Contact</h3>
                    <p>For questions about these terms, please reach out to:</p>
                    <ul className="space-y-2 mt-3 text-sm">
                      <li><strong>Dhanbad District Kabaddi Association (DDKA)</strong></li>
                      <li>Email: dhanbaddistrictkabaddi@gmail.com</li>
                      <li>Location: Retired Rly Colony, Gomoh, Dhanbad, Jharkhand 828401</li>
                    </ul>
                  </div>
                </>
              )}

              {isHi && (
                <div className="space-y-4 text-slate-300">
                  <p className="text-sm text-slate-300">
                    डीडीकेए समय‑समय पर इन नियमों और संबंधित नीतियों में परिवर्तन कर सकता है तथा संशोधित नियमों की सूचना आधिकारिक नोटिस या ऑनलाइन माध्यमों से दी जाएगी। ऐसे अद्यतन के बाद भी डीडीकेए की गतिविधियों में भाग लेते रहना संशोधित नियमों की स्वीकृति मानी जाएगी।
                  </p>
                  <p className="text-sm text-slate-300">
                    सदस्य जानकारी और डेटा का संग्रह एवं उपयोग अलग से प्रकाशित डीडीकेए प्राइवेसी पॉलिसी के अनुसार होगा। किसी भी विवाद की स्थिति में लागू भारतीय क़ानून लागू होंगे और न्याय क्षेत्र धनबाद, झारखंड की उपयुक्त न्यायालयों का रहेगा।
                  </p>
                  <p className="text-sm text-slate-300">
                    इन नियमों से संबंधित किसी भी प्रश्न के लिए कृपया Dhanbad District Kabaddi Association (DDKA), ईमेल: dhanbaddistrictkabaddi@gmail.com, स्थान: धनबाद, झारखंड से संपर्क करें।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 7: Specific Terms for Players */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '7. खिलाड़ियों के लिए अतिरिक्त नियम' : '7. Additional Terms for Players'}
              </h2>
            </div>

            <div className="space-y-4 text-slate-300">
              {!isHi && (
                <ul className="space-y-2 list-disc list-inside">
                  <li>Players must participate only through proper DDKA registration and may not represent unauthorised teams in official events without permission.</li>
                  <li>Attendance, fitness and discipline will be key criteria for selection in district or higher‑level teams.</li>
                  <li>Players must wear prescribed kit and follow safety instructions of coaches and officials.</li>
                  <li>Any injury or health issue must be reported immediately to the coach / staff.</li>
                  <li>Misuse of DDKA ID card, certificate or name (for example, for non‑approved tournaments) is strictly prohibited.</li>
                </ul>
              )}

              {isHi && (
                <p className="text-sm text-slate-300">
                  खिलाड़ी केवल डीडीकेए के विधिवत पंजीकरण के बाद ही संघ द्वारा स्वीकृत प्रतियोगिताओं में भाग ले सकते हैं और बिना अनुमति किसी भी अनधिकृत टीम या टूर्नामेंट के लिए आधिकारिक प्रतिनिधित्व नहीं कर सकते। जिला या उच्च स्तरीय टीमों के चयन में निरंतर उपस्थिति, शारीरिक क्षमता और अनुशासन प्रमुख मानदंड होंगे। खिलाड़ियों के लिए निर्धारित किट, ड्रेस‑कोड और सुरक्षा निर्देशों का पालन अनिवार्य है तथा किसी भी प्रकार की चोट या स्वास्थ्य संबंधी समस्या होने पर तुरंत कोच / स्टाफ को सूचित करना आवश्यक है। डीडीकेए के आईडी कार्ड, प्रमाण‑पत्र या नाम का गलत या भ्रामक उपयोग (जैसे गैर‑स्वीकृत आयोजनों में) सख्ती से प्रतिबंधित है।
                </p>
              )}
            </div>
          </div>

          {/* Section 8: Specific Terms for Institutions */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-300" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {isHi ? '8. संस्थानों के लिए अतिरिक्त नियम' : '8. Additional Terms for Institutions'}
              </h2>
            </div>

            <div className="space-y-4 text-slate-300">
              {!isHi && (
                <ul className="space-y-2 list-disc list-inside">
                  <li>Institutions must nominate an authorised coordinator (secretary / sports in‑charge) to liaise with DDKA.</li>
                  <li>Only bonafide students / registered players of the institution may be fielded in teams under that institution&apos;s name.</li>
                  <li>Institutions are responsible for basic safety, supervision and conduct of their players when travelling to or from DDKA events.</li>
                  <li>Affiliation may be suspended or cancelled if false information is provided or if serious indiscipline is reported.</li>
                  <li>Any use of the DDKA logo or name in posters, banners or social media must be in good faith and, where required, with prior permission.</li>
                </ul>
              )}

              {isHi && (
                <p className="text-sm text-slate-300">
                  प्रत्येक संबद्ध संस्था को डीडीकेए से समन्वय के लिए एक अधिकृत प्रतिनिधि (जैसे सचिव / खेल‑प्रभारी) नामित करना होगा। संस्था के नाम से केवल उसके वास्तविक छात्र‑खिलाड़ियों या पंजीकृत सदस्यों को ही टीम में शामिल किया जा सकता है। डीडीकेए कार्यक्रमों के लिए आते‑जाते समय खिलाड़ियों की सुरक्षा, निगरानी और आचरण की प्राथमिक जिम्मेदारी संबंधित संस्था की होगी। गलत या भ्रामक जानकारी देने, फर्जी खिलाड़ियों को शामिल करने या गंभीर अनुशासनहीनता पाए जाने पर संस्था की संबद्धता निलंबित या समाप्त की जा सकती है। डीडीकेए के नाम और लोगो का उपयोग पोस्टर, बैनर या सोशल मीडिया में केवल सद्भावनापूर्ण और जहाँ आवश्यक हो पूर्व अनुमति के साथ ही किया जाएगा।
                </p>
              )}
            </div>
          </div>

          {/* Acceptance Statement */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 rounded-xl p-8 text-center">
            <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              {isHi ? 'नियमों की स्वीकृति' : 'Acceptance of Terms'}
            </h3>
            {!isHi && (
              <>
                <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto mb-6">
                  By completing either the Player Registration or Institution Registration process with Dhanbad District Kabaddi Association (DDKA), you confirm that you have read, understood and agree to these Terms &amp; Conditions and all applicable kabaddi regulations.
                </p>
                <div className="mt-2 flex flex-col items-center gap-3">
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      to="/register"
                      className="inline-block px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 text-sm"
                    >
                      I Agree - Player Registration
                    </Link>
                    <Link
                      to="/institution"
                      className="inline-block px-7 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm"
                    >
                      I Agree - Institution Registration
                    </Link>
                  </div>
                  <span className="block text-xs text-slate-400">
                    Your agreement is recorded when you tick the consent checkbox on the respective registration form.
                  </span>
                </div>
              </>
            )}

            {isHi && (
              <>
                <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto mb-6 text-sm">
                  खिलाड़ी या संस्थान पंजीकरण प्रक्रिया पूरी करते समय आप यह घोषित करते हैं कि आपने इन सभी नियमों और शर्तों को सावधानीपूर्वक पढ़ लिया है, उन्हें समझ लिया है और उनका पालन करने के लिए सहमत हैं।
                </p>
                <div className="mt-2 flex flex-col items-center gap-3">
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      to="/register"
                      className="inline-block px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 text-sm"
                    >
                      मैं सहमत हूँ - खिलाड़ी पंजीकरण
                    </Link>
                    <Link
                      to="/institution"
                      className="inline-block px-7 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm"
                    >
                      मैं सहमत हूँ - संस्थान पंजीकरण
                    </Link>
                  </div>
                  <span className="block text-xs text-slate-400">
                    आपकी सहमति संबंधित पंजीकरण फ़ॉर्म पर कन्सेंट चेकबॉक्स चुनने के साथ दर्ज की जाती है।
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
