import React, { useState } from 'react';
import { 
  FileCheck2, 
  CreditCard, 
  Car, 
  ShieldCheck, 
  UserCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Lock,
  Sparkles,
  AlertCircle,
  FileText,
  ChevronRight,
  UploadCloud,
  Check,
  Key
} from 'lucide-react';
import { DriverProfile, UploadedFileMeta } from '../types/driver';
import { DocumentUploadCard } from './DocumentUploadCard';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { CameraCaptureModal } from './CameraCaptureModal';
import { FourWheelerCapabilityQuestionnaire } from './FourWheelerCapabilityQuestionnaire';
import { 
  validateDrivingLicense, 
  validateAadhaar, 
  formatAadhaar, 
  validatePAN 
} from '../utils/validation';

interface DocumentsStepProps {
  profile: DriverProfile;
  onChange: (updated: DriverProfile) => void;
  onPrev: () => void;
  onNext: () => void;
}

type DocSubStep = 'prerequisite' | 'dl' | 'aadhaar' | 'pan' | 'selfie';

const SUB_STEPS: { id: DocSubStep; label: string; shortLabel: string; icon: any }[] = [
  { id: 'prerequisite', label: 'Vehicle Driving Preferences', shortLabel: '1. Vehicle Skills', icon: Key },
  { id: 'dl', label: 'Driving License (DL)', shortLabel: '2. Driving License', icon: FileCheck2 },
  { id: 'aadhaar', label: 'Aadhaar Identity Card', shortLabel: '3. Aadhaar Card', icon: CreditCard },
  { id: 'pan', label: 'PAN Card (Tax & Payout)', shortLabel: '4. PAN Card', icon: FileText },
  { id: 'selfie', label: 'Driver Live Portrait', shortLabel: '5. Driver Photo', icon: UserCheck },
];

export const DocumentsStep: React.FC<DocumentsStepProps> = ({
  profile,
  onChange,
  onPrev,
  onNext,
}) => {
  // Modal states
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    file?: UploadedFileMeta | null;
    title: string;
    docNumber?: string;
    status?: string;
  }>({
    isOpen: false,
    title: '',
  });

  const [cameraModal, setCameraModal] = useState<{
    isOpen: boolean;
    title: string;
    onCaptureTarget?: (file: UploadedFileMeta) => void;
  }>({
    isOpen: false,
    title: '',
  });

  // Current active sub-step for step-by-step upload
  const [activeSubStep, setActiveSubStep] = useState<DocSubStep>('prerequisite');

  const { documents } = profile;

  // Validation helpers
  const dlValidation = documents.drivingLicense.number
    ? validateDrivingLicense(documents.drivingLicense.number)
    : null;
  const aadhaarValidation = documents.aadhaarCard.number
    ? validateAadhaar(documents.aadhaarCard.number)
    : null;
  const panValidation = documents.panCard.number
    ? validatePAN(documents.panCard.number)
    : null;

  // Generic document updates
  const updateDocuments = (patch: Partial<DriverProfile['documents']>) => {
    onChange({
      ...profile,
      documents: {
        ...profile.documents,
        ...patch,
      },
    });
  };

  // DL updates
  const handleDlChange = (field: string, value: any) => {
    updateDocuments({
      drivingLicense: {
        ...documents.drivingLicense,
        [field]: value,
      },
    });
  };

  // Aadhaar updates
  const handleAadhaarChange = (field: string, value: any) => {
    updateDocuments({
      aadhaarCard: {
        ...documents.aadhaarCard,
        [field]: value,
      },
    });
  };

  // PAN updates
  const handlePanChange = (field: string, value: any) => {
    updateDocuments({
      panCard: {
        ...documents.panCard,
        [field]: value,
      },
    });
  };

  // Selfie updates
  const handleSelfieDoc = (file: UploadedFileMeta | null) => {
    updateDocuments({
      driverPhoto: {
        ...documents.driverPhoto,
        doc: file || undefined,
        status: file ? 'uploaded' : 'not_uploaded',
      },
    });
  };

  // Open Preview Modal
  const openPreview = (file?: UploadedFileMeta, title = '', docNumber?: string, status?: string) => {
    setPreviewModal({
      isOpen: true,
      file,
      title,
      docNumber,
      status,
    });
  };

  // Open Camera Modal
  const openCamera = (title: string, onCapture: (file: UploadedFileMeta) => void) => {
    setCameraModal({
      isOpen: true,
      title,
      onCaptureTarget: onCapture,
    });
  };

  // Sub-step completion checks
  const isPrerequisiteComplete = !!profile.fourWheelerCapability?.confirmedBeforeUpload;
  const isDlComplete = !!(documents.drivingLicense.number && documents.drivingLicense.frontDoc);
  const isAadhaarComplete = !!(documents.aadhaarCard.number && documents.aadhaarCard.frontDoc);
  const isPanComplete = !!(documents.panCard.number && documents.panCard.doc);
  const isSelfieComplete = !!documents.driverPhoto.doc;

  const totalCompleted = 
    (isPrerequisiteComplete ? 1 : 0) +
    (isDlComplete ? 1 : 0) +
    (isAadhaarComplete ? 1 : 0) +
    (isPanComplete ? 1 : 0) +
    (isSelfieComplete ? 1 : 0);

  const isAllComplete = totalCompleted === 5;

  // Sub-step navigation
  const currentIndex = SUB_STEPS.findIndex((s) => s.id === activeSubStep);

  const goToNextSubStep = () => {
    if (currentIndex < SUB_STEPS.length - 1) {
      setActiveSubStep(SUB_STEPS[currentIndex + 1].id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      onNext();
    }
  };

  const goToPrevSubStep = () => {
    if (currentIndex > 0) {
      setActiveSubStep(SUB_STEPS[currentIndex - 1].id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      onPrev();
    }
  };

  return (
    <div id="step-documents-kyc" className="space-y-6 animate-in fade-in">
      
      {/* Top Banner in TheRide Blue & White */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              STEP 2 OF 3 &bull; DRIVER KYC &amp; IDENTITY VERIFICATION (5 STEPS)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Official KYC Documents &amp; <span className="text-blue-600">Driver Verification</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Because customers entrust you with their personal cars, we verify your official Driving License, Aadhaar identity, and PAN card. No driver vehicle RC or insurance documents are required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-3.5 px-5 text-xs text-blue-900">
            <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              {totalCompleted}/5
            </div>
            <div>
              <span className="font-extrabold block text-sm text-blue-950">Verification Progress</span>
              <span className="text-blue-700 text-xs">
                {isAllComplete ? 'All 5 Steps Completed!' : `${5 - totalCompleted} step(s) remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(totalCompleted / 5) * 100}%` }}
            />
          </div>

          {/* Sub-step indicator buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none sm:grid sm:grid-cols-5 sm:gap-2">
            {SUB_STEPS.map((step, idx) => {
              const isCurrent = step.id === activeSubStep;
              let isDone = false;
              if (step.id === 'prerequisite') isDone = isPrerequisiteComplete;
              if (step.id === 'dl') isDone = isDlComplete;
              if (step.id === 'aadhaar') isDone = isAadhaarComplete;
              if (step.id === 'pan') isDone = isPanComplete;
              if (step.id === 'selfie') isDone = isSelfieComplete;

              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  id={`substep-btn-${step.id}`}
                  onClick={() => setActiveSubStep(step.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer min-w-[130px] sm:min-w-0 flex-shrink-0 sm:flex-shrink ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : isDone
                      ? 'border-blue-200 bg-blue-50/80 text-blue-900 hover:bg-blue-100/70'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                    isCurrent 
                      ? 'bg-white/20 text-white' 
                      : isDone 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className="truncate">{step.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notice Banner: Customer Car Model */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm text-emerald-950">
            Hired Driver / Chauffeur Service Model
          </span>
          <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
            The vehicle is always provided by the customer. You are being onboarded as a certified driver. You do <strong>not</strong> need to upload a vehicle RC (Registration Certificate) or commercial car insurance.
          </p>
        </div>
      </div>

      {/* SUB-STEP 1: Vehicle Driving Capabilities & Preferences */}
      {activeSubStep === 'prerequisite' && (
        <div className="space-y-4">
          <FourWheelerCapabilityQuestionnaire
            profile={profile}
            onChange={onChange}
            onConfirmed={goToNextSubStep}
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Step 1: Profile</span>
            </button>

            <button
              type="button"
              id="btn-substep-next-dl"
              onClick={goToNextSubStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <span>Next: Driving License (DL)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-STEP 2: Driving License (DL) */}
      {activeSubStep === 'dl' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Commercial / LMV Driving License</h3>
                <p className="text-xs text-slate-500">Union of India / State Transport Department</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              MoRTH SARATHI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-dl-number">
                Driving License Number <span className="text-red-500">*</span>
              </label>
              <input
                id="input-dl-number"
                type="text"
                placeholder="e.g. DL1420150048921"
                value={documents.drivingLicense.number}
                onChange={(e) => handleDlChange('number', e.target.value.toUpperCase())}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 font-mono uppercase focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {dlValidation && (
                <p className={`text-[11px] mt-1 font-medium ${dlValidation.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {dlValidation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-dl-expiry">
                DL Expiry Date (Must be Valid) <span className="text-red-500">*</span>
              </label>
              <input
                id="input-dl-expiry"
                type="date"
                value={documents.drivingLicense.expiryDate}
                onChange={(e) => handleDlChange('expiryDate', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium"
              />
            </div>
          </div>

          {/* Front and Back Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <DocumentUploadCard
              id="upload-dl-front"
              title="Driving License (Front Side)"
              subtitle="Clear color photo showing name, photo, and LMV category"
              file={documents.drivingLicense.frontDoc}
              status={documents.drivingLicense.frontDoc ? 'uploaded' : 'not_uploaded'}
              onFileUpload={(f: UploadedFileMeta) => handleDlChange('frontDoc', f)}
              onFileRemove={() => handleDlChange('frontDoc', undefined)}
              onOpenPreview={() => openPreview(documents.drivingLicense.frontDoc, 'Driving License Front', documents.drivingLicense.number, documents.drivingLicense.status)}
              onOpenCamera={() => openCamera('Take Driving License Front Photo', (f: UploadedFileMeta) => handleDlChange('frontDoc', f))}
              acceptedFormats="image/*,.pdf"
            />

            <DocumentUploadCard
              id="upload-dl-back"
              title="Driving License (Back Side)"
              subtitle="Reverse side showing transport endorsement and QR code"
              file={documents.drivingLicense.backDoc}
              status={documents.drivingLicense.backDoc ? 'uploaded' : 'not_uploaded'}
              onFileUpload={(f: UploadedFileMeta) => handleDlChange('backDoc', f)}
              onFileRemove={() => handleDlChange('backDoc', undefined)}
              onOpenPreview={() => openPreview(documents.drivingLicense.backDoc, 'Driving License Back', documents.drivingLicense.number, documents.drivingLicense.status)}
              onOpenCamera={() => openCamera('Take Driving License Back Photo', (f: UploadedFileMeta) => handleDlChange('backDoc', f))}
              acceptedFormats="image/*,.pdf"
            />
          </div>

          {/* Sub-step controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={goToPrevSubStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back: Vehicle Skills</span>
            </button>

            <button
              type="button"
              id="btn-substep-next-aadhaar"
              onClick={goToNextSubStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <span>Next: Aadhaar Card</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-STEP 3: Aadhaar Identity Card */}
      {activeSubStep === 'aadhaar' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Aadhaar Identity Card</h3>
                <p className="text-xs text-slate-500">UIDAI verified national identity &amp; address proof</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              UIDAI COMPLIANT
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-aadhaar-number">
              12-Digit Aadhaar Number <span className="text-red-500">*</span>
            </label>
            <input
              id="input-aadhaar-number"
              type="text"
              placeholder="XXXX XXXX XXXX"
              maxLength={14}
              value={documents.aadhaarCard.number}
              onChange={(e) => handleAadhaarChange('number', formatAadhaar(e.target.value))}
              className="w-full sm:w-80 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 font-mono tracking-wider focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {aadhaarValidation && (
              <p className={`text-[11px] mt-1 font-medium ${aadhaarValidation.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                {aadhaarValidation.message}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5 text-xs text-slate-700">
            <Lock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-900 block">UIDAI Masked Aadhaar Safety Standard</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Under UIDAI regulations, you may upload a Masked Aadhaar card showing only the last 4 digits. Your data is stored encrypted and never shared.
              </p>
            </div>
          </div>

          {/* Front and Back Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <DocumentUploadCard
              id="upload-aadhaar-front"
              title="Aadhaar Card (Front Side)"
              subtitle="Front side showing name, date of birth, and photo"
              file={documents.aadhaarCard.frontDoc}
              status={documents.aadhaarCard.frontDoc ? 'uploaded' : 'not_uploaded'}
              onFileUpload={(f: UploadedFileMeta) => handleAadhaarChange('frontDoc', f)}
              onFileRemove={() => handleAadhaarChange('frontDoc', undefined)}
              onOpenPreview={() => openPreview(documents.aadhaarCard.frontDoc, 'Aadhaar Card Front', documents.aadhaarCard.number, documents.aadhaarCard.status)}
              onOpenCamera={() => openCamera('Take Aadhaar Front Photo', (f: UploadedFileMeta) => handleAadhaarChange('frontDoc', f))}
              acceptedFormats="image/*,.pdf"
            />

            <DocumentUploadCard
              id="upload-aadhaar-back"
              title="Aadhaar Card (Address Proof - Back)"
              subtitle="Back side showing residential address and barcode/QR"
              file={documents.aadhaarCard.backDoc}
              status={documents.aadhaarCard.backDoc ? 'uploaded' : 'not_uploaded'}
              onFileUpload={(f: UploadedFileMeta) => handleAadhaarChange('backDoc', f)}
              onFileRemove={() => handleAadhaarChange('backDoc', undefined)}
              onOpenPreview={() => openPreview(documents.aadhaarCard.backDoc, 'Aadhaar Card Back', documents.aadhaarCard.number, documents.aadhaarCard.status)}
              onOpenCamera={() => openCamera('Take Aadhaar Back Photo', (f: UploadedFileMeta) => handleAadhaarChange('backDoc', f))}
              acceptedFormats="image/*,.pdf"
            />
          </div>

          {/* Sub-step controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={goToPrevSubStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back: Driving License</span>
            </button>

            <button
              type="button"
              id="btn-substep-next-pan"
              onClick={goToNextSubStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <span>Next: PAN Card</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-STEP 4: PAN Card */}
      {activeSubStep === 'pan' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Permanent Account Number (PAN Card)</h3>
                <p className="text-xs text-slate-500">Required for direct weekly driver earnings bank deposit</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              INCOME TAX NSDL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-pan-number">
                10-Character PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                id="input-pan-number"
                type="text"
                placeholder="e.g. ABCPR8941K"
                maxLength={10}
                value={documents.panCard.number}
                onChange={(e) => handlePanChange('number', e.target.value.toUpperCase())}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 font-mono uppercase tracking-wider focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {panValidation && (
                <p className={`text-[11px] mt-1 font-medium ${panValidation.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {panValidation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="input-pan-name">
                Name on PAN Card <span className="text-red-500">*</span>
              </label>
              <input
                id="input-pan-name"
                type="text"
                placeholder="e.g. RAJESH KUMAR SHARMA"
                value={documents.panCard.nameOnCard || profile.fullName}
                onChange={(e) => handlePanChange('nameOnCard', e.target.value.toUpperCase())}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 uppercase focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="max-w-md pt-2">
            <DocumentUploadCard
              id="upload-pan-doc"
              title="PAN Card Image / Scanned Copy"
              subtitle="Clear photo of physical PAN Card or e-PAN copy"
              file={documents.panCard.doc}
              status={documents.panCard.doc ? 'uploaded' : 'not_uploaded'}
              onFileUpload={(f: UploadedFileMeta) => handlePanChange('doc', f)}
              onFileRemove={() => handlePanChange('doc', undefined)}
              onOpenPreview={() => openPreview(documents.panCard.doc, 'PAN Card Document', documents.panCard.number, documents.panCard.status)}
              onOpenCamera={() => openCamera('Take PAN Card Photo', (f: UploadedFileMeta) => handlePanChange('doc', f))}
              acceptedFormats="image/*,.pdf"
            />
          </div>

          {/* Sub-step controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={goToPrevSubStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back: Aadhaar Card</span>
            </button>

            <button
              type="button"
              id="btn-substep-next-selfie"
              onClick={goToNextSubStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <span>Next: Driver Live Portrait</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-STEP 5: Driver Live Portrait */}
      {activeSubStep === 'selfie' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Driver Live Photo (Biometric Match)</h3>
                <p className="text-xs text-slate-500">Live portrait shown to customers when you arrive to drive their car</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              TRUST BADGE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <DocumentUploadCard
                id="upload-driver-photo"
                title="Driver Live Portrait / Selfie"
                subtitle="Take a live photo using your webcam or upload a clear front-facing headshot (no sunglasses/caps)"
                file={documents.driverPhoto.doc}
                status={documents.driverPhoto.doc ? 'uploaded' : 'not_uploaded'}
                onFileUpload={(file: UploadedFileMeta) => handleSelfieDoc(file)}
                onFileRemove={() => handleSelfieDoc(null)}
                onOpenPreview={() => openPreview(documents.driverPhoto.doc, 'Driver Photo', profile.fullName, documents.driverPhoto.status)}
                onOpenCamera={() => openCamera('Capture Driver Live Selfie', (file: UploadedFileMeta) => handleSelfieDoc(file))}
                acceptedFormats="image/*"
              />
            </div>

            <div className="md:col-span-5 bg-blue-50/60 border border-blue-100 rounded-2xl p-5 space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Customer Trust Standard
              </h4>
              <ul className="space-y-2 text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Face clearly visible in good lighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Remove dark sunglasses, face masks, or caps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>This picture is cross-checked against your Driving License photo for 99%+ biometric match</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-step controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={goToPrevSubStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back: PAN Card</span>
            </button>

            <button
              type="button"
              id="btn-substep-finish-docs"
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span>Complete Step 2 &bull; Go to Company Audit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, title: '' })}
        file={previewModal.file}
        title={previewModal.title}
        documentNumber={previewModal.docNumber}
        status={previewModal.status}
      />

      <CameraCaptureModal
        isOpen={cameraModal.isOpen}
        onClose={() => setCameraModal({ isOpen: false, title: '' })}
        onCapture={(file) => {
          if (cameraModal.onCaptureTarget) {
            cameraModal.onCaptureTarget(file);
          }
          setCameraModal({ isOpen: false, title: '' });
        }}
        documentTitle={cameraModal.title}
      />
    </div>
  );
};
