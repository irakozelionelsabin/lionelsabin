import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Reply, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';

export const MessageManager: React.FC = () => {
  const { messages, toggleMessageRead, deleteMessage } = usePortfolio();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          Messages & Communication Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Review, mark, reply, and organize inquiries sent through the contact portal.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0b1328]/70 border border-white/10 p-8">
          <Mail className="w-12 h-12 mx-auto mb-3 text-cyan-400 opacity-40" />
          <h3 className="text-lg font-heading font-bold text-white">
            No messages yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When visitors use the contact form to reach out, their messages will immediately populate here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                !msg.read
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                  : 'bg-[#0b1328]/80 border-white/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold font-mono">
                    {msg.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-white">
                        {msg.name}
                      </h3>
                      {!msg.read && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-pink-500 text-white font-bold animate-pulse">
                          Unread
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-cyan-300">
                      {msg.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{msg.date}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 mb-4">
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              </div>

              {/* Actions Bar: Read, Unread, Reply, Delete */}
              <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMessageRead(msg.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      msg.read
                        ? 'bg-slate-800 text-slate-300 border-white/10 hover:border-cyan-400'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                  >
                    {msg.read ? (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Read</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=Regarding your message to Lionel Sabin Irakoza&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out.%0D%0A%0D%0ABest regards,%0D%0ALionel Sabin Irakoza`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:opacity-90 transition-opacity"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
