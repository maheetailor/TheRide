import React, { useState } from 'react';
import { User, Lock, Phone, MapPin, Users, ArrowRight, CheckCircle2, X, KeyRound, Sparkles } from 'lucide-react';
import { UserProfile, BookingRecipient } from '../types';

interface AuthModalProps {
  onSuccess: (user: UserProfile, recipient: BookingRecipient) => void;
  onClose?: () => void;
  initialStage?: 'auth' | 'address';
  initialMode?: 'login' | 'signup';
  currentUser?: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onSuccess,
  onClose,
  initialStage = 'auth',
  initialMode = 'login',
  currentUser = null,
}) => {
  const [stage, setStage] = useState<'auth' | 'address'>(initialStage);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Login credentials: strictly username + otp
  const [username, setUsername] = useState(currentUser?.username || '');
  const [otp, setOtp] = useState('');
  const [demoOtpSent, setDemoOtpSent] = useState(false);

  // Signup extra credentials
  const [emailOrPhone, setEmailOrPhone] = useState(currentUser?.emailOrPhone || '');
  const [password, setPassword] = useState('');

  // Address & Recipient details
  const [recipientType, setRecipientType] = useState<'myself' | 'someone_else'>('myself');
  const [homeAddress, setHomeAddress] = useState(currentUser?.homeAddress || 'Flat 402, Green Glen Heights, Bellandur');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

  const handleSendOtp = () => {
    setOtp('8492');
    setDemoOtpSent(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!username.trim() || !otp.trim()) return;
      setStage('address');
    } else {
      if (!username.trim() || !emailOrPhone.trim() || !password.trim()) return;
      setStage('address');
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      username: username.trim(),
      emailOrPhone: emailOrPhone.trim() || undefined,
      homeAddress: recipientType === 'myself' ? homeAddress.trim() : undefined,
    };

    const recipient: BookingRecipient = {
      type: recipientType,
      passengerName: recipientType === 'someone_else' ? passengerName.trim() : undefined,
      passengerPhone: recipientType === 'someone_else' ? passengerPhone.trim() : undefined,
    };

    onSuccess(user, recipient);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STAGE 1: CREDENTIALS (LOGIN / CREATE ACCOUNT) */}
        {stage === 'auth' ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                TheRide Account
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {mode === 'login' ? 'Login with Username & OTP' : 'Create Your Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login' 
                  ? 'Enter your username and OTP to sign in' 
                  : 'Enter your credentials to book personal vehicle drivers'}
              </p>
            </div>

            {/* Toggle 2 Options: Login or Create Account */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* IF WANT TO LOGIN: ONLY ASK FOR USERNAME AND ENTER OTP */}
              {mode === 'login' ? (
                <>
                  {/* Field 1: Username */}
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username (e.g. Mahee Tailor)"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Field 2: Enter OTP */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-700">
                        Enter OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{demoOtpSent ? 'Resend OTP' : 'Get / Fill OTP (8492)'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        maxLength={6}
                        className="w-full pl-9 pr-3 py-2 text-sm font-mono tracking-wider border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    
                    {/* Quick Demo OTP Helper badge */}
                    <div className="mt-2 p-2 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-[11px] text-slate-600">
                      <span>Quick Test OTP: <strong className="font-mono text-slate-900">8492</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtp('8492')}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Auto-fill
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* CREATE ACCOUNT: Name, Email/Phone, Password */
                <>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Your Name / Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Mahee Tailor"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="e.g. +91 98765 00000"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Login with OTP' : 'Continue to Address Setup'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* STAGE 2: HOME ADDRESS OR BOOKING FOR SOMEONE ELSE */
          <div>
            <div className="text-center mb-5">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                Step 2 of 2
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Hey, {username}!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tell us about your ride address or if you are booking for someone else
              </p>
            </div>

            {/* Recipient Choice Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRecipientType('myself')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  recipientType === 'myself'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-xs font-bold text-slate-800">Booking for Myself</div>
                <div className="text-[10px] text-slate-500">Save your Home Address</div>
              </button>

              <button
                type="button"
                onClick={() => setRecipientType('someone_else')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  recipientType === 'someone_else'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-purple-600 mb-1" />
                <div className="text-xs font-bold text-slate-800">For Someone Else</div>
                <div className="text-[10px] text-slate-500">Family, friend, client</div>
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-3.5">
              {recipientType === 'myself' ? (
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Your Home Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <textarea
                      rows={3}
                      required
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      placeholder="Enter flat/house no., society name, landmark, city"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    This will be used as your quick pickup default for personal vehicle chauffeurs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Passenger's Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="e.g. Mr. Rajesh Tailor"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Passenger's Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+91 98000 12345"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Trip updates and driver OTP will be sent to this number.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStage('auth')}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Ready to Book</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
