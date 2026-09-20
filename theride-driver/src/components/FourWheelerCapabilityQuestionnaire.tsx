import React, { useState } from 'react';
import { 
  Car, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Edit3, 
  Award,
  ArrowRight,
  HelpCircle,
  Key,
  Zap,
  Sliders
} from 'lucide-react';
import { DriverProfile, FourWheelerCapability, FourWheelerType } from '../types/driver';

interface FourWheelerCapabilityQuestionnaireProps {
  profile: DriverProfile;
  onChange: (updated: DriverProfile) => void;
  onConfirmed?: () => void;
}

interface FourWheelerOption {
  id: FourWheelerType;
  name: string;
  category: string;
  popularCustomerCars: string;
  badge: string;
  iconBg: string;
}

const FOUR_WHEELER_OPTIONS: FourWheelerOption[] = [
  {
    id: 'compact_sedan',
    name: 'Sedans (Compact & Mid-Size)',
    category: 'Sedan',
    popularCustomerCars: 'Honda City, Maruti Dzire, Hyundai Verna, Honda Amaze, Ciaz',
    badge: 'Most Booked',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'hatchback',
    name: 'Compact Hatchbacks',
    category: 'Hatchback',
    popularCustomerCars: 'Maruti Swift, Baleno, Hyundai i20, Grand i10, Tata Altroz',
    badge: 'Daily Commutes',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'suv_muv',
    name: 'SUVs & MUVs (6-7 Seaters)',
    category: 'SUV & MUV',
    popularCustomerCars: 'Toyota Innova Crysta, Fortuner, Mahindra Scorpio, XUV700, Ertiga',
    badge: 'Highest Payout',
    iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'electric_ev',
    name: 'Electric Vehicles (EVs)',
    category: 'Electric 4-Wheeler',
    popularCustomerCars: 'Tata Nexon EV, Tigor EV, MG ZS EV, Mahindra XUV400, Ioniq 5',
    badge: 'Green Incentive',
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'luxury_cars',
    name: 'Executive & Luxury Fleet',
    category: 'Luxury Cars',
    popularCustomerCars: 'Mercedes-Benz, BMW 3/5 Series, Audi A4/A6, Jaguar, Volvo',
    badge: 'VIP Chauffeur',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'large_mpv',
    name: 'Large MPV & Multi-Seaters',
    category: 'Large MPV',
    popularCustomerCars: 'Kia Carnival, Toyota Vellfire, Force Urbania',
    badge: 'Special Duties',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
];

const TRANSMISSION_OPTIONS: { id: 'both' | 'manual' | 'automatic'; label: string; desc: string }[] = [
  { id: 'both', label: 'Both (Manual & Automatic)', desc: 'Comfortable with traditional stick-shift clutch & automatic/AMT/CVT/DCT cars' },
  { id: 'automatic', label: 'Automatic Transmission Only', desc: 'AMT, CVT, Torque Converter, DCT & Single-Speed EVs' },
  { id: 'manual', label: 'Manual Transmission Only', desc: 'Standard manual 5/6-speed stick shift with clutch pedal' },
];

const EXPERIENCE_OPTIONS = [
  '1 - 3 Years (General Driving)',
  '3 - 5 Years (Experienced Driver)',
  '5+ Years (Professional Driver)',
  '10+ Years (Senior Master Chauffeur)',
];

export const FourWheelerCapabilityQuestionnaire: React.FC<FourWheelerCapabilityQuestionnaireProps> = ({
  profile,
  onChange,
  onConfirmed,
}) => {
  const capability: FourWheelerCapability = profile.fourWheelerCapability || {
    canDriveTypes: ['compact_sedan', 'hatchback'],
    transmission: 'both',
    drivingExperience: '3 - 5 Years (Experienced Driver)',
    hasValidLmvLicense: true,
    preferredModels: [],
    comfortDrivingHighway: true,
    comfortDrivingNight: true,
    comfortDrivingHills: true,
    specialSkills: ['Automatic & Paddle Shifters', 'Tight Parking & Basement Valet'],
    familiarBrands: ['Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata Motors'],
    confirmedBeforeUpload: false,
  };

  const [isEditing, setIsEditing] = useState<boolean>(!capability.confirmedBeforeUpload);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleToggleVehicleType = (type: FourWheelerType) => {
    const current = capability.canDriveTypes || [];
    let updated: FourWheelerType[];
    if (current.includes(type)) {
      if (current.length === 1) {
        setValidationError('Please select at least one customer 4-wheeler category you can drive.');
        return;
      }
      updated = current.filter((t) => t !== type);
    } else {
      updated = [...current, type];
    }
    setValidationError(null);
    updateCapability({ canDriveTypes: updated });
  };

  const handleSelectAll = () => {
    updateCapability({
      canDriveTypes: FOUR_WHEELER_OPTIONS.map((o) => o.id),
    });
    setValidationError(null);
  };

  const updateCapability = (patch: Partial<FourWheelerCapability>) => {
    const nextCap: FourWheelerCapability = {
      ...capability,
      ...patch,
    };
    onChange({
      ...profile,
      fourWheelerCapability: nextCap,
    });
  };

  const handleConfirm = () => {
    if (!capability.canDriveTypes || capability.canDriveTypes.length === 0) {
      setValidationError('Please select which customer 4-wheeler(s) you can drive before continuing.');
      return;
    }
    if (!capability.hasValidLmvLicense) {
      setValidationError('You must confirm possession of a valid LMV 4-wheeler driving license.');
      return;
    }
    setValidationError(null);
    updateCapability({ confirmedBeforeUpload: true });
    setIsEditing(false);
    if (onConfirmed) {
      onConfirmed();
    }
  };

  const selectedCount = capability.canDriveTypes?.length || 0;

  return (
    <div id="customer-car-skills-card" className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-7 shadow-xs">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Customer Vehicle Driving Skills &amp; Preferences
              </h3>
              {capability.confirmedBeforeUpload && !isEditing && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> Confirmed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              The car belongs to the customer. Specify which customer car types you are authorized &amp; confident to drive.
            </p>
          </div>
        </div>

        {!isEditing && capability.confirmedBeforeUpload && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Vehicle Skills</span>
          </button>
        )}
      </div>

      {/* Summary View when Confirmed */}
      {!isEditing && capability.confirmedBeforeUpload ? (
        <div className="space-y-4">
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                  Authorized Customer 4-Wheeler Categories
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {selectedCount} Vehicle Types Selected &bull; {capability.transmission.toUpperCase()} Transmission
                </h4>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white">
                Experience: {capability.drivingExperience}
              </span>
            </div>

            {/* Selected Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-200/60">
              {capability.canDriveTypes?.map((typeId) => {
                const opt = FOUR_WHEELER_OPTIONS.find((o) => o.id === typeId);
                return (
                  <span
                    key={typeId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-blue-900 border border-blue-200 text-xs font-bold shadow-xs"
                  >
                    <Check className="h-3.5 w-3.5 text-blue-600" />
                    <span>{opt ? opt.name : typeId}</span>
                  </span>
                );
              })}
            </div>

            {/* Special Skills */}
            {capability.specialSkills && capability.specialSkills.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200/60 flex flex-wrap gap-1.5 items-center text-xs">
                <span className="text-slate-600 font-semibold mr-1">Skills:</span>
                {capability.specialSkills.map((sk) => (
                  <span key={sk} className="px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800 text-[11px] font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>✓ Valid LMV 4-wheeler license declared</span>
            <span>✓ Ready for customer booking matching</span>
          </div>
        </div>
      ) : (
        /* Edit / Input Form */
        <div className="space-y-6">
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Customer Car Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1. Which Customer Car Types Can You Drive? <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500">Select all categories you have experience and comfort driving</p>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 cursor-pointer"
              >
                Select All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FOUR_WHEELER_OPTIONS.map((opt) => {
                const isSelected = capability.canDriveTypes?.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleVehicleType(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="font-bold text-slate-900 text-xs">{opt.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">
                        <strong className="text-slate-700">Customer models:</strong> {opt.popularCustomerCars}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className={`text-[11px] font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-400'}`}>
                        {isSelected ? '✓ Authorized' : 'Click to select'}
                      </span>
                      <div className={`h-4 w-4 rounded flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Transmission */}
          <div className="pt-5 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
              2. Transmission Style Competency <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-3">Which gearbox types are you proficient in operating?</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TRANSMISSION_OPTIONS.map((opt) => {
                const isSelected = capability.transmission === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => updateCapability({ transmission: opt.id })}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs">{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-blue-600 stroke-[3]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Experience */}
          <div className="pt-5 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
              3. Years of 4-Wheeler Driving Experience
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {EXPERIENCE_OPTIONS.map((exp) => {
                const isSelected = capability.drivingExperience === exp;
                return (
                  <button
                    type="button"
                    key={exp}
                    onClick={() => updateCapability({ drivingExperience: exp })}
                    className={`px-3 py-2 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{exp.split(' ')[0]} {exp.split(' ')[1]}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: LMV License Confirmation */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={capability.hasValidLmvLicense}
                onChange={(e) => updateCapability({ hasValidLmvLicense: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900 block">
                  I confirm I hold a valid Indian Driving License (LMV / Transport) for 4-wheelers.
                </span>
                <span className="text-slate-600 text-[11px] mt-0.5 block">
                  I am legally permitted to drive passenger cars and will upload my official license in the next step.
                </span>
              </div>
            </label>
          </div>

          {/* Confirm Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              id="btn-confirm-skills"
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Confirm Vehicle Skills &amp; Proceed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
