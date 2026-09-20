import React from 'react';
import { X, ZoomIn, ZoomOut, Download, FileText, CheckCircle2 } from 'lucide-react';
import { UploadedFileMeta } from '../types/driver';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file?: UploadedFileMeta | null;
  title: string;
  documentNumber?: string;
  status?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  file,
  title,
  documentNumber,
  status,
}) => {
  const [zoom, setZoom] = React.useState<number>(1);

  if (!isOpen || !file) return null;

  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="modal-document-preview"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              {status && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {status.toUpperCase()}
                </span>
              )}
            </div>
            {documentNumber && (
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID / Ref: <span className="text-blue-700 font-bold">{documentNumber}</span>
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              id="btn-zoom-out"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-slate-500 min-w-[45px] text-center font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              id="btn-zoom-in"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <a
              id="btn-download-preview-doc"
              href={file.dataUrl}
              download={file.name}
              className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </a>

            <button
              id="btn-close-document-preview"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100/70 flex items-center justify-center min-h-[300px]">
          {isPdf ? (
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 text-center max-w-md">
              <FileText className="h-14 w-14 text-blue-600 mx-auto mb-3" />
              <p className="font-bold text-slate-900 text-sm">{file.name}</p>
              <p className="text-xs text-slate-500 mt-1">Portable Document Format (PDF)</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
              <a
                href={file.dataUrl}
                download={file.name}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF to View
              </a>
            </div>
          ) : (
            <div 
              className="transition-transform duration-150 ease-out origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                src={file.dataUrl}
                alt={title}
                className="max-h-[65vh] max-w-full rounded-xl shadow-lg border border-slate-200 object-contain bg-white"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{file.name}</span>
            <span>&bull;</span>
            <span className="font-mono">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified High Resolution
          </span>
        </div>
      </div>
    </div>
  );
};
