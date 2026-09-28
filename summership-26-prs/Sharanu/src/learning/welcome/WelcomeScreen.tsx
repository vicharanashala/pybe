import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PrimaryButton from "../../shared-components/ui/PrimaryButton";

export default function WelcomeScreen() {
  return (
    <div className="max-w-3xl mx-auto text-center animate-[fadeIn_0.6s_ease] w-full px-2">
      <style>{`
        @keyframes cardShine {
          0% { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        .dark-blue-card {
          background: linear-gradient(135deg, #0a1128 0%, #131b3a 45%, #1e2f6b 100%);
        }
        .dark-blue-card .shine-sweep {
          position: absolute;
          top: 0;
          left: 0;
          width: 35%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.25), transparent);
          animation: cardShine 3.5s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      <div className="dark-blue-card rounded-3xl px-6 py-12 sm:px-12 sm:py-16 border border-blue-400/30 shadow-[0_0_40px_rgba(30,58,138,0.5)] relative overflow-hidden">
        <div className="shine-sweep" />

        {/* Background ambient glowing aura */}
        <div className="gold-aura w-72 h-72 -top-20 -left-20 opacity-20" />
        <div className="gold-aura w-64 h-64 -bottom-20 -right-20 opacity-20" />

        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl text-white leading-[1.15] mb-6 font-display font-semibold drop-shadow-xl tracking-tight">
            Welcome to <span className="text-gold-gradient font-bold">PyBE</span>
          </h1>

          <p className="text-blue-100/80 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Enjoy and learn the story of CodeGita.
          </p>

          <Link to="/foundations">
            <PrimaryButton tone="vermilion">
              Begin Journey <ArrowRight size={18} />
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}