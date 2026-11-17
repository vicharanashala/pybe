import React from 'react';
import { Sparkles, Lightbulb, CheckCircle2, AlertCircle, Compass, HelpCircle } from 'lucide-react';

export default function CompanionGuide({ 
  type = 'intro', 
  title, 
  message, 
  onAction, 
  actionLabel,
  compact = false 
}) {
  if (!message) return null;

  const getThemeConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/90 border-emerald-300',
          accent: 'bg-emerald-500 text-white',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 size={20} className="text-emerald-600" />,
          defaultTitle: 'Splendid Job!',
          avatarBg: 'from-emerald-400 to-teal-500',
          avatarEye: '😊'
        };
      case 'hint':
      case 'error':
        return {
          bg: 'bg-amber-50/95 border-amber-300',
          accent: 'bg-amber-500 text-white',
          badge: 'bg-amber-100 text-amber-900 border-amber-200',
          icon: <Lightbulb size={20} className="text-amber-600 animate-pulse" />,
          defaultTitle: 'Companion Tip',
          avatarBg: 'from-amber-400 to-orange-500',
          avatarEye: '🤔'
        };
      case 'concept':
        return {
          bg: 'bg-teal-50/95 border-teal-300',
          accent: 'bg-teal-600 text-white',
          badge: 'bg-teal-100 text-teal-900 border-teal-200',
          icon: <Compass size={20} className="text-teal-600" />,
          defaultTitle: 'Concept Unlocked',
          avatarBg: 'from-teal-400 to-cyan-500',
          avatarEye: '💡'
        };
      default:
        return {
          bg: 'bg-orange-50/95 border-orange-200',
          accent: 'bg-[#C85A32] text-white',
          badge: 'bg-orange-100 text-orange-900 border-orange-200',
          icon: <Sparkles size={20} className="text-orange-600" />,
          defaultTitle: 'PyBe Companion',
          avatarBg: 'from-orange-400 to-amber-500',
          avatarEye: '✨'
        };
    }
  };

  const config = getThemeConfig();

  return (
    <div className={`transition-all duration-300 ease-out transform animate-fade-in ${compact ? 'my-2' : 'my-4'}`}>
      <div className={`relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border shadow-md backdrop-blur-sm ${config.bg}`}>
        
        {/* Companion Avatar */}
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${config.avatarBg} flex items-center justify-center shadow-md ring-4 ring-white transform hover:rotate-6 transition-transform`}>
            <span className="text-2xl select-none" role="img" aria-label="avatar">
              {config.avatarEye}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
            {config.icon}
          </div>
        </div>

        {/* Speech Bubble / Dialogue Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${config.badge}`}>
                {title || config.defaultTitle}
              </span>
            </div>
          </div>
          
          <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed mt-1">
            {message}
          </p>

          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className={`mt-3 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 ${config.accent}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
