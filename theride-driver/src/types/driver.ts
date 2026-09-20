export type FourWheelerType = 
  | 'hatchback' 
  | 'compact_sedan' 
  | 'executive_sedan' 
  | 'suv_muv' 
  | 'electric_ev' 
  | 'luxury_cars' 
  | 'large_mpv';

export interface FourWheelerCapability {
  canDriveTypes: FourWheelerType[];
  transmission: 'manual' | 'automatic' | 'both';
  drivingExperience: string;
  hasValidLmvLicense: boolean;
  preferredModels?: string[];
  comfortDrivingHighway: boolean;
  comfortDrivingNight: boolean;
  comfortDrivingHills: boolean;
  specialSkills: string[];
  familiarBrands: string[];
  confirmedBeforeUpload: boolean;
}

export type DocumentStatus = 'not_uploaded' | 'uploaded' | 'under_review' | 'verified' | 'rejected';

export interface UploadedFileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface DriverKycDocuments {
  drivingLicense: {
    number: string;
    expiryDate: string;
    status: DocumentStatus;
    frontDoc?: UploadedFileMeta;
    backDoc?: UploadedFileMeta;
    notes?: string;
  };
  aadhaarCard: {
    number: string;
    status: DocumentStatus;
    frontDoc?: UploadedFileMeta;
    backDoc?: UploadedFileMeta;
    maskedConsent: boolean;
    notes?: string;
  };
  panCard: {
    number: string;
    status: DocumentStatus;
    doc?: UploadedFileMeta;
    nameOnCard: string;
    notes?: string;
  };
  driverPhoto: {
    status: DocumentStatus;
    doc?: UploadedFileMeta;
  };
}

export interface DriverProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  dateOfBirth: string;
  address?: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  // Service preferences when driving customer's car
  servicePreferences: {
    cityRides: boolean;
    outstationRides: boolean;
    rentalRides: boolean;
    airportDuty: boolean;
    nightDuty: boolean;
  };
  // Which kinds of customer vehicles the driver can drive
  fourWheelerCapability: FourWheelerCapability;
  documents: DriverKycDocuments;
  verificationStatus: 'draft' | 'submitted' | 'under_audit' | 'approved' | 'rejected';
  partnerId?: string;
  joinedDate: string;
  approvedAt?: string;
}

export interface CustomerCarInfo {
  make: string;
  model: string;
  year?: number;
  category: FourWheelerType;
  transmission: 'Manual' | 'Automatic' | 'EV Single-Speed';
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  plateNumber: string;
  specialInstructions?: string;
}

export interface RideRequest {
  id: string;
  passengerName: string;
  passengerRating: number;
  passengerPhone: string;
  passengerPhoto: string;
  // Customer car details (the car the driver is hired to drive)
  customerCar: CustomerCarInfo;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  estimatedMinutes: number;
  fareAmount: number;
  paymentMethod: 'Cash' | 'TheRide Wallet' | 'UPI / Card';
  serviceType: string;
  bookingType: 'One-Way Trip' | 'Outstation Round-Trip' | 'Hourly Chauffeur (4h/8h)' | 'Airport Transfer' | 'Late Night Safe Driver';
  otp: string;
}

export type ActiveTripStatus = 
  | 'idle' 
  | 'incoming_request' 
  | 'heading_to_pickup' 
  | 'arrived_at_pickup' 
  | 'trip_in_progress' 
  | 'trip_completed';
