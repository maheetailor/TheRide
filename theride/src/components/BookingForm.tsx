import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Clock, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  SlidersHorizontal, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  BookmarkCheck,
  CalendarDays,
  Gauge,
  Compass
} from 'lucide-react';
import { 
  VehicleCategory, 
  TransmissionType, 
  TripType, 
  TripPackage, 
  Booking, 
  VehicleDetails, 
  UserProfile, 
  BookingRecipient,
  TripPreferences 
} from '../types';
import { HOURLY_PACKAGES } from '../data/mockData';

interface BookingFormProps {
  user: UserProfile | null;
  recipient: BookingRecipient | null;
  onChangeRecipient: () => void;
  onStartBooking: (bookingData: Omit<Booking, 'id' | 'otp' | 'status' | 'createdAt' | 'inspectionDone'>) => void;
}

const DEFAULT_PREFERENCES: TripPreferences = {
  policeVerifiedOnly: true,
  nonSmokerDriver: true,
  manualAndAutoCertified: true,
  nightAndHighwaySpecialist: false,
  preferredLanguage: 'Hindi & English',
  smoothDrivingStyle: true,
};

export const BookingForm: React.FC<BookingFormProps> = ({ 
  user, 
  recipient, 
  onChangeRecipient, 
  onStartBooking 
}) => {
  // Form States
  const [tripType, setTripType] = useState<TripType>('hourly');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('suv');
  const [transmission, setTransmission] = useState<TransmissionType>('manual');
  const [makeModel, setMakeModel] = useState('Hyundai Creta');
  const [plateNumber, setPlateNumber] = useState('');
  
  // Hourly packages
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-4h');

  // Multi-day booking states (1 to 7 days quick buttons, or custom number of days)
  const [selectedDays, setSelectedDays] = useState<number>(2);
  const [customDaysInput, setCustomDaysInput] = useState<string>('2');
  const [isCustomDays, setIsCustomDays] = useState(false);

  // Address & Timing
  const [pickupAddress, setPickupAddress] = useState(
    recipient?.type === 'myself' && user?.homeAddress 
      ? user.homeAddress 
      : '142 Cyber City, DLF Phase 2'
  );
  const [dropAddress, setDropAddress] = useState('Aerocity Terminal 3, New Delhi');
  const [showOptionalDrop, setShowOptionalDrop] = useState(false);
  const [isImmediate, setIsImmediate] = useState(true);
  const [scheduledTime, setScheduledTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Trip Preferences (Persistent)
  const [preferences, setPreferences] = useState<TripPreferences>(() => {
    try {
      const saved = localStorage.getItem('theride_trip_preferences');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_PREFERENCES;
  });
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);

  // Sync home address if user profile updates
  useEffect(() => {
    if (recipient?.type === 'myself' && user?.homeAddress && !pickupAddress) {
      setPickupAddress(user.homeAddress);
    }
  }, [user, recipient]);

  const selectedPackage = HOURLY_PACKAGES.find(p => p.id === selectedPackageId) || HOURLY_PACKAGES[3];

  // A ride is considered under 4 hours if it's a one-way trip, OR an hourly booking where hours < 4
  const isHourlyShortRide = tripType === 'hourly' && selectedPackage.hours < 4;
  const isDropLocationRequired = tripType === 'oneway' || tripType === 'outstation' || isHourlyShortRide;

  // Pricing calculation
  const calculatePrice = () => {
    let luxurySurcharge = vehicleCategory === 'luxury' ? 250 : 0;

    if (tripType === 'hourly') {
      return selectedPackage.basePrice + luxurySurcharge;
    } else if (tripType === 'oneway') {
      return 399 + (vehicleCategory === 'luxury' ? 200 : 0);
    } else if (tripType === 'multiday') {
      // Base daily rate: ₹1,499/day for dedicated personal chauffeur (10 hours/day)
      const daysCount = Math.max(1, selectedDays);
      const dayRate = 1499;
      return (daysCount * dayRate) + (luxurySurcharge * daysCount);
    } else {
      // Outstation point-to-point highway day rate
      return 1899 + luxurySurcharge;
    }
  };

  const estimatedPrice = calculatePrice();

  const handleSelectDays = (days: number) => {
    setSelectedDays(days);
    setCustomDaysInput(days.toString());
    setIsCustomDays(false);
  };

  const handleCustomDaysChange = (val: string) => {
    setCustomDaysInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 30) {
      setSelectedDays(parsed);
      setIsCustomDays(true);
    }
  };

  const handleSaveTripPreferences = () => {
    try {
      localStorage.setItem('theride_trip_preferences', JSON.stringify(preferences));
    } catch {
      // Ignore
    }
    setShowSaveFeedback(true);
    setTimeout(() => {
      setShowSaveFeedback(false);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim()) return;

    // For rides less than 4 hours, drop location is mandatory
    if (isDropLocationRequired && !dropAddress.trim()) {
      return;
    }

    const vehicle: VehicleDetails = {
      category: vehicleCategory,
      transmission,
      makeModel: makeModel.trim() || 'Personal Vehicle',
      plateNumber: plateNumber.trim() ? plateNumber.toUpperCase() : undefined,
    };

    onStartBooking({
      tripType,
      vehicle,
      pickupAddress: pickupAddress.trim(),
      dropAddress: (isDropLocationRequired || dropAddress.trim()) ? dropAddress.trim() : undefined,
      pickupTime: isImmediate ? 'Immediate (Arrives in ~10 mins)' : (scheduledTime || 'Scheduled Today'),
      package: tripType === 'hourly' ? selectedPackage : undefined,
      days: tripType === 'multiday' ? selectedDays : undefined,
      estimatedPrice,
      recipient: recipient || undefined,
      preferences,
      notes: specialInstructions || undefined,
    });
  };

  return (
    <div id="booking-form-container" className="w-full max-w-4xl mx-auto space-y-5">
      
      {/* Main Booking Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 md:p-8">
        
        {/* Recipient & Address Quick Status Bar */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
            {recipient?.type === 'someone_else' ? (
              <div>
                <span className="font-semibold text-slate-900">Booking for: {recipient.passengerName || 'Someone Else'}</span>
                <span className="text-slate-500 ml-1.5 font-mono">({recipient.passengerPhone})</span>
              </div>
            ) : (
              <div>
                <span className="font-semibold text-slate-900">Booking for: {user?.username || 'Myself'}</span>
                {user?.homeAddress && (
                  <span className="text-slate-500 ml-1.5 hidden sm:inline">• Home: {user.homeAddress.slice(0, 35)}...</span>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onChangeRecipient}
            className="text-blue-600 hover:text-blue-700 font-semibold underline text-xs text-left sm:text-right min-h-[36px] flex items-center"
          >
            Change Passenger / Home Address
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Choose Service Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                <span>Choose Service Mode</span>
              </label>
              <span className="text-[11px] text-slate-500 hidden sm:inline">Chauffeur drives your vehicle</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {[
                { 
                  id: 'hourly', 
                  label: 'Hourly Chauffeur', 
                  badge: '2h - 12h',
                  sub: 'Errands, dinners & waiting' 
                },
                { 
                  id: 'multiday', 
                  label: 'Multi-Day Chauffeur', 
                  badge: 'Up to 7+ Days',
                  sub: 'Daily dedicated driver' 
                },
                { 
                  id: 'oneway', 
                  label: 'One-Way Drop', 
                  badge: 'City Trip',
                  sub: 'Point A to B in your car' 
                },
                { 
                  id: 'outstation', 
                  label: 'Outstation Highway', 
                  badge: 'Intercity',
                  sub: 'Highways & road trips' 
                }
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTripType(mode.id as TripType)}
                  className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all min-h-[88px] flex flex-col justify-between ${
                    tripType === mode.id
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                      {mode.label}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded mt-1">
                      {mode.badge}
                    </span>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {mode.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION: MULTI-DAY DURATION SELECTOR (UP TO 7 DAYS OR CUSTOM DAYS) */}
          {tripType === 'multiday' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Book Chauffeur for Multiple Days
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Dedicated driver arrives at your doorstep each day. 10 hours daily driving included.
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                    ₹1,499 / day (Flat rate)
                  </span>
                </div>
              </div>

              {/* Quick 1 to 7 Days Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1.5">
                  Select Duration (Up to 7 Days):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSelectDays(d)}
                      className={`min-h-[44px] py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                        selectedDays === d && !isCustomDays
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Number of Days Input Option */}
              <div className="pt-2 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Need more than 7 days or custom duration?
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Enter any number of days (1 to 30 days):
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={customDaysInput}
                    onChange={(e) => handleCustomDaysChange(e.target.value)}
                    className="w-24 px-3 py-2 text-sm font-bold text-center border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden min-h-[44px]"
                    placeholder="Days"
                  />
                  <span className="font-semibold text-slate-700">Days</span>
                  <button
                    type="button"
                    onClick={() => {
                      const num = parseInt(customDaysInput, 10);
                      if (!isNaN(num) && num > 0) {
                        setSelectedDays(num);
                        setIsCustomDays(true);
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs min-h-[44px] transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Multi-day summary badge */}
              <div className="p-2.5 bg-white rounded-xl border border-blue-100 flex items-center justify-between text-xs text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <strong>{selectedDays} Days Selected</strong>: Driver retained exclusively for your vehicle.
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{selectedDays * 1499}
                </span>
              </div>
            </div>
          )}

          {/* Section 2: Hourly Package (if hourly mode is chosen) */}
          {tripType === 'hourly' && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                  <span>Select Hourly Package</span>
                </label>
                <span className="text-[11px] text-slate-500">Fuel & tolls by vehicle owner</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {HOURLY_PACKAGES.map(pkg => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all min-h-[82px] flex flex-col justify-between ${
                      selectedPackageId === pkg.id
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{pkg.hours} Hours</span>
                        {pkg.hours < 4 && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                            &lt; 4h
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-blue-700">₹{pkg.basePrice}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Includes {pkg.includedKm} km
                      {pkg.hours < 4 && <span className="text-amber-700 font-medium block text-[10px]">Drop location required</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Extra: ₹{pkg.extraHourRate}/hr • ₹{pkg.extraKmRate}/km
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Your Vehicle Specification */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">
                  {tripType === 'hourly' ? '3' : '2'}
                </span>
                <span>Your Vehicle Specification</span>
              </label>
              <span className="text-[11px] text-slate-500">Matches qualified chauffeurs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Category */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Vehicle Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['hatchback', 'sedan', 'suv', 'luxury'] as VehicleCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setVehicleCategory(cat)}
                      className={`min-h-[44px] py-2 px-2 text-center rounded-xl text-xs font-bold uppercase tracking-wide border transition-all ${
                        vehicleCategory === cat
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Transmission Type
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['manual', 'automatic'] as TransmissionType[]).map(trans => (
                    <button
                      key={trans}
                      type="button"
                      onClick={() => setTransmission(trans)}
                      className={`min-h-[44px] py-2 px-3 text-center rounded-xl text-xs font-bold capitalize border transition-all ${
                        transmission === trans
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {trans} Gearbox
                    </button>
                  ))}
                </div>
              </div>

              {/* Make & Model */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Make & Model
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={makeModel}
                    onChange={(e) => setMakeModel(e.target.value)}
                    placeholder="e.g. Hyundai Creta, Honda City, Innova"
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Registration Number */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Vehicle Plate Number (Optional)
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="e.g. DL 03 CA 5541"
                  className="w-full px-3 py-2.5 text-base sm:text-sm uppercase font-mono border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Route & Scheduling */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-900 block mb-2.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">
                {tripType === 'hourly' ? '4' : '3'}
              </span>
              <span>
                {tripType === 'hourly' 
                  ? 'Pickup Location & Schedule' 
                  : tripType === 'multiday' 
                  ? 'Reporting Location & Start Time' 
                  : 'Route & Schedule'}
              </span>
            </label>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Pickup / Reporting Address (Where driver meets your vehicle)
                  </label>
                  {user?.homeAddress && (
                    <button
                      type="button"
                      onClick={() => setPickupAddress(user.homeAddress || '')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline min-h-[32px] flex items-center"
                    >
                      Fill Home Address
                    </button>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter building, colony, or GPS landmark"
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Destination / Drop Location Field: REQUIRED for rides under 4 hours, one-way, and outstation */}
              {isDropLocationRequired ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-rose-500" />
                      <span>Destination / Drop Location</span>
                      {isHourlyShortRide ? (
                        <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                          Required for rides &lt; 4 Hours ({selectedPackage.hours}h)
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-600 font-semibold">*Required</span>
                      )}
                    </label>
                  </div>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={dropAddress}
                      onChange={(e) => setDropAddress(e.target.value)}
                      placeholder={
                        isHourlyShortRide
                          ? `Enter drop location for your ${selectedPackage.hours}h ride (e.g. Cyber City, Airport, Indiranagar)`
                          : "Destination address, city, or airport terminal"
                      }
                      className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>
                  {isHourlyShortRide && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Since this ride is {selectedPackage.hours} hour{selectedPackage.hours > 1 ? 's' : ''} (&lt; 4 hours), typing the drop location is required so the driver can plan route transit and return travel.
                    </p>
                  )}
                </div>
              ) : tripType === 'hourly' ? (
                /* For 4h+ hourly bookings, driver is on standby; drop location can be optionally entered */
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowOptionalDrop(!showOptionalDrop)}
                    className="text-xs text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1.5 py-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {showOptionalDrop 
                        ? 'Hide optional drop location' 
                        : '+ Add planned drop location (Optional for 4h+ chauffeur standby)'}
                    </span>
                  </button>
                  {showOptionalDrop && (
                    <div className="mt-2 relative animate-in fade-in duration-150">
                      <Navigation className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={dropAddress}
                        onChange={(e) => setDropAddress(e.target.value)}
                        placeholder="Planned end location (optional, chauffeur stays on standby with car)"
                        className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                      />
                    </div>
                  )}
                </div>
              ) : null}

              {/* Timing Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsImmediate(true)}
                    className={`min-h-[44px] py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      isImmediate
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Immediate (~10m)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsImmediate(false)}
                    className={`min-h-[44px] py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      !isImmediate
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule Ahead
                  </button>
                </div>

                {!isImmediate && (
                  <div>
                    <input
                      type="datetime-local"
                      required={!isImmediate}
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2.5 text-base sm:text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION: TRIP PREFERENCES & SAVE TRIP PREFERENCES */}
          <div className="pt-2 border-t border-slate-100">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Trip Preferences & Chauffeur Standards
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Customize driver traits for your personal car and save for future rides.
                    </p>
                  </div>
                </div>

                {/* Save Trip Preferences Button */}
                <button
                  type="button"
                  onClick={handleSaveTripPreferences}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 min-h-[40px] shrink-0"
                >
                  <BookmarkCheck className="w-4 h-4 text-blue-600" />
                  <span>Save Trip Preferences</span>
                </button>
              </div>

              {/* Feedback toast when saved */}
              {showSaveFeedback && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Trip preferences saved! These will automatically apply to all your bookings.</span>
                </div>
              )}

              {/* Interactive Preference Checkboxes / Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <label className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:border-slate-300 transition-all min-h-[52px]">
                  <input
                    type="checkbox"
                    checked={preferences.policeVerifiedOnly}
                    onChange={(e) => setPreferences(prev => ({ ...prev, policeVerifiedOnly: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Strict Police-Verified Chauffeur</span>
                    <span className="text-[11px] text-slate-500">Commercial DL & judicial background check authenticated</span>
                  </div>
                </label>

                <label className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:border-slate-300 transition-all min-h-[52px]">
                  <input
                    type="checkbox"
                    checked={preferences.nonSmokerDriver}
                    onChange={(e) => setPreferences(prev => ({ ...prev, nonSmokerDriver: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Non-Smoker Driver</span>
                    <span className="text-[11px] text-slate-500">Zero smoking odor guaranteed inside your cabin</span>
                  </div>
                </label>

                <label className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:border-slate-300 transition-all min-h-[52px]">
                  <input
                    type="checkbox"
                    checked={preferences.manualAndAutoCertified}
                    onChange={(e) => setPreferences(prev => ({ ...prev, manualAndAutoCertified: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Gearbox & Clutch Specialist</span>
                    <span className="text-[11px] text-slate-500">Smooth rev-matching with zero clutch wear</span>
                  </div>
                </label>

                <label className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:border-slate-300 transition-all min-h-[52px]">
                  <input
                    type="checkbox"
                    checked={preferences.nightAndHighwaySpecialist}
                    onChange={(e) => setPreferences(prev => ({ ...prev, nightAndHighwaySpecialist: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Night & Highway Certified</span>
                    <span className="text-[11px] text-slate-500">Trained for high-speed expressways and nocturnal driving</span>
                  </div>
                </label>

              </div>

              {/* Language & Driving Style Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">
                    Preferred Chauffeur Language:
                  </label>
                  <select
                    value={preferences.preferredLanguage}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  >
                    <option value="Hindi & English">Hindi & English (Standard)</option>
                    <option value="English Fluent">English Fluent</option>
                    <option value="Hindi Fluent">Hindi Fluent</option>
                    <option value="Bilingual / Regional">Regional / Local Language</option>
                  </select>
                </div>

                <div className="flex items-center pt-2 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={preferences.smoothDrivingStyle}
                      onChange={(e) => setPreferences(prev => ({ ...prev, smoothDrivingStyle: e.target.checked }))}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 shrink-0"
                    />
                    <span>Eco / Gentle Driving Style (No sudden braking)</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Sticky/Prominent Mobile-Friendly Fare Summary & Submit Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">
                {tripType === 'multiday' 
                  ? `Estimated Fare (${selectedDays} Days Chauffeur)` 
                  : 'Estimated Total Fare'}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">₹{estimatedPrice}</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Includes Vehicle Protection
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Zero surge • Pay cash or UPI directly after ride
              </p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>
                {tripType === 'multiday' 
                  ? `Book Chauffeur for ${selectedDays} Days` 
                  : 'Confirm & Find Nearby Chauffeur'}
              </span>
              <span className="text-blue-200">→</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
