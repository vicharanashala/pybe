import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Compass, BookOpen, Layers, Award, X } from "lucide-react";
import { useProgress } from "../../progress/useProgress";
import { LESSONS } from "../../learning/lessons/registry";
import { useGuideNarration } from "../guide/useGuideNarration";
import Chakra from "./Chakra";
import krishnaGuide from "../../assets/illustrations/krishna-guide.png";

export default function Navbar() {
  const location = useLocation();
  const { completedCount } = useProgress();
  const narration = useGuideNarration();
  const [mobileKrishnaOpen, setMobileKrishnaOpen] = useState(false);
  const total = LESSONS.length;
  const progressPercent = Math.round((completedCount / total) * 100);

  const navLinks = [
    { path: "/", label: "Home", icon: Sparkles },
    { path: "/intro", label: "Story", icon: BookOpen },
    { path: "/foundations", label: "Foundations", icon: Layers },
    { path: "/path", label: "Lessons", icon: Compass },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full glass-card-strong border-b border-gold/20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-105 group-hover:border-gold transition-all shadow-md">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-wide text-gold-gradient">CodeGita</span>
            <span className="text-[10px] text-muted block -mt-1 font-sans">Python Exceptions</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-panel/60 p-1.5 rounded-full border border-line">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? "bg-gold text-bg shadow-md"
                    : "text-mutedSoft hover:text-ink hover:bg-gold/10"
                }`}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Progress pill & Mobile Krishna toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/path"
            className="hidden sm:flex items-center gap-2.5 bg-panel/70 border border-gold/25 rounded-full px-3.5 py-1.5 hover:border-gold/60 transition-all"
          >
            <Award size={15} className="text-gold" />
            <div className="text-left">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-ink">
                <span>{completedCount}/{total}</span>
                <span className="text-muted text-[10px]">({progressPercent}%)</span>
              </div>
              <div className="w-16 h-1 bg-line rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </Link>

          {/* Mobile Krishna Guide Button */}
          <button
            onClick={() => setMobileKrishnaOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
          >
            <Chakra size={16} />
            <span>Guide</span>
          </button>
        </div>
      </header>

      {/* Mobile Krishna Guide Modal Drawer */}
      {mobileKrishnaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md animate-[fadeIn_0.3s_ease]">
          <div className="glass-card-strong max-w-md w-full rounded-3xl overflow-hidden border border-gold/40 shadow-2xl relative">
            <button
              onClick={() => setMobileKrishnaOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-bg/80 border border-gold/30 flex items-center justify-center text-muted hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>

            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={krishnaGuide}
                alt="Krishna Guide"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-transparent" />
            </div>

            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-semibold mb-2">
                <Chakra size={16} /> Krishna Speaks
              </div>
              <h3 className="text-xl font-display font-semibold text-ink mb-4">Your Spiritual Guide</h3>
              <div className="bg-panel/70 border border-gold/20 rounded-2xl p-4 mb-5 text-left">
                <p className="text-mutedSoft text-sm leading-relaxed italic font-display">
                  {narration}
                </p>
              </div>

              <button
                onClick={() => setMobileKrishnaOpen(false)}
                className="w-full bg-gold text-bg font-semibold py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
