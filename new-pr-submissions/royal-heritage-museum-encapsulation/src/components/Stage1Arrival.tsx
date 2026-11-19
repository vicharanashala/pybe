import { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { ASSET_PATHS } from '../game/assets';
import { STAGE1_HOTSPOTS } from '../game/missionLogic';
import { MuseumImage } from './MuseumImage';

interface Stage1ArrivalProps {
  inspectedHotspots: string[];
  onInspectHotspot: (hotspotId: string) => void;
}

const HOTSPOT_POSITIONS: Record<string, string> = {
  porcelain: 'top-[38%] left-[48%]',
  valuation: 'top-[62%] left-[32%]',
  conservation: 'top-[52%] left-[64%]',
  registry: 'top-[78%] left-[50%]',
};

export function Stage1Arrival({ inspectedHotspots, onInspectHotspot }: Stage1ArrivalProps) {
  const [selectedId, setSelectedId] = useState<string>(
    inspectedHotspots[inspectedHotspots.length - 1] ?? 'porcelain'
  );

  const selectedHotspot =
    STAGE1_HOTSPOTS.find((h) => h.id === selectedId) ?? STAGE1_HOTSPOTS[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onInspectHotspot(id);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-stretch">
      {/* Left: Interactive Vitrine Inspection Viewport */}
      <div className="lg:col-span-6 museum-panel rounded-[22px] p-4 sm:p-5 flex flex-col justify-between">
        <div className="museum-case relative aspect-[3/4] max-h-[520px] w-full mx-auto rounded-[18px] p-3">
          <div className="museum-glass relative h-full w-full overflow-hidden rounded-[14px]">
            <MuseumImage
              src={ASSET_PATHS.blueHeronVase}
              alt="Blue Heron Vase inside Gallery 4 glass vitrine with interactive inspection points"
              className="artifact-image w-full h-full object-cover"
              fallbackTitle="Blue Heron Vase"
            />
            <div
              className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-[#C5A46D]/25"
              aria-hidden="true"
            />

            {STAGE1_HOTSPOTS.map((spot) => {
              const inspected = inspectedHotspots.includes(spot.id);
              const isSelected = selectedId === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleSelect(spot.id)}
                  aria-label={`Inspect ${spot.label}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-transform cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-white ${
                    HOTSPOT_POSITIONS[spot.id]
                  } ${
                    isSelected
                      ? 'bg-[#7F9274] text-white scale-105'
                      : inspected
                        ? 'bg-[#D6EDE0]/95 text-[#4A7C59] border border-[#4A7C59]/50'
                        : 'bg-[#FAF7F0]/95 text-[#3F493D] border border-[#A8BFA3]/50 hover:bg-[#E9EFE5]'
                  }`}
                >
                  {inspected ? (
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Search className="w-3.5 h-3.5 shrink-0 text-[#7F9274]" aria-hidden="true" />
                  )}
                  <span className="whitespace-nowrap">{spot.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-[#7B8C79] mt-3 text-center tabular-nums">
          Inspected {inspectedHotspots.length} of {STAGE1_HOTSPOTS.length} artifact points
        </p>
      </div>

      {/* Right: Progressive Artifact Variable Discovery */}
      <div className="lg:col-span-6 museum-shell rounded-[22px] p-6 space-y-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-[#3F493D]">
              Artifact Information Inspector
            </h2>
            <span className="text-xs text-[#7B8C79] tabular-nums">
              {inspectedHotspots.length}/{STAGE1_HOTSPOTS.length} Discovered
            </span>
          </div>

          {/* Progressive Variable Rows */}
          <div className="space-y-2">
            {STAGE1_HOTSPOTS.map((spot) => {
              const inspected = inspectedHotspots.includes(spot.id);
              const isSelected = selectedId === spot.id;
              return (
                <div
                  key={spot.id}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-xs transition-colors ${
                    isSelected && inspected
                      ? 'bg-[#E9EFE5] border-[#7F9274] text-[#3F493D]'
                      : inspected
                        ? 'bg-[#E9EFE5] border-[#4A7C59]/35 text-[#3F493D]'
                        : 'bg-[#FAF7F0] border-[#C8D5C4]/20 text-[#7B8C79]'
                  }`}
                >
                  <span className="font-medium">{spot.label}</span>
                  {inspected ? (
                    <code className="font-mono-code text-[#7F9274]">
                      {spot.fieldName} = {spot.fieldValue}
                    </code>
                  ) : (
                    <span>Click on the display case to inspect</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Inspection Card */}
          <div className="rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 p-5 space-y-3">
            <p className="text-xs font-medium text-[#7F9274]">
              Selected Point · {selectedHotspot.label}
            </p>
            {inspectedHotspots.includes(selectedHotspot.id) ? (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <code className="font-mono-code text-sm sm:text-base text-[#7F9274]">
                    {selectedHotspot.fieldName} = {selectedHotspot.fieldValue}
                  </code>
                  <span className="text-xs text-[#7B8C79] font-mono-code">
                    Type: {selectedHotspot.dataType}
                  </span>
                </div>
                <p className="text-sm text-[#3F493D] leading-relaxed">{selectedHotspot.detail}</p>
              </>
            ) : (
              <p className="text-sm text-[#7B8C79]">
                Click any of the 4 inspection markers on the Blue Heron Vase display case to reveal
                its stored Python variable.
              </p>
            )}
          </div>
        </div>

        {/* Minimal Python Preview */}
        <div className="rounded-lg bg-[#F0EDE6] border border-[#C8D5C4]/50 p-4 space-y-2">
          <p className="text-xs font-medium text-[#7B8C79]">
            Python Variables (Each name holds one piece of information)
          </p>
          <pre className="font-mono-code text-xs sm:text-sm text-[#3F493D] overflow-x-auto leading-relaxed">
{`artifact_name = ${inspectedHotspots.includes('porcelain') ? '"Blue Heron Vase"' : '???'}
value = ${inspectedHotspots.includes('valuation') ? '4500000' : '???'}
condition = ${inspectedHotspots.includes('conservation') ? '"Good"' : '???'}
location = ${inspectedHotspots.includes('registry') ? '"Gallery 4, Case B"' : '???'}
curator_id = ${inspectedHotspots.includes('registry') ? '"CUR-7"' : '???'}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
