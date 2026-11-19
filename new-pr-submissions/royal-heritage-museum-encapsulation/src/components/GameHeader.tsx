import { Lock, Check, ShieldAlert, ShieldCheck, RotateCcw, FileText } from 'lucide-react';
import { STAGES, SecurityStatus, StageId } from '../game/missionLogic';

interface GameHeaderProps {
  activeStage: StageId;
  highestUnlockedStage: StageId;
  completedStages: StageId[];
  currentScreen: 'briefing' | 'stage' | 'victory';
  securityStatus: SecurityStatus;
  onSelectStage: (stage: StageId) => void;
  onOpenBriefing: () => void;
  onResetMission: () => void;
}

export function GameHeader({
  activeStage,
  highestUnlockedStage,
  completedStages,
  currentScreen,
  securityStatus,
  onSelectStage,
  onOpenBriefing,
  onResetMission,
}: GameHeaderProps) {
  const isAlert = securityStatus === 'BREACH ALERT' || securityStatus === 'VULNERABLE';
  const isSecure = securityStatus === 'SECURE' || securityStatus === 'PROTECTED';

  return (
    <header className="sticky top-0 z-30 border-b border-[#A8BFA3]/30 bg-[#FAF7F0]/90 px-4 sm:px-6 py-2.5 shadow-[0_10px_30px_rgba(63,73,61,0.06)] backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto flex flex-wrap xl:flex-nowrap items-center justify-between gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenBriefing}
          className="font-display text-sm sm:text-base font-semibold tracking-[0.12em] uppercase text-[#3F493D] hover:text-[#7F9274] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-[#7F9274] rounded cursor-pointer"
        >
          Royal Heritage Museum
        </button>

        <nav aria-label="Mission Stages" className="order-3 xl:order-2 w-full xl:w-auto flex items-center gap-1.5 overflow-x-auto py-0.5">
          {STAGES.map((stage) => {
            const isUnlocked = stage.id <= highestUnlockedStage;
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent =
              (currentScreen === 'stage' && activeStage === stage.id) ||
              (currentScreen === 'victory' && stage.id === 7);

            return (
              <button
                key={stage.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onSelectStage(stage.id)}
                aria-label={`Stage ${stage.id}: ${stage.title}${!isUnlocked ? ' (Locked)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#7F9274] ${
                  isCurrent
                    ? 'bg-[#7F9274] text-white font-semibold shadow-[0_10px_20px_rgba(127,146,116,0.25)]'
                    : isUnlocked
                      ? 'bg-[#E9EFE5] text-[#3F493D] hover:bg-[#D6E0D1] border border-[#A8BFA3]/40'
                      : 'bg-[#F0EDE6] text-[#7B8C79] border border-[#C8D5C4]/20 cursor-not-allowed'
                }`}
              >
                <span className="tabular-nums">{stage.id}</span>
                <span className="hidden md:inline">{stage.shortTitle}</span>
                {!isUnlocked ? (
                  <Lock className="w-3 h-3 opacity-60" aria-hidden="true" />
                ) : isCompleted && !isCurrent ? (
                  <Check className="w-3 h-3 text-[#4A7C59]" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="order-2 xl:order-3 flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className={`hidden sm:flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap ${
              isAlert
                ? 'text-[#A85D5D]'
                : isSecure
                  ? 'text-[#4A7C59]'
                  : 'text-[#7F9274]'
            }`}
          >
            {isAlert ? (
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>Status: {securityStatus}</span>
          </div>

          <button
            type="button"
            onClick={onOpenBriefing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-[#E9EFE5] text-[#3F493D] hover:bg-[#D6E0D1] border border-[#A8BFA3]/40 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#7F9274]" aria-hidden="true" />
            <span>Briefing</span>
          </button>

          <button
            type="button"
            onClick={onResetMission}
            aria-label="Reset mission progress"
            className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium text-[#7B8C79] hover:text-[#3F493D] hover:bg-[#E9EFE5] border border-[#C8D5C4]/40 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
