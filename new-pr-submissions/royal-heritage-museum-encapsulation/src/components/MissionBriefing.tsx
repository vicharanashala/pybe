import { ArrowRight, CheckCircle2, Lock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { ASSET_PATHS } from '../game/assets';
import { ARTIFACT_METADATA, MissionProgress, STAGES, StageId } from '../game/missionLogic';
import { MuseumImage } from './MuseumImage';

interface MissionBriefingProps {
  progress: MissionProgress;
  onStartInvestigation: () => void;
  onSelectStage: (stageId: StageId) => void;
}

export function MissionBriefing({
  progress,
  onStartInvestigation,
  onSelectStage,
}: MissionBriefingProps) {
  const completedCount = progress.completedStages.length;
  const totalStages = STAGES.length;
  const progressPct = Math.round((completedCount / totalStages) * 100);

  const currentStatus =
    progress.highestUnlockedStage >= 7
      ? 'SECURE'
      : progress.highestUnlockedStage >= 4
        ? 'VULNERABLE'
        : progress.highestUnlockedStage === 3
          ? 'BREACH ALERT'
          : 'INCIDENT PENDING';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <section className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Artifact Dossier */}
        <div className="lg:col-span-5 museum-case rounded-[24px] p-3 sm:p-4 overflow-hidden flex flex-col shadow-[0_24px_40px_rgba(63,73,61,0.12)]">
          <div className="museum-glass aspect-[4/3] relative overflow-hidden rounded-[18px]">
            <MuseumImage
              src={ASSET_PATHS.blueHeronVase}
              alt="Blue Heron Vase in Gallery 4, Case B"
              className="artifact-image w-full h-full object-cover object-center"
              fallbackTitle="Blue Heron Vase"
            />
            <div
              className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-[#C5A46D]/25"
              aria-hidden="true"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between rounded-b-[18px] bg-[#FAF7F0]/90">
            <div>
              <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#7F9274]">
                Artifact Dossier
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#3F493D] mt-1">
                {ARTIFACT_METADATA.artifact}
              </h1>
            </div>

            <dl className="divide-y divide-[#C8D5C4]/40 text-sm">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#7B8C79]">Artifact</dt>
                <dd className="font-medium text-[#3F493D]">{ARTIFACT_METADATA.artifact}</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#7B8C79]">Value</dt>
                <dd className="font-mono-code font-medium text-[#7F9274] tabular-nums">
                  {ARTIFACT_METADATA.value}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#7B8C79]">Condition</dt>
                <dd className="font-medium text-[#3F493D]">{ARTIFACT_METADATA.condition}</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#7B8C79]">Location</dt>
                <dd className="font-medium text-[#3F493D]">{ARTIFACT_METADATA.location}</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-[#7B8C79]">Curator ID</dt>
                <dd className="font-mono-code font-medium text-[#3F493D]">
                  {ARTIFACT_METADATA.curatorId}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right: Mission Objective, Status & Stages */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="museum-shell rounded-[22px] p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#7F9274]">
                Mission Briefing
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#3F493D]">
                Primary Mission Objective
              </h2>
              <p className="text-base sm:text-lg text-[#3F493D] leading-relaxed">
                Protect the Blue Heron Vase by understanding and securing its internal information.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#C8D5C4]/40">
              <div className="p-4 rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 space-y-1">
                <span className="text-xs text-[#7B8C79]">Security Status</span>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {currentStatus === 'SECURE' ? (
                    <ShieldCheck className="w-4 h-4 text-[#4A7C59]" aria-hidden="true" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                  )}
                  <span
                    className={
                      currentStatus === 'SECURE' ? 'text-[#4A7C59]' : 'text-[#FBBF24]'
                    }
                  >
                    {currentStatus}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#7B8C79]">
                  <span>Mission Progress</span>
                  <span className="tabular-nums text-[#3F493D] font-medium">
                    {completedCount}/{totalStages} Stages · {progressPct}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#D6E0D1] overflow-hidden">
                  <div
                    className="h-full bg-[#7F9274] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-[#3F493D]">
                Seven-Stage Investigation Roadmap
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {STAGES.map((stage) => {
                  const unlocked = stage.id <= progress.highestUnlockedStage;
                  const done = progress.completedStages.includes(stage.id);
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => onSelectStage(stage.id)}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border text-left transition-colors ${
                        unlocked
                          ? 'bg-[#E9EFE5] hover:bg-[#D6E0D1] border-[#A8BFA3]/40 cursor-pointer'
                          : 'bg-[#FAF7F0] border-[#C8D5C4]/20 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-[#7F9274] tabular-nums">
                          Stage {stage.id} · {stage.concept}
                        </p>
                        <p className="text-sm font-medium text-[#3F493D] truncate">
                          {stage.title}
                        </p>
                      </div>
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0" aria-hidden="true" />
                      ) : !unlocked ? (
                        <Lock className="w-4 h-4 text-[#7B8C79] shrink-0" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-[#7F9274] shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onStartInvestigation}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#7F9274] hover:bg-[#6B7E63] text-white font-semibold text-base transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>
                  {completedCount > 0 ? 'Continue Investigation' : 'Start Investigation'}
                </span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
