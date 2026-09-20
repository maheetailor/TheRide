import React, { useState } from 'react';
import { Shield, KeyRound, Gauge, Fuel, CheckSquare, AlertTriangle, X } from 'lucide-react';
import { Booking } from '../types';

interface VehicleInspectionModalProps {
  booking: Booking;
  onConfirmHandover: (odometer: string, fuel: string) => void;
  onClose: () => void;
}

export const VehicleInspectionModal: React.FC<VehicleInspectionModalProps> = ({
  booking,
  onConfirmHandover,
  onClose,
}) => {
  const [odometer, setOdometer] = useState('38,420');
  const [fuelLevel, setFuelLevel] = useState('Half (50%)');
  const [rcChecked, setRcChecked] = useState(true);
  const [scratchesChecked, setScratchesChecked] = useState(true);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmHandover(odometer, fuelLevel);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Key Handover & Vehicle Inspection
            </h3>
            <p className="text-xs text-slate-500">
              Record car baseline metrics before driver starts your vehicle
            </p>
          </div>
        </div>

        {/* Security OTP Display */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Trip Start OTP
            </span>
            <p className="text-xs text-emerald-700">
              Share only after verifying driver badge
            </p>
          </div>
          <div className="text-2xl font-mono font-bold tracking-widest text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-300">
            {booking.otp}
          </div>
        </div>

        <form onSubmit={handleComplete} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              Starting Odometer (Km)
            </label>
            <input
              type="text"
              required
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1 flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              Current Fuel / Battery Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Quarter (25%)', 'Half (50%)', 'Three-Quarters (75%)', 'Full (100%)'].map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setFuelLevel(level)}
                  className={`py-1.5 text-center text-xs rounded-lg border transition-all ${
                    fuelLevel === level
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {level.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={scratchesChecked}
                onChange={(e) => setScratchesChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600"
              />
              <span>I have walked around the car with the driver and confirmed pre-existing body conditions.</span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rcChecked}
                onChange={(e) => setRcChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600"
              />
              <span>Vehicle Registration (RC) and valid insurance copy are present in the glove compartment.</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!scratchesChecked || !rcChecked}
              className="flex-1 py-2.5 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs"
            >
              Authorize & Start Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
