import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { 
  Award, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  PlusCircle, 
  ShieldCheck,
  Star
} from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const { certificates, setSelectedCertificate, setAdminOpen, setActiveAdminView } = usePortfolio();

  const handleOpenAddCert = () => {
    setActiveAdminView('certificates');
    setAdminOpen(true);
  };

  return (
    <section id="certificates" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACCREDITATIONS & HONORS</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Certificates & Credentials
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Official certifications, technical assessments, and verified software development achievements.
            </p>
          </RevealOnScroll>
        </div>

        {/* Certificates Grid or Empty State */}
        {certificates.length === 0 ? (
          <RevealOnScroll delay={150}>
            <div className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mx-auto flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3">
                Certificate Portal Configured
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Ready to showcase your official diplomas, certifications, and licenses. Upload your real credentials in the Admin Panel to display them here with interactive full-size inspection and verification links.
              </p>
              <button
                onClick={handleOpenAddCert}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-500 via-pink-600 to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload Certificate in Admin</span>
              </button>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, idx) => (
              <RevealOnScroll key={cert.id} delay={idx * 100}>
                <Card3D 
                  id={`cert-card-${cert.id}`}
                  glowColor={cert.featured ? 'pink' : 'purple'}
                  className="h-full group"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Certificate Visual Header */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 mb-5">
                        {cert.certificateImage ? (
                          <img
                            src={cert.certificateImage}
                            alt={cert.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#130f2c] to-[#1e1b4b] text-purple-400 p-6 text-center">
                            <Award className="w-12 h-12 mb-3 opacity-80 animate-pulse" />
                            <span className="text-xs font-mono font-semibold text-purple-200">{cert.organization}</span>
                            <span className="text-[11px] font-mono text-slate-400 mt-1">ID: {cert.certificateId || 'VERIFIED'}</span>
                          </div>
                        )}

                        {cert.featured && (
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-pink-500/90 backdrop-blur-md text-white flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Organization */}
                      <span className="text-xs font-mono uppercase tracking-wider text-purple-300 block mb-1">
                        {cert.organization}
                      </span>
                      <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {cert.title}
                      </h3>

                      {/* Issue Date & ID */}
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          <span>Issued: {cert.issueDate}</span>
                        </span>
                        {cert.certificateId && (
                          <span>• ID: {cert.certificateId}</span>
                        )}
                      </div>

                      {/* Description */}
                      {cert.description && (
                        <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                          {cert.description}
                        </p>
                      )}

                      {/* Skills */}
                      {cert.relatedSkills && cert.relatedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {cert.relatedSkills.map((sk, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Preserved / Required Buttons */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedCertificate(cert)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-purple-500/30 hover:border-purple-400 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>View Certificate</span>
                      </button>

                      {cert.verificationUrl && (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Verify Certificate</span>
                        </a>
                      )}
                    </div>

                  </div>
                </Card3D>
              </RevealOnScroll>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
