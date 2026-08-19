import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { 
  FolderGit2, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Upload, 
  ExternalLink, 
  Github, 
  Star, 
  X, 
  Check, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { Project } from '../../types';

export const ProjectManager: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [image, setImage] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [category, setCategory] = useState('Web App');
  const [featured, setFeatured] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setTechnologies('');
    setImage('');
    setGithubUrl('');
    setLiveDemoUrl('');
    setCategory('Web App');
    setFeatured(false);
    setEditingProject(null);
    setIsProcessingImage(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
    setTechnologies(project.technologies.join(', '));
    setImage(project.image || '');
    setGithubUrl(project.githubUrl || '');
    setLiveDemoUrl(project.liveDemoUrl || '');
    setCategory(project.category || 'Web App');
    setFeatured(project.featured);
    setIsProcessingImage(false);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingImage(true);
        const optimized = await optimizeImage(file, 1280, 1280, 0.82);
        setImage(optimized);
      } catch (err) {
        console.error('Project image compression error:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const techArray = technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const projectPayload = {
      name: name.trim(),
      description: description.trim(),
      technologies: techArray.length > 0 ? techArray : ['Web Development'],
      image: image.trim(),
      githubUrl: githubUrl.trim() || undefined,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      category: category.trim() || 'Web App',
      featured
    };

    if (editingProject) {
      updateProject(editingProject.id, projectPayload);
    } else {
      addProject(projectPayload);
    }

    setModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Projects Gallery Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Create, update, feature, and showcase your live software applications.
          </p>
        </div>

        <button
          id="admin-btn-add-project"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:opacity-95 transition-opacity shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0b1328]/70 border border-white/10 p-8">
          <FolderGit2 className="w-12 h-12 mx-auto mb-3 text-cyan-400 opacity-50" />
          <h3 className="text-lg font-heading font-bold text-white">
            No projects in database
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
            Click "Add Project" above to create your first featured software project.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
          >
            + Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 transition-all shadow-md"
            >
              <div>
                {/* Image Preview */}
                <div className="aspect-video rounded-xl bg-slate-900 overflow-hidden mb-4 relative border border-white/5">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-400/50">
                      <FolderGit2 className="w-8 h-8" />
                    </div>
                  )}

                  {project.featured && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500 text-white font-bold flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {project.name}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      title="GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-cyan-300"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-semibold"
                    title="Edit Project"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 text-xs"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-2xl rounded-3xl bg-[#0b1328] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl font-heading font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Modern School Management System"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Full Stack / PHP & MySQL / React"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the application features, architecture, and problem solved..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="e.g. PHP, MySQL, JavaScript, Tailwind CSS"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              {/* Project Image Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 uppercase">
                  Project Cover Image (Upload or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Paste Image link or upload local file..."
                    className="flex-1 px-4 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="file"
                    id="project-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="project-image-upload"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/40 hover:to-blue-500/40 text-xs font-bold text-cyan-200 border border-cyan-500/50 cursor-pointer flex items-center gap-1.5 shrink-0 transition-all shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </label>
                </div>

                {/* LIVE PREVIEW */}
                {image && (
                  <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Project Preview (Review before saving):
                      </span>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
                      <img
                        src={image}
                        alt="Project Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-xs font-mono text-slate-200">
                    Mark as Featured Project
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:opacity-95"
                >
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
