import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Phone, 
  Share2, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Car, 
  Award,
  Navigation,
  KeyRound,
  RotateCcw,
  Sparkles,
  Star,
  Bell,
  BellRing,
  Lock,
  Radio,
  Headphones,
  AlertTriangle
} from 'lucide-react';
import { Booking, RideStatus, RideNotification } from '../types';

interface LiveTrackingViewProps {
  booking: Booking;
  onUpdateStatus: (newStatus: RideStatus) => void;
  onOpenInspection: () => void;
  onContactCompany: (reason: 'general' | 'cancel') => void;
  onCompleteCycle: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  booking,
  onUpdateStatus,
  onOpenInspection,
  onContactCompany,
  onCompleteCycle,
}) => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [tripElapsedMins, setTripElapsedMins] = useState(6);
  const [simulatedKmDriven, setSimulatedKmDriven] = useState(3.4);

  // Live Location Sharing State
  const [isSharingLocation, setIsSharingLocation] = useState(booking.liveLocationShared ?? false);
  const [locationTimestamp, setLocationTimestamp] = useState('Just now');

  // Notifications state (regular updates)
  const [notifications, setNotifications] = useState<RideNotification[]>([
    {
      id: 'notif-1',
      title: 'Ride Confirmed & Chauffeur Dispatched',
      message: 'Verified driver Rajesh Kumar assigned to your personal vehicle.',
      time: '2 mins ago',
      type: 'success'
    },
    {
      id: 'notif-2',
      title: 'Mandatory Safety Alerts Active',
      message: 'App notifications are locked ON for passenger & vehicle safety.',
      time: '1 min ago',
      type: 'info'
    }
  ]);
  const [latestToast, setLatestToast] = useState<string | null>(null);

  // Periodically push simulated live updates
  useEffect(() => {
    const timer1 = setTimeout(() => {
      const newNotif: RideNotification = {
        id: `notif-${Date.now()}`,
        title: 'Chauffeur On The Way',
        message: 'Rajesh is 1.2 km away. Please prepare your car keys and parking gate access.',
        time: 'Just now',
        type: 'info'
      };
      setNotifications(prev => [newNotif, ...prev]);
      setLatestToast(newNotif.title + ': ' + newNotif.message);
    }, 8000);

    const timer2 = setTimeout(() => {
      const newNotif: RideNotification = {
        id: `notif-${Date.now() + 1}`,
        title: 'Chauffeur Approaching',
        message: 'Driver has entered your locality. Look out for chauffeur in TheRide uniform.',
        time: 'Just now',
        type: 'alert'
      };
      setNotifications(prev => [newNotif, ...prev]);
      setLatestToast(newNotif.title + ': ' + newNotif.message);
    }, 18000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Dismiss toast after 5s
  useEffect(() => {
    if (latestToast) {
      const t = setTimeout(() => setLatestToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [latestToast]);

  // Simulate small trip distance and elapsed time updates during active ride
  useEffect(() => {
    if (booking.status === 'in_progress') {
      const interval = setInterval(() => {
        setTripElapsedMins(prev => prev + 1);
        setSimulatedKmDriven(prev => +(prev + 0.4).toFixed(1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [booking.status]);

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSOS = () => {
    setSosTriggered(true);
  };

  const handleToggleLocationSharing = () => {
    setIsSharingLocation(true);
    setLocationTimestamp('Just now (Precision ±3m)');
    const notif: RideNotification = {
      id: `notif-loc-${Date.now()}`,
      title: 'Live Location Shared with Chauffeur',
      message: 'Real-time GPS stream active. Driver can now navigate straight to your car.',
      time: 'Just now',
      type: 'success'
    };
    setNotifications(prev => [notif, ...prev]);
    setLatestToast('Live location shared with driver Rajesh!');
  };

  const driver = booking.driver;

  if (booking.status === 'searching') {
    return (
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-60"></div>
          <div className="absolute inset-2 rounded-full bg-blue-200/70 animate-pulse"></div>
          <div className="relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
            <Car className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">Matching a Verified Chauffeur...</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Checking verified drivers qualified for your {booking.vehicle.makeModel} ({booking.vehicle.transmission} transmission) within 3 km.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Pickup Location:</span>
            <span className="font-medium text-slate-800 truncate max-w-[240px]">{booking.pickupAddress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Vehicle:</span>
            <span className="font-medium text-slate-800">{booking.vehicle.makeModel} ({booking.vehicle.transmission})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipient:</span>
            <span className="font-medium text-slate-800">
              {booking.recipient?.type === 'someone_else' 
                ? `For: ${booking.recipient.passengerName}` 
                : 'Booking for Myself'}
            </span>
          </div>
        </div>

        {/* Cancellation Notice for Searching Stage */}
        <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-1.5">
          <div className="text-[11px] text-slate-500">
            Need to cancel or change dispatch?
          </div>
          <button
            type="button"
            onClick={() => onContactCompany('cancel')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Contact Company to Cancel</span>
          </button>
          <span className="text-[10px] text-slate-400">
            * Direct in-app cancellation is disabled. Please contact company support.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      
      {/* Real-time Notification Pop-up Toast */}
      {latestToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
          <BellRing className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Live Ride Update
            </div>
            <div className="text-xs font-medium text-slate-200 mt-0.5">
              {latestToast}
            </div>
          </div>
        </div>
      )}

      {/* SOS Alert Banner if activated */}
      {sosTriggered && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-rose-900">Emergency Protocol Initiated</div>
              <div className="text-xs text-rose-700">
                Live GPS telemetry transmitted to 24x7 safety response team & emergency contacts.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSosTriggered(false)}
            className="text-xs px-3 py-1 bg-white border border-rose-300 text-rose-800 rounded-lg hover:bg-rose-50"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Status & Map Visualizer Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Interactive Simulated Map Stage */}
        <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden flex flex-col justify-between p-4">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#64748b 1px, #0f172a 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          />

          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <path
              d="M -20 180 Q 200 40 450 140 T 900 80"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-[dash_20s_linear_infinite]"
            />
            <path
              d="M 50 250 C 250 200 400 300 700 120"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            />
          </svg>

          {/* Top Bar on Map */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono text-emerald-400 font-semibold">
                {booking.status === 'driver_assigned' && 'CHAUFFEUR ON THE WAY TO YOUR VEHICLE'}
                {booking.status === 'driver_arrived' && 'CHAUFFEUR ARRIVED AT VEHICLE LOCATION'}
                {booking.status === 'in_progress' && 'RIDE IN PROGRESS • PERSONAL VEHICLE'}
                {booking.status === 'completed' && 'TRIP COMPLETED'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Trip'}</span>
              </button>
              
              <button
                onClick={handleSOS}
                className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 shadow-md transition-all"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>
            </div>
          </div>

          {/* Animated Car & Driver Node in Map Center */}
          <div className="relative z-10 my-auto flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold">
                <Car className="w-4 h-4" />
                <span>{booking.vehicle.makeModel}</span>
                <span className="text-blue-200">• {booking.vehicle.transmission}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-300 font-mono bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-xs">
                {booking.status === 'in_progress' 
                  ? `${simulatedKmDriven} km driven • ${tripElapsedMins} mins elapsed` 
                  : `Driver ETA: ~${driver?.etaMinutes || 8} mins`}
              </div>
            </div>
          </div>

          {/* Bottom Route Summary on Map */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 truncate max-w-lg">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate text-white font-medium">{booking.pickupAddress}</span>
              </div>
              {booking.dropAddress && (
                <div className="flex items-center gap-1.5 truncate text-slate-300">
                  <span className="text-slate-500">→</span>
                  <Navigation className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate text-slate-200">{booking.dropAddress}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0">
              {booking.recipient?.type === 'someone_else' && (
                <div className="text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Passenger: {booking.recipient.passengerName}
                </div>
              )}
              <div className="font-mono text-emerald-400 font-bold ml-2">
                OTP: {booking.otp}
              </div>
            </div>
          </div>

        </div>

        {/* Live Location Sharing Section (Required by User) */}
        <div className="p-4 bg-blue-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Share Live Location with Chauffeur</span>
                {isSharingLocation && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active (±3m)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {isSharingLocation 
                  ? `Transmitting high-precision GPS coordinates to driver ${driver?.name || 'Rajesh'} so they walk directly to your car.`
                  : `Help driver ${driver?.name || 'Rajesh'} pinpoint your exact car parking spot without phone calls.`}
              </p>
            </div>
          </div>

          <div>
            {!isSharingLocation ? (
              <button
                onClick={handleToggleLocationSharing}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Share Live Location</span>
              </button>
            ) : (
              <div className="text-right text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Shared: {locationTimestamp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Driver Profile & Controls */}
        {driver && (
          <div className="p-5 md:p-6 border-b border-slate-200 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <img
                  src={driver.avatarUrl}
                  alt={driver.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{driver.name}</h4>
                    {driver.verifiedBadge && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Police Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {driver.rating}
                    </span>
                    <span>•</span>
                    <span>{driver.totalTrips}+ trips</span>
                    <span>•</span>
                    <span>{driver.experienceYears} yrs experience</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                      Specialist: Manual & Auto
                    </span>
                    <span>Speaks: {driver.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`tel:${driver.phone}`}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Call Driver</span>
                </a>

                <button
                  type="button"
                  onClick={() => onContactCompany('general')}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Headphones className="w-4 h-4 text-blue-600" />
                  <span>Contact Company</span>
                </button>

                {/* Status Transitions */}
                {booking.status === 'driver_assigned' && (
                  <button
                    onClick={() => onUpdateStatus('driver_arrived')}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                  >
                    Simulate Driver Arrival
                  </button>
                )}

                {booking.status === 'driver_arrived' && (
                  <button
                    onClick={onOpenInspection}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Inspect & Hand Over Keys</span>
                  </button>
                )}

                {booking.status === 'in_progress' && (
                  <button
                    onClick={() => onUpdateStatus('completed')}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                  >
                    End Ride & Settle Fare
                  </button>
                )}

                {booking.status === 'completed' && (
                  <button
                    onClick={onCompleteCycle}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Book Another Ride</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Regular Notification Updates Feed (User Cannot Turn Off) */}
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h5 className="text-xs font-bold text-slate-900">Regular Trip Notifications</h5>
            </div>
            {/* Notification restriction notice: not allowed to turn off */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/80 text-[10px] font-semibold text-slate-700">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Notifications: Mandatory (Cannot be disabled)</span>
            </div>
          </div>

          <div className="space-y-2">
            {notifications.slice(0, 3).map((notif) => (
              <div 
                key={notif.id}
                className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3 shadow-2xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">{notif.title}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{notif.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellation Notice Bar (No direct cancel button - must contact company) */}
        <div className="p-4 bg-amber-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Cancellation Policy:</strong> In-app cancellation is disabled. To cancel this ride, you must contact company dispatch directly.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onContactCompany('cancel')}
            className="text-rose-700 hover:text-rose-800 font-semibold underline text-xs shrink-0 text-left"
          >
            Contact Company to Request Cancellation →
          </button>
        </div>

        {/* Fare & Protection Details */}
        <div className="bg-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {booking.tripType === 'multiday' 
                ? `Multi-Day Booking: ${booking.days || 1} Days chauffeur assigned. Comprehensive vehicle protection active.`
                : 'Vehicle Protection: Comprehensive damage cover active during chauffeur custody.'}
            </span>
          </div>
          <div className="font-medium text-slate-800">
            Total Fare: <span className="font-bold text-slate-900">₹{booking.estimatedPrice}</span> (Cash or UPI on completion)
          </div>
        </div>

        {/* Applied Trip Preferences Ribbon */}
        {booking.preferences && (
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-700">Applied Preferences:</span>
            {booking.preferences.policeVerifiedOnly && (
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-emerald-700">
                ✓ Police Verified
              </span>
            )}
            {booking.preferences.nonSmokerDriver && (
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700">
                ✓ Non-Smoker
              </span>
            )}
            {booking.preferences.manualAndAutoCertified && (
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700">
                ✓ Gearbox Specialist
              </span>
            )}
            {booking.preferences.nightAndHighwaySpecialist && (
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-blue-700">
                ✓ Night & Highway Certified
              </span>
            )}
            {booking.preferences.smoothDrivingStyle && (
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700">
                ✓ Gentle Driving
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
