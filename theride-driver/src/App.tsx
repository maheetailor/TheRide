import React, { useState, useEffect } from 'react';
import { DriverProfile } from './types/driver';
import { sampleDriverProfile, emptyDriverProfile } from './utils/sampleData';
import { Navbar } from './components/Navbar';
import { ProfileVehicleStep } from './components/ProfileVehicleStep';
import { DocumentsStep } from './components/DocumentsStep';
import { VerificationAuditStep } from './components/VerificationAuditStep';
import { DriverDutyDashboard } from './components/DriverDutyDashboard';
import { ShieldCheck, Info, CheckCircle2, Car, Heart, Sparkles, Award, FileText, Radio } from 'lucide-react';

const STORAGE_KEY = 'theride_driver_profile_v1';
const ONLINE_KEY = 'theride_driver_online_v1';

export default function App() {
  const [profile, setProfile] = useState<DriverProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load profile from storage', e);
    }
    // Default to sample driver profile so user immediately gets a fully functional interactive experience
    return sampleDriverProfile;
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'verification' | 'duty'>('profile');
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONLINE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(ONLINE_KEY, isOnline ? 'true' : 'false');
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [isOnline]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoadSample = () => {
    setProfile(sampleDriverProfile);
    showToast('Loaded verified sample driver profile and documents!');
  };

  const handleReset = () => {
    setProfile(emptyDriverProfile);
    setIsOnline(false);
    setActiveTab('profile');
    showToast('Reset to blank onboarding form. Start from Step 1.');
  };

  const handleApproveVerification = () => {
    const updated = {
      ...profile,
      verificationStatus: 'approved' as const,
      partnerId: profile.partnerId || `TR-DRV-${Math.floor(1000 + Math.random() * 9000)}`,
      documents: {
        ...profile.documents,
        drivingLicense: { ...profile.documents.drivingLicense, status: 'verified' as const },
        aadhaarCard: { ...profile.documents.aadhaarCard, status: 'verified' as const },
        panCard: { ...profile.documents.panCard, status: 'verified' as const },
        driverPhoto: { ...profile.documents.driverPhoto, status: 'verified' as const },
      },
    };
    setProfile(updated);
    showToast('Official verification complete! Chauffeur badge activated.');
  };

  const handleToggleOnline = () => {
    if (profile.verificationStatus !== 'approved') {
      showToast('Please complete Company Verification before going on duty!');
      setActiveTab('verification');
      return;
    }
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      showToast('You are now ONLINE. Searching for nearby 4-wheeler passenger rides.');
      setActiveTab('duty');
    } else {
      showToast('You are now OFFLINE.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation in TheRide Blue and White */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
      />

      {/* Bharat Build Hackathon & Creator Banner */}
      <div className="bg-blue-600 text-white py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wide uppercase">
              Hackathon Project
            </span>
            <span className="font-bold text-xs sm:text-sm">
              Built by Mahee Tailor for Bharat Build Hackathon first commit
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-blue-100 justify-center flex-wrap">
            <span>Customer 4-Wheeler Chauffeurs</span>
            <span>&bull;</span>
            <span className="font-semibold text-white">MoRTH &amp; UIDAI Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Content Area with bottom padding for mobile bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 sm:pb-8">
        
        {activeTab === 'profile' && (
          <ProfileVehicleStep
            profile={profile}
            onChange={setProfile}
            onNext={() => setActiveTab('documents')}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsStep
            profile={profile}
            onChange={setProfile}
            onPrev={() => setActiveTab('profile')}
            onNext={() => setActiveTab('verification')}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationAuditStep
            profile={profile}
            onApprove={handleApproveVerification}
            onPrev={() => setActiveTab('documents')}
            onGoToDuty={() => {
              setIsOnline(true);
              setActiveTab('duty');
            }}
          />
        )}

        {activeTab === 'duty' && (
          <DriverDutyDashboard
            profile={profile}
            isOnline={isOnline}
            onToggleOnline={handleToggleOnline}
            onOpenDocuments={() => setActiveTab('documents')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-slate-500 text-xs mb-16 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                TR
              </div>
              <span className="font-bold text-slate-900">TheRide-Driver</span>
            </div>
            <span className="hidden sm:inline">&bull;</span>
            <span>
              Built by <strong className="text-slate-900">Mahee Tailor</strong> for <strong className="text-blue-600">Bharat Build Hackathon first commit</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              UIDAI &amp; MoRTH Compliance
            </span>
            <span>&bull;</span>
            <span>Commercial 4-Wheeler Passenger Safety</span>
            <span>&bull;</span>
            <span className="text-blue-700 font-mono font-bold">TheRide Edition</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Visible only on smartphones) */}
      <div 
        id="mobile-bottom-nav" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around sm:hidden shadow-lg safe-area-bottom"
      >
        <button
          type="button"
          id="mobile-nav-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-blue-600 font-bold bg-blue-50/70'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Car className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">1. Profile</span>
        </button>

        <button
          type="button"
          id="mobile-nav-documents"
          onClick={() => setActiveTab('documents')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'documents'
              ? 'text-blue-600 font-bold bg-blue-50/70'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <FileText className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">2. KYC Docs</span>
          <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-blue-600"></span>
        </button>

        <button
          type="button"
          id="mobile-nav-verification"
          onClick={() => setActiveTab('verification')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'verification'
              ? 'text-blue-600 font-bold bg-blue-50/70'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <ShieldCheck className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">3. Badge</span>
          {profile.verificationStatus === 'approved' && (
            <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          type="button"
          id="mobile-nav-duty"
          onClick={() => setActiveTab('duty')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'duty'
              ? 'text-emerald-600 font-bold bg-emerald-50/80'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Radio className={`h-5 w-5 mb-0.5 ${isOnline ? 'text-emerald-600 animate-pulse' : ''}`} />
          <span className="text-[10px] tracking-tight">4. Duty</span>
          {isOnline && (
            <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          )}
        </button>
      </div>

    </div>
  );
}
