import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number; // total duration before complete, default 2500ms
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  durationMs = 2500 
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade-out 600ms before total duration
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, Math.max(1000, durationMs - 600));

    // Complete transition
    const completeTimer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [durationMs, onComplete]);

  return (
    <div
      id="the-ride-splash-screen"
      role="banner"
      aria-label="TheRide loading splash screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-600 transition-opacity duration-700 ease-in-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Centered Clean Car Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center mb-5 shadow-lg">
          <Car className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
        </div>

        {/* Center App Title in Clean, Bold White Typography */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-xs">
          TheRide
        </h1>

        {/* Minimalist Subtitle */}
        <p className="text-sm sm:text-base font-medium text-blue-100 mt-2.5 tracking-wide">
          Your Vehicle • Verified Chauffeurs
        </p>

        {/* Loading Pulsing Dot */}
        <div className="flex items-center gap-1.5 mt-8">
          <span className="w-2 h-2 rounded-full bg-white/60 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span className="w-2 h-2 rounded-full bg-white/60"></span>
        </div>

      </div>

      {/* Subtle Skip button in bottom corner in case users/judges want immediate access */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute bottom-6 right-6 text-xs text-blue-200 hover:text-white bg-blue-700/50 hover:bg-blue-700/80 px-3 py-1.5 rounded-lg border border-blue-400/30 transition-colors"
      >
        Skip →
      </button>
    </div>
  );
};
