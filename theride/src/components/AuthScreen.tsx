import React, { useState } from 'react';
import { 
  Car, 
  User, 
  KeyRound, 
  Sparkles, 
  Phone, 
  Lock, 
  ArrowRight, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Download,
  Headphones
} from 'lucide-react';
import { UserProfile, BookingRecipient } from '../types';

interface AuthScreenProps {
  onSuccess: (user: UserProfile, recipient: BookingRecipient) => void;
  onOpenGuide: () => void;
  onOpenContact: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onOpenGuide,
  onOpenContact,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Login credentials: username and OTP
  const [username, setUsername] = useState('Mahee Tailor');
  const [otp, setOtp] = useState('');
  const [demoOtpSent, setDemoOtpSent] = useState(false);

  // Signup credentials
  const [emailOrPhone, setEmailOrPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('');

  // Optional Home Address / Recipient details
  const [showAddressSettings, setShowAddressSettings] = useState(false);
  const [recipientType, setRecipientType] = useState<'myself' | 'someone_else'>('myself');
  const [homeAddress, setHomeAddress] = useState('Flat 402, Green Glen Heights, Bellandur, Bengaluru');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = () => {
    setOtp('8492');
    setDemoOtpSent(true);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      if (!username.trim()) {
        setErrorMessage('Please enter your username');
        return;
      }
      if (!otp.trim()) {
        setErrorMessage('Please enter the OTP (or tap Auto-fill 8492)');
        return;
      }
    } else {
      if (!username.trim()) {
        setErrorMessage('Please enter your name');
        return;
      }
      if (!emailOrPhone.trim()) {
        setErrorMessage('Please enter your mobile or email');
        return;
      }
      if (!password.trim()) {
        setErrorMessage('Please choose a password');
        return;
      }
    }

    const savedUser: UserProfile = {
      username: username.trim(),
      emailOrPhone: emailOrPhone.trim() || undefined,
      homeAddress: recipientType === 'myself' && homeAddress.trim() ? homeAddress.trim() : undefined,
    };

    const savedRecipient: BookingRecipient = {
      type: recipientType,
      passengerName: recipientType === 'someone_else' && passengerName.trim() ? passengerName.trim() : undefined,
      passengerPhone: recipientType === 'someone_else' && passengerPhone.trim() ? passengerPhone.trim() : undefined,
    };

    onSuccess(savedUser, savedRecipient);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900 animate-in fade-in duration-300">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">TheRide</span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  Step 2: Authentication
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                On-demand verified chauffeurs to drive your personal vehicle
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenContact}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all min-h-[36px]"
            >
              <Headphones className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact</span>
            </button>
            <button
              type="button"
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold shadow-2xs transition-all min-h-[36px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>AWS Hackathon Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          
          {/* Header & Subtitle */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-3 shadow-2xs">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {mode === 'login' ? 'Login to TheRide' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {mode === 'login'
                ? 'Sign in with your username and OTP to access chauffeur booking'
                : 'Register your details to book verified personal vehicle drivers'}
            </p>
          </div>

          {/* Toggle Buttons: Login vs Create Account */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* LOGIN MODE: USERNAME & OTP */}
            {mode === 'login' ? (
              <>
                {/* Username Input */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Mahee Tailor"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden min-h-[44px]"
                    />
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Enter OTP
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{demoOtpSent ? 'Resend OTP' : 'Get / Fill OTP (8492)'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      maxLength={6}
                      className="w-full pl-10 pr-3 py-2.5 text-sm font-mono tracking-wider border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden min-h-[44px]"
                    />
                  </div>

                  {/* Fast One-Click Demo OTP helper */}
                  <div className="mt-2 p-2 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-slate-700">
                    <span className="text-[11px]">
                      Test OTP Code: <strong className="font-mono text-blue-700">8492</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp('8492')}
                      className="text-xs font-bold text-blue-700 hover:underline px-2 py-0.5 rounded bg-white shadow-2xs border border-blue-200"
                    >
                      Auto-fill
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* CREATE ACCOUNT MODE */
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Name / Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Mahee Tailor"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden min-h-[44px]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Optional Pickup & Passenger Preferences */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAddressSettings(!showAddressSettings)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 py-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {showAddressSettings ? 'Hide default address settings' : '+ Optional: Set Default Home Address'}
                </span>
              </button>

              {showAddressSettings && (
                <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in duration-150 text-xs">
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRecipientType('myself')}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        recipientType === 'myself'
                          ? 'border-blue-600 bg-white ring-1 ring-blue-600 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 mb-1 text-blue-600" />
                      <div className="font-bold">For Myself</div>
                      <div className="text-[10px] text-slate-500">Home address default</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipientType('someone_else')}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        recipientType === 'someone_else'
                          ? 'border-blue-600 bg-white ring-1 ring-blue-600 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 mb-1 text-purple-600" />
                      <div className="font-bold">Someone Else</div>
                      <div className="text-[10px] text-slate-500">Family or friend</div>
                    </button>
                  </div>

                  {recipientType === 'myself' ? (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Home Address
                      </label>
                      <textarea
                        rows={2}
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        placeholder="House/flat, building, locality, city"
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                          Passenger Name
                        </label>
                        <input
                          type="text"
                          value={passengerName}
                          onChange={(e) => setPassengerName(e.target.value)}
                          placeholder="e.g. Rajesh Tailor"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                          Passenger Phone
                        </label>
                        <input
                          type="text"
                          value={passengerPhone}
                          onChange={(e) => setPassengerPhone(e.target.value)}
                          placeholder="+91 98000 00000"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit / Verification Action */}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              <span>{mode === 'login' ? 'Login & Proceed to Booking' : 'Register & Proceed to Booking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Trust Badge */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Police Verified & Gearbox Specialist Chauffeurs</span>
          </div>

        </div>
      </main>

      {/* Persistent Hackathon Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left font-medium text-slate-800">
            Built for AWS x WeMakeDevs "First Commit | Bharat Builds" Hackathon by Mahee Tailor
          </div>

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
              onClick={onOpenContact}
              className="hover:text-blue-600 transition-colors"
            >
              Contact Company
            </button>
            <span>•</span>
            <button 
              onClick={onOpenGuide}
              className="text-blue-600 hover:underline font-medium"
            >
              AWS Tech Stack Guide
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
