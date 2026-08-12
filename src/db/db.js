import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isVercel ? path.join('/tmp', 'data') : path.join(cwd, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const ORIGINAL_DATA_FILE = path.join(cwd, 'data', 'store.json');

// Initial seed data for Kaggadu Adventures
const INITIAL_DATA = {
  settings: {
    upiId: '7760013106@ybl',
    upiName: 'Kaggadu Adventures',
    qrCodeImage: '/images/hero_western_ghats.jpg',
    bankDetails: 'Bank: HDFC Bank | A/C: 50200012345678 | IFSC: HDFC0001234 | Branch: Chikmagalur',
    paymentInstructions: '1. Scan QR code or copy UPI ID.\n2. Enter total booking amount.\n3. Enter your booking ID or name in payment note.\n4. Upload payment screenshot or transaction ID below.',
    phone: '7760013106',
    trekLeadPhone: '9353772729',
    email: 'kaggadu@gmail.com',
    instagram: '@kaggadu_adventures',
    instagramUrl: 'https://instagram.com/kaggadu_adventures',
    whatsappNumber: '917760013106'
  },
  treks: [
    {
      id: 'netravathi',
      slug: 'netravathi',
      name: 'Netravathi Peak Trek',
      tagline: 'Walk along the pristine green spine of Kudremukha range',
      location: 'Chikkamagaluru',
      distance: '7 + 7 KM',
      difficulty: 'Moderate',
      altitude: '1,520 Meters',
      duration: '2 Days / 1 Night',
      bestSeason: 'Monsoon & Post-Monsoon (June - Feb)',
      price: 3499,
      image: '/images/netravathi_peak.jpg',
      category: 'Monsoon',
      published: true,
      highlights: [
        'Rolling velvet green mountain ridges',
        'Spectacular view of Netravathi river origin',
        'Dense shola forest trails & natural streams',
        'Sunset over western horizon from ridge'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Overnight Journey from Bengaluru', description: 'Pickup from designated points in Bengaluru. Overnight drive to Samse/Kalasa base village.' },
        { day: 'DAY 1', title: 'Reach Base & Trek Summit', description: 'Fresh up & authentic Malnad breakfast. Jeep ride to trekking starting point. Ascend to Netravathi peak, enjoy packed lunch at peak, descend back by evening.' },
        { day: 'DAY 2', title: 'Waterfall Visit & Return', description: 'Visit nearby pristine waterfall stream. Morning breakfast & start return journey. Reach Bengaluru by 10:00 PM.' }
      ],
      included: [
        'Non-AC Transportation (Bengaluru to Bengaluru)',
        'Experienced Kaggadu Trek Leaders & Local Guide',
        'Forest Department Trekking Permits',
        '2 Breakfasts, 1 Packed Lunch, 1 Dinner',
        'Homestay / Camping Accommodation (Triple/Quad Sharing)',
        'Basic First Aid Kit Support'
      ],
      excluded: [
        'Personal Expenses & Snacks',
        'Day 2 Lunch / Dinner during transit',
        'Anything not explicitly mentioned in inclusions'
      ],
      checklist: [
        'Trekking shoes with good rubber grip',
        'Light raincoat / Poncho',
        '2 Litre reusable water bottle',
        'Headlamp / Torch with extra batteries',
        'Comfortable backpack (20-30 Litres)',
        'Extra pair of quick-dry clothes & socks',
        'Empty lunch box & spoon',
        'Personal medicines & toiletries',
        'Power bank for phone'
      ],
      faqs: [
        { question: 'Is Netravathi trek beginner friendly?', answer: 'Yes! Netravathi is ideal for beginners with moderate fitness who love scenic nature walks.' },
        { question: 'What happens if it rains heavily?', answer: 'Trekking in rain is the magic of Western Ghats! Raincoats/ponchos are essential. We monitor safety protocols continuously.' }
      ]
    },
    {
      id: 'kudremukha',
      slug: 'kudremukha',
      name: 'Kudremukha Peak Trek',
      tagline: 'Conquer the iconic horse-faced peak of Western Ghats',
      location: 'Chikkamagaluru',
      distance: '10 + 10 KM',
      difficulty: 'Moderate – Hard',
      altitude: '1,892 Meters',
      duration: '2 Days / 1 Night',
      bestSeason: 'June - March',
      price: 3799,
      image: '/images/kudremukha_trek.jpg',
      category: 'Monsoon',
      published: true,
      highlights: [
        'Third highest peak in Karnataka',
        'Vast green meadows reminiscent of European hills',
        'Forest jeep ride to Lobo’s house',
        'Crossing fresh mountain water streams'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Departure from Bengaluru', description: 'Overnight sleeper / push-back bus journey to Kalasa / Mullodi.' },
        { day: 'DAY 1', title: 'Kudremukha Peak Summit Climb', description: 'Early morning off-road jeep drive to Lobo house. 20 km total trek through shola forest, Somavathi falls viewpoint & horse-face peak.' },
        { day: 'DAY 2', title: 'Beloor / Waterfall Explorer & Return', description: 'Visit local waterfall stream, enjoy warm Malnad tea, return travel to Bengaluru.' }
      ],
      included: [
        'Transportation from Bengaluru & back',
        'Kudremukha Forest Entry Permits',
        'Off-road Jeep rides (Base to Trek Start)',
        'Home-cooked Malnad Meals (2 Breakfast, 1 Lunch, 1 Dinner)',
        'Certified Kaggadu Trek Guides',
        'Accommodation in local homestay'
      ],
      excluded: [
        'Personal camera charges if applicable',
        'Meals on travel highway'
      ],
      checklist: [
        'Trekking shoes',
        'Raincoat',
        'Water bottle',
        'Headlamp',
        'Backpack',
        'Extra clothes',
        'Empty lunch box',
        'Personal medicines',
        'Power bank'
      ],
      faqs: [
        { question: 'What is the age limit for Kudremukha?', answer: 'Anyone aged 12 to 50 years with basic fitness can participate.' }
      ]
    },
    {
      id: 'bandeje',
      slug: 'bandeje',
      name: 'Bandeje Arbi Waterfall Trek',
      tagline: 'Trek to the roaring waterfall cascading into Charmadi Ghats',
      location: 'Belthangady / Charmadi',
      distance: '7 + 7 KM',
      difficulty: 'Moderate',
      altitude: '1,020 Meters',
      duration: '2 Days / 1 Night',
      bestSeason: 'July - January',
      price: 3399,
      image: '/images/bandeje_waterfall.jpg',
      category: 'Waterfalls',
      published: true,
      highlights: [
        'Cliffside waterfall dropping 200 feet into valley',
        'Trek through dense Charmadi tropical rainforest',
        'Ballalarayana Durga ancient fort ruins',
        'Panoramic view of Netravathi valley below'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Overnight drive to Charmadi', description: 'Late night departure from Bengaluru points.' },
        { day: 'DAY 1', title: 'Trek to Fort & Waterfall Summit', description: 'Ascend through thick forest canopy to Ballalarayana Durga fort ruins, then reach Bandeje Arbi cliff waterfall stream.' },
        { day: 'DAY 2', title: 'Stream Bath & Return', description: 'Breakfast, visit mountain stream, begin journey back to Bengaluru.' }
      ],
      included: [
        'Travel transport',
        'Trek guide & forest permit',
        'Food & homestay stay'
      ],
      excluded: ['Personal items'],
      checklist: ['Trekking shoes', 'Raincoat', 'Water bottle', 'Backpack', 'Empty lunch box'],
      faqs: []
    },
    {
      id: 'kurinjal',
      slug: 'kurinjal',
      name: 'Kurinjal Peak Trek',
      tagline: 'Serene forest walk with misty panoramic vistas',
      location: 'Kudremukha National Park',
      distance: '5 + 5 KM',
      difficulty: 'Easy – Moderate',
      altitude: '1,150 Meters',
      duration: '2 Days / 1 Night',
      bestSeason: 'Year Round',
      price: 3299,
      image: '/images/hero_western_ghats.jpg',
      category: 'Easy',
      published: true,
      highlights: [
        'Beginner friendly gentle gradient trail',
        'Lush mossy tree canopy',
        'Old transmitter towers & summit viewpoint'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Bengaluru to Kalasa', description: 'Night departure.' },
        { day: 'DAY 1', title: 'Kurinjal Peak Climb', description: 'Easy 10km total walk immersed in misty shola nature.' },
        { day: 'DAY 2', title: 'Explore & Return', description: 'Return trip.' }
      ],
      included: ['Transport', 'Guides', 'Permits', 'Meals', 'Homestay'],
      excluded: ['Personal expenses'],
      checklist: ['Trekking shoes', 'Raincoat', 'Water bottle'],
      faqs: []
    },
    {
      id: 'kodachadri',
      slug: 'kodachadri',
      name: 'Kodachadri Peak Trek',
      tagline: 'Trek through Hidlumane waterfalls to Sarvajna Peetha',
      location: 'Shimoga / Kollur',
      distance: '9 KM One Way',
      difficulty: 'Moderate',
      altitude: '1,343 Meters',
      duration: '2 Days / 1 Night',
      bestSeason: 'August - February',
      price: 3899,
      image: '/images/hero_western_ghats.jpg',
      category: 'Weekend',
      published: true,
      highlights: [
        'Hidlumane multi-tier waterfall trail',
        'Thick Mookambika wildlife sanctuary canopy',
        'Off-road Jeep ride down the mountain',
        'Sarvajna Peetha ancient stone temple'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Night Travel to Nittur', description: 'Overnight drive from Bengaluru.' },
        { day: 'DAY 1', title: 'Waterfall Trek & Peak Ascent', description: 'Trek through Hidlumane waterfall cascade, steep climb to peak, sunset point, descend by off-road jeep.' },
        { day: 'DAY 2', title: 'Nagara Fort Visit & Return', description: 'Explore historic Nagara fort ruins, return to Bengaluru.' }
      ],
      included: ['Transport', 'Jeep ride', 'Meals', 'Stay', 'Guides & Permits'],
      excluded: ['Personal expenses'],
      checklist: ['Trekking shoes', 'Raincoat', 'Water bottle', 'Backpack'],
      faqs: []
    },
    {
      id: 'gangadikal',
      slug: 'gangadikal',
      name: 'Gangadikal Peak Trek',
      tagline: 'Gentle green grass hills & peaceful solitude',
      location: 'Kudremukha range',
      distance: '4 + 4 KM',
      difficulty: 'Easy',
      altitude: '1,450 Meters',
      duration: '1 Day / Weekend',
      bestSeason: 'Year Round',
      price: 2999,
      image: '/images/netravathi_peak.jpg',
      category: 'One Day',
      published: true,
      highlights: [
        'Short & soothing 8km walk',
        '360-degree view of Kudremukha valley',
        'Ideal for first-time trekkers and families'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Night Departure', description: 'Bengaluru to Kalasa.' },
        { day: 'DAY 1', title: 'Gangadikal Peak Trek', description: 'Half day trek, return by evening.' }
      ],
      included: ['Transport', 'Guides', 'Meals', 'Permits'],
      excluded: ['Personal expenses'],
      checklist: ['Shoes', 'Water bottle'],
      faqs: []
    },
    {
      id: 'narasimhaparvatha',
      slug: 'narasimhaparvatha',
      name: 'Narasimhaparvatha Trek',
      tagline: 'The ultimate endurance challenge in Agumbe rainforest',
      location: 'Agumbe / Sringeri',
      distance: '8 + 9 KM',
      difficulty: 'Moderate – Hard',
      altitude: '1,150 Meters',
      duration: '2 Days / 1 Night',
      bestSeason: 'October - March',
      price: 3999,
      image: '/images/kudremukha_trek.jpg',
      category: 'Moderate-Hard',
      published: true,
      highlights: [
        'Highest peak in Agumbe rainforest',
        'Barkana falls view & dense forest canopy',
        'Thrilling wilderness trail for fitness enthusiasts'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Drive to Agumbe', description: 'Night journey.' },
        { day: 'DAY 1', title: 'Trek Mallandur to Peak', description: 'Challenging steep climb through thick jungle.' },
        { day: 'DAY 2', title: 'Sringeri Temple Visit & Return', description: 'Morning temple visit & journey home.' }
      ],
      included: ['Transport', 'Guides', 'Forest Entry', 'Meals', 'Stay'],
      excluded: ['Personal expenses'],
      checklist: ['Good Trekking shoes', 'Torch', 'Water 3L', 'Raincoat'],
      faqs: []
    },
    {
      id: 'tadiandamol',
      slug: 'tadiandamol',
      name: 'Tadiandamol Peak Trek',
      tagline: 'Hike to Coorg’s highest mountain summit',
      location: 'Coorg / Madikeri',
      distance: '5 + 5 KM',
      difficulty: 'Moderate',
      altitude: '1,748 Meters',
      duration: '2 Days / 1 Night',
      bestSeason: 'September - February',
      price: 3499,
      image: '/images/hero_western_ghats.jpg',
      category: 'Weekend',
      published: true,
      highlights: [
        'Highest peak in Kodagu / Coorg',
        'Scenic coffee plantations & shola forest trail',
        'Big stone viewpoint & windy ridge'
      ],
      itinerary: [
        { day: 'DAY 0', title: 'Overnight to Coorg', description: 'Departure from Bengaluru.' },
        { day: 'DAY 1', title: 'Tadiandamol Peak Trek', description: 'Trek through Nalknad palace trail to summit.' },
        { day: 'DAY 2', title: 'Coorg Sightseeing & Return', description: 'Visit Abbey falls / Namdroling monastery, return by night.' }
      ],
      included: ['Transport', 'Stay', 'Meals', 'Guide & Permit'],
      excluded: ['Personal expenses'],
      checklist: ['Shoes', 'Water bottle', 'Jacket', 'Raincoat'],
      faqs: []
    }
  ],
  batches: [
    {
      id: 'batch-1',
      trekId: 'netravathi',
      startDate: '2026-08-15',
      endDate: '2026-08-17',
      price: 3499,
      capacity: 25,
      bookedCount: 18,
      status: 'Open',
      pickupPoints: ['Indiranagar (10:00 PM)', 'Domlur (10:15 PM)', 'Yeshwanthpur (11:00 PM)']
    },
    {
      id: 'batch-2',
      trekId: 'netravathi',
      startDate: '2026-08-22',
      endDate: '2026-08-24',
      price: 3499,
      capacity: 25,
      bookedCount: 25,
      status: 'Full',
      pickupPoints: ['Indiranagar (10:00 PM)', 'Yeshwanthpur (11:00 PM)']
    },
    {
      id: 'batch-3',
      trekId: 'kudremukha',
      startDate: '2026-08-15',
      endDate: '2026-08-17',
      price: 3799,
      capacity: 30,
      bookedCount: 14,
      status: 'Open',
      pickupPoints: ['Silk Board (09:30 PM)', 'Yeshwanthpur (10:30 PM)']
    },
    {
      id: 'batch-4',
      trekId: 'kudremukha',
      startDate: '2026-08-29',
      endDate: '2026-08-31',
      price: 3799,
      capacity: 30,
      bookedCount: 8,
      status: 'Open',
      pickupPoints: ['Indiranagar (10:00 PM)', 'Yeshwanthpur (11:00 PM)']
    },
    {
      id: 'batch-5',
      trekId: 'bandeje',
      startDate: '2026-08-22',
      endDate: '2026-08-24',
      price: 3399,
      capacity: 20,
      bookedCount: 12,
      status: 'Open',
      pickupPoints: ['Indiranagar (10:00 PM)', 'Yeshwanthpur (11:00 PM)']
    },
    {
      id: 'batch-6',
      trekId: 'kodachadri',
      startDate: '2026-09-05',
      endDate: '2026-09-07',
      price: 3899,
      capacity: 25,
      bookedCount: 5,
      status: 'Open',
      pickupPoints: ['Indiranagar (10:00 PM)', 'Yeshwanthpur (11:00 PM)']
    }
  ],
  bookings: [
    {
      id: 'KG-2026-8801',
      trekId: 'netravathi',
      trekName: 'Netravathi Peak Trek',
      batchId: 'batch-1',
      batchDate: '15 Aug - 17 Aug 2026',
      fullName: 'Rahul Sharma',
      phone: '9876543210',
      whatsapp: '9876543210',
      email: 'rahul.s@example.com',
      age: 26,
      gender: 'Male',
      emergencyName: 'Suresh Sharma',
      emergencyPhone: '9876500000',
      pickupLocation: 'Yeshwanthpur (11:00 PM)',
      participantsCount: 2,
      specialNotes: 'Vegetarian food preferred',
      totalAmount: 6998,
      paymentStatus: 'Uploaded',
      paymentScreenshot: '',
      status: 'Approved',
      createdAt: '2026-08-01T10:30:00Z'
    }
  ],
  gallery: [
    { id: 'g1', title: 'Mist on Kudremukha Ridge', image: '/images/kudremukha_trek.jpg', category: 'Mountains' },
    { id: 'g2', title: 'Netravathi Peak Group Summit', image: '/images/netravathi_peak.jpg', category: 'Treks' },
    { id: 'g3', title: 'Bandeje Arbi Waterfall Cascade', image: '/images/bandeje_waterfall.jpg', category: 'Waterfalls' },
    { id: 'g4', title: 'Monsoon Trail in Western Ghats', image: '/images/hero_western_ghats.jpg', category: 'Monsoon' }
  ],
  events: [
    {
      id: 'ev-1',
      title: 'Monsoon Camping & Stargazing Night',
      date: 'Sep 12 - 13, 2026',
      location: 'Mullodi, Chikkamagaluru',
      description: 'Join the Kaggadu community for an unforgettable night under Western Ghats stars with bonfire, local music & outdoor stories.',
      image: '/images/hero_western_ghats.jpg',
      status: 'Upcoming',
      registrationUrl: '#'
    }
  ],
  reviews: [],
  faqs: [
    {
      id: 'f1',
      question: 'Can I join a Kaggadu trek alone / solo?',
      answer: 'Absolutely! Over 40% of our participants join solo. Kaggadu is a warm, welcoming adventure community where you will make lifelong friends.'
    },
    {
      id: 'f2',
      question: 'What is included in the trek price?',
      answer: 'All Kaggadu packages include Bengaluru-to-Bengaluru transport, forest department permits, certified trek leaders, homestay/tent accommodation, and home-cooked meals as listed in trek inclusions.'
    },
    {
      id: 'f3',
      question: 'What is the cancellation and refund policy?',
      answer: 'Cancellations made 7+ days before departure receive 90% refund or full batch transfer credit. 3-6 days before departure receives 50% refund. Less than 72 hours non-refundable.'
    }
  ],
  notifications: [
    {
      id: 'n1',
      type: 'Booking Approved',
      message: 'Booking #KG-2026-8801 for Rahul Sharma (Netravathi Peak) has been approved.',
      timestamp: '2026-08-01T10:35:00Z'
    }
  ]
};

// Ensure data file exists
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      if (fs.existsSync(ORIGINAL_DATA_FILE)) {
        fs.copyFileSync(ORIGINAL_DATA_FILE, DATA_FILE);
      } else {
        fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      }
    }
  } catch (err) {
    console.error('ensureDataFile warning:', err.message);
  }
}

export function readDB() {
  let dbData = null;
  if (inMemoryDB) {
    dbData = inMemoryDB;
  } else {
    ensureDataFile();
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        inMemoryDB = JSON.parse(raw);
        dbData = inMemoryDB;
      }
    } catch (err) {
      console.error('Error reading DB file, using INITIAL_DATA:', err.message);
    }
    
    if (!dbData) {
      inMemoryDB = JSON.parse(JSON.stringify(INITIAL_DATA));
      dbData = inMemoryDB;
    }
  }

  // Guarantee schema defaults
  if (!dbData.announcements) dbData.announcements = [
    {
      id: 'anc-1',
      title: '🌧️ Monsoon Trekking Season Open!',
      message: 'Monsoon bookings for Kudremukha, Netravathi & Kodachadri are now live. Limited batch seats available!',
      link: '/treks',
      active: true,
      badge: 'SEASON UPDATE',
      createdAt: new Date().toISOString()
    }
  ];
  if (!dbData.offers) dbData.offers = [
    {
      id: 'off-1',
      code: 'KAGGADUGROUP5',
      title: 'Group Offer - Get ₹300 OFF',
      description: 'Book for 5 or more trekkers and get instant ₹300 per person discount!',
      discount: '₹300 OFF',
      minTrekkers: 5,
      active: true
    }
  ];
  if (!dbData.activityLogs) dbData.activityLogs = [
    {
      id: 'log-1',
      action: 'System Initialized',
      details: 'Dynamic Database Engine active for Kaggadu Platform',
      timestamp: new Date().toISOString()
    }
  ];
  if (!dbData.users) dbData.users = [
    {
      id: 'usr-1',
      name: 'Super Admin',
      email: 'admin@kaggadu.com',
      role: 'Super Admin',
      createdAt: new Date().toISOString()
    }
  ];

  return dbData;
}

export function writeDB(data) {
  inMemoryDB = data;
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Warning: Disk write failed, but in-memory DB updated:', err.message);
    return true;
  }
}
