import React, { useState } from 'react';
import { 
  User, Phone, FileText, Upload, CheckCircle, QrCode, X, 
  Mail, Calendar, Droplets, Trophy, MessageSquare 
} from 'lucide-react';
import { RegistrationType } from '../../types';
import type { Language } from '../../translations';
import { FEES } from '../../constants';
import { translations } from '../../translations';

interface RegisterFormProps {
  lang: Language;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ lang }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileNames(prev => ({ ...prev, [key]: file.name }));

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [key]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      }
    }
  };

  const removeFile = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setFileNames(prev => { const n = {...prev}; delete n[key]; return n; });
    setPreviews(prev => { const n = {...prev}; delete n[key]; return n; });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-2xl mx-auto my-12 animate-in zoom-in-95 duration-300 border border-green-50">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4 uppercase font-oswald">
          {lang === 'hi' ? 'पंजीकरण सफल!' : 'Registration Successful!'}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {lang === 'hi' 
            ? `धन्यवाद ${formData.fullName}, आपका आवेदन स्वीकार कर लिया गया है।` 
            : `Thank you ${formData.fullName}, your application has been submitted successfully.`}
        </p>
        <button 
          onClick={() => { setIsSuccess(false); setStep(1); setFileNames({}); setPreviews({}); }}
          className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg"
        >
          {lang === 'hi' ? 'नया पंजीकरण' : 'New Registration'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl mx-auto border border-gray-100">
      <div className="bg-blue-900 p-8 text-white relative">
        <h2 className="text-3xl font-oswald font-bold uppercase tracking-wide">{t.playerTitle}</h2>
        <p className="text-blue-200 mt-2 font-light">{step === 1 ? t.playerSubtitle : tp.title}</p>
        <div className="absolute top-8 right-8 bg-orange-600 px-4 py-2 rounded-lg font-bold shadow-lg">
          ₹{FEES.PLAYER}
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleProceedToPayment} className="p-8 space-y-8">
          
          {/* Section 1: Personal Information */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <User className="text-orange-600" size={20} />
              <h3 className="text-xl font-bold text-gray-800">{lang === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t.labels.fullName}</label>
                <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Aryan Singh" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t.labels.fathersName}</label>
                <input required name="fathersName" value={formData.fathersName} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Rajesh Kumar Singh" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Calendar size={14} /> {lang === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                </label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">{t.labels.gender}</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Droplets size={14} className="text-red-500" /> {lang === 'hi' ? 'रक्त समूह' : 'Blood Group'}
                  </label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Contact & Identity */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <Phone className="text-orange-600" size={20} />
              <h3 className="text-xl font-bold text-gray-800">{lang === 'hi' ? 'संपर्क और पहचान' : 'Contact & Identity'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Mail size={14} /> {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="example@mail.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t.labels.aadhar}</label>
                <input required name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1234 5678 9012" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t.labels.phone}</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{lang === 'hi' ? 'अभिभावक का फोन' : "Parents' Phone Number"}</label>
                <input required name="parentsPhone" value={formData.parentsPhone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 98765 43211" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t.labels.address}</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20" placeholder="Full residential address..."></textarea>
              </div>
            </div>
          </section>

          {/* Section 3: Sports Experience */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <Trophy className="text-orange-600" size={20} />
              <h3 className="text-xl font-bold text-gray-800">{lang === 'hi' ? 'खेल का अनुभव' : 'Sports Experience'}</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{lang === 'hi' ? 'खेल का अनुभव (यदि कोई हो)' : 'Sports Experience (if any)'}</label>
                <textarea name="sportsExperience" value={formData.sportsExperience} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Mention previous clubs, tournaments, or achievements..."></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <MessageSquare size={14} /> {lang === 'hi' ? 'DDKA में शामिल होने का कारण' : 'Reason for Joining DDKA'}
                </label>
                <textarea required name="reasonForJoining" value={formData.reasonForJoining} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Why do you want to join our academy?"></textarea>
              </div>
            </div>
          </section>

          {/* Section 4: Uploads */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <Upload className="text-orange-600" size={20} />
              <h3 className="text-xl font-bold text-gray-800">{t.labels.uploads}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['photo', 'front', 'back'].map((key) => (
                <div key={key} className="relative group">
                  <label className={`border-2 border-dashed ${fileNames[key] ? 'border-green-500 bg-green-50/30' : 'border-gray-300 bg-gray-50/50'} rounded-2xl p-4 h-48 flex flex-col items-center justify-center hover:border-blue-500 transition-all cursor-pointer overflow-hidden`}>
                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, key)} />
                    {previews[key] && (
                      <img src={previews[key]} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                    )}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      {key === 'photo' ? <Upload className={`${fileNames[key] ? 'text-green-600' : 'text-gray-400'} mb-2`} /> : <FileText className={`${fileNames[key] ? 'text-green-600' : 'text-gray-400'} mb-2`} />}
                      <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter px-2">
                        {key === 'photo' ? t.labels.photo : key === 'front' ? t.labels.aadharFront : t.labels.aadharBack}
                      </p>
                      {fileNames[key] && (
                        <p className="text-[9px] text-blue-700 font-medium mt-1 truncate max-w-[120px]">{fileNames[key]}</p>
                      )}
                    </div>
                  </label>
                  {fileNames[key] && (
                    <button onClick={(e) => removeFile(e, key)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors z-20">
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-oswald text-xl uppercase py-5 rounded-xl shadow-lg transition-all flex items-center justify-center ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? 'Processing...' : t.submit}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFinalSubmit} className="p-12 space-y-10 animate-in slide-in-from-right-10 duration-500">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{tp.fee}: ₹{FEES.PLAYER}</h3>
            <p className="text-gray-500">{tp.upi}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 mb-6 shadow-2xl transform hover:scale-105 transition-transform">
              <QrCode size={200} className="text-blue-900" />
            </div>
            <div className="bg-blue-900 px-8 py-3 rounded-full font-bold text-white shadow-lg">
              {tp.upiId}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <label className="block text-sm font-bold text-gray-700 text-center uppercase tracking-widest">{tp.txId}</label>
            <input 
              required 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 outline-none text-center font-mono text-2xl uppercase"
              placeholder="TXN123456"
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting || !transactionId}
              className={`w-full bg-blue-900 hover:bg-orange-600 text-white font-oswald text-xl uppercase py-5 rounded-xl shadow-lg transition-all ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? tp.processing : tp.verify}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;