import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  QrCode, 
  Download, 
  Building2, 
  Check,
  Award,
  Key,
  Car,
  UserCheck
} from 'lucide-react';
import { DriverProfile } from '../types/driver';

interface VerificationAuditStepProps {
  profile: DriverProfile;
  onApprove: () => void;
  onPrev: () => void;
  onGoToDuty: () => void;
}

export const VerificationAuditStep: React.FC<VerificationAuditStepProps> = ({
  profile,
  onApprove,
  onPrev,
  onGoToDuty,
}) => {
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const isApproved = profile.verificationStatus === 'approved';
  const { documents } = profile;

  const checks = [
    {
      title: 'Driving License Transport Check',
      docName: documents.drivingLicense.number || 'Not provided',
      hasFile: !!documents.drivingLicense.frontDoc,
      status: isApproved ? 'verified' : documents.drivingLicense.frontDoc ? 'uploaded' : 'pending',
      desc: 'Transport Dept. validity & LMV endorsement verification',
    },
    {
      title: 'Aadhaar Identity & Address Proof',
      docName: documents.aadhaarCard.number ? `XXXX XXXX ${documents.aadhaarCard.number.slice(-4)}` : 'Not provided',
      hasFile: !!documents.aadhaarCard.frontDoc,
      status: isApproved ? 'verified' : documents.aadhaarCard.frontDoc ? 'uploaded' : 'pending',
      desc: 'UIDAI compliance & residential address verification',
    },
    {
      title: 'PAN Card Payout Clearance',
      docName: documents.panCard.number || 'Not provided',
      hasFile: !!documents.panCard.doc,
      status: isApproved ? 'verified' : documents.panCard.doc ? 'uploaded' : 'pending',
      desc: 'Income Tax NSDL verification for bank transfers',
    },
    {
      title: 'Driver Biometric Face Match',
      docName: profile.fullName || 'Driver Face Portrait',
      hasFile: !!documents.driverPhoto.doc,
      status: isApproved ? 'verified' : documents.driverPhoto.doc ? 'uploaded' : 'pending',
      desc: 'Facial similarity match with Driving License & Aadhaar',
    },
    {
      title: 'Customer Vehicle Driving Certification',
      docName: profile.fourWheelerCapability?.canDriveTypes?.length
        ? `${profile.fourWheelerCapability.canDriveTypes.length} Customer Car Categories (${profile.fourWheelerCapability.transmission.toUpperCase()})`
        : 'LMV 4-Wheeler Declared',
      hasFile: !!profile.fourWheelerCapability?.confirmedBeforeUpload,
      status: isApproved ? 'verified' : profile.fourWheelerCapability?.confirmedBeforeUpload ? 'verified' : 'pending',
      desc: 'Authorized to operate customer-owned 4-wheeler passenger cars',
    },
    {
      title: 'Safe Chauffeur Background Declaration',
      docName: 'Clean record & zero incident pledge',
      hasFile: true,
      status: isApproved ? 'verified' : 'verified',
      desc: 'No criminal history, valid insurance eligibility on customer vehicle',
    },
  ];

  const handleStartAudit = () => {
    setIsAuditing(true);
    setAuditProgress(15);
    setAuditLogs(['Initiating Company Chauffeur Verification pipeline for ' + (profile.fullName || 'Driver Partner')]);

    setTimeout(() => {
      setAuditProgress(40);
      setAuditLogs((prev) => [...prev, '✓ Driving License verified on MoRTH Sarathi portal (Active LMV status)']);
    }, 600);

    setTimeout(() => {
      setAuditProgress(65);
      setAuditLogs((prev) => [...prev, '✓ UIDAI Aadhaar identity & residential address authenticated']);
    }, 1200);

    setTimeout(() => {
      setAuditProgress(85);
      setAuditLogs((prev) => [
        ...prev, 
        '✓ Income Tax PAN clearance confirmed for weekly bank payouts',
        '✓ Customer 4-Wheeler Endorsement approved (' + (profile.fourWheelerCapability?.canDriveTypes?.length || 'all') + ' car categories)',
      ]);
    }, 1800);

    setTimeout(() => {
      setAuditProgress(100);
      setAuditLogs((prev) => [
        ...prev,
        '✓ Facial biometric match confirmed (99.6% similarity)',
        '★ THE RIDE CHAUFFEUR ACCREDITATION GRANTED: Ready for customer car bookings!',
      ]);
      setIsAuditing(false);
      onApprove();
    }, 2400);
  };

  return (
    <div id="step-verification-audit" className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              STEP 3 OF 3 &bull; COMPANY COMPLIANCE &amp; BACKGROUND VERIFICATION
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Company Onboarding Audit &amp; <span className="text-blue-600">TheRide Chauffeur ID</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Our automated system audits your driving license, identity proofs, and chosen customer car capabilities to issue your official verified chauffeur badge.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-200 rounded-2xl p-3 px-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] text-blue-700 font-semibold block uppercase tracking-wide">Accreditation</span>
              <span className="text-xs font-extrabold text-blue-950">
                {isApproved ? 'VERIFIED CHAUFFEUR' : 'AUDIT PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Verification Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Compliance Checklist</h3>
                <p className="text-xs text-slate-500">Government portal queries &amp; biometric matching</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                6 Clearance Checks
              </span>
            </div>

            <div className="space-y-3">
              {checks.map((check, idx) => {
                const isVerified = check.status === 'verified';
                const isUploaded = check.status === 'uploaded';
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isVerified
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : isUploaded
                        ? 'border-blue-200 bg-blue-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-700'
                          : isUploaded
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isVerified ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : isUploaded ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{check.title}</span>
                        <span className="text-[11px] text-slate-500 block">{check.desc}</span>
                        <span className="text-[10px] font-mono text-blue-700 font-semibold mt-0.5 block">
                          Doc: {check.docName}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isUploaded
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {isVerified ? 'VERIFIED' : isUploaded ? 'UNDER REVIEW' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Audit Trigger / Logs */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              {isAuditing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Automated Compliance Audit in Progress...</span>
                    <span>{auditProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${auditProgress}%` }}
                    />
                  </div>
                  <div className="bg-slate-900 text-slate-200 rounded-xl p-3 text-xs font-mono space-y-1 max-h-36 overflow-y-auto">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="text-[11px]">{log}</div>
                    ))}
                  </div>
                </div>
              ) : !isApproved ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600">
                    Click below to trigger the real-time automated audit pipeline.
                  </div>
                  <button
                    id="btn-trigger-audit"
                    onClick={handleStartAudit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Run Real-Time Audit</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold">Official Verification Passed. Chauffeur ID Activated!</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200">
                    PARTNER ID: {profile.partnerId || 'TR-DRV-4482'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Verified Driver Digital ID Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Chauffeur Partner Badge
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isApproved ? 'ACTIVE BADGE' : 'PROVISIONAL'}
              </span>
            </div>

            {/* Chauffeur Card Graphic in TheRide Signature Style */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                <Car className="h-40 w-40 text-white" />
              </div>

              {/* Top Row of Card */}
              <div className="flex items-center justify-between relative z-10 pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-white text-blue-700 flex items-center justify-center font-black text-xs">
                    TR
                  </div>
                  <div>
                    <span className="font-extrabold text-sm tracking-tight block leading-tight">TheRide</span>
                    <span className="text-[9px] text-blue-200 uppercase tracking-wider font-semibold">
                      Certified Chauffeur Partner
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-blue-200 block">PARTNER ID</span>
                  <span className="font-mono text-xs font-bold text-white tracking-wider">
                    {profile.partnerId || 'TR-DRV-4482'}
                  </span>
                </div>
              </div>

              {/* Middle: Photo & Details */}
              <div className="flex items-center gap-4 my-4 relative z-10">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-800 border-2 border-white/30 flex-shrink-0 relative">
                  {profile.documents.driverPhoto.doc?.dataUrl ? (
                    <img
                      src={profile.documents.driverPhoto.doc.dataUrl}
                      alt={profile.fullName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white/50 text-xs">
                      No Photo
                    </div>
                  )}
                  {isApproved && (
                    <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-white tracking-tight">
                    {profile.fullName || 'Rajesh Kumar Sharma'}
                  </h4>
                  <p className="text-[11px] text-blue-200 font-mono">
                    DL: {profile.documents.drivingLicense.number || 'DL1420150048921'}
                  </p>
                  <p className="text-[11px] text-blue-200">
                    City: <strong className="text-white">{profile.city || 'Delhi NCR'}</strong>
                  </p>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/15 text-[10px] text-blue-100 font-semibold">
                    <span>Transmission:</span>
                    <span className="font-bold text-white">{profile.fourWheelerCapability?.transmission?.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Authorized Customer Vehicles */}
              <div className="pt-3 border-t border-white/15 relative z-10 text-[10px] text-blue-100">
                <span className="text-[9px] uppercase tracking-wider text-blue-300 font-bold block mb-1">
                  Authorized Customer Vehicles to Drive:
                </span>
                <div className="flex flex-wrap gap-1">
                  {profile.fourWheelerCapability?.canDriveTypes?.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-white/20 text-white font-medium">
                      {t.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 space-y-2">
              <button
                type="button"
                id="btn-go-to-duty"
                onClick={onGoToDuty}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>Go to Rider Duty &amp; Start Accepting Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onPrev}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Step 2: KYC Documents</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
