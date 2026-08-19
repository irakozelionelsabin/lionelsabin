import React, { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { LiquidBackground } from './components/LiquidBackground';
import { LogoPreloader } from './components/LogoPreloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificatesSection } from './components/CertificatesSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CertificateModal } from './components/CertificateModal';
import { PhotoModal } from './components/PhotoModal';
import { AdminLayout } from './components/admin/AdminLayout';

export default function App() {
  return (
    <PortfolioProvider>
      {/* Spectacular Dynamic Logo Loading Preloader Animation */}
      <LogoPreloader />

      <div className="relative min-h-screen bg-transparent text-slate-100 selection:bg-cyan-400 selection:text-black">
        {/* Persistent Vivid Hard-Light Liquid 3D Background */}
        <LiquidBackground />

        {/* Top 4-Portal Navigation Bar with Profile Avatar */}
        <Navbar />

        {/* Public Portfolio 4 Main Portals */}
        <main className="relative z-10 space-y-4">
          
          {/* ======================================================== */}
          {/* PORTAL 1: HOME (Futuristic 3D Mirror Glass Dashboard)   */}
          {/* ======================================================== */}
          <div id="home-portal-wrapper">
            <Hero />
          </div>

          {/* ======================================================== */}
          {/* PORTAL 2: ABOUT ME (Profile Picture, Education & Certs) */}
          {/* ======================================================== */}
          <div id="aboutme-portal-wrapper" className="space-y-4">
            <AboutSection />
            <CertificatesSection />
          </div>

          {/* ======================================================== */}
          {/* PORTAL 3: MY SKILLS (3 Tabs: Frontend, Backend, Others) */}
          {/* ======================================================== */}
          <div id="myskills-portal-wrapper" className="space-y-4">
            <SkillsSection />
            <ProjectsSection />
            <GallerySection />
            <TestimonialsSection />
          </div>

          {/* ======================================================== */}
          {/* PORTAL 4: CONTACT (Direct WhatsApp, Email & Hire Form)   */}
          {/* ======================================================== */}
          <div id="contact-portal-wrapper">
            <ContactSection />
          </div>

        </main>

        {/* Footer with Shiny Refraction & Admin Portal Icon */}
        <Footer />

        {/* Interactive Modals */}
        <CertificateModal />
        <PhotoModal />

        {/* Full Admin Content Management System */}
        <AdminLayout />
      </div>
    </PortfolioProvider>
  );
}
