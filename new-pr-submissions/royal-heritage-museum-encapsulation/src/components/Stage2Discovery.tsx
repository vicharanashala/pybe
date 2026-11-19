import { useState } from 'react';
import { Check, FolderOpen, AlertCircle } from 'lucide-react';
import { STAGE2_SLIPS } from '../game/missionLogic';

interface Stage2DiscoveryProps {
  assignedRecords: Record<string, 'vase' | 'astrolabe'>;
  onAssignRecord: (slipId: string, target: 'vase' | 'astrolabe') => void;
}

export function Stage2Discovery({
  assignedRecords,
  onAssignRecord,
}: Stage2DiscoveryProps) {
  const [selectedSlipId, setSelectedSlipId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const tryAssign = (slipId: string, target: 'vase' | 'astrolabe') => {
    const slip = STAGE2_SLIPS.find((s) => s.id === slipId);
    if (!slip) return;

    if (slip.target === target) {
      onAssignRecord(slipId, target);
      setSelectedSlipId(null);
      setFeedback({
        type: 'success',
        text: `Placed "${slip.text}" into the ${
          target === 'vase' ? 'Blue Heron Vase' : 'Ivory Astrolabe'
        } folder. Grouping related data prevents mix-ups.`,
      });
    } else {
      setFeedback({
        type: 'error',
        text: `"${slip.text}" belongs to the ${
          slip.target === 'vase' ? 'Blue Heron Vase' : 'Ivory Astrolabe'
        }, not the ${target === 'vase' ? 'Blue Heron Vase' : 'Ivory Astrolabe'}.`,
      });
    }
  };

  const unassignedSlips = STAGE2_SLIPS.filter(
    (slip) => assignedRecords[slip.id] !== slip.target
  );

  const vaseSlips = STAGE2_SLIPS.filter((s) => assignedRecords[s.id] === 'vase');
  const astrolabeSlips = STAGE2_SLIPS.filter((s) => assignedRecords[s.id] === 'astrolabe');

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Loose Museum Notes */}
        <div className="lg:col-span-5 rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#3F493D]">
              Loose Museum Notes
            </h2>
            <span className="text-xs text-[#7B8C79] tabular-nums">
              {unassignedSlips.length} remaining
            </span>
          </div>

          <p className="text-xs text-[#7B8C79]">
            Select a loose note (or drag it) and place it into the matching artifact folder.
          </p>

          {unassignedSlips.length === 0 ? (
            <div className="rounded-lg bg-[#D6EDE0] border border-[#4A7C59]/40 p-4 text-sm text-[#4A7C59] flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>All notes are neatly grouped inside their artifact folders!</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {unassignedSlips.map((slip) => {
                const isSelected = selectedSlipId === slip.id;
                return (
                  <button
                    key={slip.id}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', slip.id);
                      setSelectedSlipId(slip.id);
                    }}
                    onClick={() => setSelectedSlipId(slip.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#E9EFE5] border-[#7F9274] text-[#3F493D]'
                        : 'bg-[#E9EFE5] border-[#C8D5C4]/40 text-[#3F493D] hover:border-[#A8BFA3]/40'
                    }`}
                  >
                    <div>
                      <span className="text-xs text-[#7B8C79] block">{slip.field}</span>
                      <span className="text-sm font-medium">{slip.text}</span>
                    </div>
                    <span className="text-xs text-[#7F9274] shrink-0">
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {feedback && (
            <div
              aria-live="polite"
              className={`rounded-lg p-3.5 text-xs sm:text-sm flex items-start gap-2 border ${
                feedback.type === 'success'
                  ? 'bg-[#D6EDE0] border-[#4A7C59]/40 text-[#3F493D]'
                  : 'bg-[#2A1215] border-[#F87171]/35 text-[#FECACA]'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>

        {/* Structured Folders */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
          {/* Blue Heron Vase Folder */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const slipId = e.dataTransfer.getData('text/plain');
              if (slipId) tryAssign(slipId, 'vase');
            }}
            className="rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#7F9274]" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-[#3F493D]">
                  Blue Heron Vase
                </h3>
              </div>
              <span className="text-xs text-[#7B8C79] tabular-nums">{vaseSlips.length}/3</span>
            </div>

            <button
              type="button"
              disabled={!selectedSlipId}
              onClick={() => selectedSlipId && tryAssign(selectedSlipId, 'vase')}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                selectedSlipId
                  ? 'bg-[#7F9274] text-white hover:bg-[#6B7E63] cursor-pointer'
                  : 'bg-[#E9EFE5] text-[#7B8C79] border border-[#C8D5C4]/20 cursor-default'
              }`}
            >
              {selectedSlipId ? 'Place Selected Note Here' : 'Select a note to place here'}
            </button>

            <div className="space-y-2 min-h-[132px]">
              {vaseSlips.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-[#E9EFE5] border border-[#4A7C59]/25 text-xs"
                >
                  <span className="text-[#7B8C79]">{s.field}</span>
                  <span className="font-medium text-[#3F493D]">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ivory Astrolabe Folder */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const slipId = e.dataTransfer.getData('text/plain');
              if (slipId) tryAssign(slipId, 'astrolabe');
            }}
            className="rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#7F9274]" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-[#3F493D]">
                  Ivory Astrolabe
                </h3>
              </div>
              <span className="text-xs text-[#7B8C79] tabular-nums">{astrolabeSlips.length}/3</span>
            </div>

            <button
              type="button"
              disabled={!selectedSlipId}
              onClick={() => selectedSlipId && tryAssign(selectedSlipId, 'astrolabe')}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                selectedSlipId
                  ? 'bg-[#7F9274] text-white hover:bg-[#6B7E63] cursor-pointer'
                  : 'bg-[#E9EFE5] text-[#7B8C79] border border-[#C8D5C4]/20 cursor-default'
              }`}
            >
              {selectedSlipId ? 'Place Selected Note Here' : 'Select a note to place here'}
            </button>

            <div className="space-y-2 min-h-[132px]">
              {astrolabeSlips.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-[#E9EFE5] border border-[#4A7C59]/25 text-xs"
                >
                  <span className="text-[#7B8C79]">{s.field}</span>
                  <span className="font-medium text-[#3F493D]">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Organizing Related Information Matters */}
      <section className="rounded-xl border border-[#C8D5C4]/40 bg-[#E9EFE5] p-5 grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#7F9274]">
            Why Grouping Related Information Matters
          </h3>
          <p className="text-sm text-[#3F493D] leading-relaxed">
            When every artifact uses separate loose variables, renaming or moving one item easily
            causes costly security errors. Grouping all facts belonging to one artifact inside a
            single structure keeps records clean—and prepares us for Python objects.
          </p>
        </div>
        <pre className="font-mono-code text-xs text-[#3F493D] bg-[#F0EDE6] p-4 rounded-lg border border-[#C8D5C4]/50 overflow-x-auto">
{`# Organized as one artifact unit:
blue_heron_case = {
    "artifact": "Blue Heron Vase",
    "value": 4500000,
    "location": "Gallery 4, Case B"
}`}
        </pre>
      </section>
    </div>
  );
}
