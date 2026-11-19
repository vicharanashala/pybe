import { useState } from 'react';
import { Lock, Unlock, Thermometer, ShieldAlert, ShieldCheck } from 'lucide-react';
import { ASSET_PATHS } from '../game/assets';
import { ARTIFACT_METADATA, simulateAttributeAccess } from '../game/missionLogic';
import { MuseumImage } from './MuseumImage';

interface Stage4ControlRoomProps {
  testedPublicTamper: boolean;
  activatedPrivateLock: boolean;
  testedPrivateTamper: boolean;
  onUpdateStage4: (patch: {
    testedPublicTamper?: boolean;
    activatedPrivateLock?: boolean;
    testedPrivateTamper?: boolean;
  }) => void;
}

export function Stage4ControlRoom({
  testedPublicTamper,
  activatedPrivateLock,
  testedPrivateTamper,
  onUpdateStage4,
}: Stage4ControlRoomProps) {
  const [liveTemp, setLiveTemp] = useState<number>(20);
  const [lastLog, setLastLog] = useState<{
    status: 'safe' | 'warning' | 'blocked';
    message: string;
    codeLine: string;
  }>({
    status: 'safe',
    message: 'Display case temperature is currently 20°C. Try changing the public temperature directly to see why it is risky.',
    codeLine: 'blue_heron_case.temperature  # currently 20°C (public)',
  });

  const handleDirectAttempt = (attemptedTemp: number) => {
    const mode = activatedPrivateLock ? 'private' : 'public';
    const result = simulateAttributeAccess(mode, attemptedTemp, liveTemp);

    if (mode === 'public') {
      setLiveTemp(result.currentTemp);
      onUpdateStage4({ testedPublicTamper: true });
      setLastLog({
        status: result.dangerLevel,
        message: result.explanation,
        codeLine: `blue_heron_case.temperature = ${attemptedTemp}  # Changed directly!`,
      });
    } else {
      onUpdateStage4({ testedPrivateTamper: true });
      setLastLog({
        status: 'blocked',
        message: result.explanation,
        codeLine: `blue_heron_case.__temperature = ${attemptedTemp}  # Blocked by private lock`,
      });
    }
  };

  const handleEnablePrivate = () => {
    setLiveTemp(20);
    onUpdateStage4({ activatedPrivateLock: true });
    setLastLog({
      status: 'safe',
      message:
        'Switched to private attribute self.__temperature = 20. Now try changing it directly again to test the lock.',
      codeLine: 'self.__temperature = 20  # Double underscore keeps this private',
    });
  };

  const tempOutOfRange = liveTemp < 18 || liveTemp > 22;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Control Room & Live Temperature Monitor */}
        <div className="lg:col-span-6 rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] overflow-hidden flex flex-col">
          <div className="relative h-48 sm:h-56 m-3 mb-0 rounded-[14px] overflow-hidden border border-[#C5A46D]/55 bg-[#E9EFE5]">
            <MuseumImage
              src={ASSET_PATHS.controlRoom}
              alt="Professional museum security control room with operators monitoring multiple surveillance displays"
              className="w-full h-full object-cover object-center brightness-105 contrast-105 saturate-90"
              fallbackTitle="Security Control Room"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2F342B]/55 to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-4">
              <div className="rounded-md border border-[#C5A46D]/45 bg-[#FAF7F0]/92 px-3 py-2 shadow-sm">
                <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#7F9274]">
                  Case Climate Monitor
                </p>
                <p className="font-display text-base font-semibold text-[#3F493D]">
                  {ARTIFACT_METADATA.location}
                </p>
              </div>
              <div className="rounded-md border border-[#C5A46D]/45 bg-[#FAF7F0]/92 px-3 py-2 text-right shadow-sm">
                <p className="text-[10px] text-[#7B8C79]">Protection Mode</p>
                <p
                  className={`text-[11px] font-semibold inline-flex items-center gap-1 ${
                    activatedPrivateLock ? 'text-[#4A7C59]' : 'text-[#A85D5D]'
                  }`}
                >
                  {activatedPrivateLock ? (
                    <>
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Private (__temperature)</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Public (temperature)</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            {/* Live Temperature Gauge */}
            <div
              className={`rounded-lg p-5 border transition-colors ${
                tempOutOfRange
                  ? 'bg-[#261115] border-[#F87171]/45'
                  : 'bg-[#E9EFE5] border-[#C8D5C4]/40'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Thermometer
                    className={`w-7 h-7 ${
                      tempOutOfRange ? 'text-[#F87171]' : 'text-[#4A7C59]'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs text-[#7B8C79]">Current Display Case Temperature</p>
                    <p className="font-mono-code text-3xl font-semibold text-[#3F493D] tabular-nums">
                      {liveTemp}°C
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="text-[#7B8C79]">Safe Vase Range</p>
                  <p className="font-mono-code text-[#7F9274] font-semibold">18°C – 22°C</p>
                  <p
                    className={`mt-1 font-semibold ${
                      tempOutOfRange ? 'text-[#F87171]' : 'text-[#4A7C59]'
                    }`}
                  >
                    {tempOutOfRange ? 'DANGER: Unsafe Temp' : 'SAFE: Normal'}
                  </p>
                </div>
              </div>
            </div>

            {/* Python Public vs Private Comparison */}
            <div className="rounded-lg bg-[#F0EDE6] border border-[#C8D5C4]/50 p-4 space-y-2">
              <p className="text-xs font-medium text-[#7B8C79]">
                {activatedPrivateLock
                  ? 'Protected Private Attribute in Python'
                  : 'Unprotected Public Attribute in Python'}
              </p>
              <pre className="font-mono-code text-xs text-[#3F493D] overflow-x-auto leading-relaxed">
{activatedPrivateLock
  ? `class DisplayCase:
    def __init__(self):
        self.__temperature = 20  # Private`
  : `class DisplayCase:
    def __init__(self):
        self.temperature = 20    # Public (Unsafe)`}
              </pre>
            </div>

            {/* DisplayCase Summary */}
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40">
                <dt className="text-[#7B8C79]">Artifact</dt>
                <dd className="text-[#3F493D] font-medium mt-0.5">
                  {ARTIFACT_METADATA.artifact}
                </dd>
              </div>
              <div className="p-3 rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40">
                <dt className="text-[#7B8C79]">Authorized Curator</dt>
                <dd className="font-mono-code text-[#7F9274] font-medium mt-0.5">
                  {ARTIFACT_METADATA.curatorId}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right: Security Control Panel & Public vs Private Experiment */}
        <div className="lg:col-span-6 rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#3F493D]">
              Security Control Panel
            </h2>

            {/* Step 1: Test Direct Public Access */}
            <div className="rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#7F9274]">
                  Step 1 · Test Direct External Modification
                </span>
                <span className="text-xs text-[#7B8C79]">
                  {testedPublicTamper ? 'Tested' : 'Pending'}
                </span>
              </div>
              <p className="text-xs text-[#3F493D]">
                Simulate an outsider directly changing the attribute on{' '}
                <code className="font-mono-code">blue_heron_case</code>:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleDirectAttempt(34)}
                  className="px-3.5 py-2 rounded-md text-xs font-mono-code font-medium bg-[#2A1418] hover:bg-[#3A1B20] text-[#FCA5A5] border border-[#F87171]/40 transition-colors cursor-pointer"
                >
                  Set = 34°C (Overheat)
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectAttempt(10)}
                  className="px-3.5 py-2 rounded-md text-xs font-mono-code font-medium bg-[#E9EFE5] hover:bg-[#D6E0D1] text-[#3F493D] border border-[#A8BFA3]/40 transition-colors cursor-pointer"
                >
                  Set = 10°C (Freeze)
                </button>
              </div>
            </div>

            {/* Step 2: Enable Private __temperature */}
            <div className="rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#7F9274]">
                  Step 2 · Lock Attribute with Python Double Underscore
                </span>
                <span className="text-xs text-[#7B8C79]">
                  {activatedPrivateLock ? 'Active' : 'Pending'}
                </span>
              </div>
              <p className="text-xs text-[#3F493D] leading-relaxed">
                In Python, prefixing an attribute with double underscores (
                <code className="font-mono-code text-[#7F9274]">__temperature</code>) marks it
                private so outside code cannot alter it directly.
              </p>
              <button
                type="button"
                disabled={activatedPrivateLock}
                onClick={handleEnablePrivate}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                  activatedPrivateLock
                    ? 'bg-[#D6EDE0] text-[#4A7C59] border border-[#4A7C59]/40 cursor-default'
                    : 'bg-[#7F9274] hover:bg-[#6B7E63] text-white cursor-pointer'
                }`}
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {activatedPrivateLock
                    ? 'Private __temperature Enabled (20°C)'
                    : 'Convert to Private: self.__temperature'}
                </span>
              </button>
            </div>

            {/* Step 3: Verify tamper attempt fails */}
            {activatedPrivateLock && (
              <div className="rounded-lg bg-[#E9EFE5] border border-[#A8BFA3]/40 p-4 space-y-2.5">
                <span className="text-xs font-semibold text-[#7F9274] block">
                  Step 3 · Re-test Direct Tampering Against __temperature
                </span>
                <button
                  type="button"
                  onClick={() => handleDirectAttempt(40)}
                  className="px-3.5 py-2 rounded-md text-xs font-mono-code font-medium bg-[#D6E0D1] hover:bg-[#C8D5C4] text-[#3F493D] border border-[#A8BFA3]/40 transition-colors cursor-pointer"
                >
                  Attempt case.__temperature = 40
                </button>
              </div>
            )}
          </div>

          {/* Live System Response Log */}
          <div
            aria-live="polite"
            className={`rounded-lg p-4 border space-y-2 ${
              lastLog.status === 'warning'
                ? 'bg-[#261115] border-[#F87171]/40'
                : lastLog.status === 'blocked'
                  ? 'bg-[#D6EDE0] border-[#4A7C59]/40'
                  : 'bg-[#F0EDE6] border-[#C8D5C4]/50'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              {lastLog.status === 'warning' ? (
                <ShieldAlert className="w-4 h-4 text-[#F87171]" aria-hidden="true" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#4A7C59]" aria-hidden="true" />
              )}
              <span
                className={
                  lastLog.status === 'warning' ? 'text-[#FCA5A5]' : 'text-[#4A7C59]'
                }
              >
                {lastLog.status === 'warning'
                  ? 'Security Vulnerability Exposed'
                  : lastLog.status === 'blocked'
                    ? 'Private Attribute Protected'
                    : 'Control Room Ready'}
              </span>
            </div>
            <code className="block font-mono-code text-xs text-[#7F9274]">{lastLog.codeLine}</code>
            <p className="text-xs text-[#3F493D] leading-relaxed">{lastLog.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
