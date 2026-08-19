import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  FolderGit2, 
  Image as ImageIcon, 
  Users, 
  Mail, 
  Upload, 
  PlusCircle, 
  Settings, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Eye,
  Trash2,
  Award
} from 'lucide-react';
import { AdminView } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    projects, 
    gallery, 
    schoolPhotos, 
    testimonials, 
    messages, 
    certificates,
    setActiveAdminView, 
    toggleMessageRead, 
    deleteMessage 
  } = usePortfolio();

  const unreadCount = messages.filter(m => !m.read).length;
  const totalGalleryCount = gallery.length + schoolPhotos.length;

  const quickActions: Array<{
    label: string;
    view: AdminView;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    { label: 'Upload Certificates', view: 'certificates', icon: Award, color: 'from-purple-500 via-pink-600 to-cyan-500' },
    { label: 'Upload Photo', view: 'school-photos', icon: Upload, color: 'from-cyan-500 to-blue-600' },
    { label: 'Add Project', view: 'projects', icon: PlusCircle, color: 'from-blue-600 to-indigo-600' },
    { label: 'Add Gallery Photo', view: 'gallery', icon: ImageIcon, color: 'from-pink-500 to-rose-600' },
    { label: 'Add Testimonial', view: 'testimonials', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Site Settings', view: 'settings', icon: Settings, color: 'from-slate-700 to-slate-800' },
  ];

  return (
    <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-heading font-bold text-white">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1 font-mono">
          Overview of IRAKOZE Lionel Sabin's portfolio content & activity.
        </p>
      </div>

      {/* 5 Statistics Cards (Adaptive Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        
        {/* Stat 1: Certificates (Highlighted) */}
        <div 
          onClick={() => setActiveAdminView('certificates')}
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-950/60 via-[#0b1328]/90 to-pink-950/40 backdrop-blur-xl border border-purple-500/40 hover:border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.2)] cursor-pointer transition-all hover:-translate-y-0.5 group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono text-purple-300 uppercase tracking-wider font-bold">Certificates</span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-orbitron font-extrabold text-white">
            {certificates.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-purple-300 font-mono mt-0.5 sm:mt-1 block truncate">
            + Upload Multiple
          </span>
        </div>

        {/* Stat 2: Projects */}
        <div 
          onClick={() => setActiveAdminView('projects')}
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">Projects</span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-heading font-extrabold text-white">
            {projects.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-cyan-400/80 font-mono mt-0.5 sm:mt-1 block truncate">
            Projects & code
          </span>
        </div>

        {/* Stat 3: Gallery Photos */}
        <div 
          onClick={() => setActiveAdminView('gallery')}
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-pink-500/20 hover:border-pink-400/50 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">Gallery</span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-heading font-extrabold text-white">
            {totalGalleryCount}
          </div>
          <span className="text-[10px] sm:text-[11px] text-pink-400/80 font-mono mt-0.5 sm:mt-1 block truncate">
            {gallery.length} Gal, {schoolPhotos.length} School
          </span>
        </div>

        {/* Stat 4: Testimonials */}
        <div 
          onClick={() => setActiveAdminView('testimonials')}
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/50 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">Reviews</span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-heading font-extrabold text-white">
            {testimonials.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-purple-400/80 font-mono mt-0.5 sm:mt-1 block truncate">
            Client feedback
          </span>
        </div>

        {/* Stat 5: Unread Messages */}
        <div 
          onClick={() => setActiveAdminView('messages')}
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/50 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">Messages</span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>{unreadCount}</span>
            {unreadCount > 0 && (
              <span className="text-[9px] sm:text-xs font-mono px-1.5 py-0.2 rounded-full bg-pink-500 text-white font-semibold animate-pulse">
                New
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-400/80 font-mono mt-0.5 sm:mt-1 block truncate">
            {messages.length} total messages
          </span>
        </div>

      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-base sm:text-lg font-heading font-bold text-white mb-2.5 sm:mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveAdminView(action.view)}
                className="p-2.5 sm:p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-cyan-400/40 text-left transition-all duration-200 group flex flex-col justify-between h-20 sm:h-28"
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="font-heading font-semibold text-[11px] sm:text-sm text-slate-200 group-hover:text-white truncate">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Messages Section */}
      <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0b1328]/80 backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between mb-3 sm:mb-5 border-b border-white/10 pb-3 sm:pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-heading font-bold text-white">
              Recent Messages
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Direct inquiries submitted from the public portfolio contact form.
            </p>
          </div>
          <button
            onClick={() => setActiveAdminView('messages')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-mono text-xs sm:text-sm">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-40 text-cyan-400" />
            <p className="font-semibold text-slate-300">No messages yet.</p>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              Messages submitted from the "Hire Me" contact form will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {messages.slice(0, 4).map((msg) => (
              <div
                key={msg.id}
                className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 ${
                  !msg.read 
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                    : 'bg-slate-900/60 border-white/5'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-xs sm:text-sm text-white">
                      {msg.name}
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-cyan-300 truncate">
                      ({msg.email})
                    </span>
                    {!msg.read && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-pink-500 text-white font-bold">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 sm:line-clamp-1">
                    {msg.message}
                  </p>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {msg.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => toggleMessageRead(msg.id)}
                    className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-semibold"
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${msg.read ? 'text-slate-500' : 'text-cyan-400'}`} />
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 text-xs"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
