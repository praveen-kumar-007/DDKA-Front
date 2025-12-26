export type Language = 'en' | 'hi';

export const translations = {
  en: {
    nav: { home: 'Home', about: 'About', gallery: 'Gallery', news: 'News', register: 'Registration', institution: 'Institution', affiliated: 'Affiliated' },
    hero: { 
      badge: 'District League 2024', slogan: 'Sport of the Soil, Sport of the Nation, Kabaddi Our Sport', title: 'Le Panga,', subtitle: 'Dhanbad District!', 
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
      upi: 'Pay via any UPI App', upiId: 'ddka@upi', txId: 'Enter Transaction ID',
      verify: 'Verify Payment', processing: 'Verifying...', note: 'Valid for current season.'
    },
    footer: { desc: 'The official governing body for Kabaddi in Dhanbad.', quickLinks: 'Quick Links', contact: 'Contact Us' }
  },
  hi: {
    nav: { home: 'होम', about: 'हमारे बारे में', gallery: 'गैलरी', news: 'खबरें', register: 'पंजीकरण', institution: 'संस्थान', affiliated: 'संबद्ध' },
    hero: { 
      badge: 'जिला लीग 2024', slogan: 'मिट्टी का खेल, देश का खेल, कबड्डी अपना खेल', title: 'ले पंगा,', subtitle: 'धनबाद जिला!', 
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
      upi: 'किसी भी UPI ऐप से भुगतान करें', upiId: 'ddka@upi', txId: 'ट्रांजैक्शन आईडी दर्ज करें',
      verify: 'भुगतान सत्यापित करें', processing: 'सत्यापित किया जा रहा है...', note: 'वर्तमान सत्र के लिए वैध।'
    },
    footer: { desc: 'धनबाद में कबड्डी के लिए आधिकारिक शासी निकाय।', quickLinks: 'त्वरित लिंक', contact: 'संपर्क करें' }
  }
} as const; // Adding "as const" makes TypeScript more strict and reliable