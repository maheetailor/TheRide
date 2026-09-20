import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Radio, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  Key,
  Fuel,
  Sliders,
  Check,
  Zap,
  Crown
} from 'lucide-react';
import { DriverProfile, RideRequest, ActiveTripStatus } from '../types/driver';
import { sampleRideRequests } from '../utils/sampleData';

interface DriverDutyDashboardProps {
  profile: DriverProfile;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenDocuments: () => void;
}

export const DriverDutyDashboard: React.FC<DriverDutyDashboardProps> = ({
  profile,
  isOnline,
  onToggleOnline,
  onOpenDocuments,
}) => {
  const [activeTripStatus, setActiveTripStatus] = useState<ActiveTripStatus>('idle');
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [requestCountdown, setRequestCountdown] = useState<number>(15);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [todayEarnings, setTodayEarnings] = useState<number>(1850);
  const [tripsCompleted, setTripsCompleted] = useState<number>(3);
  const [carInspectionChecked, setCarInspectionChecked] = useState<boolean>(false);

  // Auto-generate ride request when going online if idle
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOnline && activeTripStatus === 'idle') {
      timer = setTimeout(() => {
        triggerSimulatedRequest();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isOnline, activeTripStatus]);

  // Countdown for incoming request
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTripStatus === 'incoming_request' && requestCountdown > 0) {
      interval = setInterval(() => {
        setRequestCountdown((prev) => {
          if (prev <= 1) {
            setActiveTripStatus('idle');
            setCurrentRequest(null);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTripStatus, requestCountdown]);

  const triggerSimulatedRequest = (index?: number) => {
    const chosenIndex = index !== undefined 
      ? index 
      : Math.floor(Math.random() * sampleRideRequests.length);
    const chosen = sampleRideRequests[chosenIndex];
    setCurrentRequest(chosen);
    setRequestCountdown(15);
    setCarInspectionChecked(false);
    setActiveTripStatus('incoming_request');
  };

  const handleAcceptRide = () => {
    setActiveTripStatus('heading_to_pickup');
  };

  const handleDeclineRide = () => {
    setActiveTripStatus('idle');
    setCurrentRequest(null);
  };

  const handleArrivedAtPickup = () => {
    setActiveTripStatus('arrived_at_pickup');
  };

  const handleStartTripWithOtp = () => {
    if (!currentRequest) return;
    if (enteredOtp.trim() === currentRequest.otp || enteredOtp.trim() === '') {
      setOtpError(null);
      setActiveTripStatus('trip_in_progress');
    } else {
      setOtpError(`Incorrect OTP. Passenger OTP is ${currentRequest.otp}`);
    }
  };

  const handleCompleteTrip = () => {
    if (currentRequest) {
      setTodayEarnings((prev) => prev + currentRequest.fareAmount);
      setTripsCompleted((prev) => prev + 1);
    }
    setActiveTripStatus('trip_completed');
    setTimeout(() => {
      setActiveTripStatus('idle');
      setCurrentRequest(null);
      setEnteredOtp('');
    }, 3500);
  };

  const authorizedVehicleCount = profile.fourWheelerCapability?.canDriveTypes?.length || 0;
  const transmission = profile.fourWheelerCapability?.transmission?.toUpperCase() || 'BOTH';

  return (
    <div id="driver-duty-dashboard" className="space-y-6 animate-in fade-in">
      
      {/* Top Banner: Online Duty Switch & Live Status */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
              isOnline ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 text-slate-500'
            }`}>
              <Radio className={`h-6 w-6 ${isOnline ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {isOnline ? 'You Are Online — Matching Customer Car Bookings' : 'You Are Offline'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isOnline ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isOnline ? 'LIVE ON CUSTOMER RADAR' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized: <strong className="text-blue-700">{authorizedVehicleCount} Customer Car Categories</strong> &bull; Gearbox: <strong className="text-slate-800">{transmission}</strong> &bull; City: <strong className="text-slate-800">{profile.city}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-toggle-online-duty"
              onClick={onToggleOnline}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
                isOnline
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              <Radio className="h-4 w-4" />
              <span>{isOnline ? 'Go Offline' : 'Go Online & Take Rides'}</span>
            </button>
          </div>
        </div>

        {/* Chauffeur Model Callout */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-slate-800">Customer Car Model:</span>
            <span>Customer provides their personal car. You receive booking requests based on the car types you chose.</span>
          </div>
          {isOnline && activeTripStatus === 'idle' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Test specific booking:</span>
              <button
                onClick={() => triggerSimulatedRequest(0)}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Sedan (Auto)
              </button>
              <span>&bull;</span>
              <button
                onClick={() => triggerSimulatedRequest(1)}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Fortuner (Manual)
              </button>
              <span>&bull;</span>
              <button
                onClick={() => triggerSimulatedRequest(2)}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Mercedes (Luxury)
              </button>
              <span>&bull;</span>
              <button
                onClick={() => triggerSimulatedRequest(3)}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                EV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Today's Chauffeur Earnings</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹{todayEarnings}</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Direct bank transfer via PAN {profile.documents.panCard.number || 'Verified'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Customer Drives Completed</span>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{tripsCompleted} Trips</div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
            100% On-Time Safe Driving Rating
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Chauffeur Rating</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 flex items-center gap-1">
            <span>4.96</span>
            <span className="text-amber-500 text-lg">★</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            Partner Badge: {profile.partnerId || 'TR-DRV-4482'}
          </span>
        </div>
      </div>

      {/* TRIP STATUS VIEWS */}

      {/* State 1: Incoming Customer Car Request Modal / Card */}
      {activeTripStatus === 'incoming_request' && currentRequest && (
        <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-xl space-y-5 animate-in zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center animate-bounce">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  New Customer Car Booking Request
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {currentRequest.bookingType} &bull; <span className="text-emerald-600 font-black">₹{currentRequest.fareAmount}</span>
                </h3>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              <Clock className="h-4 w-4 text-amber-600 animate-spin" />
              <span className="text-xs font-bold text-amber-900">
                Expires in <strong className="text-amber-600 font-mono text-sm">{requestCountdown}s</strong>
              </span>
            </div>
          </div>

          {/* CUSTOMER CAR HIGHLIGHT BOX */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                    Customer's Vehicle to Drive
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {currentRequest.customerCar.make} {currentRequest.customerCar.model}
                  </h4>
                </div>
              </div>

              {/* Badges for Transmission & Fuel */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">
                  {currentRequest.customerCar.transmission} Gearbox
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white text-blue-900 border border-blue-200 text-xs font-bold">
                  {currentRequest.customerCar.fuelType}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">
                  {currentRequest.customerCar.plateNumber}
                </span>
              </div>
            </div>

            {currentRequest.customerCar.specialInstructions && (
              <div className="bg-white/80 rounded-xl p-2.5 border border-blue-100 text-xs text-slate-700 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Customer Note:</strong> {currentRequest.customerCar.specialInstructions}
                </span>
              </div>
            )}
          </div>

          {/* Customer & Route Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <img
                src={currentRequest.passengerPhoto}
                alt={currentRequest.passengerName}
                className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xs text-slate-500 block">Customer (Car Owner)</span>
                <h5 className="font-bold text-slate-900 text-sm">{currentRequest.passengerName}</h5>
                <span className="text-xs text-amber-500 font-bold">★ {currentRequest.passengerRating} Rating</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Estimated Driving Route</span>
                <span className="font-bold text-slate-900 text-sm">{currentRequest.distanceKm} km &bull; ~{currentRequest.estimatedMinutes} mins</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Payment Method</span>
                <span className="font-bold text-blue-700 text-xs">{currentRequest.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Pickup & Drop Points */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 block">Car Pickup Location:</span>
                <span className="text-slate-900 font-medium">{currentRequest.pickupLocation}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Navigation className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 block">Trip Destination:</span>
                <span className="text-slate-900 font-medium">{currentRequest.dropLocation}</span>
              </div>
            </div>
          </div>

          {/* Accept / Decline Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="btn-decline-ride"
              onClick={handleDeclineRide}
              className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Pass / Decline
            </button>
            <button
              id="btn-accept-ride"
              onClick={handleAcceptRide}
              className="flex-2 py-3 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Accept Booking (₹{currentRequest.fareAmount})</span>
            </button>
          </div>
        </div>
      )}

      {/* State 2: Heading to Pickup Location */}
      {activeTripStatus === 'heading_to_pickup' && currentRequest && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Navigation className="h-5 w-5 animate-spin" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Phase 1 of 3</span>
                <h3 className="text-base font-extrabold text-slate-900">Heading to Customer's Location</h3>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ETA: 8 Mins
            </span>
          </div>

          {/* Customer and Car Pill */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Customer &amp; Car to Drive:</span>
              <strong className="text-slate-900 text-sm block">
                {currentRequest.passengerName} &bull; {currentRequest.customerCar.make} {currentRequest.customerCar.model}
              </strong>
              <span className="text-slate-600 font-mono text-[11px]">
                {currentRequest.customerCar.plateNumber} ({currentRequest.customerCar.transmission})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert(`Calling Customer ${currentRequest.passengerName}: ${currentRequest.passengerPhone}`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-blue-700 font-bold border border-blue-200 shadow-xs cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Customer</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-0.5">Customer Pickup Address:</span>
            <span className="text-slate-900 font-medium">{currentRequest.pickupLocation}</span>
          </div>

          <button
            id="btn-arrived-at-pickup"
            onClick={handleArrivedAtPickup}
            className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>I Have Arrived at Customer's Location</span>
          </button>
        </div>
      )}

      {/* State 3: Arrived at Pickup - Car Handover & OTP */}
      {activeTripStatus === 'arrived_at_pickup' && currentRequest && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Phase 2 of 3</span>
                <h3 className="text-base font-extrabold text-slate-900">Customer Car Handover &amp; Start OTP</h3>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              At Customer Location
            </span>
          </div>

          {/* Inspection Check */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Quick Vehicle Handover Check</h4>
            <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={carInspectionChecked}
                onChange={(e) => setCarInspectionChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>
                I have verified the customer's vehicle ({currentRequest.customerCar.make} {currentRequest.customerCar.model}), checked fuel/battery level, and received keys from {currentRequest.passengerName}.
              </span>
            </label>
          </div>

          {/* OTP Input */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1" htmlFor="input-trip-otp">
                Ask Customer for 4-Digit Trip Start OTP
              </label>
              <p className="text-[11px] text-blue-700 mb-2">
                Customer's OTP is: <strong className="font-mono text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-blue-200">{currentRequest.otp}</strong>
              </p>
              <input
                id="input-trip-otp"
                type="text"
                placeholder={currentRequest.otp}
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-48 bg-white border border-blue-300 rounded-xl px-4 py-2 text-base font-mono tracking-widest text-center text-slate-900 focus:outline-none focus:border-blue-600 font-bold"
              />
              {otpError && (
                <p className="text-xs text-red-600 font-semibold mt-1">{otpError}</p>
              )}
            </div>
          </div>

          <button
            id="btn-start-trip"
            onClick={handleStartTripWithOtp}
            className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Car className="h-4 w-4" />
            <span>Start Driving Customer's Car</span>
          </button>
        </div>
      )}

      {/* State 4: Trip in Progress */}
      {activeTripStatus === 'trip_in_progress' && currentRequest && (
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-lg space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold animate-pulse">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Phase 3 of 3</span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Driving Customer's Car to Destination
                </h3>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              TRIP IN PROGRESS
            </span>
          </div>

          {/* Active Car & Passenger Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Customer Car Being Driven:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {currentRequest.customerCar.make} {currentRequest.customerCar.model}
              </div>
              <span className="text-blue-700 font-semibold font-mono text-[11px]">
                {currentRequest.customerCar.plateNumber} &bull; {currentRequest.customerCar.transmission}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Destination:</span>
              <div className="font-extrabold text-slate-900 text-sm">
                {currentRequest.dropLocation}
              </div>
              <span className="text-slate-500 text-[11px]">
                Estimated distance: {currentRequest.distanceKm} km
              </span>
            </div>
          </div>

          <button
            id="btn-complete-trip"
            onClick={handleCompleteTrip}
            className="w-full py-4 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>Reached Destination &bull; Return Keys &amp; Complete Drive (₹{currentRequest.fareAmount})</span>
          </button>
        </div>
      )}

      {/* State 5: Trip Completed Celebration */}
      {activeTripStatus === 'trip_completed' && (
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-7 shadow-lg text-center space-y-3 animate-in zoom-in-95">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Trip Completed &amp; Keys Returned!</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            You safely operated the customer's vehicle. Payout has been credited to your daily wallet.
          </p>
          <div className="inline-block px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm">
            + ₹{currentRequest?.fareAmount || 550} Added to Earnings
          </div>
        </div>
      )}

      {/* Idle State: Waiting for rides */}
      {activeTripStatus === 'idle' && isOnline && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Radio className="h-7 w-7 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Searching for Nearby Customer Car Bookings...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our dispatch engine is matching you with customer vehicle requests in <strong className="text-slate-700">{profile.city}</strong> for categories you are authorized to drive.
          </p>
        </div>
      )}

      {/* Idle State: Offline */}
      {activeTripStatus === 'idle' && !isOnline && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Car className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You Are Currently Offline</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Toggle your duty switch above to start receiving customer car chauffeur requests and earning fares.
          </p>
          <button
            onClick={onToggleOnline}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <Radio className="h-4 w-4" />
            <span>Go Online Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
