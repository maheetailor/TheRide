import { DriverProfile, TripPackage } from '../types';

export const HOURLY_PACKAGES: TripPackage[] = [
  {
    id: 'pkg-1h',
    title: 'Quick Hop',
    hours: 1,
    includedKm: 15,
    basePrice: 229,
    extraHourRate: 120,
    extraKmRate: 12,
    recommendedFor: 'Short drop, metro station transit, quick car move'
  },
  {
    id: 'pkg-2h',
    title: 'Short Errand',
    hours: 2,
    includedKm: 25,
    basePrice: 349,
    extraHourRate: 120,
    extraKmRate: 12,
    recommendedFor: 'Hospital visits, shopping, dinner nights'
  },
  {
    id: 'pkg-3h',
    title: 'City Run',
    hours: 3,
    includedKm: 35,
    basePrice: 469,
    extraHourRate: 120,
    extraKmRate: 12,
    recommendedFor: 'Doctor appointments, banking, multiple close stops'
  },
  {
    id: 'pkg-4h',
    title: 'City Express',
    hours: 4,
    includedKm: 45,
    basePrice: 599,
    extraHourRate: 120,
    extraKmRate: 12,
    recommendedFor: 'Client meetings, party night return, social visits'
  },
  {
    id: 'pkg-8h',
    title: 'Full Day Chauffeur',
    hours: 8,
    includedKm: 90,
    basePrice: 1099,
    extraHourRate: 110,
    extraKmRate: 11,
    recommendedFor: 'Family functions, weddings, day-long business tours'
  },
  {
    id: 'pkg-12h',
    title: 'Extended Day & Night',
    hours: 12,
    includedKm: 140,
    basePrice: 1549,
    extraHourRate: 100,
    extraKmRate: 10,
    recommendedFor: 'Full day outstation & inter-city travels'
  }
];

export const MOCK_DRIVERS: DriverProfile[] = [
  {
    id: 'drv-1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.92,
    totalTrips: 1840,
    experienceYears: 7,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verifiedBadge: true,
    manualSpecialist: true,
    languages: ['Hindi', 'English', 'Gujarati'],
    currentDistanceKm: 1.4,
    etaMinutes: 8,
    carTypesTrained: ['Hatchback', 'Sedan', 'SUV', 'Luxury (BMW/Audi)']
  },
  {
    id: 'drv-2',
    name: 'Suresh Patil',
    phone: '+91 98111 22334',
    rating: 4.88,
    totalTrips: 1210,
    experienceYears: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    verifiedBadge: true,
    manualSpecialist: true,
    languages: ['Hindi', 'Marathi', 'English'],
    currentDistanceKm: 2.1,
    etaMinutes: 12,
    carTypesTrained: ['Hatchback', 'Sedan', 'SUV']
  },
  {
    id: 'drv-3',
    name: 'Amit Sharma',
    phone: '+91 97555 88990',
    rating: 4.95,
    totalTrips: 2450,
    experienceYears: 9,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    verifiedBadge: true,
    manualSpecialist: true,
    languages: ['Hindi', 'English', 'Punjabi'],
    currentDistanceKm: 2.8,
    etaMinutes: 15,
    carTypesTrained: ['Sedan', 'SUV', 'Luxury', 'Electric Vehicles']
  }
];
