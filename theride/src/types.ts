export type VehicleCategory = 'hatchback' | 'sedan' | 'suv' | 'luxury';
export type TransmissionType = 'manual' | 'automatic';
export type TripType = 'hourly' | 'oneway' | 'multiday' | 'outstation';

export interface VehicleDetails {
  category: VehicleCategory;
  transmission: TransmissionType;
  makeModel: string;
  plateNumber?: string;
}

export interface TripPreferences {
  policeVerifiedOnly: boolean;
  nonSmokerDriver: boolean;
  manualAndAutoCertified: boolean;
  nightAndHighwaySpecialist: boolean;
  preferredLanguage: string;
  smoothDrivingStyle: boolean;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  experienceYears: number;
  avatarUrl: string;
  verifiedBadge: boolean;
  manualSpecialist: boolean;
  languages: string[];
  currentDistanceKm: number;
  etaMinutes: number;
  carTypesTrained: string[];
}

export interface TripPackage {
  id: string;
  title: string;
  hours: number;
  includedKm: number;
  basePrice: number;
  extraHourRate: number;
  extraKmRate: number;
  recommendedFor: string;
}

export type RideStatus = 
  | 'draft'
  | 'searching'
  | 'driver_assigned'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface UserProfile {
  username: string;
  emailOrPhone?: string;
  homeAddress?: string;
  preferences?: TripPreferences;
}

export interface BookingRecipient {
  type: 'myself' | 'someone_else';
  passengerName?: string;
  passengerPhone?: string;
}

export interface RideNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alert' | 'success';
}

export interface Booking {
  id: string;
  tripType: TripType;
  vehicle: VehicleDetails;
  pickupAddress: string;
  dropAddress?: string;
  pickupTime: string; // ISO or "Immediate"
  package?: TripPackage;
  days?: number;
  estimatedPrice: number;
  driver?: DriverProfile;
  otp: string;
  status: RideStatus;
  createdAt: string;
  inspectionDone: boolean;
  notes?: string;
  recipient?: BookingRecipient;
  liveLocationShared?: boolean;
  preferences?: TripPreferences;
}
