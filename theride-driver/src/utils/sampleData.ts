import { DriverProfile, RideRequest } from '../types/driver';

// Helper to generate crisp SVG data URL for document mock
function createDocumentSvg(title: string, subtitle: string, accentColor: string, iconType: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="acc" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${accentColor}" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>
    </defs>
    <rect width="600" height="380" rx="16" fill="url(#bg)" stroke="#334155" stroke-width="2" />
    <rect x="24" y="24" width="552" height="6" rx="3" fill="url(#acc)" />
    
    <!-- Top badge -->
    <rect x="24" y="44" width="180" height="28" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="36" y="63" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1">GOVERNMENT OF INDIA</text>
    
    <text x="24" y="115" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="22" font-weight="800">${title}</text>
    <text x="24" y="140" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">${subtitle}</text>
    
    <!-- Avatar / Card Chip box -->
    <rect x="440" y="70" width="120" height="150" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <circle cx="500" cy="125" r="32" fill="#334155" />
    <circle cx="500" cy="120" r="16" fill="#94a3b8" />
    <path d="M480 148 C480 138 520 138 520 148 Z" fill="#94a3b8" />
    <text x="500" y="200" fill="#64748b" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle">OFFICIAL COPY</text>
    
    <!-- Chip -->
    <rect x="24" y="165" width="54" height="40" rx="6" fill="#ca8a04" opacity="0.8" />
    <line x1="24" y1="185" x2="78" y2="185" stroke="#713f12" stroke-width="1.5" />
    <line x1="51" y1="165" x2="51" y2="205" stroke="#713f12" stroke-width="1.5" />
    
    <!-- Data lines -->
    <text x="24" y="235" fill="#64748b" font-family="monospace" font-size="11">HOLDER NAME</text>
    <text x="24" y="255" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="15" font-weight="700">RAJESH KUMAR SHARMA</text>
    
    <text x="240" y="235" fill="#64748b" font-family="monospace" font-size="11">ISSUED DATE / STATUS</text>
    <text x="240" y="255" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="15" font-weight="700">ACTIVE &bull; LMV ENDORSED</text>
    
    <rect x="24" y="285" width="552" height="60" rx="8" fill="#090d16" />
    <text x="44" y="322" fill="#e2e8f0" font-family="monospace" font-size="17" font-weight="700" letter-spacing="4">${iconType}</text>
    <text x="500" y="322" fill="#22c55e" font-family="system-ui, sans-serif" font-size="12" font-weight="700">&#x2714; KYC VERIFIED</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const sampleDriverProfile: DriverProfile = {
  id: 'DRV-CHAUFFEUR-9821',
  fullName: 'Rajesh Kumar Sharma',
  phone: '9876543210',
  email: 'rajesh.sharma.drive@gmail.com',
  city: 'Delhi NCR',
  dateOfBirth: '1992-08-14',
  address: 'Pocket 4, Sector 12, Dwarka, New Delhi 110078',
  bloodGroup: 'B+',
  emergencyContact: {
    name: 'Sunita Sharma',
    relation: 'Spouse',
    phone: '9811223344',
  },
  servicePreferences: {
    cityRides: true,
    outstationRides: true,
    rentalRides: true,
    airportDuty: true,
    nightDuty: true,
  },
  fourWheelerCapability: {
    canDriveTypes: ['hatchback', 'compact_sedan', 'executive_sedan', 'suv_muv', 'electric_ev', 'luxury_cars'],
    transmission: 'both',
    drivingExperience: '5+ Years (Professional Driver)',
    hasValidLmvLicense: true,
    preferredModels: ['Honda City', 'Toyota Fortuner', 'Innova Crysta', 'Tata Nexon EV', 'Mercedes-Benz E-Class'],
    comfortDrivingHighway: true,
    comfortDrivingNight: true,
    comfortDrivingHills: true,
    specialSkills: [
      'Automatic & Paddle Shifters',
      'Electronic Parking Handbrake',
      'Ghats & Hill Road Slopes',
      'ADAS & Adaptive Cruise Control',
      'Tight Parking & Basement Valet',
      'VIP Executive Etiquette',
    ],
    familiarBrands: ['Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata Motors', 'Mahindra', 'Mercedes-Benz', 'BMW', 'Kia'],
    confirmedBeforeUpload: true,
  },
  documents: {
    drivingLicense: {
      number: 'DL1420150048921',
      expiryDate: '2035-08-14',
      status: 'verified',
      notes: 'Transport endorsement LMV valid and active on MoRTH Sarathi portal',
      frontDoc: {
        id: 'dl-f-1',
        name: 'Driving_License_Front.jpg',
        size: 245000,
        type: 'image/jpeg',
        dataUrl: createDocumentSvg('DRIVING LICENCE', 'Union of India / Transport Dept.', '#2563eb', 'DL-1420150048921'),
        uploadedAt: '2026-09-15 10:24 AM',
      },
      backDoc: {
        id: 'dl-b-1',
        name: 'Driving_License_Back.jpg',
        size: 198000,
        type: 'image/jpeg',
        dataUrl: createDocumentSvg('DRIVING LICENCE - REVERSE', 'Authorised 4-Wheeler LMV Categories', '#2563eb', 'VALID TILL 14-08-2035'),
        uploadedAt: '2026-09-15 10:25 AM',
      },
    },
    aadhaarCard: {
      number: '8942 6150 9238',
      status: 'verified',
      maskedConsent: true,
      notes: 'UIDAI OTP verification passed (Address: Dwarka, Delhi)',
      frontDoc: {
        id: 'adh-f-1',
        name: 'Aadhaar_Card_Front.jpg',
        size: 310000,
        type: 'image/jpeg',
        dataUrl: createDocumentSvg('AADHAAR CARD', 'Unique Identification Authority of India', '#10b981', 'XXXX XXXX 9238'),
        uploadedAt: '2026-09-15 10:26 AM',
      },
      backDoc: {
        id: 'adh-b-1',
        name: 'Aadhaar_Card_Back.jpg',
        size: 280000,
        type: 'image/jpeg',
        dataUrl: createDocumentSvg('AADHAAR ADDRESS PROOF', 'Residential address verified (New Delhi)', '#10b981', 'PIN CODE: 110078'),
        uploadedAt: '2026-09-15 10:27 AM',
      },
    },
    panCard: {
      number: 'ABCPR8941K',
      nameOnCard: 'RAJESH KUMAR SHARMA',
      status: 'verified',
      notes: 'Income Tax NSDL database match verified for bank payouts',
      doc: {
        id: 'pan-1',
        name: 'PAN_Card_Original.jpg',
        size: 215000,
        type: 'image/jpeg',
        dataUrl: createDocumentSvg('PERMANENT ACCOUNT NUMBER', 'Income Tax Department, Govt of India', '#8b5cf6', 'ABCPR8941K'),
        uploadedAt: '2026-09-15 10:28 AM',
      },
    },
    driverPhoto: {
      status: 'verified',
      doc: {
        id: 'photo-1',
        name: 'Driver_Verification_Selfie.jpg',
        size: 180000,
        type: 'image/jpeg',
        dataUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        uploadedAt: '2026-09-15 10:32 AM',
      },
    },
  },
  verificationStatus: 'approved',
  partnerId: 'TR-DRV-4482',
  joinedDate: '2026-09-15',
  approvedAt: '2026-09-16 02:45 PM',
};

export const emptyDriverProfile: DriverProfile = {
  id: `DRV-${Date.now().toString().slice(-6)}`,
  fullName: '',
  phone: '',
  email: '',
  city: 'Delhi NCR',
  dateOfBirth: '',
  address: '',
  bloodGroup: 'O+',
  emergencyContact: {
    name: '',
    relation: 'Family',
    phone: '',
  },
  servicePreferences: {
    cityRides: true,
    outstationRides: true,
    rentalRides: true,
    airportDuty: true,
    nightDuty: false,
  },
  fourWheelerCapability: {
    canDriveTypes: ['compact_sedan', 'hatchback'],
    transmission: 'both',
    drivingExperience: '1 - 3 Years',
    hasValidLmvLicense: true,
    preferredModels: [],
    comfortDrivingHighway: true,
    comfortDrivingNight: false,
    comfortDrivingHills: false,
    specialSkills: ['Automatic & Paddle Shifters', 'Tight Parking & Basement Valet'],
    familiarBrands: ['Maruti Suzuki', 'Hyundai', 'Tata Motors'],
    confirmedBeforeUpload: false,
  },
  documents: {
    drivingLicense: {
      number: '',
      expiryDate: '',
      status: 'not_uploaded',
    },
    aadhaarCard: {
      number: '',
      status: 'not_uploaded',
      maskedConsent: true,
    },
    panCard: {
      number: '',
      nameOnCard: '',
      status: 'not_uploaded',
    },
    driverPhoto: {
      status: 'not_uploaded',
    },
  },
  verificationStatus: 'draft',
  joinedDate: new Date().toISOString().split('T')[0],
};

// Customer car booking requests where the customer hires a driver for their personal car
export const sampleRideRequests: RideRequest[] = [
  {
    id: 'BOOK-CUST-8941',
    passengerName: 'Ananya Verma',
    passengerRating: 4.95,
    passengerPhone: '+91 98110 44921',
    passengerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    customerCar: {
      make: 'Honda',
      model: 'City ZX (5th Gen)',
      category: 'executive_sedan',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      plateNumber: 'DL 03 CA 9012 (Customer Car)',
      specialInstructions: 'Push-button start. Customer will hand over keys at apartment lobby.',
    },
    pickupLocation: 'Apartment 702, Golf Course Road, DLF Phase 5, Gurugram',
    dropLocation: 'Terminal 3, IGI Airport, New Delhi',
    distanceKm: 18.5,
    estimatedMinutes: 35,
    fareAmount: 650,
    paymentMethod: 'UPI / Card',
    serviceType: 'Airport Drop in Customer Car',
    bookingType: 'Airport Transfer',
    otp: '7412',
  },
  {
    id: 'BOOK-CUST-8942',
    passengerName: 'Vikramaditya Rao',
    passengerRating: 4.88,
    passengerPhone: '+91 98201 88319',
    passengerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    customerCar: {
      make: 'Toyota',
      model: 'Fortuner 4x4 (Diesel)',
      category: 'suv_muv',
      transmission: 'Manual',
      fuelType: 'Diesel',
      plateNumber: 'HR 26 DQ 4490 (Customer Car)',
      specialInstructions: 'Manual 6-speed gear. Highway cruise control available. Outstation trip.',
    },
    pickupLocation: 'Vasant Vihar, Block E, New Delhi',
    dropLocation: 'Taj Expressway Roundabout, Agra (Round-trip)',
    distanceKm: 195.0,
    estimatedMinutes: 180,
    fareAmount: 2450,
    paymentMethod: 'TheRide Wallet',
    serviceType: 'Outstation Highway Chauffeur',
    bookingType: 'Outstation Round-Trip',
    otp: '3950',
  },
  {
    id: 'BOOK-CUST-8943',
    passengerName: 'Dr. Arvind Mehta',
    passengerRating: 5.0,
    passengerPhone: '+91 99100 12390',
    passengerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    customerCar: {
      make: 'Mercedes-Benz',
      model: 'E-Class E200 (Luxury)',
      category: 'luxury_cars',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      plateNumber: 'DL 01 BU 0007 (Customer Car)',
      specialInstructions: 'Luxury automatic sedan. Column shifter gear selector. High attention to smooth braking.',
    },
    pickupLocation: 'Sundar Nagar, Golf Links, Central Delhi',
    dropLocation: 'Multiple City Meetings (Connaught Place & Aerocity)',
    distanceKm: 42.0,
    estimatedMinutes: 240,
    fareAmount: 1900,
    paymentMethod: 'TheRide Wallet',
    serviceType: '8-Hour Executive Chauffeur Duty',
    bookingType: 'Hourly Chauffeur (4h/8h)',
    otp: '5518',
  },
  {
    id: 'BOOK-CUST-8944',
    passengerName: 'Pooja Iyer',
    passengerRating: 4.92,
    passengerPhone: '+91 97112 55901',
    passengerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    customerCar: {
      make: 'Tata Motors',
      model: 'Nexon EV Empowered',
      category: 'electric_ev',
      transmission: 'EV Single-Speed',
      fuelType: 'Electric',
      plateNumber: 'DL 08 EV 2024 (Customer Car)',
      specialInstructions: 'Electric vehicle with regenerative braking (Level 2). Rotary gear selector dial.',
    },
    pickupLocation: 'Hauz Khas Village, Near Deer Park Gate',
    dropLocation: 'Select Citywalk Mall, Saket',
    distanceKm: 8.2,
    estimatedMinutes: 22,
    fareAmount: 380,
    paymentMethod: 'Cash',
    serviceType: 'City Drive in Customer EV',
    bookingType: 'One-Way Trip',
    otp: '8219',
  },
  {
    id: 'BOOK-CUST-8945',
    passengerName: 'Rohan Kapoor',
    passengerRating: 4.85,
    passengerPhone: '+91 98990 77412',
    passengerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    customerCar: {
      make: 'Hyundai',
      model: 'i20 Asta (Hatchback)',
      category: 'hatchback',
      transmission: 'Manual',
      fuelType: 'Petrol',
      plateNumber: 'UP 16 BE 7812 (Customer Car)',
      specialInstructions: 'Late night safe driver service. Safe drive back home from dinner party.',
    },
    pickupLocation: 'Social CyberHub, DLF Phase 2, Gurugram',
    dropLocation: 'Noida Sector 50, Pocket C',
    distanceKm: 34.0,
    estimatedMinutes: 45,
    fareAmount: 850,
    paymentMethod: 'UPI / Card',
    serviceType: 'Late Night Safe Driver',
    bookingType: 'Late Night Safe Driver',
    otp: '9103',
  },
];
