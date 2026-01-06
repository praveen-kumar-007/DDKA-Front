import React, { useState } from 'react';
import { 
  User, Phone, FileText, Upload, CheckCircle, X, 
  Mail, Calendar, Droplets, Trophy, MessageSquare 
} from 'lucide-react';
import { RegistrationType } from '../../types';
import type { Language } from '../../translations';
import { FEES } from '../../constants';
import { translations } from '../../translations';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
  lang: Language;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ lang }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // FIXED: State updated to handle exactly 4 files (photo, front, back, receipt)
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    photo: null,
    front: null,
    back: null,
    receipt: null
  });
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const t = translations[lang].forms;
  const tp = translations[lang].payment;

  const [formData, setFormData] = useState({
    fullName: '',
    fathersName: '',
    gender: 'Male',
    dob: '',
    bloodGroup: '',
    email: '',
    phone: '',
    parentsPhone: '',
    address: '',
    aadharNumber: '',
    registerAs: RegistrationType.PLAYER,
    sportsExperience: '',
    reasonForJoining: '',
  });

  // Custom handler for Aadhar and Phone
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'aadharNumber') {
      // Remove all non-digits
      let digits = value.replace(/\D/g, '');
      // Limit to 12 digits
      digits = digits.slice(0, 12);
      // Add space every 4 digits
      let formatted = '';
      for (let i = 0; i < digits.length; i += 4) {
        if (i > 0) formatted += ' ';
        formatted += digits.substr(i, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'phone' || name === 'parentsPhone') {
      // Only allow numbers, max 10 digits
      let digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Store the actual file object needed for FormData
      setSelectedFiles(prev => ({ ...prev, [key]: file }));
      setFileNames(prev => ({ ...prev, [key]: file.name }));

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [key]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFile = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setSelectedFiles(prev => ({ ...prev, [key]: null }));
    setFileNames(prev => { const n = {...prev}; delete n[key]; return n; });
    setPreviews(prev => { const n = {...prev}; delete n[key]; return n; });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // STRICT VALIDATION: Ensure all 3 documents are selected before proceeding
    if (!selectedFiles.photo || !selectedFiles.front || !selectedFiles.back) {
        alert(lang === 'hi' ? "कृपया सभी 3 आवश्यक दस्तावेज अपलोड करें।" : "Please upload all 3 required documents.");
        return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert(lang === 'hi'
        ? 'कृपया आगे बढ़ने से पहले नियम और शर्तों को स्वीकार करें।'
        : 'Please agree to the Terms & Conditions before submitting.');
      return;
    }
    
    // STRICT VALIDATION: Transaction ID and Receipt Screenshot required
    if (!transactionId || !selectedFiles.receipt) {
        alert(lang === 'hi' ? "कृपया ट्रांजैक्शन आईडी और भुगतान रसीद अपलोड करें।" : "Please provide Transaction ID and upload Payment Receipt.");
        return;
    }
    
    setIsSubmitting(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      // Create FormData to handle the multi-part request (Text + Files)
      const dataToSend = new FormData();
      
      // 1. Append all text fields from formData
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      
      // 2. Append Transaction ID
      dataToSend.append('transactionId', transactionId.toUpperCase().trim());

      // 2b. Append Terms acceptance
      dataToSend.append('acceptedTerms', acceptedTerms ? 'true' : 'false');

      // 3. Append the physical files (matching Multer keys on backend)
      if (selectedFiles.photo) dataToSend.append('photo', selectedFiles.photo);
      if (selectedFiles.front) dataToSend.append('front', selectedFiles.front);
      if (selectedFiles.back) dataToSend.append('back', selectedFiles.back);
      if (selectedFiles.receipt) dataToSend.append('receipt', selectedFiles.receipt);

      const response = await fetch(`${API_URL}/api/players/register`, {
        method: 'POST',
        // Important: Content-Type is automatically set for FormData
        body: dataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Connection Error: Could not reach the server. Check if backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-2xl mx-auto my-12 animate-in zoom-in-95 duration-300 border border-green-100">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-8" />
        <h2 className="text-4xl font-bold text-gray-900 mb-6 uppercase font-oswald tracking-tight">
          {lang === 'hi' ? 'आवेदन प्राप्त हुआ!' : 'APPLICATION RECEIVED!'}
        </h2>
        <p className="text-gray-600 mb-10 leading-relaxed text-xl font-medium">
          {lang === 'hi' 
            ? `धन्यवाद ${formData.fullName}, आपकी भुगतान रसीद और विवरण समीक्षा के लिए भेज दिए गए हैं।` 
            : `Thank you ${formData.fullName}, your payment receipt and details have been sent for manual review.`}
        </p>
        <button 
          onClick={() => { setIsSuccess(false); setStep(1); setFileNames({}); setPreviews({}); setSelectedFiles({photo:null, front:null, back:null, receipt:null}); }}
          className="bg-blue-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl uppercase tracking-widest text-lg"
        >
          {lang === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Return Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl sm:rounded-[2.5rem] overflow-hidden max-w-full sm:max-w-5xl mx-auto border border-gray-100">
      <div className="bg-blue-900 p-4 xs:p-6 sm:p-8 md:p-12 text-white relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10 w-full">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald font-bold uppercase tracking-wider">{t.playerTitle}</h2>
            <p className="text-blue-200 mt-3 font-light text-lg sm:text-xl">{step === 1 ? t.playerSubtitle : "Step 2: Manual Payment Receipt Submission"}</p>
          </div>
          <div className="ml-2 mt-1 bg-orange-600 px-2 py-1 xs:px-4 xs:py-2 sm:px-8 sm:py-4 rounded-2xl xs:rounded-3xl font-black shadow-2xl text-base xs:text-lg sm:text-2xl animate-pulse z-20 whitespace-nowrap flex-shrink-0">
            ₹{FEES.PLAYER}
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sample Player ID card preview */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 sm:px-8 py-6 flex flex-col items-center gap-4 text-center">
        <div className="text-sm text-slate-700 max-w-2xl">
          <p className="font-semibold text-slate-900 mb-1">
            {lang === 'hi' ? 'स्वीकृति के बाद प्राप्त खिलाड़ी आईडी कार्ड' : 'Player ID Card after Approval'}
          </p>
          <p>
            {lang === 'hi'
              ? 'पंजीकरण और शुल्क की सफल जांच के बाद खिलाड़ी को नीचे दिखाए गए के समान आधिकारिक DDKA प्लेयर आईडी कार्ड प्राप्त होगा।'
              : 'After successful verification of your registration and fee, you will receive an official DDKA Player ID card similar to the one shown below.'}
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767539444/Screenshot_2026-01-04_204017_ylfugp.png"
          alt="Sample DDKA Player ID Card"
          className="w-full max-w-sm rounded-xl border border-slate-200 shadow-md bg-white"
        />
      </div>

      {step === 1 ? (
        <form onSubmit={handleProceedToPayment} className="p-2 xs:p-4 sm:p-8 md:p-12 space-y-6 xs:space-y-8 sm:space-y-10 md:space-y-12">
          
          {/* Section 1: Personal Information */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-10 border-b border-slate-100 pb-4">
              <div className="p-2 sm:p-3 bg-orange-50 rounded-2xl"><User className="text-orange-600" size={24} /></div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-oswald uppercase tracking-tight">{lang === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">{t.labels.fullName}</label>
                <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-lg" placeholder="Full Name" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">{t.labels.fathersName}</label>
                <input required name="fathersName" value={formData.fathersName} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-lg" placeholder="Father's Name" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Calendar size={16} /> Date of Birth</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none bg-white text-lg">
                    <option value="Male">Male</option><option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Droplets size={16} className="text-red-500" /> Blood</label>
                  <select required name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none bg-white text-lg">
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-',"NA"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Contact & Identity */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-10 border-b border-slate-100 pb-4">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-2xl"><Phone className="text-blue-600" size={24} /></div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-oswald uppercase tracking-tight">{lang === 'hi' ? 'संपर्क और पहचान' : 'Contact & Identity'}</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Mail size={16} /> Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-lg" placeholder="example@mail.com" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Aadhar Number</label>
                <input required name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-lg" placeholder="1234 5678 9012" maxLength={14} inputMode="numeric" pattern="[0-9 ]*" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-lg" placeholder="9876543210" maxLength={10} inputMode="numeric" pattern="[0-9]*" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Parent's Phone</label>
                <input required name="parentsPhone" value={formData.parentsPhone} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-lg" placeholder="9876543211" maxLength={10} inputMode="numeric" pattern="[0-9]*" />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Full Address</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none h-28 text-lg" placeholder="Full residential address..."></textarea>
              </div>
            </div>
          </section>

          {/* Terms & Conditions Acceptance */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-400 text-orange-600 focus:ring-orange-500"
                required
              />
              <p className="text-sm text-slate-700 leading-relaxed">
                {lang === 'hi' ? (
                  <>
                    मैं पुष्टि करता/करती हूं कि मैंने{' '}
                    <Link to="/terms-conditions" className="text-orange-600 underline font-semibold">नियम एवं शर्तें</Link>{' '}
                    और{' '}
                    <Link to="/privacy-policy" className="text-orange-600 underline font-semibold">प्राइवेसी पॉलिसी</Link>{' '}
                    पढ़ ली है और उनसे सहमत हूं।
                  </>
                ) : (
                  <>
                    I confirm that I have read and agree to the{' '}
                    <Link to="/terms-conditions" className="text-orange-600 underline font-semibold">Terms &amp; Conditions</Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-orange-600 underline font-semibold">Privacy Policy</Link>{' '}
                    of DDKA.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* Section 3: Sports Experience */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-10 border-b border-slate-100 pb-4">
              <div className="p-2 sm:p-3 bg-green-50 rounded-2xl"><Trophy className="text-green-600" size={24} /></div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-oswald uppercase tracking-tight">{lang === 'hi' ? 'खेल का अनुभव' : 'Sports Experience'}</h3>
            </div>
            <div className="space-y-6 sm:space-y-10">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Previous Experience (if any)</label>
                <textarea name="sportsExperience" value={formData.sportsExperience} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl outline-none h-32 text-lg" placeholder="Mention clubs, tournaments, or achievements..."></textarea>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={16} /> Reason for Joining DDKA</label>
                <textarea required name="reasonForJoining" value={formData.reasonForJoining} onChange={handleChange} className="w-full px-6 py-5 border-2 border-slate-100 rounded-2xl outline-none h-32 text-lg" placeholder="Why do you want to join our association?"></textarea>
              </div>
            </div>
          </section>

          {/* Section 4: Mandatory Document Uploads */}
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-10 border-b border-slate-100 pb-4">
              <div className="p-2 sm:p-3 bg-purple-50 rounded-2xl"><Upload className="text-purple-600" size={24} /></div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-oswald uppercase tracking-tight">{t.labels.uploads}</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
              {['photo', 'front', 'back'].map((key) => (
                <div key={key} className="relative group">
                  <label className={`border-4 border-dashed ${fileNames[key] ? 'border-green-500 bg-green-50/50' : 'border-slate-200 bg-slate-50'} rounded-2xl sm:rounded-[2.5rem] p-4 xs:p-6 sm:p-8 h-48 xs:h-56 sm:h-64 flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer overflow-hidden shadow-sm`}>
                    <input required type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, key)} />
                    {previews[key] && (
                      <img src={previews[key]} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity" />
                    )}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`p-4 rounded-full mb-4 ${fileNames[key] ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                        {key === 'photo' ? <User size={32} /> : <FileText size={32} />}
                      </div>
                      <p className="text-sm font-black text-slate-700 uppercase tracking-widest">
                        {key === 'photo' ? t.labels.photo : key === 'front' ? t.labels.aadharFront : t.labels.aadharBack}
                      </p>
                      {fileNames[key] && (
                        <p className="text-xs text-blue-600 font-bold mt-2 truncate max-w-[120px] xs:max-w-[160px] bg-white px-2 xs:px-3 py-1 rounded-full">{fileNames[key]}</p>
                      )}
                    </div>
                  </label>
                  {fileNames[key] && (
                    <button onClick={(e) => removeFile(e, key)} className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full shadow-2xl hover:bg-red-600 transition-all z-20">
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4 xs:pt-6 sm:pt-10">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-orange-600 hover:bg-blue-900 text-white font-oswald text-xl xs:text-2xl sm:text-3xl uppercase py-4 xs:py-6 sm:py-8 rounded-xl xs:rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-4 group active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Validating Data...' : t.submit}
            </button>
          </div>
        </form>
      ) : (
        /* STEP 2: PAYMENT & RECEIPT VERIFICATION */
        <form onSubmit={handleFinalSubmit} className="p-2 xs:p-4 sm:p-10 md:p-16 space-y-6 xs:space-y-8 sm:space-y-12 md:space-y-16 animate-in slide-in-from-right-20 duration-1000 bg-slate-50">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-oswald font-bold text-slate-900 uppercase tracking-wide">{tp.fee}: ₹{FEES.PLAYER}</h3>
            <p className="text-slate-500 text-xl font-medium italic">{tp.upi}</p>
          </div>
          
          <div className="flex flex-col gap-6 xs:gap-8 lg:flex-row items-center justify-center lg:gap-16 overflow-x-auto">
            <div className="flex flex-col items-center w-full lg:w-auto min-w-[220px] xs:min-w-[260px] sm:min-w-[320px]">
              <div className="bg-white p-4 xs:p-6 sm:p-10 rounded-xl xs:rounded-[2rem] sm:rounded-[4rem] border-4 sm:border-8 border-white shadow-2xl mb-4 xs:mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767537928/QR_1767537816_nwcp3c.png" 
                  alt="DDKA Official QR Code" 
                  className="w-32 h-32 xs:w-40 xs:h-40 sm:w-64 sm:h-64 object-contain rounded-lg xs:rounded-2xl sm:rounded-3xl" 
                />
              </div>
              <div className="bg-blue-900 px-4 py-2 xs:px-6 xs:py-3 sm:px-12 sm:py-5 rounded-full font-black text-white shadow-2xl tracking-tighter text-base xs:text-lg sm:text-2xl border-2 sm:border-4 border-white/20">
                {tp.upiId}
              </div>
            </div>

            {/* PAYMENT SCREENSHOT UPLOAD */}
            <div className="w-full max-w-[90vw] xs:max-w-xs sm:max-w-md">
              <label className="block text-xs sm:text-sm font-black text-slate-700 text-center uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-6">Upload Payment Screenshot</label>
              <div className="relative">
                <label className={`border-4 sm:border-8 border-dashed ${fileNames.receipt ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white'} rounded-xl xs:rounded-2xl sm:rounded-[3.5rem] p-4 xs:p-6 sm:p-12 h-32 xs:h-48 sm:h-80 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden shadow-2xl`}>
                  <input required type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'receipt')} />
                  {previews.receipt ? (
                    <img src={previews.receipt} alt="Receipt Preview" className="absolute inset-0 w-full h-full object-contain p-2 xs:p-4 sm:p-8" />
                  ) : (
                    <div className="text-center">
                      <div className="p-2 xs:p-4 sm:p-6 bg-slate-50 rounded-full mb-1 xs:mb-2 sm:mb-4 inline-block"><Upload size={28} className="text-slate-300" /></div>
                      <p className="text-slate-400 font-black text-xs xs:text-sm sm:text-lg uppercase">Select Screenshot</p>
                    </div>
                  )}
                </label>
                {fileNames.receipt && (
                  <button onClick={(e) => removeFile(e, 'receipt')} className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-red-500 text-white p-2 sm:p-4 rounded-full shadow-2xl hover:rotate-90 transition-all z-20">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-[90vw] xs:max-w-xs sm:max-w-2xl mx-auto space-y-3 xs:space-y-4 sm:space-y-6">
            <label className="block text-base sm:text-lg font-black text-slate-700 text-center uppercase tracking-[0.3em] sm:tracking-[0.5em]">{tp.txId}</label>
            <input 
              required 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-4 xs:px-6 sm:px-10 py-3 xs:py-5 sm:py-8 border-4 sm:border-8 border-white rounded-lg xs:rounded-2xl sm:rounded-[3rem] focus:ring-8 sm:focus:ring-12 focus:ring-orange-100 outline-none text-center font-mono text-lg xs:text-2xl sm:text-4xl shadow-inner uppercase bg-white tracking-widest"
              placeholder="TXN123456789"
            />
          </div>

          <div className="pt-3 xs:pt-4 sm:pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting || !transactionId || !selectedFiles.receipt}
              className={`w-full bg-blue-900 hover:bg-orange-600 text-white font-oswald text-xl xs:text-2xl sm:text-4xl uppercase py-4 xs:py-6 sm:py-10 rounded-lg xs:rounded-2xl sm:rounded-[3rem] shadow-2xl transition-all active:scale-95 ${isSubmitting || !selectedFiles.receipt ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Processing Submission..." : "Complete Registration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;