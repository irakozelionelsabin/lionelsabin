import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { fireConfetti } from '../../utils/confetti';
import { 
  Award, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Upload, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  X, 
  Star,
  Copy,
  FolderPlus,
  Loader2,
  Sparkles,
  Check
} from 'lucide-react';
import { Certificate } from '../../types';

export const CertificateManager: React.FC = () => {
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = usePortfolio();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [certificateImage, setCertificateImage] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [description, setDescription] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [relatedSkills, setRelatedSkills] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Bulk Upload State
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadCount, setBulkUploadCount] = useState(0);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  
  const bulkFileInputRef = useRef<HTMLInputElement | null>(null);
  const singleFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const resetForm = () => {
    setTitle('');
    setOrganization('Verified Institution');
    setCertificateImage('');
    setCertificateId('');
    setIssueDate(new Date().getFullYear().toString());
    setExpirationDate('');
    setDescription('');
    setVerificationUrl('');
    setRelatedSkills('');
    setFeatured(false);
    setEditingCert(null);
    setIsProcessingImage(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Certificate) => {
    setEditingCert(c);
    setTitle(c.title);
    setOrganization(c.organization);
    setCertificateImage(c.certificateImage || '');
    setCertificateId(c.certificateId || '');
    setIssueDate(c.issueDate);
    setExpirationDate(c.expirationDate || '');
    setDescription(c.description || '');
    setVerificationUrl(c.verificationUrl || '');
    setRelatedSkills(c.relatedSkills?.join(', ') || '');
    setFeatured(c.featured);
    setIsProcessingImage(false);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingImage(true);
        const optimized = await optimizeImage(file, 1280, 1280, 0.82);
        setCertificateImage(optimized);
        showToast('Certificate image uploaded and optimized!');
      } catch (err) {
        console.error('Certificate photo compression error:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  // Bulk / Multiple Certificates Upload Handler
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkUploading(true);
    setBulkUploadCount(files.length);

    try {
      let added = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const optimized = await optimizeImage(file, 1280, 1280, 0.82);
          
          // Generate clean title from file name
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

          addCertificate({
            title: cleanName || `Certificate ${certificates.length + added + 1}`,
            organization: 'Verified Academic / Tech Institution',
            certificateImage: optimized,
            certificateId: `CERT-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 900 + 100)}`,
            issueDate: new Date().getFullYear().toString(),
            description: 'Officially certified achievement and credential validation.',
            featured: added === 0
          });
          added++;
        }
      }

      fireConfetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
      showToast(`Successfully added ${added} certificate${added > 1 ? 's' : ''}!`);
    } catch (err) {
      console.error('Error during bulk certificate upload:', err);
    } finally {
      setIsBulkUploading(false);
      if (bulkFileInputRef.current) bulkFileInputRef.current.value = '';
    }
  };

  const handleDuplicate = (cert: Certificate) => {
    addCertificate({
      title: `${cert.title} (Copy)`,
      organization: cert.organization,
      certificateImage: cert.certificateImage,
      certificateId: cert.certificateId ? `${cert.certificateId}-COPY` : undefined,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate,
      description: cert.description,
      verificationUrl: cert.verificationUrl,
      relatedSkills: cert.relatedSkills,
      featured: false
    });
    fireConfetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    showToast('Certificate duplicated successfully!');
  };

  const handleSubmit = (e: React.FormEvent, andAddAnother = false) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    const skillsArray = relatedSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      organization: organization.trim(),
      certificateImage: certificateImage.trim() || undefined,
      certificateId: certificateId.trim() || undefined,
      issueDate: issueDate.trim() || 'Documented',
      expirationDate: expirationDate.trim() || undefined,
      description: description.trim() || undefined,
      verificationUrl: verificationUrl.trim() || undefined,
      relatedSkills: skillsArray.length > 0 ? skillsArray : undefined,
      featured
    };

    if (editingCert) {
      updateCertificate(editingCert.id, payload);
      showToast('Certificate updated successfully!');
      setModalOpen(false);
      resetForm();
    } else {
      addCertificate(payload);
      fireConfetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      showToast('New certificate added successfully!');
      
      if (andAddAnother) {
        // Reset form for next entry but keep modal open
        resetForm();
      } else {
        setModalOpen(false);
        resetForm();
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="certificate-manager-panel">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header & Multi-Upload Actions */}
      <div className="p-5 sm:p-6 rounded-2xl mirror-glass-card shadow-[0_10px_35px_rgba(0,10,35,0.7)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Award className="w-5 h-5 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-orbitron font-bold text-white tracking-wide">
                Certificates & Credentials Manager
              </h1>
              <p className="text-purple-200/80 text-xs sm:text-sm">
                Add, manage, and batch-upload multiple technical certificates, degrees, and academic awards
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons: Single Add & Bulk Upload */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Multiple / Bulk Upload Button */}
          <input
            ref={bulkFileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleBulkUpload}
            className="hidden"
            id="bulk-cert-upload-input"
          />
          
          <button
            onClick={() => bulkFileInputRef.current?.click()}
            disabled={isBulkUploading}
            className="px-4 py-2.5 rounded-xl font-orbitron font-bold text-xs text-purple-200 bg-purple-950/60 hover:bg-purple-950/90 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2 cursor-pointer"
          >
            {isBulkUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading {bulkUploadCount}...</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-3.5 h-3.5 text-purple-300" />
                <span>Upload Multiple At Once</span>
              </>
            )}
          </button>

          {/* Single Add Modal Trigger */}
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-500 via-pink-600 to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0b1328]/80 border border-purple-500/30 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300">Total Certificates:</span>
          <span className="text-sm font-orbitron font-bold text-purple-300">{certificates.length}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0b1328]/80 border border-pink-500/30 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300">Featured Honors:</span>
          <span className="text-sm font-orbitron font-bold text-pink-300">
            {certificates.filter(c => c.featured).length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0b1328]/80 border border-cyan-500/30 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300">Verified Credentials:</span>
          <span className="text-sm font-orbitron font-bold text-[#00e5ff]">
            {certificates.filter(c => c.verificationUrl || c.certificateId).length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0b1328]/80 border border-emerald-500/30 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300">With Visual Scan:</span>
          <span className="text-sm font-orbitron font-bold text-emerald-400">
            {certificates.filter(c => c.certificateImage).length}
          </span>
        </div>
      </div>

      {/* PROMINENT DIRECT MULTI-UPLOAD DROPZONE AREA */}
      <div 
        onClick={() => bulkFileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleBulkUpload(fakeEvent);
          }
        }}
        className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-purple-500/50 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-950/40 text-center cursor-pointer transition-all duration-300 group shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden"
      >
        <div className="max-w-md mx-auto space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/50 text-purple-300 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            {isBulkUploading ? (
              <Loader2 className="w-7 h-7 animate-spin text-purple-300" />
            ) : (
              <Upload className="w-7 h-7 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            )}
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors">
              {isBulkUploading ? `Processing ${bulkUploadCount} Certificates...` : 'Click or Drag & Drop Multiple Certificates Here'}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
              Select 1, 5, 10 or more certificate image files at once (PNG, JPG, WEBP). They will be automatically compressed and added to your portfolio!
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/30 border border-purple-400/50 text-purple-200 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Multiple Certificates Supported • Instant Upload</span>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="py-16 text-center rounded-2xl mirror-glass-card border border-purple-500/30 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-400/40 text-purple-300 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-orbitron font-bold text-white">
            No Certificates Added Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            You can upload multiple certificates at once or add them one by one to showcase your verified accreditations.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => bulkFileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl text-xs font-orbitron font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Bulk Upload Certificates</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl text-xs font-orbitron font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Single Certificate</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl mirror-glass-card border border-white/10 flex flex-col justify-between group hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)] transition-all shadow-md"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-white/10 mb-4 flex items-center justify-center">
                  {cert.certificateImage ? (
                    <img
                      src={cert.certificateImage}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#130f2c] to-[#1e1b4b] text-purple-400 p-4 text-center">
                      <Award className="w-10 h-10 mb-2 opacity-80 animate-pulse" />
                      <span className="text-[11px] font-mono text-purple-200 truncate max-w-[200px]">
                        {cert.organization}
                      </span>
                    </div>
                  )}

                  {cert.featured && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-orbitron font-bold bg-pink-500 text-white flex items-center gap-1 shadow-lg">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-semibold text-purple-300 uppercase truncate max-w-[180px]">
                    {cert.organization}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{cert.issueDate}</span>
                  </div>
                </div>

                <h3 className="font-orbitron font-bold text-sm sm:text-base text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                  {cert.title}
                </h3>

                {cert.description && (
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {cert.description}
                  </p>
                )}

                {cert.certificateId && (
                  <div className="text-[10px] font-mono text-emerald-400 mb-2">
                    ID: {cert.certificateId}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-2">
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">Verified Doc</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicate(cert)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs transition-colors cursor-pointer"
                    title="Duplicate Certificate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/50 text-slate-300 hover:text-purple-300 text-xs transition-colors cursor-pointer"
                    title="Edit Certificate"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete certificate "${cert.title}"?`)) {
                        deleteCertificate(cert.id);
                        showToast('Certificate removed');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 text-xs transition-colors cursor-pointer"
                    title="Delete Certificate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Certificate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-xl rounded-3xl bg-[#0b1328] border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-orbitron font-bold text-white">
                  {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Web Development Certification"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Giheke TSS / Rwanda TVET Board"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. 2024 / June 2024"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Credential / Cert ID
                  </label>
                  <input
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="e.g. CERT-2024-8842"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Description / Qualification Context
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of skills mastered and qualification context..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Verification Link / URL
                </label>
                <input
                  type="url"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              {/* Certificate Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 uppercase">
                  Certificate Document Image (Upload or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certificateImage}
                    onChange={(e) => setCertificateImage(e.target.value)}
                    placeholder="Paste image URL or click upload file..."
                    className="flex-1 px-4 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="file"
                    ref={singleFileInputRef}
                    id="cert-file-upload-single"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => singleFileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 hover:from-purple-500/60 hover:to-pink-500/60 text-xs font-bold text-purple-200 border border-purple-400/50 cursor-pointer flex items-center gap-1.5 shrink-0 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  >
                    {isProcessingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{isProcessingImage ? 'Optimizing...' : 'Upload File'}</span>
                  </button>
                </div>

                {/* LIVE PREVIEW */}
                {certificateImage && (
                  <div className="mt-3 p-3 rounded-2xl bg-black/50 border border-purple-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-purple-300 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Certificate Document Preview:
                      </span>
                      <button
                        type="button"
                        onClick={() => setCertificateImage('')}
                        className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>

                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
                      <img
                        src={certificateImage}
                        alt="Certificate Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-200">
                    Feature this certificate in primary highlights
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                {!editingCert && (
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-purple-300 bg-purple-950/80 hover:bg-purple-900 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer"
                  >
                    Save & Add Another
                  </button>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs text-white bg-gradient-to-r from-purple-500 via-pink-600 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:opacity-95 cursor-pointer"
                >
                  {editingCert ? 'Save Changes' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
