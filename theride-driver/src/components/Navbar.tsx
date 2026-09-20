import React from 'react';
import { 
  Car, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  CheckCircle2,
  Radio,
  ExternalLink
} from 'lucide-react';
import { DriverProfile } from '../types/driver';

interface NavbarProps {
  profile: DriverProfile;
  activeTab: 'profile' | 'documents' | 'verification' | 'duty';
  onTabChange: (tab: 'profile' | 'documents' | 'verification' | 'duty') => void;
  onLoadSample: () => void;
  onReset: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  onTabChange,
  onLoadSample,
  onReset,
  isOnline,
  onToggleOnline,
}) => {
  const isApproved = profile.verificationStatus === 'approved';
  const isSubmitted = profile.verificationStatus === 'submitted' || profile.verificationStatus === 'under_audit';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar with Branding & Actions */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Hackathon Tag */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/25 flex-shrink-0">
              <Car className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
                  TheRide<span className="text-blue-600 font-bold">-Driver</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Partner Portal
                </span>
              </div>
              
              {/* Build by Mahee Tailor for Bharat Build Hackathon First Commit note */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-500 truncate">
                <span className="font-semibold text-slate-700 whitespace-nowrap">Mahee Tailor</span>
                <span className="hidden xs:inline">&bull;</span>
                <span className="text-blue-700 font-medium truncate">Bharat Build Hackathon first commit</span>
              </div>
            </div>
          </div>

          {/* Quick status & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              {isApproved ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-slate-600 font-medium">Partner ID:</span>
                  <span className="font-mono font-bold text-emerald-700">{profile.partnerId || 'TR-DRV-OK'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </>
              ) : isSubmitted ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                  <span className="text-blue-700 font-bold">Audit In Progress</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-slate-700 font-medium">KYC Verification Needed</span>
                </>
              )}
            </div>

            {/* Quick Demo Pre-fill Button */}
            <button
              id="btn-load-sample-driver"
              onClick={onLoadSample}
              title="Pre-fill with verified sample driver details & mock official documents"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">Load Sample Driver</span>
              <span className="sm:hidden">Sample</span>
            </button>

            {/* Reset */}
            <button
              id="btn-reset-driver"
              onClick={onReset}
              title="Clear all fields to test blank onboarding"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Quick Online Rider Toggle (Active duty) */}
            {isApproved && (
              <button
                id="btn-nav-duty-toggle"
                onClick={onToggleOnline}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isOnline 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <Radio className={`h-3.5 w-3.5 ${isOnline ? 'animate-pulse' : ''}`} />
                <span>{isOnline ? 'Online (On Duty)' : 'Go Online'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-100 text-xs sm:text-sm font-semibold scrollbar-none">
          <button
            id="tab-btn-profile"
            onClick={() => onTabChange('profile')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Car className="h-4 w-4" />
            <span>1. Profile &amp; Vehicle Skills</span>
            {profile.fullName && profile.phone && (profile.fourWheelerCapability?.canDriveTypes?.length || 0) > 0 && (
              <CheckCircle2 className={`h-3.5 w-3.5 ${activeTab === 'profile' ? 'text-white' : 'text-emerald-600'}`} />
            )}
          </button>

          <button
            id="tab-btn-documents"
            onClick={() => onTabChange('documents')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors relative cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>2. Step-by-Step KYC Documents</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              5 Steps
            </span>
          </button>

          <button
            id="tab-btn-verification"
            onClick={() => onTabChange('verification')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>3. Company Verification</span>
            {isApproved && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            id="tab-btn-duty"
            onClick={() => onTabChange('duty')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'duty'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="h-4 w-4 text-emerald-600" />
            <span className="font-bold">4. Chauffeur Duty &amp; Bookings</span>
            {isOnline && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                LIVE
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
