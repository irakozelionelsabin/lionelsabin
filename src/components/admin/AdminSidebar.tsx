import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  Settings, 
  Layers,
  Sparkles,
  Film,
  FolderGit2, 
  Image as ImageIcon, 
  Quote, 
  GraduationCap, 
  Award, 
  Mail, 
  Eye, 
  Compass, 
  X,
  ChevronRight
} from 'lucide-react';
import { AdminView } from '../../types';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { 
    activeAdminView, 
    setActiveAdminView, 
    setAdminOpen, 
    messages, 
    certificates,
    profile 
  } = usePortfolio();

  const unreadCount = messages.filter(m => !m.read).length;

  const sidebarItems: Array<{
    id: AdminView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Logo', icon: UserCheck },
    { id: 'header-tabs', label: 'Nav Header Tabs', icon: Layers },
    { id: 'hero-tabs', label: 'Hero Feature Tabs', icon: Sparkles },
    { id: 'intro-video', label: 'Starting Intro Video', icon: Film },
    { id: 'certificates', label: 'Certificates (Upload Multiple)', icon: Award, badge: certificates.length },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'projects', label: 'Projects Gallery', icon: FolderGit2 },
    { id: 'gallery', label: 'Photo Gallery 2', icon: ImageIcon },
    { id: 'school-photos', label: 'School Photos', icon: GraduationCap },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
  ];

  const handleSelectView = (view: AdminView) => {
    setActiveAdminView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const handleViewSite = () => {
    setAdminOpen(false);
    if (onCloseMobile) onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewGallery = () => {
    setAdminOpen(false);
    if (onCloseMobile) onCloseMobile();
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside 
      id="admin-sidebar"
      className="w-64 sm:w-72 bg-[#080e22]/95 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col justify-between h-full z-40"
    >
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.logoImage ? (
              <img
                src={profile.logoImage}
                alt="Logo"
                className="h-8 w-auto max-w-[100px] object-contain drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 p-[1.5px]">
                <div className="w-full h-full bg-[#091026] rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 text-xs">
                    {profile.logoText || 'LS'}
                  </span>
                </div>
              </div>
            )}
            <div>
              <h2 className="font-heading font-bold text-white text-sm">
                Admin Console
              </h2>
              <span className="text-[10px] font-mono text-cyan-400">
                Lionel Sabin Control
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminView === item.id;

            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-pink-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Public Navigation Links */}
      <div className="p-3 border-t border-white/10 space-y-1.5">
        <button
          id="admin-btn-view-site"
          onClick={handleViewSite}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/30 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Site</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        <button
          id="admin-btn-view-gallery"
          onClick={handleViewGallery}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-pink-500/30 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-3.5 h-3.5 text-pink-400" />
            <span>View Gallery</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </aside>
  );
};
