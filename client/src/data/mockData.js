// Seed dataset for TalentX - Local Talent Marketplace (Pakistan)

export const CATEGORIES = [
  { id: 'all', label: 'All Fields', icon: 'Sparkles' },
  { id: 'Photography', label: 'Photography & Video', icon: 'Camera' },
  { id: 'Web Development', label: 'Web & MERN Dev', icon: 'Code' },
  { id: 'UI/UX Design', label: 'UI/UX & Branding', icon: 'Palette' },
  { id: 'Mobile Apps', label: 'Mobile Apps', icon: 'Smartphone' },
  { id: 'Digital Marketing', label: 'Digital Marketing & SEO', icon: 'TrendingUp' },
  { id: 'Content Writing', label: 'Content & Copy', icon: 'PenTool' }
];

export const CITIES = [
  'All Cities',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Faisalabad',
  'Multan'
];

export const INITIAL_TALENTS = [
  {
    id: 'talent_1',
    name: 'Hamza Tariq',
    headline: 'Fashion, Commercial & Aerial Drone Photographer',
    category: 'Photography',
    city: 'Lahore',
    area: 'Gulberg III & DHA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
    hourlyRate: 3500,
    dailyRate: 25000,
    rating: 4.9,
    reviewCount: 42,
    completedJobs: 56,
    badge: 'Top Rated Pro',
    workMode: 'On-site & Studio',
    experience: '5+ Years',
    bio: 'Professional fashion & commercial photographer with 5+ years of experience shooting for Pakistan’s top apparel brands, food chains, and corporate events. Equipped with Sony A7 IV, Profoto studio strobes, and DJI Mavic 3 Pro drone.',
    skills: ['Fashion Photography', 'Product Catalog', 'Studio Lighting', 'Drone Videography', 'Adobe Lightroom', 'High-End Retouching', 'Color Grading'],
    portfolio: [
      {
        id: 'p1_1',
        title: 'Lawn Couture Summer Campaign 2026',
        category: 'Fashion Photography',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        description: 'Shot 45 looks for an upscale retail clothing brand in Lahore with custom editorial lighting.',
        client: 'Zaha Atelier Lahore',
        tags: ['Editorial', 'Studio', 'Fashion']
      },
      {
        id: 'p1_2',
        title: 'Artisan Cafe & Bakery Brand Shoot',
        category: 'Food & Commercial',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        description: 'Complete menu and interior photography for a boutique restaurant in Gulberg.',
        client: 'The Daily Roast',
        tags: ['Food', 'Commercial', 'Ambience']
      },
      {
        id: 'p1_3',
        title: 'Corporate Headquarters Drone Architecture',
        category: 'Drone & Real Estate',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        description: '4K aerial videography and architectural stills for commercial real estate.',
        client: 'DHA Commercial Ventures',
        tags: ['Architecture', 'Drone', '4K']
      }
    ],
    reviews: [
      { id: 'r1', client: 'Zara Clothing Co.', rating: 5, comment: 'Hamza did an exceptional job on our catalog shoot! Super punctual and high quality edits delivered within 48 hours.', date: '3 days ago' },
      { id: 'r2', client: 'Bistro 201', rating: 5, comment: 'Best food photographer in Lahore. Increased our Instagram engagement noticeably!', date: '2 weeks ago' }
    ]
  },
  {
    id: 'talent_2',
    name: 'Ayesha Malik',
    headline: 'Senior MERN Stack & Next.js Full-Stack Developer',
    category: 'Web Development',
    city: 'Karachi',
    area: 'Clifton & PECHS',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    hourlyRate: 5000,
    dailyRate: 35000,
    rating: 5.0,
    reviewCount: 38,
    completedJobs: 49,
    badge: 'AI & Full-Stack Pro',
    workMode: 'Hybrid & Remote',
    experience: '6 Years',
    bio: 'Ex-TechLead specializing in high-performance web applications, custom MERN e-commerce platforms, payment gateway integrations (JazzCash, EasyPaisa, Stripe), and AI LLM integrations.',
    skills: ['React.js', 'Next.js', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Redux Toolkit', 'Socket.io', 'JazzCash API', 'REST & GraphQL'],
    portfolio: [
      {
        id: 'p2_1',
        title: 'Multi-Vendor Groceries Marketplace',
        category: 'MERN E-Commerce',
        image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
        description: 'Complete scalable MERN web app supporting 10k+ daily orders with live inventory tracking and riders map.',
        client: 'KraveFresh Karachi',
        tags: ['React', 'Node.js', 'MongoDB', 'Socket.io']
      },
      {
        id: 'p2_2',
        title: 'Fintech Dashboard & Invoicing Suite',
        category: 'SaaS Platform',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        description: 'Automated billing, FBR tax calculation, and instant payment links for Pakistani SMBs.',
        client: 'HisabKitab PK',
        tags: ['Next.js', 'Tailwind', 'PostgreSQL']
      }
    ],
    reviews: [
      { id: 'r3', client: 'FastCourier Karachi', rating: 5, comment: 'Ayesha is hands down one of the sharpest developers in Karachi. Built our portal in record time.', date: '1 week ago' }
    ]
  },
  {
    id: 'talent_3',
    name: 'Bilal Farooq',
    headline: 'Product Designer (UI/UX), Mobile App & Brand Strategist',
    category: 'UI/UX Design',
    city: 'Islamabad',
    area: 'F-7 / Blue Area',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
    hourlyRate: 4000,
    dailyRate: 28000,
    rating: 4.9,
    reviewCount: 31,
    completedJobs: 37,
    badge: 'Design Specialist',
    workMode: 'On-site & Remote',
    experience: '4+ Years',
    bio: 'Crafting pixel-perfect, conversion-driven mobile apps and web platforms. Specializes in Figma design systems, interactive prototypes, user journey mapping, and modern visual branding.',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Mobile App UI', 'Wireframing', 'User Research', 'Prototyping', 'Brand Guidelines'],
    portfolio: [
      {
        id: 'p3_1',
        title: 'Ride-Hailing & Logistics Mobile App UI',
        category: 'Mobile UX/UI',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
        description: 'Complete 60+ screen design system for iOS & Android with dark mode and multilingual Urdu support.',
        client: 'ChaloRide PK',
        tags: ['Figma', 'iOS Design', 'Design System']
      },
      {
        id: 'p3_2',
        title: 'Healthcare & Telemedicine Consultation App',
        category: 'Web & Mobile',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        description: 'Doctor booking, live prescription viewer, and lab test tracker interface.',
        client: 'ShifaCare Digital',
        tags: ['Telehealth', 'UI/UX', 'Figma']
      }
    ],
    reviews: [
      { id: 'r4', client: 'PakStartup Hub', rating: 5, comment: 'Bilal converted our complex business logic into a clean, intuitive app flow. Outstanding work!', date: '5 days ago' }
    ]
  },
  {
    id: 'talent_4',
    name: 'Zoya Fatima',
    headline: 'Short-Form Video Editor & Reels/TikTok Commercial Creator',
    category: 'Photography',
    city: 'Rawalpindi',
    area: 'Saddar & Bahria Town',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    hourlyRate: 3000,
    dailyRate: 20000,
    rating: 4.8,
    reviewCount: 27,
    completedJobs: 41,
    badge: 'Viral Video Pro',
    workMode: 'Hybrid',
    experience: '3+ Years',
    bio: 'Produced over 500+ viral short videos, TikTok ads, and Instagram Reels for local e-commerce stores, restaurants, and influencers. Fast turnarounds with Premiere Pro & After Effects.',
    skills: ['Video Editing', 'Adobe Premiere Pro', 'After Effects', 'Reels & TikTok Ads', 'Sound Design', 'Motion Graphics', 'Color Grading'],
    portfolio: [
      {
        id: 'p4_1',
        title: 'Footwear Brand 30s Kinetic Ad Campaign',
        category: 'Video Production',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        description: 'High-energy rhythmic commercial generating 2.5M+ views across Meta & TikTok.',
        client: 'StepUp Footwear',
        tags: ['After Effects', 'Commercial', 'Motion']
      }
    ],
    reviews: [
      { id: 'r5', client: 'Gourmet Bites RWP', rating: 5, comment: 'Zoya brought our food reels to life. Our restaurant saw a 40% jump in weekend footfall!', date: '1 month ago' }
    ]
  },
  {
    id: 'talent_5',
    name: 'Saad Ur Rehman',
    headline: 'Performance Marketer, Meta & Google Ads Specialist',
    category: 'Digital Marketing',
    city: 'Lahore',
    area: 'Johar Town & Model Town',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    hourlyRate: 3800,
    dailyRate: 26000,
    rating: 4.9,
    reviewCount: 35,
    completedJobs: 50,
    badge: 'ROI Growth Expert',
    workMode: 'Remote & Onsite Consult',
    experience: '5 Years',
    bio: 'Generated over PKR 85M+ in sales for Pakistani e-commerce brands with data-backed Meta Ads, Google Shopping campaigns, TikTok Ads, and conversion rate optimization.',
    skills: ['Meta Ads Manager', 'Google Ads (PMax)', 'TikTok Ads', 'Shopify Growth', 'SEO Auditing', 'Google Analytics 4', 'Conversion Optimization'],
    portfolio: [
      {
        id: 'p5_1',
        title: '6.2x ROAS Scaling for Skincare Brand',
        category: 'Performance Marketing',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        description: 'Scaled monthly revenue from 1.5M to 8M PKR with retargeting funnels and UGC creatives.',
        client: 'PureGlow Organics',
        tags: ['Meta Ads', 'E-Commerce', 'ROAS']
      }
    ],
    reviews: [
      { id: 'r6', client: 'LeatherCraft PK', rating: 5, comment: 'Saad knows performance marketing inside out. Scaled our winter sales tremendously.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'talent_6',
    name: 'Danyal Khan',
    headline: 'Cross-Platform React Native & Flutter Mobile App Engineer',
    category: 'Mobile Apps',
    city: 'Peshawar',
    area: 'University Town & Hayatabad',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    hourlyRate: 4200,
    dailyRate: 30000,
    rating: 4.9,
    reviewCount: 22,
    completedJobs: 28,
    badge: 'Mobile Specialist',
    workMode: 'Remote & Hybrid',
    experience: '4+ Years',
    bio: 'Delivering smooth, native-feel iOS and Android mobile apps. Expertise in offline sync, Push notifications, Google Maps, local payment gateways, and real-time chat integration.',
    skills: ['React Native', 'Flutter', 'Firebase', 'Redux', 'Google Maps API', 'Push Notifications', 'Payment SDKs', 'App Store Deployment'],
    portfolio: [
      {
        id: 'p6_1',
        title: 'Local Delivery & Parcel Tracking App',
        category: 'Mobile App',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
        description: 'Real-time GPS rider tracking, instant OTP delivery confirmation, and cash on delivery ledger.',
        client: 'Peshawar Express Logistics',
        tags: ['React Native', 'GPS', 'Firebase']
      }
    ],
    reviews: [
      { id: 'r7', client: 'Khyber Tech Labs', rating: 5, comment: 'Fast, reliable, and clean code. The app runs silky smooth at 60 FPS.', date: '3 weeks ago' }
    ]
  }
];

export const INITIAL_JOBS = [
  {
    id: 'job_101',
    clientId: 'client_01',
    clientName: 'Al-Karam Studio Retailers',
    clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    title: 'High-Fashion Eid Collection Studio & Model Shoot',
    category: 'Photography',
    description: 'We need an experienced fashion photographer in Lahore with access to a studio or lighting setup for a 2-day shoot of 35 embroidered unstitched & pret lawn designs.',
    budget: 65000,
    currency: 'PKR',
    budgetType: 'Fixed',
    city: 'Lahore',
    locationType: 'On-site',
    experienceLevel: 'Expert',
    requiredSkills: ['Fashion Photography', 'Studio Lighting', 'Adobe Lightroom', 'High-End Retouching'],
    status: 'Open',
    postedDate: '2 days ago',
    proposalsCount: 4
  },
  {
    id: 'job_102',
    clientId: 'client_02',
    clientName: 'Bismah Organic Skincare',
    clientAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    title: 'Custom MERN Stack E-Commerce Website with JazzCash/EasyPaisa',
    category: 'Web Development',
    description: 'Looking for a reliable web developer in Karachi to build a fast e-commerce storefront with cart, discounts, admin inventory manager, and automated courier booking API.',
    budget: 120000,
    currency: 'PKR',
    budgetType: 'Fixed',
    city: 'Karachi',
    locationType: 'Hybrid',
    experienceLevel: 'Intermediate / Expert',
    requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'JazzCash API', 'Tailwind CSS'],
    status: 'Open',
    postedDate: '1 day ago',
    proposalsCount: 6
  },
  {
    id: 'job_103',
    clientId: 'client_03',
    clientName: 'Capital PropTech Islamabad',
    clientAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    title: 'Figma UI/UX Design System for Real Estate Mobile App',
    category: 'UI/UX Design',
    description: 'Need a UI/UX product designer in Islamabad/Rawalpindi to craft modern 45+ screens for property listings, virtual tours, and agent scheduling.',
    budget: 80000,
    currency: 'PKR',
    budgetType: 'Fixed',
    city: 'Islamabad',
    locationType: 'On-site / Remote',
    experienceLevel: 'Expert',
    requiredSkills: ['Figma', 'UI/UX Design', 'Design Systems', 'Mobile App UI', 'Wireframing'],
    status: 'Open',
    postedDate: '3 hours ago',
    proposalsCount: 2
  },
  {
    id: 'job_104',
    clientId: 'client_04',
    clientName: 'Cafe Solitaire Faisalabad',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    title: 'Short Video Creator for Instagram Reels & Food Tasting Campaign',
    category: 'Photography',
    city: 'Faisalabad',
    description: 'Looking for a creative videographer/editor to shoot 10 dynamic Reels highlighting our new steaks, burger menu, and rooftop ambiance.',
    budget: 35000,
    currency: 'PKR',
    budgetType: 'Fixed',
    locationType: 'On-site',
    experienceLevel: 'Intermediate',
    requiredSkills: ['Video Editing', 'Reels & TikTok Ads', 'Sound Design', 'Adobe Premiere Pro'],
    status: 'Open',
    postedDate: 'Just now',
    proposalsCount: 1
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop_001',
    jobId: 'job_101',
    talentId: 'talent_1',
    talentName: 'Hamza Tariq',
    talentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bidAmount: 60000,
    deliveryDays: 3,
    coverLetter: 'Hello Al-Karam team! I operate a fully equipped studio in Gulberg III with Profoto lighting and high-res Sony cameras. I have executed similar campaigns for Zaha & Khaadi. Happy to share full portfolio.',
    status: 'Pending',
    date: '1 day ago'
  }
];

export const INITIAL_CONTRACTS = [
  {
    id: 'cnt_501',
    jobId: 'job_103',
    jobTitle: 'Figma UI/UX Design System for Real Estate Mobile App',
    clientName: 'Capital PropTech Islamabad',
    talentName: 'Bilal Farooq',
    talentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    amount: 80000,
    currency: 'PKR',
    status: 'In Progress',
    deadline: '2026-09-30',
    milestones: [
      { id: 'm1', title: 'User Flow & Wireframes (15 Screens)', amount: 30000, isPaid: true, status: 'Completed' },
      { id: 'm2', title: 'High-Fidelity Figma Prototype & Components', amount: 50000, isPaid: false, status: 'In Progress' }
    ]
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg_1',
    senderId: 'client_01',
    senderName: 'Zara Apparel Co.',
    receiverId: 'talent_1',
    text: 'Salam Hamza! We saw your fashion portfolio. Are you available this coming Saturday for the studio shoot in Gulberg?',
    time: '11:45 AM',
    isClient: true
  },
  {
    id: 'msg_2',
    senderId: 'talent_1',
    senderName: 'Hamza Tariq',
    receiverId: 'client_01',
    text: 'Walaikum Assalam! Yes, Saturday is completely open on my schedule. I will bring my Profoto strobes and 85mm prime lens.',
    time: '11:48 AM',
    isClient: false
  }
];
