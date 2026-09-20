import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, AlertTriangle, ShieldCheck, X, Clock, CheckCircle } from 'lucide-react';

interface CompanyContactModalProps {
  onClose: () => void;
  reason?: 'general' | 'cancel';
  bookingId?: string;
}

export const CompanyContactModal: React.FC<CompanyContactModalProps> = ({
  onClose,
  reason = 'general',
  bookingId,
}) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              TheRide Support & Dispatch Desk
            </h3>
            <p className="text-xs text-slate-500">24x7 Customer & Chauffeur Operations</p>
          </div>
        </div>

        {reason === 'cancel' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Ride Cancellation Notice</span>
            </div>
            <p className="leading-relaxed">
              To protect dedicated chauffeurs and ensure verified custody of vehicles, <strong>in-app direct cancellation is disabled</strong>. Please speak directly with our dispatch desk to cancel booking {bookingId ? `#${bookingId.slice(-6)}` : ''}.
            </p>
          </div>
        )}

        {/* Quick Contact Buttons */}
        <div className="space-y-2.5 mb-5">
          <a
            href="tel:18008437433"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all text-xs font-semibold text-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div>Toll-Free Helpline</div>
                <div className="text-[11px] text-slate-500 font-normal">1800-843-7433 (1800-THERIDE)</div>
              </div>
            </div>
            <span className="text-blue-600 font-medium">Call Now →</span>
          </a>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-xs font-semibold text-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div>WhatsApp Priority Desk</div>
                <div className="text-[11px] text-slate-500 font-normal">Instant agent reply in &lt; 1 min</div>
              </div>
            </div>
            <span className="text-emerald-600 font-medium">Chat →</span>
          </a>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div>Official Support Email</div>
                <div className="text-[11px] text-slate-500 font-normal">dispatch@theride.in</div>
              </div>
            </div>
            <span className="text-slate-400 font-normal text-[11px]">Monitored 24/7</span>
          </div>
        </div>

        {/* Request Callback Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-4 space-y-3">
            <label className="block text-xs font-medium text-slate-700">
              Or Leave a Message for Dispatcher
            </label>
            <textarea
              rows={2}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g., Need to change pickup timing or cancel ride..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
            >
              Request Immediate Callback
            </button>
          </form>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Callback requested! A TheRide operator will call you in 2 minutes.</span>
          </div>
        )}

      </div>
    </div>
  );
};
