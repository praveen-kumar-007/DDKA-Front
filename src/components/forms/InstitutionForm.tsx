import React, { useState } from 'react';
import { 
  Building, CheckCircle, Phone, MapPin, 
  Users, Info, Calendar, Hash, Ruler, Layers, Upload, X 
} from 'lucide-react';
import { translations } from '../../translations';
import type { Language } from '../../translations';
import { FEES } from '../../constants';

interface InstitutionFormProps {
  lang: Language;
}

const InstitutionForm: React.FC<InstitutionFormProps> = ({ lang }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  // State for Payment Screenshot
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const t = translations[lang].forms;
  const tp = translations[lang].payment;

  const [formData, setFormData] = useState({
    instType: 'School',
    instName: '',
    headName: '',
    secretaryName: '',
    regNo: '',
    year: '',
    totalPlayers: '',
    area: '',
    surfaceType: 'Both',
    officePhone: '',
    altPhone: '',
    email: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearScreenshot = () => {
    setScreenshot(null);
    setPreview('');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !screenshot) {
      alert("Please provide both Transaction ID and Payment Screenshot.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Use FormData for multipart/form-data (required for file uploads)
      const dataToSend = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      dataToSend.append('transactionId', transactionId.toUpperCase().trim());
      
      // Append the screenshot file
      dataToSend.append('screenshot', screenshot);

      const response = await fetch(`${API_URL}/api/institutions/register`, {
        method: 'POST',
        // Note: Do not set Content-Type header when sending FormData, 
        // the browser will set it automatically with the correct boundary.
        body: dataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Connection Error: Could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl mx-auto my-12 animate-in zoom-in-95 border border-green-100">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-4xl font-oswald font-bold text-gray-900 mb-4 uppercase">
          {lang === 'hi' ? 'आवेदन सफलतापूर्वक जमा' : 'APPLICATION SUBMITTED'}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          {lang === 'hi' 
            ? 'हम आपका संस्थान पंजीकरण आवेदन और भुगतान शीघ्र ही समीक्षा करेंगे।' 
            : "We will review your affiliation application and payment shortly."}
        </p>
        <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-200 mb-8">
          <p className="text-sm text-slate-500 font-bold uppercase mb-2">Transaction ID</p>
          <p className="font-mono text-xl text-blue-900">{transactionId.toUpperCase()}</p>
        </div>
        <button 
          onClick={() => { setIsSuccess(false); setStep(1); setTransactionId(''); clearScreenshot(); }}
          className="bg-blue-900 text-white px-12 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg"
        >
          {lang === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Return to Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-blue-900 text-white rounded-t-3xl p-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Building className="w-8 h-8 text-orange-400" />
              <h2 className="text-4xl font-oswald font-bold uppercase tracking-wide">{t.instTitle}</h2>
            </div>
            <p className="text-blue-100 font-light text-lg">{step === 1 ? t.instSubtitle : tp.title}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl text-center">
            <p className="text-xs uppercase font-bold text-orange-400 mb-1">{tp.fee}</p>
            <p className="text-3xl font-oswald font-bold">₹{FEES.INSTITUTION}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-b-3xl overflow-hidden border-x border-b border-gray-100">
        {step === 1 ? (
          <form onSubmit={handleProceedToPayment} className="p-8 lg:p-12 space-y-12">
            {/* Section 1: Institutional Profile */}
            <section>
              <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                <Info className="text-orange-600" size={20} />
                <h3 className="text-2xl font-bold text-blue-900 uppercase font-oswald">{lang === 'hi' ? 'संस्थान प्रोफ़ाइल' : 'Institutional Profile'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{t.labels.instType}</label>
                  <select name="instType" value={formData.instType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none">
                    <option value="School">School</option>
                    <option value="Club">Club</option>
                    <option value="College">College</option>
                    <option value="Academy">Academy</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">{t.labels.instName}</label>
                  <input required name="instName" value={formData.instName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. DAV Public School, Dhanbad" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Hash size={14}/> {lang === 'hi' ? 'पंजीकरण संख्या' : 'Registration No.'}</label>
                  <input required name="regNo" value={formData.regNo} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. REG/123/2024" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Calendar size={14}/> {lang === 'hi' ? 'स्थापना वर्ष' : 'Year of Estb.'}</label>
                  <input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="2024" />
                </div>
              </div>
            </section>

            {/* Section 2: Leadership Details */}
            <section>
              <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                <Users className="text-blue-600" size={20} />
                <h3 className="text-2xl font-bold text-blue-900 uppercase font-oswald">{lang === 'hi' ? 'नेतृत्व विवरण' : 'Leadership Details'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{lang === 'hi' ? 'संस्थान प्रमुख का नाम' : 'Head of Institution Name'}</label>
                  <input required name="headName" value={formData.headName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="Principal / Chairman Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{lang === 'hi' ? 'सचिव / खेल प्रभारी' : 'Secretary / Sports In-charge'}</label>
                  <input required name="secretaryName" value={formData.secretaryName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="Contact Person Name" />
                </div>
              </div>
            </section>

            {/* Section 3: Sports Infrastructure */}
            <section>
              <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                <Layers className="text-green-600" size={20} />
                <h3 className="text-2xl font-bold text-blue-900 uppercase font-oswald">{lang === 'hi' ? 'खेल अवसंरचना' : 'Sports Infrastructure'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{lang === 'hi' ? 'कुल खिलाड़ी' : 'Total Kabaddi Players'}</label>
                  <input required type="number" name="totalPlayers" value={formData.totalPlayers} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Ruler size={14}/> {lang === 'hi' ? 'खेल का मैदान (वर्ग फुट)' : 'Playground Area (sq.ft)'}</label>
                  <input required name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="e.g. 2000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{lang === 'hi' ? 'सतह का प्रकार' : 'Surface Type'}</label>
                  <select name="surfaceType" value={formData.surfaceType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none">
                    <option value="Grass">Grass</option>
                    <option value="Mat">Kabaddi Mat</option>
                    <option value="Both">Both (Grass & Mat)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 4: Contact Information */}
            <section>
              <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                <Phone className="text-purple-600" size={20} />
                <h3 className="text-2xl font-bold text-blue-900 uppercase font-oswald">{lang === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{t.labels.officePhone}</label>
                  <input required name="officePhone" value={formData.officePhone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="+91 XXXX XXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{lang === 'hi' ? 'वैकल्पिक फोन' : 'Alternative Phone'}</label>
                  <input name="altPhone" value={formData.altPhone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="+91 XXXX XXXXXX" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">{t.labels.email}</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="institution@email.com" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><MapPin size={14}/> {t.labels.address}</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl h-32 outline-none" placeholder={t.placeholders.address}></textarea>
                </div>
              </div>
            </section>

            <div className="pt-10">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-blue-900 text-white font-oswald text-2xl uppercase py-6 rounded-2xl shadow-xl transition-all"
              >
                {isSubmitting ? 'Validating...' : t.instSubmit}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="p-12 lg:p-20 space-y-12 bg-slate-50">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-3xl font-oswald font-bold text-gray-900 mb-4 uppercase">{tp.method}</h3>
              <p className="text-gray-500 text-lg mb-10">{tp.upi}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-blue-50 mb-8 transform hover:scale-105 transition-transform">
                <img 
                  src={"https://res.cloudinary.com/dcqo5qt7b/image/upload/v1766767120/QR_1766767090_adh5z3.png"} 
                  alt="UPI QR Code" 
                  className="w-64 h-64 object-contain rounded-xl" 
                />
              </div>
              <div className="bg-blue-900 px-8 py-3 rounded-full font-mono font-bold text-white shadow-lg tracking-wider text-lg">
                {tp.upiId}
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-8 pt-10">
              {/* Transaction ID Input */}
              <div>
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest text-center mb-3">{tp.txId}</label>
                <input 
                  required 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl outline-none text-center font-mono text-2xl shadow-inner uppercase focus:ring-4 focus:ring-orange-100 transition-all"
                  placeholder="TXNXXXXXXXXX"
                />
              </div>

              {/* NEW: Screenshot Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest text-center">
                  {lang === 'hi' ? 'भुगतान स्क्रीनशॉट अपलोड करें' : 'Upload Payment Screenshot'}
                </label>
                
                <div className="relative">
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-200 rounded-2xl bg-white hover:bg-blue-50 transition-colors cursor-pointer group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform mb-3" />
                        <p className="text-sm text-gray-500 font-medium">
                          {lang === 'hi' ? 'फ़ाइल चुनें या यहाँ खींचें' : 'Choose file or drag here'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input required type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-lg bg-white">
                      <img src={preview} alt="Payment Preview" className="w-full h-full object-contain p-2" />
                      <button 
                        type="button"
                        onClick={clearScreenshot}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-12 max-w-lg mx-auto">
              <button 
                type="submit" 
                disabled={isSubmitting || !transactionId || !screenshot}
                className={`w-full bg-blue-900 hover:bg-orange-600 text-white font-oswald text-2xl uppercase py-6 rounded-2xl shadow-2xl transition-all ${isSubmitting || !transactionId || !screenshot ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {isSubmitting ? tp.processing : tp.verify}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InstitutionForm;