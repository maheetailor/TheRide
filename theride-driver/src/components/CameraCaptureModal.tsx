import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle, SwitchCamera } from 'lucide-react';
import { UploadedFileMeta } from '../types/driver';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: UploadedFileMeta) => void;
  documentTitle: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  documentTitle,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Decide default camera mode: front camera for selfies, back for documents
  const isSelfie = /selfie|portrait|photo/i.test(documentTitle);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(isSelfie ? 'user' : 'environment');

  useEffect(() => {
    if (isOpen) {
      setFacingMode(isSelfie ? 'user' : 'environment');
      startCamera(isSelfie ? 'user' : 'environment');
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    stopCamera();
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        throw new Error('Camera API not available in this environment');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('Camera access not granted or not supported in frame. You can use the instant snapshot generator below to verify.');
      setCameraActive(false);
    }
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const takeSnapshot = () => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
      }
    } else {
      generateMockSnapshot();
    }
  };

  const generateMockSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Crisp professional mock card background in TheRide blue and white
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#1e40af';
      ctx.fillRect(20, 20, canvas.width - 40, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`TheRide - ${documentTitle}`, 40, 52);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, 90, canvas.width - 80, 290);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 90, canvas.width - 80, 290);

      // Photo block
      ctx.fillStyle = '#dbeafe';
      ctx.fillRect(65, 120, 110, 140);
      ctx.fillStyle = '#1d4ed8';
      ctx.font = '14px sans-serif';
      ctx.fillText('LIVE PHOTO', 75, 195);

      // Text lines
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('OFFICIAL 4-WHEELER PARTNER DOCUMENT', 195, 140);

      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Captured: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString()}`, 195, 175);
      ctx.fillText('MoRTH & UIDAI Transport Compliance', 195, 205);
      ctx.fillText('Authorized Commercial 4-Wheeler Passenger Cab', 195, 235);

      // Barcode simulation
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 35; i++) {
        const w = (i % 3 === 0) ? 5 : 2;
        ctx.fillRect(195 + i * 10, 260, w, 40);
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const handleConfirmCapture = () => {
    if (!capturedImage) return;
    const meta: UploadedFileMeta = {
      id: `cam-${Date.now()}`,
      name: `${documentTitle.replace(/\s+/g, '_')}_CameraScan.jpg`,
      size: 1024 * 180,
      type: 'image/jpeg',
      dataUrl: capturedImage,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onCapture(meta);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="modal-camera-capture"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Camera className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">Scanner &bull; {documentTitle}</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">Hold flat &amp; steady in frame</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {cameraActive && !capturedImage && (
              <button
                type="button"
                onClick={toggleFacingMode}
                title="Switch Camera (Front / Back)"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <SwitchCamera className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">{facingMode === 'user' ? 'Front' : 'Back'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Camera Viewport or Preview */}
        <div className="relative p-3 sm:p-6 bg-slate-100 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px]">
          {capturedImage ? (
            <div className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
              <img src={capturedImage} alt="Captured scan" className="w-full object-cover" />
              <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Captured</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-lg aspect-4/3 bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {!cameraActive && (
                <div className="p-6 text-center space-y-3 text-slate-300 max-w-xs">
                  <Camera className="h-10 w-10 text-blue-400 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-300">
                    {cameraError || 'Initializing camera stream...'}
                  </p>
                  <button
                    onClick={generateMockSnapshot}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all min-h-[44px]"
                  >
                    <span>Instant High-Quality Scan Generator</span>
                  </button>
                </div>
              )}

              {/* Document Alignment Box overlay */}
              {cameraActive && (
                <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-blue-400 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[10px] sm:text-[11px] font-mono text-white bg-slate-950/70 px-2.5 py-1 rounded-md text-center max-w-[85%] truncate">
                    Align {documentTitle} within borders
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-3 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {capturedImage ? (
              <>
                <button
                  onClick={() => setCapturedImage(null)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer min-h-[44px]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retake</span>
                </button>
                <button
                  id="btn-confirm-captured-doc"
                  onClick={handleConfirmCapture}
                  className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer min-h-[44px]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Use This</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {cameraActive && (
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="sm:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 min-h-[44px] flex items-center justify-center cursor-pointer"
                    title="Flip camera"
                  >
                    <SwitchCamera className="h-5 w-5 text-blue-600" />
                  </button>
                )}
                <button
                  id="btn-shutter-capture"
                  onClick={takeSnapshot}
                  className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer min-h-[44px]"
                >
                  <Camera className="h-4 w-4" />
                  <span>Snap Document</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
