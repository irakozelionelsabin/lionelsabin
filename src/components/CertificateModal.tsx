import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  Award, 
  Calendar, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { selectedCertificate, setSelectedCertificate } = usePortfolio();

  if (!selectedCertificate) return null;

  return (
    <div 
      id="certificate-viewer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setSelectedCertificate(null)}
    >
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-[#0b1328] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedCertificate(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Display */}
        <div className="relative z-10 space-y-6">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                {selectedCertificate.organization}
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
                {selectedCertificate.title}
              </h2>
            </div>
          </div>

          {/* Certificate Image or Rich Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/20 p-2 shadow-inner">
            {selectedCertificate.certificateImage ? (
              <img
                src={selectedCertificate.certificateImage}
                alt={selectedCertificate.title}
                className="w-full max-h-[400px] object-contain mx-auto rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="py-16 px-6 text-center border-2 border-dashed border-cyan-500/30 rounded-xl bg-gradient-to-b from-[#0e1730] to-[#070c1d]">
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mx-auto flex items-center justify-center mb-4">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white">
                  {selectedCertificate.title}
                </h3>
                <p className="text-xs font-mono text-cyan-300 mt-1">
                  Issued by: {selectedCertificate.organization}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Credential ID: {selectedCertificate.certificateId || 'VERIFIED-RECORD'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block mb-1">Issue Date</span>
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {selectedCertificate.issueDate || 'Documented'}
              </span>
            </div>
            {selectedCertificate.expirationDate && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Expiration</span>
                <span className="text-white font-semibold">
                  {selectedCertificate.expirationDate}
                </span>
              </div>
            )}
          </div>

          {selectedCertificate.description && (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedCertificate.description}
              </p>
            </div>
          )}

          {/* Verification CTA */}
          {selectedCertificate.verificationUrl && (
            <div className="pt-2">
              <a
                href={selectedCertificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Official Authenticity</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
