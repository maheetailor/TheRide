import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock
} from 'lucide-react';
import { UploadedFileMeta, DocumentStatus } from '../types/driver';

interface DocumentUploadCardProps {
  id: string;
  title: string;
  subtitle: string;
  status: DocumentStatus;
  file?: UploadedFileMeta;
  onFileUpload: (file: UploadedFileMeta) => void;
  onFileRemove: () => void;
  onOpenPreview: () => void;
  onOpenCamera: () => void;
  acceptedFormats?: string;
  required?: boolean;
  notes?: string;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  id,
  title,
  subtitle,
  status,
  file,
  onFileUpload,
  onFileRemove,
  onOpenPreview,
  onOpenCamera,
  acceptedFormats = 'image/jpeg,image/png,image/webp,application/pdf',
  required = true,
  notes,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (rawFile: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const meta: UploadedFileMeta = {
        id: `doc-${Date.now()}`,
        name: rawFile.name,
        size: rawFile.size,
        type: rawFile.type || 'image/jpeg',
        dataUrl: reader.result as string,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onFileUpload(meta);
    };
    reader.readAsDataURL(rawFile);
  };

  const isUploaded = !!file;

  return (
    <div 
      id={`upload-card-${id}`}
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden ${
        isDragging
          ? 'border-blue-500 bg-blue-50/50 shadow-md'
          : isUploaded
          ? 'border-blue-200 bg-blue-50/20 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFormats}
        className="hidden"
        id={`input-file-${id}`}
      />

      <div className="p-4 sm:p-5">
        {/* Top bar: Title and Status pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">{title}</h4>
              {required && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>

          {/* Status Badge */}
          <div>
            {status === 'verified' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            ) : status === 'uploaded' || isUploaded ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                <CheckCircle2 className="h-3 w-3" />
                Uploaded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <AlertCircle className="h-3 w-3" />
                Pending Upload
              </span>
            )}
          </div>
        </div>

        {/* Upload dropzone or File Preview state */}
        {isUploaded ? (
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            {/* Thumbnail */}
            <div 
              onClick={onOpenPreview}
              className="relative h-14 w-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group flex-shrink-0"
            >
              {file.type === 'application/pdf' ? (
                <div className="h-full w-full flex flex-col items-center justify-center bg-blue-50 text-blue-600">
                  <FileText className="h-6 w-6" />
                  <span className="text-[9px] font-mono font-bold text-slate-600">PDF</span>
                </div>
              ) : (
                <img
                  src={file.dataUrl}
                  alt={title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="h-4 w-4" />
              </div>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {(file.size / 1024).toFixed(1)} KB &bull; Uploaded {file.uploadedAt}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                <span>Format verified &amp; ready</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                id={`btn-view-${id}`}
                onClick={onOpenPreview}
                title="View Full Document"
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                id={`btn-replace-${id}`}
                onClick={() => fileInputRef.current?.click()}
                title="Replace Document"
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <UploadCloud className="h-4 w-4" />
              </button>
              <button
                id={`btn-remove-${id}`}
                onClick={onFileRemove}
                title="Remove Document"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all text-center cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">
              Drag &amp; drop document here, or <span className="text-blue-600 underline">Browse Files</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports JPEG, PNG, WEBP, PDF (Max 10MB)
            </p>

            {/* Quick camera button */}
            <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                id={`btn-camera-${id}`}
                onClick={onOpenCamera}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5 text-blue-600" />
                <span>Snap with Camera</span>
              </button>
            </div>
          </div>
        )}

        {notes && (
          <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-blue-600 font-bold">&bull;</span>
            <span>{notes}</span>
          </p>
        )}
      </div>
    </div>
  );
};
