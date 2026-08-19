import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Card3D } from './Card3D';
import { RevealOnScroll } from './RevealOnScroll';
import { fireConfetti } from '../utils/confetti';
import { 
  Mail, 
  Phone, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  MapPin,
  ExternalLink
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { profile, sendMessage } = usePortfolio();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    sendMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    setSubmitted(true);
    fireConfetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });

    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 6000);
  };

  const whatsappClean = (profile.whatsapp || '0723519793').replace(/^0/, '');
  const whatsappUrl = `https://wa.me/250${whatsappClean}`;

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LET'S CONNECT</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Contact & Inquiries
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Have an exciting project, freelance opportunity, or technical discussion? Send a direct message below.
            </p>
          </RevealOnScroll>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Direct Contact Info Channels */}
          <div className="lg:col-span-5 space-y-6">
            <RevealOnScroll delay={100} direction="right">
              
              {/* WhatsApp Card */}
              <Card3D glowColor="cyan" className="mb-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block mb-0.5">
                      WhatsApp Direct
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {profile.whatsapp || '0723519793'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <span>Click to start instant WhatsApp chat</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </p>
                  </div>
                </a>
              </Card3D>

              {/* Email Card */}
              <Card3D glowColor="purple" className="mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 block mb-0.5">
                      Email Inquiries
                    </span>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white break-all">
                      {profile.email || 'irakozelionelsabin191@gmail.…'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct developer communication
                    </p>
                  </div>
                </div>
              </Card3D>

              {/* Location & Status Card */}
              <Card3D glowColor="blue">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.25)]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block mb-0.5">
                      Availability & Base
                    </span>
                    <h3 className="text-base font-heading font-bold text-white">
                      {profile.location || 'Rwanda 🇷🇼'}
                    </h3>
                    <p className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{profile.status || '✓ Open to Work'}</span>
                    </p>
                  </div>
                </div>
              </Card3D>

            </RevealOnScroll>
          </div>

          {/* Right Column: Floating Glass Contact Form */}
          <div className="lg:col-span-7">
            <RevealOnScroll delay={200} direction="left">
              <Card3D glowColor="pink" className="w-full">
                
                {submitted ? (
                  <div className="py-12 px-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-white">
                      Message Transmitted!
                    </h3>
                    <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you! Your message has been saved in Lionel Sabin's message center and notification feed.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-colors border border-cyan-500/30"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="border-b border-white/10 pb-4 mb-2">
                      <h3 className="text-xl font-heading font-bold text-white">
                        Send a Direct Message
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Fill out the details below to initiate contact.
                      </p>
                    </div>

                    {/* Sender Name */}
                    <div>
                      <label 
                        htmlFor="sender-name-input"
                        className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase tracking-wider"
                      >
                        Your Full Name *
                      </label>
                      <input
                        id="sender-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                      />
                    </div>

                    {/* Sender Email */}
                    <div>
                      <label 
                        htmlFor="sender-email-input"
                        className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase tracking-wider"
                      >
                        Your Email Address *
                      </label>
                      <input
                        id="sender-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. client@company.com"
                        className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <label 
                        htmlFor="sender-message-input"
                        className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase tracking-wider"
                      >
                        Project Details & Message *
                      </label>
                      <textarea
                        id="sender-message-input"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your web development requirements, timeline, or inquiry..."
                        className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 resize-none"
                      />
                    </div>

                    {/* Preserved / Exact Main CTA Button: Hire Me */}
                    <button
                      id="contact-hire-me-submit-btn"
                      type="submit"
                      className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Hire Me</span>
                    </button>

                  </form>
                )}

              </Card3D>
            </RevealOnScroll>
          </div>

        </div>

      </div>
    </section>
  );
};
