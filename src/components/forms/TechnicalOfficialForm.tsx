import React, { useState, useRef } from 'react';
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Upload,
  CheckCircle
} from 'lucide-react';
import type { Language } from '../../translations';
import ReCAPTCHA from 'react-google-recaptcha';

interface TechnicalOfficialFormProps {
  lang: Language;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const TechnicalOfficialForm: React.FC<TechnicalOfficialFormProps> = ({ lang }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    candidateName: '',
    parentName: '',
    dob: '',
    address: '',
    aadharNumber: '',
    gender: 'Male',
    bloodGroup: 'NA',
    playerLevel: 'District',
    work: '',
    mobile: '',
    education: '',
    email: '',
    transactionId: '',
    confirmation: false
  });

  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
   const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
   const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [botField, setBotField] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === 'aadharNumber') {
      let digits = value.replace(/\D/g, '').slice(0, 12);
      let formatted = '';
      for (let i = 0; i < digits.length; i += 4) {
        if (i > 0) formatted += ' ';
        formatted += digits.substr(i, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === 'mobile') {
      let digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digits }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'signature' | 'photo' | 'receipt') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(lang === 'hi' ? 'फ़ाइल का आकार 10 एमबी से कम होना चाहिए।' : 'File size must be less than 10 MB.');
      e.target.value = '';
      return;
    }

    if (key === 'signature') {
      setSignatureFile(file);
      setSignaturePreview(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      });
    }

    if (key === 'photo') {
      setPhotoFile(file);
      setPhotoPreview(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      });
    }

    if (key === 'receipt') {
      setReceiptFile(file);
      setReceiptPreview(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signatureFile || !photoFile || !receiptFile) {
      alert(
        lang === 'hi'
          ? 'कृपया हस्ताक्षर, पासपोर्ट साइज़ फोटो और भुगतान की स्क्रीिनशॉट अपलोड करें।'
          : 'Please upload Signature, Passport Size Photo and Payment Screenshot.'
      );
      return;
    }

    if (!formData.transactionId.trim()) {
      alert(
        lang === 'hi'
          ? 'कृपया भुगतान का ट्रांजैक्शन आईडी दर्ज करें।'
          : 'Please enter the payment Transaction ID.'
      );
      return;
    }

    if (!formData.confirmation) {
      alert(
        lang === 'hi'
          ? 'कृपया सुनिश्चित करें कि ऊपर दी गई सभी जानकारी सही है।'
          : 'Please confirm that all details are correct.'
      );
      return;
    }

    if (recaptchaSiteKey && !captchaToken) {
      alert(
        lang === 'hi'
          ? 'कृपया फ़ॉर्म जमा करने से पहले reCAPTCHA पूरा करें।'
          : 'Please complete the reCAPTCHA before submitting.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const form = new FormData();

      form.append('candidateName', formData.candidateName);
      form.append('parentName', formData.parentName);
      form.append('dob', formData.dob);
      form.append('address', formData.address);
      form.append('aadharNumber', formData.aadharNumber);
      form.append('gender', formData.gender);
      form.append('bloodGroup', formData.bloodGroup);
      form.append('playerLevel', formData.playerLevel);
      form.append('work', formData.work);
      form.append('mobile', formData.mobile);
      form.append('education', formData.education);
      form.append('email', formData.email);
      form.append('transactionId', formData.transactionId.toUpperCase().trim());

      form.append('botField', botField);
      if (captchaToken) {
        form.append('recaptchaToken', captchaToken);
      }

      if (signatureFile) form.append('signature', signatureFile);
      if (photoFile) form.append('photo', photoFile);
      if (receiptFile) form.append('receipt', receiptFile);

      const response = await fetch(`${API_URL}/api/technical-officials/register`, {
        method: 'POST',
        body: form
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setBotField('');
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(result.message || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Connection error. Please check if backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl mx-auto text-center border border-green-100">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-oswald font-bold text-slate-900 mb-3 uppercase tracking-wide">
          {lang === 'hi' ? 'टेक्निकल ऑफिशियल फॉर्म सबमिट' : 'Technical Official Form Submitted'}
        </h2>
        <p className="text-slate-600 text-lg">
          {lang === 'hi'
            ? 'टेक्निकल ऑफिशियल के रूप में पंजीकरण के लिए धन्यवाद। आपकी जानकारी रिकॉर्ड कर ली गई है।'
            : 'Thank you for registering as a Technical Official. Your details have been recorded.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl max-w-4xl mx-auto border border-slate-100 overflow-hidden">
      <div className="bg-blue-900 px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-oswald font-bold uppercase tracking-wide">
            {lang === 'hi' ? 'टेक्निकल ऑफिशियल पंजीकरण' : 'Technical Official Registration'}
          </h1>
          <p className="text-blue-200 mt-2 text-sm sm:text-base">
            {lang === 'hi'
              ? 'DDKA टेक्निकल ऑफिशियल पंजीकरण के लिए समर्पित फॉर्म।'
              : 'Dedicated form for DDKA Technical Officials registration.'}
          </p>
        </div>
      </div>

      {/* Sample ID card preview */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 sm:px-8 py-6 flex flex-col items-center gap-4 text-center">
        <div className="text-sm text-slate-700 max-w-2xl">
          <p className="font-semibold text-slate-900 mb-1">
            {lang === 'hi' ? 'परीक्षा के बाद प्राप्त आईडी कार्ड' : 'ID Card after Examination'}
          </p>
          <p>
            {lang === 'hi'
              ? 'DDKA टेक्निकल ऑफिशियल परीक्षा सफलतापूर्वक उत्तीर्ण करने के बाद अभ्यर्थी को नीचे दिखाए गए के समान आधिकारिक DDKA टेक्निकल ऑफिशियल आईडी कार्ड प्राप्त होगा।'
              : 'After successfully qualifying the DDKA Technical Official examination, candidates will receive an official DDKA Technical Official ID card similar to the one shown below.'}
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767535733/Screenshot_2026-01-04_193603_js6bvo.png"
          alt="Sample DDKA Technical Official ID Card issued after exam"
          className="w-full max-w-sm rounded-xl border border-slate-200 shadow-md bg-white"
        />
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 md:p-10 space-y-8 bg-slate-50">
        {/* Personal Details */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-1">
            <div className="p-2 bg-orange-50 rounded-xl">
              <User className="text-orange-600" size={22} />
            </div>
            <h2 className="text-lg sm:text-xl font-oswald font-bold text-slate-800 uppercase tracking-wide">
              {lang === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal Details'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Name of Candidate *
              </label>
              <input
                name="candidateName"
                required
                value={formData.candidateName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Father's / Mother's Name *
              </label>
              <input
                name="parentName"
                required
                value={formData.parentName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter parent name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} /> Full Address *
            </label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 h-24"
              placeholder="House No., Street, Area, City, State, PIN"
            />
          </div>
        </section>

        {/* Identity & Contact */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-1">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Phone className="text-blue-600" size={22} />
            </div>
            <h2 className="text-lg sm:text-xl font-oswald font-bold text-slate-800 uppercase tracking-wide">
              {lang === 'hi' ? 'पहचान और संपर्क' : 'Identity & Contact'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Aadhar Number *
              </label>
              <input
                name="aadharNumber"
                required
                value={formData.aadharNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="1234 5678 9012"
                maxLength={14}
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Mobile Number *
              </label>
              <input
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="9876543210"
                maxLength={10}
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} /> Email ID *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="example@mail.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Work / Job *
              </label>
              <input
                name="work"
                required
                value={formData.work}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Occupation / Job role"
              />
            </div>
          </div>
        </section>

        {/* Technical Profile */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-1">
            <div className="p-2 bg-green-50 rounded-xl">
              <FileText className="text-green-600" size={22} />
            </div>
            <h2 className="text-lg sm:text-xl font-oswald font-bold text-slate-800 uppercase tracking-wide">
              {lang === 'hi' ? 'टेक्निकल प्रोफाइल' : 'Technical Profile'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Gender *
              </label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="NA">NA (Not Known)</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Player Level *
              </label>
              <select
                name="playerLevel"
                required
                value={formData.playerLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="District">District</option>
                <option value="State">State</option>
                <option value="National">National</option>
                <option value="Never Played">Never Played</option>
                <option value="Official">Official</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Highest Education *
              </label>
              <input
                name="education"
                required
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g. B.P.Ed, M.P.Ed, Graduate"
              />
            </div>
          </div>
        </section>

        {/* Exam Fee & Payment */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-1">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Upload className="text-purple-600" size={22} />
            </div>
            <h2 className="text-lg sm:text-xl font-oswald font-bold text-slate-800 uppercase tracking-wide">
              {lang === 'hi' ? 'परीक्षा शुल्क और भुगतान' : 'Exam Fee & Payment'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4 text-center">
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-widest">
                {lang === 'hi' ? 'परीक्षा शुल्क' : 'Exam Fee'}
              </p>
              <p className="text-3xl sm:text-4xl font-oswald font-bold text-blue-900">₹1000</p>
              <p className="text-xs text-slate-500">
                {lang === 'hi'
                  ? 'कृपया नीचे दिए गए QR कोड पर ₹1000 परीक्षा शुल्क का ऑनलाइन भुगतान करें और भुगतान की स्क्रीनशॉट अपलोड करें।'
                  : 'Please pay ₹1000 exam fee to the QR code below and upload the payment screenshot.'}
              </p>
              <div className="mt-4 inline-block bg-white p-4 rounded-2xl border-4 border-slate-100 shadow-md">
                <img
                  src="https://res.cloudinary.com/dcqo5qt7b/image/upload/v1767538633/QR_1767538244_eukaxr.png"
                  alt="DDKA Official QR Code"
                  className="w-40 h-40 sm:w-52 sm:h-52 object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  {lang === 'hi' ? 'ट्रांजैक्शन आईडी *' : 'Transaction ID *'}
                </label>
                <input
                  name="transactionId"
                  required
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono uppercase tracking-widest"
                  placeholder={lang === 'hi' ? 'UPI/बैंक ट्रांजैक्शन आईडी दर्ज करें' : 'Enter UPI/Bank Transaction ID'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  {lang === 'hi' ? 'भुगतान स्क्रीनशॉट अपलोड करें *' : 'Upload Payment Screenshot *'}
                </label>
                <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'receipt')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white shadow-sm">
                      <Upload className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-700">
                        {receiptFile
                          ? (lang === 'hi' ? 'फाइल चुनी गई - स्क्रीनशॉट अपडेट करने के लिए फिर से क्लिक करें।' : 'File selected - click again to change screenshot.')
                          : (lang === 'hi' ? 'भुगतान का स्क्रीनशॉट चुनने के लिए क्लिक करें।' : 'Click to select payment screenshot.')}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {lang === 'hi'
                          ? 'केवल इमेज फाइल (JPG/PNG), अधिकतम 10 MB.'
                          : 'Image files only (JPG/PNG), max 10 MB.'}
                      </p>
                    </div>
                  </div>
                  {receiptPreview && (
                    <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <img
                        src={receiptPreview}
                        alt="Payment Screenshot Preview"
                        className="w-full max-h-52 object-contain bg-slate-50"
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Uploads */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-1">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Upload className="text-purple-600" size={22} />
            </div>
            <h2 className="text-lg sm:text-xl font-oswald font-bold text-slate-800 uppercase tracking-wide">
              {lang === 'hi' ? 'दस्तावेज़ अपलोड' : 'Uploads'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Signature * (Max 10 MB)
              </label>
              <label className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:border-blue-400 text-sm text-slate-700">
                <span>{signatureFile ? signatureFile.name : 'Upload 1 supported file. Max 10 MB.'}</span>
                <Upload size={18} className="text-slate-500" />
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'signature')}
                />
              </label>
              {signaturePreview && (
                <div className="mt-2 inline-block rounded-lg border border-slate-200 bg-white p-1">
                  <img
                    src={signaturePreview}
                    alt="Signature preview"
                    className="h-20 w-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Photo Passport Size * (Max 10 MB)
              </label>
              <label className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:border-blue-400 text-sm text-slate-700">
                <span>{photoFile ? photoFile.name : 'Upload 1 supported file. Max 10 MB.'}</span>
                <Upload size={18} className="text-slate-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'photo')}
                />
              </label>
              {photoPreview && (
                <div className="mt-2 inline-block rounded-lg border border-slate-200 bg-white p-1">
                  <img
                    src={photoPreview}
                    alt="Passport photo preview"
                    className="h-24 w-24 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Confirmation */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="confirmation"
              checked={formData.confirmation}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded border-slate-400 text-orange-600 focus:ring-orange-500"
              required
            />
            <p className="text-sm text-slate-700 leading-relaxed">
              {lang === 'hi'
                ? 'मैं पुष्टि करता/करती हूं कि ऊपर दी गई सभी जानकारी मेरे ज्ञान के अनुसार सही है।'
                : 'I confirm that all details provided above are true and correct to the best of my knowledge.'}
            </p>
          </div>
        </section>

        {/* Honeypot + reCAPTCHA (kept at the end, just before submission) */}
        <section className="space-y-4">
          <input
            type="text"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          {recaptchaSiteKey && (
            <div className="pt-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={(token: string | null) => setCaptchaToken(token)}
              />
            </div>
          )}
        </section>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-orange-600 hover:bg-blue-900 text-white font-oswald text-lg sm:text-2xl uppercase py-4 sm:py-5 rounded-2xl shadow-xl transition-all ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting
              ? lang === 'hi'
                ? 'सबमिट किया जा रहा है...'
                : 'Submitting...'
              : lang === 'hi'
                ? 'टेक्निकल ऑफिशियल फॉर्म सबमिट करें'
                : 'Submit Technical Official Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TechnicalOfficialForm;
