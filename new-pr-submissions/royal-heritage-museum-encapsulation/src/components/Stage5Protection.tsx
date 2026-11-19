import { useState } from 'react';
import { Eye, Sliders, CheckCircle2, XCircle } from 'lucide-react';
import { validateTemperature } from '../game/missionLogic';

interface Stage5ProtectionProps {
  getterReadCount: number;
  validTempsTested: number[];
  invalidTempsTested: number[];
  onReadGetter: () => void;
  onTestSetter: (temp: number, accepted: boolean) => void;
}

interface LogEntry {
  id: number;
  action: string;
  accepted: boolean;
  message: string;
  reason: string;
}

const PRESET_TEMPS = [15, 18, 20, 22, 25];

export function Stage5Protection({
  getterReadCount,
  validTempsTested,
  invalidTempsTested,
  onReadGetter,
  onTestSetter,
}: Stage5ProtectionProps) {
  const [currentTemp, setCurrentTemp] = useState<number>(20);
  const [sliderTemp, setSliderTemp] = useState<number>(20);
  const [getterOutput, setGetterOutput] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const handleGetter = () => {
    setGetterOutput(currentTemp);
    onReadGetter();
    setLogs((prev) => [
      {
        id: Date.now(),
        action: 'get_temperature()',
        accepted: true,
        message: `Returned ${currentTemp}°C safely`,
        reason: 'Getter read private self.__temperature without allowing direct modification.',
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleSetter = (temp: number) => {
    const res = validateTemperature(temp);
    if (res.accepted) {
      setCurrentTemp(temp);
    }
    onTestSetter(temp, res.accepted);
    setLogs((prev) => [
      {
        id: Date.now() + Math.random(),
        action: `set_temperature(${temp})`,
        accepted: res.accepted,
        message: res.message,
        reason: res.reason,
      },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      {/* Left: Interactive Getter / Setter Console */}
      <div className="lg:col-span-7 rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-6 space-y-6">
        {/* Step 1: Getter */}
        <div className="rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#3F493D]">
              1. Read with a Getter
            </h2>
            <span className="text-xs text-[#7B8C79] tabular-nums">
              {getterReadCount >= 1 ? 'Verified' : 'Required: Read once'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#3F493D]">
            A <strong className="text-[#3F493D]">getter</strong> lets authorized officers inspect{' '}
            <code className="font-mono-code text-[#7F9274]">__temperature</code> safely without
            unlocking write access.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={handleGetter}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#7F9274] hover:bg-[#6B7E63] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Run case.get_temperature()</span>
            </button>
            {getterOutput !== null && (
              <span className="font-mono-code text-sm text-[#4A7C59] tabular-nums">
                Output: {getterOutput}°C
              </span>
            )}
          </div>
        </div>

        {/* Step 2: Setter + Validation */}
        <div className="rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#3F493D]">
              2. Update with a Setter &amp; Validation (18°C–22°C)
            </h2>
            <span className="text-xs text-[#7B8C79] tabular-nums">
              Valid tested: {validTempsTested.length}/2 · Invalid tested: {invalidTempsTested.length}/2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#3F493D]">
            A <strong className="text-[#3F493D]">setter</strong> checks whether a new temperature is
            inside <code className="font-mono-code text-[#7F9274]">18°C–22°C</code> before updating.
            Test both safe and unsafe temperatures:
          </p>

          {/* Visual Safe Temperature Zone Bar (12°C to 28°C) */}
          <div className="rounded-lg bg-[#F0EDE6] border border-[#C8D5C4]/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#7B8C79] font-mono-code tabular-nums">
              <span>12°C (Too Cold)</span>
              <span className="text-[#4A7C59] font-semibold">Safe Zone: 18°C–22°C</span>
              <span>28°C (Too Hot)</span>
            </div>
            <div className="relative h-3 rounded-full bg-[#D6E0D1] overflow-hidden">
              {/* Highlighted 18-22C safe zone: (18-12)/(28-12) = 37.5% left, (22-18)/16 = 25% width */}
              <div
                className="absolute inset-y-0 bg-[#10B981]/45 border-x border-[#4A7C59]"
                style={{ left: '37.5%', width: '25%' }}
                aria-hidden="true"
              />
              {/* Active marker */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-[#7F9274] rounded-full transition-all duration-200"
                style={{
                  left: `calc(${Math.min(100, Math.max(0, ((currentTemp - 12) / 16) * 100))}% - 3px)`,
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Preset Test Buttons */}
          <div className="flex flex-wrap gap-2">
            {PRESET_TEMPS.map((t) => {
              const isValid = t >= 18 && t <= 22;
              const tested =
                validTempsTested.includes(t) || invalidTempsTested.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSetter(t)}
                  className={`px-3.5 py-2 rounded-md text-xs font-mono-code font-semibold border transition-colors cursor-pointer tabular-nums ${
                    tested
                      ? isValid
                        ? 'bg-[#D6EDE0] border-[#4A7C59]/50 text-[#4A7C59]'
                        : 'bg-[#2B1418] border-[#F87171]/50 text-[#FCA5A5]'
                      : 'bg-[#FAF7F0] border-[#A8BFA3]/40 text-[#3F493D] hover:border-[#7F9274]'
                  }`}
                >
                  set_temperature({t})
                </button>
              );
            })}
          </div>

          {/* Custom Slider Test */}
          <div className="pt-3 border-t border-[#C8D5C4]/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="custom-temp-slider" className="text-[#3F493D] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#7F9274]" aria-hidden="true" />
                <span>Custom Test Temperature:</span>
              </label>
              <span className="font-mono-code text-[#7F9274] font-semibold tabular-nums">
                {sliderTemp}°C
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="custom-temp-slider"
                type="range"
                min={12}
                max={28}
                step={1}
                value={sliderTemp}
                onChange={(e) => setSliderTemp(Number(e.target.value))}
                className="flex-1 accent-[#7F9274]"
              />
              <button
                type="button"
                onClick={() => handleSetter(sliderTemp)}
                className="px-4 py-2 rounded-md bg-[#E9EFE5] hover:bg-[#D6E0D1] text-[#3F493D] border border-[#A8BFA3]/40 text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Test {sliderTemp}°C
              </button>
            </div>
          </div>
        </div>

        {/* Live System Log */}
        <div className="space-y-2" aria-live="polite">
          <p className="text-xs font-medium text-[#7B8C79]">Security System Response Log</p>
          {logs.length === 0 ? (
            <div className="rounded-lg bg-[#F0EDE6] border border-[#C8D5C4]/50 p-4 text-xs text-[#7B8C79]">
              Run <code className="font-mono-code">get_temperature()</code> or test a setter value
              above to see how the safety rule protects the display case.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-lg p-3.5 border text-xs flex items-start gap-2.5 ${
                    entry.accepted
                      ? 'bg-[#D6EDE0] border-[#4A7C59]/40 text-[#3F493D]'
                      : 'bg-[#261115] border-[#F87171]/40 text-[#FEE2E2]'
                  }`}
                >
                  {entry.accepted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-mono-code font-semibold">
                      {entry.action} — {entry.message}
                    </p>
                    <p className="opacity-90">{entry.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Concise Line-by-Line Python Explanation */}
      <div className="lg:col-span-5 rounded-xl border border-[#A8BFA3]/40 bg-[#E9EFE5] p-6 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-[#3F493D]">
            Python Protection Methods
          </h2>
          <span className="font-mono-code text-xs text-[#4A7C59] tabular-nums">
            Live __temperature: {currentTemp}°C
          </span>
        </div>

        <pre className="font-mono-code text-xs sm:text-sm text-[#3F493D] bg-[#F0EDE6] p-4 rounded-lg border border-[#C8D5C4]/50 overflow-x-auto leading-relaxed">
{`def get_temperature(self):
    return self.__temperature

def set_temperature(self, new_temp):
    if 18 <= new_temp <= 22:
        self.__temperature = new_temp
        return "Accepted"
    return "Rejected: Keep 18°C–22°C"`}
        </pre>

        <dl className="space-y-3 text-xs sm:text-sm border-t border-[#C8D5C4]/40 pt-4">
          <div>
            <dt className="font-mono-code text-[#7F9274] font-medium">
              def get_temperature(self):
            </dt>
            <dd className="text-[#3F493D] mt-0.5">
              Getter method—gives read-only access to the private{' '}
              <code className="font-mono-code">__temperature</code>.
            </dd>
          </div>
          <div>
            <dt className="font-mono-code text-[#7F9274] font-medium">
              def set_temperature(self, new_temp):
            </dt>
            <dd className="text-[#3F493D] mt-0.5">
              Setter method—acts as the single guarded gatekeeper for updates.
            </dd>
          </div>
          <div>
            <dt className="font-mono-code text-[#7F9274] font-medium">
              if 18 &lt;= new_temp &lt;= 22:
            </dt>
            <dd className="text-[#3F493D] mt-0.5">
              Validation check—accepts safe temperatures and blocks harmful extremes.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
