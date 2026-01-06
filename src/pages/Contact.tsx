import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone, Info, ChevronDown, ChevronUp, Youtube, Instagram, Twitter, Facebook } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FAQS = [
	{
		question: {
			en: 'How can I join DDKA or participate in events?',
			hi: 'मैं DDKA में कैसे शामिल हो सकता हूँ या कार्यक्रमों में भाग ले सकता हूँ?',
		},
		answer: {
			en: 'You can register as a player or institution using the registration page. For event participation, keep an eye on our News section for announcements.',
			hi: 'आप पंजीकरण पृष्ठ का उपयोग करके खिलाड़ी या संस्था के रूप में पंजीकरण कर सकते हैं। कार्यक्रमों में भाग लेने के लिए, घोषणाओं के लिए हमारे समाचार अनुभाग पर नज़र रखें।',
		},
	},
	{
		question: {
			en: 'Where is DDKA located?',
			hi: 'DDKA कहाँ स्थित है?',
		},
		answer: {
			en: 'Retired Rly Colony, Gomoh, Dhanbad, Jharkhand 828401',
			hi: 'रिटायर्ड रेलवे कॉलोनी, गोमो, धनबाद, झारखंड 828401',
		},
	},
	{
		question: {
			en: 'How do I contact for support or queries?',
			hi: 'सहायता या प्रश्नों के लिए मैं कैसे संपर्क करूँ?',
		},
		answer: {
			en: 'You can use the contact form or email us at dhanbaddistrictkabaddi@gmail.com. For urgent queries, call +91 9123163206.',
			hi: 'आप संपर्क फ़ॉर्म का उपयोग कर सकते हैं या हमें dhanbaddistrictkabaddi@gmail.com पर ईमेल कर सकते हैं। त्वरित सहायता के लिए, +91 9123163206 पर कॉल करें।',
		},
	},
];

const Contact: React.FC<{ lang?: 'en' | 'hi' }> = ({ lang = 'en' }) => {
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
	});
	const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
		'idle'
	);
	const [faqOpen, setFaqOpen] = useState<number | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('sending');
		try {
			const res = await fetch(`${API_URL}/api/contact`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			});
			const result = await res.json().catch(() => null);
			if (res.ok && result && result.success) {
				setStatus('sent');
				setForm({ name: '', email: '', phone: '', subject: '', message: '' });
			} else {
				setStatus('error');
			}
		} catch {
			setStatus('error');
		}
	};

	return (
		<>
			<Helmet>
				<title>
					{lang === 'hi'
						? 'संपर्क करें | धनबाद जिला कबड्डी संघ (DDKA)'
						: 'Contact DDKA | Dhanbad District Kabaddi Association, Jharkhand'}
				</title>
				<meta
					name="description"
					content={
						lang === 'hi'
							? 'धनबाद जिला कबड्डी संघ (DDKA) से संपर्क करें – पता, फोन, ईमेल और ऑनलाइन संपर्क फ़ॉर्म के माध्यम से धनबाद, झारखंड में कबड्डी से जुड़ी सभी जानकारी प्राप्त करें।'
							: 'Contact Dhanbad District Kabaddi Association (DDKA) – address, phone, email and contact form for Kabaddi-related queries in Dhanbad, Jharkhand.'
					}
				/>
					<meta
						name="keywords"
						content="Contact DDKA, contact Dhanbad Kabaddi Association, Kabaddi enquiries Dhanbad, Kabaddi Jharkhand contact, jaan kabaddi contact, dhanbad kabaddi office, kabaddi association of jharkhand dhanbad"
					/>
			</Helmet>
			<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-0 px-0">
			<div className="w-full bg-gradient-to-b from-orange-50 to-white py-16 px-2 text-center">
				<h1 className="text-5xl font-extrabold mb-2 text-blue-900 drop-shadow">
					Contact <span className="text-orange-500">DDKA</span>
				</h1>
				<p className="text-lg text-slate-700 mb-6">
					{lang === 'hi'
						? 'हमसे संपर्क करें - हम आपकी सहायता के लिए यहाँ हैं'
						: "Get in touch with us - we're here to help you succeed"}
				</p>
			</div>
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4 md:px-8 -mt-10">
				{/* Association Details */}
				<div className="bg-white rounded-2xl p-8 text-slate-800 shadow-xl flex flex-col gap-6 border border-slate-100">
					<h2 className="text-2xl font-bold mb-2 text-blue-900">
						{lang === 'hi' ? 'हमसे संपर्क करें' : 'Get in Touch'}
					</h2>
					<p className="text-slate-600 mb-4 text-sm">
						{lang === 'hi'
							? 'क्या आप कबड्डी में अपना करियर शुरू करना चाहते हैं? हमारे कार्यक्रमों के बारे में प्रश्न हैं? हम आपकी सहायता के लिए यहाँ हैं!'
							: "Ready to start your kabaddi journey? Have questions about our association or events? We'd love to hear from you!"}
					</p>
					<div className="flex items-start gap-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
						<MapPin className="text-orange-500 w-8 h-8" />
						<div>
							<div className="font-bold text-blue-900">
								{lang === 'hi' ? 'पता' : 'Address'}
							</div>
							<div className="text-sm">{CONTACT_INFO.address}</div>
						</div>
					</div>
					<div className="flex items-start gap-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
						<Phone className="text-orange-500 w-8 h-8" />
						<div>
							<div className="font-bold text-blue-900">
								{lang === 'hi' ? 'फ़ोन' : 'Phone'}
							</div>
							<div className="text-sm">{CONTACT_INFO.phone}</div>
						</div>
					</div>
					<div className="flex items-start gap-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
						<Mail className="text-orange-500 w-8 h-8" />
						<div>
							<div className="font-bold text-blue-900">
								{lang === 'hi' ? 'ईमेल' : 'Email'}
							</div>
							<a
								href={`mailto:${CONTACT_INFO.email}`}
								className="underline text-blue-900 hover:text-orange-500 text-sm"
							>
								{CONTACT_INFO.email}
							</a>
						</div>
					</div>
					<div className="flex items-start gap-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
						<Info className="text-orange-500 w-8 h-8" />
						<div>
							<div className="font-bold text-blue-900">
								{lang === 'hi' ? 'संघ का नाम' : 'Association Name'}
							</div>
							<div className="text-sm">
								Dhanbad District Kabaddi Association (DDKA)
							</div>
							<div className="text-xs text-slate-600 mt-1">
								{lang === 'hi'
									? 'झारखंड राज्य कबड्डी संघ से संबद्ध (AKFI मान्यता प्राप्त)'
									: 'Affiliated to Jharkhand State Kabaddi Association (Recognized by AKFI)'}
							</div>
						</div>
					</div>
					{/* Social Media Links */}
					<div className="mt-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
						<div className="text-sm font-bold text-blue-900 mb-3">
							{lang === 'hi' ? 'सोशल मीडिया पर DDKA से जुड़ें' : 'Connect with DDKA on Social Media'}
						</div>
						<div className="flex flex-wrap items-center gap-3 justify-between sm:justify-start">
							<a
								href={SOCIAL_LINKS.youtube}
								target="_blank"
								rel="noreferrer"
								aria-label="DDKA YouTube Channel"
								className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-red-500/80 hover:bg-red-50 active:bg-red-100 text-[10px] font-semibold transition-all shadow-sm hover:shadow-md active:shadow-inner w-[48%] sm:w-auto justify-center"
							>
								<span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-red-400 group-hover:bg-black group-hover:text-red-300 transition-all">
									<Youtube className="w-3 h-3" />
								</span>
								<span className="tracking-wide">YouTube</span>
							</a>
							<a
								href={SOCIAL_LINKS.instagram}
								target="_blank"
								rel="noreferrer"
								aria-label="DDKA Instagram"
								className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-pink-500/80 hover:bg-pink-50 active:bg-pink-100 text-[10px] font-semibold transition-all shadow-sm hover:shadow-md active:shadow-inner w-[48%] sm:w-auto justify-center"
							>
								<span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-pink-400 group-hover:bg-black group-hover:text-pink-300 transition-all">
									<Instagram className="w-3 h-3" />
								</span>
								<span className="tracking-wide">Instagram</span>
							</a>
							<a
								href={SOCIAL_LINKS.x}
								target="_blank"
								rel="noreferrer"
								aria-label="DDKA X (Twitter)"
								className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-500/80 hover:bg-blue-50 active:bg-blue-100 text-[10px] font-semibold transition-all shadow-sm hover:shadow-md active:shadow-inner w-[48%] sm:w-auto justify-center"
							>
								<span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-sky-400 group-hover:bg-black group-hover:text-sky-300 transition-all">
									<Twitter className="w-3 h-3" />
								</span>
								<span className="tracking-wide">X</span>
							</a>
								<a
									href={SOCIAL_LINKS.facebook}
									target="_blank"
									rel="noreferrer"
									aria-label="DDKA Facebook Page"
								className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-700/80 hover:bg-blue-50 active:bg-blue-100 text-[10px] font-semibold transition-all shadow-sm hover:shadow-md active:shadow-inner w-[48%] sm:w-auto justify-center"
								>
								<span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-blue-400 group-hover:bg-black group-hover:text-blue-300 transition-all">
									<Facebook className="w-3 h-3" />
								</span>
								<span className="tracking-wide">Facebook</span>
								</a>
						</div>
					</div>
				</div>
				{/* Contact Form */}
				<div className="bg-white rounded-2xl p-8 text-slate-800 shadow-xl border border-slate-100">
					<h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-900">
						<Mail className="text-orange-500" />{' '}
						{lang === 'hi' ? 'संदेश भेजें' : 'Send us a Message'}
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<label className="block text-sm font-bold mb-1 text-blue-900">
									{lang === 'hi' ? 'पूरा नाम' : 'Full Name'} *
								</label>
								<input
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 rounded bg-slate-50 text-blue-900 border border-slate-200 focus:border-orange-400 outline-none"
									placeholder={
										lang === 'hi'
											? 'अपना नाम दर्ज करें'
											: 'Enter your full name'
									}
								/>
							</div>
							<div className="flex-1">
								<label className="block text-sm font-bold mb-1 text-blue-900">
									{lang === 'hi' ? 'ईमेल' : 'Email Address'} *
								</label>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 rounded bg-slate-50 text-blue-900 border border-slate-200 focus:border-orange-400 outline-none"
									placeholder={
										lang === 'hi' ? 'आपका ईमेल' : 'your.email@example.com'
									}
								/>
							</div>
						</div>
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<label className="block text-sm font-bold mb-1 text-blue-900">
									{lang === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'} *
								</label>
								<input
									type="text"
									name="phone"
									value={form.phone}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 rounded bg-slate-50 text-blue-900 border border-slate-200 focus:border-orange-400 outline-none"
									placeholder={
										lang === 'hi' ? 'अपना फ़ोन नंबर' : 'Enter your phone number'
									}
								/>
							</div>
							<div className="flex-1">
								<label className="block text-sm font-bold mb-1 text-blue-900">
									{lang === 'hi' ? 'विषय' : 'Subject'}
								</label>
								<input
									type="text"
									name="subject"
									value={form.subject}
									onChange={handleChange}
									className="w-full px-4 py-2 rounded bg-slate-50 text-blue-900 border border-slate-200 focus:border-orange-400 outline-none"
									placeholder={
										lang === 'hi'
											? 'आपका संदेश किस बारे में है?'
											: 'What is your message about?'
									}
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-bold mb-1 text-blue-900">
								{lang === 'hi' ? 'संदेश' : 'Message'} *
							</label>
							<textarea
								name="message"
								value={form.message}
								onChange={handleChange}
								required
								rows={4}
								className="w-full px-4 py-2 rounded bg-slate-50 text-blue-900 border border-slate-200 focus:border-orange-400 outline-none"
								placeholder={
									lang === 'hi'
										? 'अपना संदेश लिखें...'
										: 'Tell us more about your inquiry...'
								}
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded transition-all"
							disabled={status === 'sending'}
						>
							{status === 'sending'
								? lang === 'hi'
									? 'भेजा जा रहा है...'
									: 'Sending...'
								: lang === 'hi'
								? 'भेजें'
								: 'Send Message'}
						</button>
						{status === 'sent' && (
							<div className="text-green-600 text-sm font-bold mt-2">
								{lang === 'hi'
									? 'धन्यवाद! आपका संदेश भेज दिया गया है।'
									: 'Thank you! Your message has been sent.'}
							</div>
						)}
						{status === 'error' && (
							<div className="text-red-600 text-sm font-bold mt-2">
								{lang === 'hi'
									? 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
									: 'Something went wrong. Please try again.'}
							</div>
						)}
					</form>
				</div>
			</div>
			{/* FAQ Section */}
			<div className="max-w-4xl mx-auto mt-16 mb-24 px-4">
				<h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
					{lang === 'hi'
						? 'अक्सर पूछे जाने वाले प्रश्न'
						: 'Frequently Asked Questions'}
				</h2>
				<div className="space-y-4">
					{FAQS.map((faq, idx) => (
						<div
							key={idx}
							className="bg-orange-50 rounded-xl p-5 text-blue-900 shadow flex flex-col border border-orange-100"
						>
							<button
								onClick={() =>
									setFaqOpen(faqOpen === idx ? null : idx)
								}
								className="flex items-center justify-between w-full text-left font-semibold text-lg focus:outline-none"
							>
								<span>{faq.question[lang]}</span>
								{faqOpen === idx ? (
									<ChevronUp className="text-orange-500" />
								) : (
									<ChevronDown className="text-orange-500" />
								)}
							</button>
							{faqOpen === idx && (
								<div className="mt-3 text-slate-700 text-base animate-in fade-in duration-300">
									{faq.answer[lang]}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
		</>
	);
};

export default Contact;
