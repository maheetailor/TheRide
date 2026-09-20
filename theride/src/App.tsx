import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  HelpCircle, 
  History, 
  Compass, 
  Sparkles, 
  PhoneCall, 
  UserCheck, 
  CheckCircle2, 
  CalendarCheck, 
  User, 
  MapPin, 
  Users, 
  Headphones, 
  LogIn, 
  LogOut,
  Download 
} from 'lucide-react';
import { Booking, RideStatus, DriverProfile, UserProfile, BookingRecipient } from './types';
import { MOCK_DRIVERS } from './data/mockData';
import { BookingForm } from './components/BookingForm';
import { LiveTrackingView } from './components/LiveTrackingView';
import { VehicleInspectionModal } from './components/VehicleInspectionModal';
import { HackathonGuideModal } from './components/HackathonGuideModal';
import { BookingsList } from './components/BookingsList';
import { AuthModal } from './components/AuthModal';
import { CompanyContactModal } from './components/CompanyContactModal';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  // Navigation Flow State: Step 1: Splash -> Step 2: Auth -> Step 3: Dashboard
  const [appFlow, setAppFlow] = useState<'splash' | 'auth' | 'dashboard'>('splash');
  const [activeTab, setActiveTab] = useState<'book' | 'live' | 'history'>('book');
  
  // User Profile & Recipient State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recipient, setRecipient] = useState<BookingRecipient | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalStage, setAuthModalStage] = useState<'auth' | 'address'>('auth');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Modals
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactReason, setContactReason] = useState<'general' | 'cancel'>('general');

  // Initial mock history so user can inspect completed state
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK-89421',
      tripType: 'hourly',
      vehicle: {
        category: 'sedan',
        transmission: 'manual',
        makeModel: 'Honda City',
        plateNumber: 'DL 03 CA 5541'
      },
      pickupAddress: 'Sector 29, Leisure Valley, Gurugram',
      pickupTime: 'Yesterday, 8:30 PM',
      package: {
        id: 'pkg-4h',
        title: 'City Express',
        hours: 4,
        includedKm: 45,
        basePrice: 599,
        extraHourRate: 120,
        extraKmRate: 12,
        recommendedFor: 'Party night safe return'
      },
      estimatedPrice: 599,
      driver: MOCK_DRIVERS[1],
      otp: '7194',
      status: 'completed',
      createdAt: '2026-09-16T20:30:00Z',
      inspectionDone: true,
      recipient: {
        type: 'myself'
      },
      notes: 'Late night return from dinner'
    }
  ]);

  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // When user completes login / address setup
  const handleAuthSuccess = (savedUser: UserProfile, savedRecipient: BookingRecipient) => {
    setUser(savedUser);
    setRecipient(savedRecipient);
    setShowAuthModal(false);
    setAppFlow('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAppFlow('auth');
  };

  // Handler for starting a booking (Step 3: Direct confirmation without triggering auth modal)
  const handleStartBooking = (bookingData: Omit<Booking, 'id' | 'otp' | 'status' | 'createdAt' | 'inspectionDone'>) => {
    const newId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const pendingBooking: Booking = {
      ...bookingData,
      id: newId,
      otp: randomOtp,
      status: 'searching',
      createdAt: new Date().toISOString(),
      inspectionDone: false,
      recipient: recipient || { type: 'myself' },
      liveLocationShared: false,
    };

    setCurrentBooking(pendingBooking);
    setActiveTab('live');

    // Simulate real-world matching dispatch in 2.2 seconds
    setTimeout(() => {
      const assignedDriver = MOCK_DRIVERS[0];
      setCurrentBooking(prev => {
        if (!prev || prev.status === 'cancelled') return prev;
        const updated = {
          ...prev,
          status: 'driver_assigned' as RideStatus,
          driver: assignedDriver,
        };
        // Also save to all bookings
        setBookings(all => [updated, ...all.filter(b => b.id !== updated.id)]);
        return updated;
      });
    }, 2200);
  };

  const handleUpdateStatus = (newStatus: RideStatus) => {
    if (!currentBooking) return;
    const updated = { ...currentBooking, status: newStatus };
    setCurrentBooking(updated);
    setBookings(all => [updated, ...all.filter(b => b.id !== updated.id)]);
  };

  const handleConfirmHandover = (odometer: string, fuel: string) => {
    if (!currentBooking) return;
    const updated: Booking = {
      ...currentBooking,
      status: 'in_progress',
      inspectionDone: true,
      notes: `${currentBooking.notes ? currentBooking.notes + ' • ' : ''}Start Odo: ${odometer} km, Fuel: ${fuel}`,
    };
    setCurrentBooking(updated);
    setBookings(all => [updated, ...all.filter(b => b.id !== updated.id)]);
    setShowInspectionModal(false);
  };

  const handleOpenContact = (reason: 'general' | 'cancel') => {
    setContactReason(reason);
    setShowContactModal(true);
  };

  const handleCompleteCycle = () => {
    setCurrentBooking(null);
    setActiveTab('book');
  };

  // STEP 1: Fullscreen Splash Screen (2 to 3 seconds with smooth fade-out)
  if (appFlow === 'splash') {
    return (
      <SplashScreen
        durationMs={2500}
        onComplete={() => setAppFlow(user ? 'dashboard' : 'auth')}
      />
    );
  }

  // STEP 2: Dedicated Full-Screen Authentication (Login / Create Account)
  if (appFlow === 'auth') {
    return (
      <>
        <AuthScreen
          onSuccess={handleAuthSuccess}
          onOpenGuide={() => setShowGuideModal(true)}
          onOpenContact={() => handleOpenContact('general')}
        />
        {showGuideModal && (
          <HackathonGuideModal onClose={() => setShowGuideModal(false)} />
        )}
        {showContactModal && (
          <CompanyContactModal
            reason={contactReason}
            bookingId={currentBooking?.id}
            onClose={() => setShowContactModal(false)}
          />
        )}
      </>
    );
  }

  // STEP 3: Booking Form Dashboard (Rendered only after authentication)
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 min-h-16 py-2.5 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3">
          
          {/* Logo / App Name */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  TheRide
                </h1>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 hidden sm:inline-block">
                  Personal Vehicle Drivers
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                On-demand verified chauffeurs to ride your own vehicle
              </p>
            </div>
          </div>

          {/* Top Actions: Contact Company, AWS Guide, Auth Status */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            <button
              type="button"
              onClick={() => handleOpenContact('general')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all min-h-[36px]"
            >
              <Headphones className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact Company</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold shadow-2xs transition-all min-h-[36px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">AWS Hackathon Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {/* View Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('book')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition-all min-h-[32px] ${
                  activeTab === 'book'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Book
              </button>
              
              {currentBooking && (
                <button
                  type="button"
                  onClick={() => setActiveTab('live')}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all min-h-[32px] ${
                    activeTab === 'live'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition-all min-h-[32px] ${
                  activeTab === 'history'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="hidden sm:inline">History ({bookings.length})</span>
                <span className="sm:hidden">History</span>
              </button>
            </div>

            {/* Authenticated User Avatar, Address Settings & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  setAuthModalStage('address');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 sm:pr-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 min-h-[36px]"
                title="Manage address & profile"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-semibold">{user?.username || 'User'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-semibold transition-all min-h-[36px]"
                title="Log out and return to Authentication Screen"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        
        {/* WELCOME / GREETING HERO SECTION */}
        <div className="mb-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Hey, {user?.username || 'Mahee'}.
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Ready to book a verified chauffeur for your vehicle.
                {user?.homeAddress && (
                  <span className="text-slate-500 block sm:inline sm:ml-2">
                    • Home: {user.homeAddress}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthModalStage('address');
                  setShowAuthModal(true);
                }}
                className="w-full sm:w-auto px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all min-h-[40px]"
              >
                {recipient?.type === 'someone_else' ? 'Booking For Someone Else' : 'Change Home Address'}
              </button>
            </div>
          </div>
        </div>

        {/* Safety & Value Props Strip */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Personal Car Protection: </span>
              <span className="text-slate-600">Manual & Auto specialists • Digital key handover OTP • Regular notifications active</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500 shrink-0">
            <button
              onClick={() => handleOpenContact('general')}
              className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
            >
              <Headphones className="w-3.5 h-3.5" /> Company 24x7 Help Desk
            </button>
          </div>
        </div>

        {/* View Switch */}
        {activeTab === 'book' && (
          <BookingForm 
            user={user}
            recipient={recipient}
            onChangeRecipient={() => {
              setAuthModalStage('address');
              setShowAuthModal(true);
            }}
            onStartBooking={handleStartBooking} 
          />
        )}

        {activeTab === 'live' && currentBooking && (
          <LiveTrackingView
            booking={currentBooking}
            onUpdateStatus={handleUpdateStatus}
            onOpenInspection={() => setShowInspectionModal(true)}
            onContactCompany={handleOpenContact}
            onCompleteCycle={handleCompleteCycle}
          />
        )}

        {activeTab === 'history' && (
          <BookingsList
            bookings={bookings}
            onSelectBooking={(b) => {
              setCurrentBooking(b);
              setActiveTab('live');
            }}
            onNewBookingClick={() => setActiveTab('book')}
          />
        )}

      </main>

      {/* Footer with exact required bottom-left text */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-600 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* EXACT REQUIRED TEXT IN BOTTOM LEFT CORNER */}
          <div className="text-left font-medium text-slate-800">
            Built for AWS x WeMakeDevs "First Commit | Bharat Builds" Hackathon by Mahee Tailor
          </div>

          {/* Right side helper links */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-500">
            <a 
              href="/theride-source-code.zip" 
              download="theride-source-code.zip"
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
              title="Download clean project source code as ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
            <span>•</span>
            <button 
              onClick={() => handleOpenContact('general')}
              className="hover:text-blue-600 transition-colors"
            >
              Contact Company
            </button>
            <span>•</span>
            <button 
              onClick={() => setShowGuideModal(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              AWS Tech Stack Guide
            </button>
          </div>

        </div>
      </footer>

      {/* Authentication & Address Setup Modal */}
      {showAuthModal && (
        <AuthModal
          initialStage={authModalStage}
          initialMode={authModalMode}
          currentUser={user}
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Vehicle Key Handover & Inspection Modal */}
      {showInspectionModal && currentBooking && (
        <VehicleInspectionModal
          booking={currentBooking}
          onConfirmHandover={handleConfirmHandover}
          onClose={() => setShowInspectionModal(false)}
        />
      )}

      {/* AWS & Hackathon Guide Modal */}
      {showGuideModal && (
        <HackathonGuideModal onClose={() => setShowGuideModal(false)} />
      )}

      {/* Company Contact & Cancellation Modal */}
      {showContactModal && (
        <CompanyContactModal
          reason={contactReason}
          bookingId={currentBooking?.id}
          onClose={() => setShowContactModal(false)}
        />
      )}

    </div>
  );
}
