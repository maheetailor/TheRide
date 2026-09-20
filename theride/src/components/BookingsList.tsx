import React from 'react';
import { Clock, MapPin, CheckCircle, Car, Shield, ChevronRight, Navigation } from 'lucide-react';
import { Booking } from '../types';

interface BookingsListProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onNewBookingClick: () => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  onSelectBooking,
  onNewBookingClick,
}) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Car className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">No Chauffeur Bookings Yet</h4>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Book a verified driver to drive your personal car for errands, parties, or outstation.
        </p>
        <button
          onClick={onNewBookingClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          Book Your First Driver
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Your Vehicle Driver Bookings</h3>
        <button
          onClick={onNewBookingClick}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          + Book Another Driver
        </button>
      </div>

      <div className="space-y-3">
        {bookings.map(b => (
          <div
            key={b.id}
            onClick={() => onSelectBooking(b)}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                  b.status === 'in_progress' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                  b.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {b.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">#{b.id.slice(-6)}</span>
                <span className="text-xs font-medium text-slate-700">
                  {b.vehicle.makeModel} ({b.vehicle.transmission})
                </span>
              </div>

              <div className="text-xs font-medium text-slate-800 flex flex-wrap items-center gap-1.5 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-xs">{b.pickupAddress}</span>
                </div>
                {b.dropAddress && (
                  <div className="flex items-center gap-1 text-slate-600">
                    <span className="text-slate-400">→</span>
                    <Navigation className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate max-w-xs">{b.dropAddress}</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {b.pickupTime}
                </span>
                <span>•</span>
                <span>
                  {b.tripType === 'multiday'
                    ? `${b.days || 1} Days Dedicated Chauffeur`
                    : b.package
                    ? `${b.package.hours} Hrs Package`
                    : b.tripType === 'outstation'
                    ? 'Outstation Highway'
                    : 'One-Way Drop'}
                </span>
                {b.driver && (
                  <>
                    <span>•</span>
                    <span className="text-slate-700 font-medium">Chauffeur: {b.driver.name}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-right">
                <div className="text-xs text-slate-400">Total</div>
                <div className="text-sm font-bold text-slate-900">₹{b.estimatedPrice}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
