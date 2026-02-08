export type Language = 'en' | 'hi';

export const translations = {
  en: {
    nav: { home: 'Home', about: 'About', gallery: 'Gallery', news: 'News', register: 'Registration', institution: 'Institution', donate: 'Donate', affiliated: 'Affiliated', affiliatedInstitutions: 'Affiliated Institutions' },
    donate: { title: 'Support DDKA', subtitle: 'Help us build grassroots kabaddi', upiId: '9504904499@upi', bankDetails: 'Account: DDKA | A/C No: 1234567890 | IFSC: ABCD0123456' },
    hero: { 
      badge: 'District League 2026', slogan: 'Sport of the Soil, Sport of the Nation, Kabaddi Our Sport', title: 'Le Panga,', subtitle: 'Dhanbad District!', 
      description: 'Promoting excellence in Kabaddi across Dhanbad district.',
      ctaPrimary: 'Register Now', ctaSecondary: 'View Schedule',
      stats: { clubs: 'Active Clubs', players: 'Registered Players', titles: 'Championships', support: 'Support' }
    },
    features: {
      title: 'Our Impact',
      items: [
        { title: 'Championships', desc: 'Organizing district level tournaments.' },
        { title: 'Community', desc: 'Building a strong network of players.' },
        { title: 'Training', desc: 'Providing professional coaching.' },
        { title: 'Awards', desc: 'Recognizing excellence in the sport.' }
      ]
    },
    news: { latest: 'Latest News', curated: 'Handpicked updates', title: 'News Feed', subtitle: 'Stay Updated', refresh: 'Refresh', readMore: 'Read Full Story' },
    forms: {
      playerTitle: 'Player Registration', playerSubtitle: 'Join the DDKA family',
      instTitle: 'Institution Affiliation', instSubtitle: 'Register your school or club',
      submit: 'Submit Registration', instSubmit: 'Proceed to Payment',
      labels: {
        fullName: 'Full Name', fathersName: "Father's Name", gender: 'Gender', dob: 'Date of Birth',
        bloodGroup: 'Blood Group', aadhar: 'Aadhar Number', email: 'Email', phone: 'Phone Number',
        parentsPhone: 'Parents Phone', address: 'Full Address', registerAs: 'Register As',
        experience: 'Experience', reason: 'Reason for Joining', uploads: 'Required Documents',
        photo: 'Passport Photo', aadharFront: 'Aadhar Front', aadharBack: 'Aadhar Back',
        instType: 'Type', instName: 'Institution Name', regNo: 'Registration No', year: 'Est. Year',
        headName: 'Principal/Head Name', secretaryName: 'Secretary Name', surfaceType: 'Surface',
        area: 'Field Area (sqft)', totalPlayers: 'Total Players', officePhone: 'Office Phone'
      },
      placeholders: {
        fullName: 'John Doe', fathersName: 'Richard Doe', bloodGroup: 'O+', 
        instName: 'Modern Public School', address: 'Enter Address', experience: 'Years of play', reason: 'Why Kabaddi?'
      }
    },
    payment: {
      title: 'Payment Verification', fee: 'Application Fee', method: 'Scan & Pay',
      upi: 'Pay via any UPI App', upiId: '9504904499@upi', txId: 'Enter Transaction ID',
      verify: 'Verify Payment', processing: 'Verifying...', note: 'Valid for current season.'
    },
    footer: { desc: 'The official governing body for Kabaddi in Dhanbad.', quickLinks: 'Quick Links', contact: 'Contact Us' },
    affiliation: {
      line1: 'Affiliated To - JHARKHAND STATE KABADDI ASSOCIATION',
      line2: 'Registered with 1860 Govt. of Jharkhand',
      line3: 'Affiliated for - A.K.F.I. & Jharkhand Olympic Association'
    },
    verification: {
      navLabel: 'Verification Center',
      heroTitle: 'Official Verification Hub',
      heroSubtitle: 'Single lookup for players, referees, and institutions',
      heroDescription: 'Enter any registered ID, email, phone, or Aadhaar to instantly view the authenticated status, snapshot, and role history.',
      checklist: [
        'Use the ID, registration number, email, phone, or Aadhaar you received from DDKA',
        'See photo, DOB, and father name alongside the badge',
        'Auto-detect player, referee, and institution roles without extra input'
      ],
      form: {
        heading: 'Lookup by ID',
        subheading: 'Enter the registered ID, email, phone, or Aadhaar number; no extra inputs are required.',
        fields: {
          idNumber: 'ID / Email / Phone / Aadhaar'
        },
        loading: 'Checking...',
        submit: 'Check Status'
      },
      statuses: {
        verified: 'Verified',
        pending: 'Pending',
        rejected: 'Rejected'
      },
      statusCopy: {
        verified: {
          badge: 'LIVE',
          title: 'Verified',
          detail: 'Your documents and records match DDKA files.'
        },
        pending: {
          badge: 'IN REVIEW',
          title: 'Pending',
          detail: 'Admin team is reviewing supporting documents for this ID.'
        },
        rejected: {
          badge: 'REJECTED',
          title: 'Rejected',
          detail: 'Please contact the DDKA office to correct the highlighted information.'
        }
      },
      snapshot: {
        summary: 'Verification snapshot',
        summaryDetail: 'Role-specific breakdown for the submitted ID',
        message: 'We will notify you on the registered email or phone once the verification is finalized.'
      },
      guidance: {
        spotlight: 'Records sync nightly at 02:00 AM; reach out to DDKA if you notice a discrepancy.'
      },
      errors: {
        notFound: 'No record matches that ID. Please verify and try again.',
        fetchFailed: 'Unable to reach the verification service. Please try again shortly.'
      },
      tableHeaders: {
        role: 'Role',
        name: 'Name',
        fatherName: 'Father',
        dob: 'DOB',
        idNumber: 'ID Number'
      },
      roleNames: {
        player: 'Player',
        official: 'Referee',
        institute: 'Institution'
      }
    }
  },
  hi: {
    nav: { home: 'होम', about: 'हमारे बारे में', gallery: 'गैलरी', news: 'खबरें', register: 'पंजीकरण', institution: 'संस्थान', donate: 'दान करें', affiliated: 'संबद्ध', affiliatedInstitutions: 'संबद्ध संस्थान' },
    donate: { title: 'DDKA का समर्थन करें', subtitle: 'स्थानीय कबड्डी के विकास में मदद करें', upiId: '9504904499@upi', bankDetails: 'खाता: DDKA | A/C No: 1234567890 | IFSC: ABCD0123456' },
    hero: { 
      badge: 'जिला लीग 2026', slogan: 'मिट्टी का खेल, देश का खेल, कबड्डी अपना खेल', title: 'ले पंगा,', subtitle: 'धनबाद जिला!', 
      description: 'धनबाद जिले में कबड्डी में उत्कृष्टता को बढ़ावा देना।',
      ctaPrimary: 'अभी पंजीकरण करें', ctaSecondary: 'शेड्यूल देखें',
      stats: { clubs: 'सक्रिय क्लब', players: 'पंजीकृत खिलाड़ी', titles: 'चैंपियनशिप', support: 'सहायता' }
    },
    features: {
      title: 'हमारा प्रभाव',
      items: [
        { title: 'चैंपियनशिप', desc: 'जिला स्तर के टूर्नामेंट आयोजित करना।' },
        { title: 'समुदाय', desc: 'खिलाड़ियों का एक मजबूत नेटवर्क बनाना।' },
        { title: 'प्रशिक्षण', desc: 'पेशेवर कोचिंग प्रदान करना।' },
        { title: 'पुरस्कार', desc: 'खेल में उत्कृष्टता को पहचानना।' }
      ]
    },
    news: { latest: 'ताजा खबरें', curated: 'चुनिंदा अपडेट', title: 'समाचार फीड', subtitle: 'अपडेट रहें', refresh: 'ताज़ा करें', readMore: 'पूरी कहानी पढ़ें' },
    forms: {
      playerTitle: 'खिलाड़ी पंजीकरण', playerSubtitle: 'DDKA परिवार में शामिल हों',
      instTitle: 'संस्थान संबद्धता', instSubtitle: 'अपने स्कूल या क्लब को पंजीकृत करें',
      submit: 'पंजीकरण जमा करें', instSubmit: 'भुगतान पर आगे बढ़ें',
      labels: {
        fullName: 'पूरा नाम', fathersName: 'पिता का नाम', gender: 'लिंग', dob: 'जन्म तिथि',
        bloodGroup: 'ब्लड ग्रुप', aadhar: 'आधार नंबर', email: 'ईमेल', phone: 'फ़ोन नंबर',
        parentsPhone: 'माता-पिता का फ़ोन', address: 'पूरा पता', registerAs: 'पंजीकरण की श्रेणी',
        experience: 'अनुभव', reason: 'शामिल होने का कारण', uploads: 'आवश्यक दस्तावेज',
        photo: 'पासपोर्ट फोटो', aadharFront: 'आधार फ्रंट', aadharBack: 'आधार बैक',
        instType: 'प्रकार', instName: 'संस्थान का नाम', regNo: 'पंजीकरण संख्या', year: 'स्थापना वर्ष',
        headName: 'प्रिंसिपल का नाम', secretaryName: 'सचिव का नाम', surfaceType: 'मैदान का प्रकार',
        area: 'मैदान का क्षेत्रफल', totalPlayers: 'कुल खिलाड़ी', officePhone: 'कार्यालय फोन'
      },
      placeholders: {
        fullName: 'जॉन डो', fathersName: 'रिचर्ड डो', bloodGroup: 'ओ+', 
        instName: 'मॉडर्न पब्लिक स्कूल', address: 'गली, शहर, पिन', experience: 'खेल के वर्ष', reason: 'कबड्डी क्यों?'
      }
    },
    payment: {
      title: 'भुगतान सत्यापन', fee: 'आवेदन शुल्क', method: 'स्कैन और भुगतान',
      upi: 'किसी भी UPI ऐप से भुगतान करें', upiId: '9504904499@upi', txId: 'ट्रांजैक्शन आईडी दर्ज करें',
      verify: 'भुगतान सत्यापित करें', processing: 'सत्यापित किया जा रहा है...', note: 'वर्तमान सत्र के लिए वैध।'
    },
    footer: { desc: 'धनबाद में कबड्डी के लिए आधिकारिक शासी निकाय।', quickLinks: 'त्वरित लिंक', contact: 'संपर्क करें' },
    affiliation: {
      line1: 'झारखंड राज्य कबड्डी संघ से संबद्ध',
      line2: 'झारखंड सरकार (1860) के तहत पंजीकृत',
      line3: 'ए.के.एफ.आई. एवं झारखंड ओलंपिक संघ से संबद्ध'
    },
    verification: {
      navLabel: 'सत्यापन केंद्र',
      heroTitle: 'आधिकारिक सत्यापन हब',
      heroSubtitle: 'खिलाड़ी, रेफरी और संस्थानों के लिए एक ही खोज',
      heroDescription: 'किसी भी पंजीकृत ID, ईमेल, फोन या आधार नंबर को दर्ज करें और स्थिति, फोटो तथा रोल की जानकारी तुरंत देखें।',
      checklist: [
        'DDKA की ID, पंजीकरण, ईमेल, फोन या आधार नंबर का उपयोग करें',
        'फोटो, जन्मतिथि और पिता का नाम एक ही कार्ड में देखें',
        'प्लेयर्स, रेफरी और संस्थान रोल स्वतः दिखते हैं'
      ],
      form: {
        heading: 'ID से सत्यापन',
        subheading: 'ID, ईमेल, फोन या आधार नंबर दर्ज करें; किसी अन्य जानकारी की आवश्यकता नहीं।',
        fields: {
          idNumber: 'ID / ईमेल / फोन / आधार'
        },
        loading: 'जाँच कर रहा है...',
        submit: 'स्थिति देखें'
      },
      statuses: {
        verified: 'सत्यापित',
        pending: 'प्रक्रिया में',
        rejected: 'अस्वीकृत'
      },
      statusCopy: {
        verified: {
          badge: 'सक्रिय',
          title: 'सत्यापित',
          detail: 'आपकी दस्तावेज़ और रिकॉर्ड DDKA फाइलों से मेल खाते हैं।'
        },
        pending: {
          badge: 'समीक्षा में',
          title: 'प्रक्रिया में',
          detail: 'प्रशासक टीम इस ID के समर्थन दस्तावेजों की समीक्षा कर रही है।'
        },
        rejected: {
          badge: 'नकारा गया',
          title: 'अस्वीकृत',
          detail: 'कृपया DDKA कार्यालय से संपर्क करके जानकारी को ठीक करें।'
        }
      },
      snapshot: {
        summary: 'सत्यापन स्नैपशॉट',
        summaryDetail: 'सबमिट किए गए ID के रोल-विशिष्ट विवरण',
        message: 'सत्यापन की पुष्टि होने पर पंजीकृत ईमेल या फोन पर सूचना मिल जाएगी।'
      },
      guidance: {
        spotlight: 'रिकॉर्ड प्रतिदिन 02:00 बजे रात को सिंक होते हैं; कोई गलती दिखे तो DDKA को सूचित करें।'
      },
      errors: {
        notFound: 'इस ID के लिए कोई रिकॉर्ड नहीं मिला। कृपया जांचें और पुनः प्रयास करें।',
        fetchFailed: 'सत्यापन सेवा से संपर्क नहीं हो पा रहा है। थोड़ी देर में पुनः प्रयास करें।'
      },
      tableHeaders: {
        role: 'भूमिका',
        name: 'नाम',
        fatherName: 'पिता',
        dob: 'जन्मतिथि',
        idNumber: 'ID संख्या'
      },
      roleNames: {
        player: 'खिलाड़ी',
        official: 'रेफरी',
        institute: 'संस्थान'
      }
    }
  }
} as const; // Adding "as const" makes TypeScript more strict and reliable