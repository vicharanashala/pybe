import Chakra from "../layout/Chakra";
import krishnaGuide from "../../assets/illustrations/krishna-guide.png";
import { useGuideNarration } from "./useGuideNarration";
import { Quote } from "lucide-react";

export default function KrishnaPanel() {
  const narration = useGuideNarration();

  return (
    <aside className="fixed left-0 top-[65px] h-[calc(100vh-65px)] w-[320px] hidden lg:flex flex-col z-20 border-r border-gold/20 shadow-2xl">
      {/* Full photo with ambient overlay */}
      <div className="relative h-[52%] w-full overflow-hidden group">
        <img
          src={krishnaGuide}
          alt="Krishna, your guide"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(10,15,29,0) 40%, rgba(10,15,29,0.95) 100%)",
          }}
        />
        <div className="gold-aura w-48 h-48 -bottom-10 left-10 opacity-40" />
      </div>

      {/* Glass content card */}
      <div className="glass-card-strong flex-1 -mt-14 relative px-6 py-6 flex flex-col justify-between border-t-0 rounded-t-3xl border-gold/30">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase font-semibold mb-3">
            <Chakra size={16} />
            Divine Guidance
          </div>
          <h3 className="font-semibold text-ink font-display text-xl tracking-tight mb-1 text-gold-gradient">
            Krishna
          </h3>
          <p className="text-muted text-xs mb-5">Your Eternal Companion on CodeGita</p>

          <div key={narration} className="animate-[fadeIn_0.6s_ease] bg-panel/70 border border-gold/20 rounded-2xl p-4 relative shadow-lg">
            <Quote size={20} className="text-gold/30 absolute top-3 right-3" />
            <div className="w-8 h-0.5 bg-vermilion mb-3 rounded-full" />
            <p className="text-mutedSoft text-[14px] leading-relaxed italic font-display pr-3">
              {narration}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-line/60 flex items-center justify-between text-[11px] text-muted font-sans">
          <span>Module: Python Exceptions</span>
          <span className="text-gold font-semibold">Gita Wisdom</span>
        </div>
      </div>
    </aside>
  );
}