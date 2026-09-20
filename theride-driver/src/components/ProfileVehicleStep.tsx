import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  HeartHandshake, 
  Car, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  CheckCircle2,
  Info,
  Sliders,
  Zap,
  Crown,
  Compass,
  Key
} from 'lucide-react';
import { DriverProfile, FourWheelerType } from '../types/driver';
import { validatePhone } from '../utils/validation';

interface ProfileVehicleStepProps {
  profile: DriverProfile;
  onChange: (updated: DriverProfile) => void;
  onNext: () => void;
}

interface VehicleOption {
  id: FourWheelerType;
  name: string;
  category: string;
  popularCustomerCars: string;
  badge: string;
  iconBg: string;
  tagline: string;
}

const VEHICLE_CATEGORIES: VehicleOption[] = [
  {
    id: 'compact_sedan',
    name: 'Compact & Mid-Size Sedan',
    category: 'Sedan',
    popularCustomerCars: 'Honda City, Maruti Dzire, Hyundai Verna, Honda Amaze, Skoda Slavia',
    badge: 'High City Demand',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    tagline: 'Standard 4-door passenger sedans',
  },
  {
    id: 'hatchback',
    name: 'Compact Hatchback',
    category: 'Hatchback',
    popularCustomerCars: 'Maruti Swift, Baleno, Hyundai i20, Grand i10 Nios, Tata Altroz',
    badge: 'Frequent Rides',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tagline: 'City commuters & family hatchbacks',
  },
  {
    id: 'suv_muv',
    name: 'SUV & MUV (6-7 Seaters)',
    category: 'SUV / MUV',
    popularCustomerCars: 'Toyota Innova Crysta, Fortuner, Mahindra Scorpio-N, XUV700, Tata Safari, Ertiga',
    badge: 'High Outstation Fares',
    iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    tagline: 'Highway cruisers, big cabin & high ground clearance',
  },
  {
    id: 'electric_ev',
    name: 'Electric Vehicles (EV)',
    category: 'Electric',
    popularCustomerCars: 'Tata Nexon EV, Tigor EV, MG ZS EV, Mahindra XUV400, Hyundai Ioniq 5',
    badge: 'Green Premium',
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    tagline: 'Regenerative braking, silent motors & instant torque',
  },
  {
    id: 'luxury_cars',
    name: 'Luxury / Executive Chauffeur',
    category: 'Luxury Fleet',
    popularCustomerCars: 'Mercedes-Benz E/C-Class, BMW 3/5 Series, Audi A4/A6, Jaguar XF, Volvo XC60',
    badge: 'Highest Hourly Payout',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    tagline: 'Premium executive rides, VIP protocol & velvet-smooth braking',
  },
  {
    id: 'large_mpv',
    name: 'Large MPV & Multi-Seaters',
    category: 'Large MPV',
    popularCustomerCars: 'Kia Carnival, Toyota Vellfire, Force Urbania, Hycross',
    badge: 'Special Events',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    tagline: 'Long wheelbase luxury family & business shuttles',
  },
];

const TRANSMISSION_OPTIONS: { id: 'both' | 'manual' | 'automatic'; label: string; desc: string }[] = [
  { 
    id: 'both', 
    label: 'Both (Manual & Automatic)', 
    desc: 'Skilled in stick-shift clutch & automatic/AMT/CVT/DCT cars' 
  },
  { 
    id: 'automatic', 
    label: 'Automatic Transmission Only', 
    desc: 'AMT, CVT, Torque Converter, DCT & Single-Speed EVs' 
  },
  { 
    id: 'manual', 
    label: 'Manual Transmission Only', 
    desc: 'Traditional manual 5/6-speed stick shift with clutch pedal' 
  },
];

const EXPERIENCE_OPTIONS = [
  '1 - 3 Years (General Driving)',
  '3 - 5 Years (Experienced Driver)',
  '5+ Years (Professional Driver)',
  '10+ Years (Senior Master Chauffeur)',
];

const SPECIAL_SKILLS = [
  'Automatic & Paddle Shifters',
  'Electronic Parking Handbrake',
  'Ghats & Hill Road Slopes',
  'Highway Night Driving',
  'Tight Parking & Basement Valet',
  'ADAS & Adaptive Cruise Control',
  'VIP Executive Etiquette',
  'EV Regenerative Braking',
];

const CITIES = [
  'Delhi NCR (Delhi, Gurugram, Noida, Faridabad, Ghaziabad)',
  'Mumbai & MMR (Mumbai, Thane, Navi Mumbai)',
  'Bengaluru (Whitefield, Koramangala, Indiranagar, Electronic City)',
  'Hyderabad (Hitec City, Gachibowli, Banjara Hills)',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad & Gandhinagar',
  'Jaipur',
  'Chandigarh Tricity',
  'Lucknow',
];

export const ProfileVehicleStep: React.FC<ProfileVehicleStepProps> = ({
  profile,
  onChange,
  onNext,
}) => {
  const capability = profile.fourWheelerCapability || {
    canDriveTypes: ['compact_sedan', 'hatchback'],
    transmission: 'both',
    drivingExperience: '3 - 5 Years (Experienced Driver)',
    hasValidLmvLicense: true,
    preferredModels: [],
    comfortDrivingHighway: true,
    comfortDrivingNight: true,
    comfortDrivingHills: true,
    specialSkills: ['Automatic & Paddle Shifters', 'Tight Parking & Basement Valet'],
    familiarBrands: [],
    confirmedBeforeUpload: true,
  };

  const handleInputChange = (field: keyof DriverProfile, value: any) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const handleEmergencyChange = (field: string, value: any) => {
    onChange({
      ...profile,
      emergencyContact: {
        ...profile.emergencyContact,
        [field]: value,
      },
    });
  };

  const handleServicePreferenceChange = (field: keyof DriverProfile['servicePreferences'], checked: boolean) => {
    onChange({
      ...profile,
      servicePreferences: {
        ...profile.servicePreferences,
        [field]: checked,
      },
    });
  };

  const updateCapability = (patch: Partial<DriverProfile['fourWheelerCapability']>) => {
    onChange({
      ...profile,
      fourWheelerCapability: {
        ...capability,
        ...patch,
      },
    });
  };

  const handleToggleVehicleType = (typeId: FourWheelerType) => {
    const current = capability.canDriveTypes || [];
    let updated: FourWheelerType[];
    if (current.includes(typeId)) {
      if (current.length === 1) {
        return; // maintain at least one
      }
      updated = current.filter((t) => t !== typeId);
    } else {
      updated = [...current, typeId];
    }
    updateCapability({ canDriveTypes: updated });
  };

  const handleSelectAllVehicles = () => {
    updateCapability({
      canDriveTypes: VEHICLE_CATEGORIES.map((v) => v.id),
    });
  };

  const handleToggleSkill = (skill: string) => {
    const current = capability.specialSkills || [];
    let updated: string[];
    if (current.includes(skill)) {
      updated = current.filter((s) => s !== skill);
    } else {
      updated = [...current, skill];
    }
    updateCapability({ specialSkills: updated });
  };

  const phoneValidation = profile.phone ? validatePhone(profile.phone) : null;
  const isProfileComplete = 
    profile.fullName.trim() !== '' &&
    profile.phone.trim() !== '' &&
    (capability.canDriveTypes?.length || 0) > 0;

  return (
    <div id="step-profile-vehicle" className="space-y-6 animate-in fade-in">
      
      {/* Step Header Banner in TheRide Blue & White */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              STEP 1 OF 3 &bull; DRIVER PROFILE &amp; CUSTOMER VEHICLE PREFERENCES
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Personal Information &amp; <span className="text-blue-600">Vehicle Driving Selection</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              <strong>TheRide Driver-on-Demand model:</strong> Customers hire you to drive <em>their personal cars</em>. You do not bring or register your own vehicle. Simply select which customer car categories, transmission styles, and duty types you are skilled to drive!
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-3.5 px-4.5 text-xs text-blue-900 flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold block text-sm text-blue-950">Customer Car Provided</span>
              <span className="text-blue-700 text-xs">No driver vehicle RC or insurance required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Driver Personal Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Driver Personal Details</h3>
                <p className="text-xs text-slate-500">Legal identity for official customer safety badge</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-fullname">
                  Full Legal Name (as per Driving License) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-fullname"
                    type="text"
                    placeholder="e.g. Rajesh Kumar Sharma"
                    value={profile.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-phone">
                  Registered Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-medium">+91</span>
                  <input
                    id="input-phone"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                  />
                </div>
                {phoneValidation && (
                  <p className={`text-[11px] mt-1 font-medium ${phoneValidation.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {phoneValidation.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-email">
                  Email Address
                </label>
                <input
                  id="input-email"
                  type="email"
                  placeholder="driver@example.com"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* City of Operation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="select-city">
                  City of Driving Operations <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="select-city"
                    value={profile.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 appearance-none font-medium cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date of Birth & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5" htmlFor="input-dob">
                    Date of Birth
                  </label>
                  <input
                    id="input-dob"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5" htmlFor="select-blood-group">
                    Blood Group
                  </label>
                  <select
                    id="select-blood-group"
                    value={profile.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium cursor-pointer"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-address">
                  Current Residential Address
                </label>
                <textarea
                  id="input-address"
                  rows={2}
                  placeholder="Street, locality, area, PIN code (must match Aadhaar address)"
                  value={profile.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Emergency Contact */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <HeartHandshake className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Emergency Contact (SOS Support)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1" htmlFor="input-emergency-name">
                      Contact Name
                    </label>
                    <input
                      id="input-emergency-name"
                      type="text"
                      placeholder="e.g. Sunita Sharma"
                      value={profile.emergencyContact.name}
                      onChange={(e) => handleEmergencyChange('name', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1" htmlFor="input-emergency-phone">
                      Contact Phone
                    </label>
                    <input
                      id="input-emergency-phone"
                      type="tel"
                      placeholder="9811223344"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Preferences */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Trip &amp; Duty Preferences</h4>
                <p className="text-xs text-slate-500">Choose which types of customer car duties you accept</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'cityRides' as const, label: 'One-Way City Trips', desc: 'Point-to-point drop in customer car' },
                { key: 'outstationRides' as const, label: 'Outstation Road Trips', desc: 'Weekend & highway drives in customer car' },
                { key: 'rentalRides' as const, label: 'Hourly Chauffeur (4h / 8h / 12h)', desc: 'Dedicated driver for full day appointments' },
                { key: 'airportDuty' as const, label: 'Airport Transfers', desc: 'Dropping or picking up customer at terminal' },
                { key: 'nightDuty' as const, label: 'Late Night Safe Driver', desc: 'Safe return drive after dinner/parties' },
              ].map((pref) => (
                <label 
                  key={pref.key} 
                  className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!profile.servicePreferences?.[pref.key]}
                    onChange={(e) => handleServicePreferenceChange(pref.key, e.target.checked)}
                    className="mt-1 h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{pref.label}</span>
                    <span className="text-[11px] text-slate-500 leading-tight">{pref.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Vehicle Selection & Driving Capabilities */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Which Customer Cars Can You Drive?</h3>
                  <p className="text-xs text-slate-500">Select all categories you are confident &amp; skilled to operate</p>
                </div>
              </div>
              <button
                type="button"
                id="btn-select-all-vehicles"
                onClick={handleSelectAllVehicles}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Select All ({VEHICLE_CATEGORIES.length})
              </button>
            </div>

            {/* Vehicle Categories Grid */}
            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-slate-700">
                Customer 4-Wheeler Categories <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VEHICLE_CATEGORIES.map((cat) => {
                  const isSelected = capability.canDriveTypes?.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      id={`card-vehicle-type-${cat.id}`}
                      onClick={() => handleToggleVehicleType(cat.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{cat.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {cat.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{cat.tagline}</p>
                        <div className="bg-white/80 rounded-lg p-2 border border-slate-100 text-[11px] text-slate-600">
                          <strong className="text-slate-800">Popular: </strong>
                          {cat.popularCustomerCars}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                          {isSelected ? '✓ Authorized to Drive' : 'Click to add'}
                        </span>
                        <div className={`h-5 w-5 rounded-md flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                        }`}>
                          {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transmission Competency */}
            <div className="mb-6 pt-5 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Transmission Competency <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TRANSMISSION_OPTIONS.map((opt) => {
                  const isSelected = capability.transmission === opt.id;
                  return (
                    <div
                      key={opt.id}
                      id={`transmission-opt-${opt.id}`}
                      onClick={() => updateCapability({ transmission: opt.id })}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-xs">{opt.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-blue-600 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Driving Experience Selector */}
            <div className="mb-6 pt-5 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                4-Wheeler Driving Experience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EXPERIENCE_OPTIONS.map((exp) => {
                  const isSelected = capability.drivingExperience === exp;
                  return (
                    <button
                      type="button"
                      key={exp}
                      onClick={() => updateCapability({ drivingExperience: exp })}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{exp}</span>
                      {isSelected && <Check className="h-4 w-4 text-blue-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Skills & Terrain Comfort */}
            <div className="pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Special Driving Skills &amp; Comfort Features
                </label>
                <span className="text-[11px] text-slate-500">Helps match specialized customer car bookings</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SPECIAL_SKILLS.map((skill) => {
                  const isSelected = capability.specialSkills?.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => handleToggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Driving License Declaration Checkbox */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={capability.hasValidLmvLicense}
                  onChange={(e) => updateCapability({ hasValidLmvLicense: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block">
                    I hold a valid Light Motor Vehicle (LMV / Transport) Driving License issued in India.
                  </span>
                  <span className="text-slate-600 text-[11px] mt-0.5 block">
                    I confirm I can safely operate customer 4-wheelers in the categories selected above and comply with traffic rules.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Selected: {capability.canDriveTypes?.length || 0} Customer Car Types &bull; {capability.transmission.toUpperCase()}
                </span>
                {isProfileComplete && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> Ready for KYC Docs
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Next: Upload official Driving License, Aadhaar, PAN card, and selfie photo.
              </p>
            </div>

            <button
              id="btn-profile-next-step"
              onClick={onNext}
              disabled={!isProfileComplete}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer ${
                isProfileComplete
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Continue to Step 2: KYC Documents</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
