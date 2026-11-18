import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  uploadImagePermanently, 
  subscribeToPermanentUploads, 
  deletePermanentUpload, 
  PermanentUploadedImage 
} from '../../firebase/cloudImageUpload';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  ExternalLink, 
  PlusCircle, 
  UserCheck, 
  HardDrive, 
  Clock, 
  FileImage, 
  Sparkles, 
  AlertCircle,
  X,
  GraduationCap,
  Award,
  FolderGit2
} from 'lucide-react';

export const CloudImageUploader: React.FC = () => {
  const { 
    addGalleryPhoto, 
    updateProfile, 
    profile,
    addSchoolPhoto,
    addCertificate,
    addProject 
  } = usePortfolio();

  const [uploads, setUploads] = useState<PermanentUploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to permanent Firestore 'uploads' collection in real time
  useEffect(() => {
    const unsubscribe = subscribeToPermanentUploads((cloudImages) => {
      setUploads(cloudImages);
    });
    return () => unsubscribe();
  }, []);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelection = (file: File) => {
    setErrorMessage('');
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit. Please choose a smaller image.');
      return;
    }

    setSelectedFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadProgress(0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile || isUploading) return;

    try {
      setIsUploading(true);
      setErrorMessage('');
      setUploadProgress(5);
      setStatusMessage('Generating unique filename & uploading to Firebase Cloud...');

      const uploadedRecord = await uploadImagePermanently(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setStatusMessage(`Saved permanently as "${uploadedRecord.fileName}"!`);
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => {
        setUploadProgress(0);
        setStatusMessage('');
      }, 4500);
    } catch (err) {
      console.error('Permanent upload error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to upload image to cloud database.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleAddToGallery = (img: PermanentUploadedImage) => {
    addGalleryPhoto({
      title: img.originalName.replace(/\.[^/.]+$/, ''),
      caption: `Uploaded permanently to cloud storage (${img.fileName})`,
      imageUrl: img.downloadURL,
      category: 'Cloud Vault',
      featured: true
    });
    setStatusMessage(`Added "${img.originalName}" to Public Portfolio Gallery!`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleSetAsProfilePhoto = (img: PermanentUploadedImage) => {
    updateProfile({
      ...profile,
      profilePhoto: img.downloadURL
    });
    setStatusMessage(`Updated Profile Photo with "${img.originalName}"!`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleAddToSchoolPhotos = (img: PermanentUploadedImage) => {
    addSchoolPhoto({
      school: 'Giheke TSS',
      year: new Date().getFullYear().toString(),
      caption: `Photo from Cloud Image Vault (${img.originalName})`,
      imageUrl: img.downloadURL,
      category: 'Academic Journey'
    });
    setStatusMessage(`Added "${img.originalName}" to School Photos!`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleAddToCertificates = (img: PermanentUploadedImage) => {
    const cleanTitle = img.originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    addCertificate({
      title: cleanTitle || 'Verified Technical Certificate',
      organization: 'Verified Institution',
      certificateImage: img.downloadURL,
      certificateId: `CERT-${Date.now().toString().slice(-4)}`,
      issueDate: new Date().getFullYear().toString(),
      description: 'Officially certified achievement stored permanently in Firebase Cloud.',
      featured: true
    });
    setStatusMessage(`Added "${img.originalName}" to Certificates!`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleAddToProjects = (img: PermanentUploadedImage) => {
    const cleanTitle = img.originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    addProject({
      name: cleanTitle || 'Software Engineering Project',
      description: 'Software development project with permanent cloud image asset.',
      technologies: ['PHP', 'MySQL', 'React', 'JavaScript'],
      category: 'Web App',
      image: img.downloadURL,
      featured: true
    });
    setStatusMessage(`Added "${img.originalName}" to Projects Gallery!`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <HardDrive className="w-3.5 h-3.5" />
            <span>FIREBASE CLOUD STORAGE + FIRESTORE METADATA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Permanent Cloud Image Uploader
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Drag & drop images to generate unique filenames, store permanently in Firebase Cloud, and sync metadata to Firestore.
          </p>
        </div>

        {statusMessage && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Upload Card (Drag-and-Drop Zone + Preview + Progress Bar) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1328]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/15 scale-[1.01] shadow-[0_0_30px_rgba(0,229,255,0.25)]'
              : selectedFile
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-white/20 hover:border-cyan-400/60 bg-slate-950/60 hover:bg-slate-900/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,229,255,0.2)]">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-heading font-bold text-white">
                  Drag & drop your image here, or <span className="text-cyan-400 underline">browse files</span>
                </p>
                <p className="text-xs font-mono text-slate-400">
                  Supports PNG, JPG, WEBP, GIF, SVG • Automatic Unique Filename Generation
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col sm:flex-row items-center gap-6 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Instant Preview Thumbnail */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/40 shrink-0 shadow-lg">
                <img
                  src={previewUrl}
                  alt="Preview thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setUploadProgress(0);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/80 text-slate-300 hover:text-rose-400 transition-colors"
                  title="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* File Info & Action */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase mb-1">
                      Ready for Permanent Upload
                    </span>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white break-all">
                      {selectedFile.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      Size: {formatBytes(selectedFile.size)} • Type: {selectedFile.type || 'image/jpeg'}
                    </p>
                  </div>
                </div>

                {/* Live Upload Progress Bar */}
                {(isUploading || uploadProgress > 0) && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300">
                        {uploadProgress < 100 ? 'Uploading to Firebase Cloud...' : 'Upload Complete!'}
                      </span>
                      <span className="font-bold text-white">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleStartUpload}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploading ? `Uploading (${uploadProgress}%)...` : 'Upload Permanently to Cloud'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors"
                  >
                    Change File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Permanent Cloud Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Permanent Cloud Gallery ({uploads.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Synced live with Firestore <code className="text-cyan-300">/uploads</code>
          </span>
        </div>

        {uploads.length === 0 ? (
          <div className="py-14 text-center rounded-2xl bg-[#0b1328]/60 border border-white/10 p-8">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-cyan-400 opacity-50" />
            <h3 className="text-base sm:text-lg font-heading font-bold text-white">
              No permanent cloud images uploaded yet
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Drop any image into the upload zone above. It will be assigned a unique filename, stored permanently in Firebase, and displayed right here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#0b1328]/85 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div>
                  {/* Image Thumbnail */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-white/10 mb-3">
                    <img
                      src={item.downloadURL}
                      alt={item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      {formatBytes(item.fileSize)}
                    </div>
                  </div>

                  {/* Metadata Details */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 truncate" title={item.fileName}>
                      <FileImage className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.fileName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{new Date(item.createdAtIso).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Host Across Website with 1 Click */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.id, item.downloadURL)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-semibold transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === item.id ? 'Copied HTTPS URL!' : 'Copy Cloud URL'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deletePermanentUpload(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Permanent Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1-Click Placement on Website */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Host Permanently On Website:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetAsProfilePhoto(item)}
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/40 text-[10px] font-mono transition-colors"
                      >
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        <span>Profile Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToGallery(item)}
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-pink-500/20 text-slate-300 hover:text-pink-300 border border-white/5 hover:border-pink-500/40 text-[10px] font-mono transition-colors"
                      >
                        <PlusCircle className="w-3 h-3 text-pink-400" />
                        <span>Gallery 2</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToSchoolPhotos(item)}
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/40 text-[10px] font-mono transition-colors"
                      >
                        <GraduationCap className="w-3 h-3 text-cyan-400" />
                        <span>School Photos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToCertificates(item)}
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-white/5 hover:border-purple-500/40 text-[10px] font-mono transition-colors"
                      >
                        <Award className="w-3 h-3 text-purple-400" />
                        <span>Certificate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToProjects(item)}
                        className="col-span-2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/40 text-[10px] font-mono transition-colors"
                      >
                        <FolderGit2 className="w-3 h-3 text-indigo-400" />
                        <span>Add to Projects Showcase</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Hosting & Firebase Cloud Production Reference */}
      <div className="p-6 rounded-3xl bg-[#091024]/90 border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Render.com Live Hosting &amp; Firebase Cloud Checklist</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
            render.yaml Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5">
            <div className="font-mono font-bold text-cyan-400 uppercase text-[11px]">
              1. Render Static Site Settings
            </div>
            <p className="text-slate-400 leading-relaxed">
              In <span className="text-white font-semibold">dashboard.render.com</span>, create a <span className="text-cyan-300">New → Static Site</span> connected to your GitHub repo:
            </p>
            <ul className="font-mono text-[11px] text-slate-300 space-y-1 pt-1">
              <li>• Build Command: <code className="text-cyan-300">npm install &amp;&amp; npm run build</code></li>
              <li>• Publish Directory: <code className="text-cyan-300">dist</code></li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5">
            <div className="font-mono font-bold text-pink-400 uppercase text-[11px]">
              2. Authorize Render Domain in Firebase
            </div>
            <p className="text-slate-400 leading-relaxed">
              Once Render gives you your live URL (e.g. <code className="text-pink-300">your-site.onrender.com</code>):
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Open <span className="text-white font-semibold">Firebase Console → Authentication → Settings → Authorized domains</span> and add your <code className="text-pink-300">.onrender.com</code> domain so cloud operations work seamlessly on the live web.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5">
            <div className="font-mono font-bold text-emerald-400 uppercase text-[11px]">
              3. Permanent Cross-Device Storage
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every image uploaded here is stored directly in Google Firebase Cloud (not on Render&apos;s temporary container disk), ensuring your photos never disappear when Render redeploys or restarts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

