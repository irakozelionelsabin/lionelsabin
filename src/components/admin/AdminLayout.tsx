import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { ProfileManager } from './ProfileManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { ProjectManager } from './ProjectManager';
import { GalleryManager } from './GalleryManager';
import { SchoolPhotoManager } from './SchoolPhotoManager';
import { TestimonialManager } from './TestimonialManager';
import { CertificateManager } from './CertificateManager';
import { MessageManager } from './MessageManager';
import { HeaderTabsManager } from './HeaderTabsManager';
import { HeroTabsManager } from './HeroTabsManager';
import { IntroVideoManager } from './IntroVideoManager';
import { 
  X, 
  Menu, 
  Eye, 
  Sliders, 
  RotateCcw,
  Sparkles,
  Film,
  ExternalLink,
  LayoutDashboard,
  UserCheck,
  Layers,
  Settings,
  FolderGit2,
  Image as ImageIcon,
  Quote,
  GraduationCap,
  Award,
  Mail
} from 'lucide-react';
import { AdminView } from '../../types';

export const AdminLayout: React.FC = () => {
  const { 
    adminOpen, 
    setAdminOpen, 
    activeAdminView, 
    setActiveAdminView,
    profile, 
    messages,
    certificates,
    resetToDefaults 
  } = usePortfolio();
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!adminOpen) return null;

  const unreadCount = messages.filter(m => !m.read).length;

  const navItems: Array<{
    id: AdminView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: certificates.length },
    { id: 'header-tabs', label: 'Nav Tabs', icon: Layers },
    { id: 'hero-tabs', label: 'Hero Tabs', icon: Sparkles },
    { id: 'intro-video', label: 'Intro Video', icon: Film },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'gallery', label: 'Gallery 2', icon: ImageIcon },
    { id: 'school-photos', label: 'School', icon: GraduationCap },
    { id: 'testimonials', label: 'Reviews', icon: Quote },
    { id: 'messages', label: 'Inbox', icon: Mail, badge: unreadCount },
  ];

  const renderActiveView = () => {
    switch (activeAdminView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'profile':
        return <ProfileManager />;
      case 'header-tabs':
        return <HeaderTabsManager />;
      case 'hero-tabs':
        return <HeroTabsManager />;
      case 'intro-video':
        return <IntroVideoManager />;
      case 'settings':
        return <SiteSettingsManager />;
      case 'projects':
        return <ProjectManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'testimonials':
        return <TestimonialManager />;
      case 'school-photos':
        return <SchoolPhotoManager />;
      case 'certificates':
        return <CertificateManager />;
      case 'messages':
        return <MessageManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div 
      id="admin-panel-overlay"
      className="fixed inset-0 z-50 flex bg-black/95 backdrop-blur-2xl text-slate-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full max-w-[280px] w-full">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* Admin Top Navigation Bar */}
        <header className="h-14 sm:h-16 px-2.5 sm:px-6 border-b border-cyan-500/20 bg-[#070c1d]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)] shrink-0"></span>
              <span className="font-orbitron font-bold text-xs sm:text-base text-white tracking-wide truncate">
                Admin Panel <span className="hidden md:inline font-mono font-normal text-xs text-cyan-300">• Lionel Sabin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Reset to initial data */}
            <button
              onClick={() => {
                if (window.confirm('Reset all portfolio state to Lionel Sabin initial data?')) {
                  resetToDefaults();
                }
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-white/10 hover:border-white/20 transition-all"
              title="Reset state to initial defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Exit Admin & View Live Site */}
            <button
              id="admin-exit-view-site-btn"
              onClick={() => setAdminOpen(false)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:opacity-90 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Site</span>
              <span className="sm:hidden">Site</span>
            </button>

            <button
              onClick={() => setAdminOpen(false)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors"
              aria-label="Close Admin"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Horizontal Quick Navigation Bar (Tabs for phone view) */}
        <div className="lg:hidden bg-[#050a1c] border-b border-white/10 px-2 py-1.5 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminView(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-pink-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-2.5 sm:p-6 lg:p-8 relative">
          {/* Subtle glow background */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-6xl mx-auto pb-12">
            {renderActiveView()}
          </div>
        </main>

      </div>
    </div>
  );
};
