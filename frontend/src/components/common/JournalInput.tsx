import { Button } from "../Button";
import type { DetectMoodResponse, Mood } from "../../types/mood";

function formatConfidence(confidence: number) {
  return `${Math.round(confidence * 100)}%`;
}

type JournalInputProps = {
  value: string;
  onChange: (value: string) => void;
  onDetect: () => void;
  onGenerateDetected: () => void;
  detectedResult: DetectMoodResponse | null;
  detectedMood: Mood | null;
  isDetecting: boolean;
  error?: string | null;
  isGenerateDisabled?: boolean;
};

export function JournalInput({
  value,
  onChange,
  onDetect,
  onGenerateDetected,
  detectedResult,
  detectedMood,
  isDetecting,
  error,
  isGenerateDisabled
}: JournalInputProps) {
  const characterCount = value.length;
  const isInvalidLength = characterCount > 0 && (value.trim().length < 5 || characterCount > 500);

  return (
    <div className="rounded-xl border border-white/60 bg-white/78 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label htmlFor="journal" className="text-base font-bold text-slate-950">
            Want to write it out?
          </label>
          <p className="mt-1 text-sm text-slate-600">
            Describe your mood in a few words. Detection runs locally on our backend and your journal text is not saved.
          </p>
        </div>
        <Button onClick={onDetect} variant="secondary" disabled={isDetecting || isInvalidLength || value.trim().length === 0}>
          {isDetecting ? "Detecting..." : "Detect mood"}
        </Button>
      </div>
      <textarea
        id="journal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-white/90 p-4 text-sm leading-6 text-slate-800 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        placeholder="Example: I feel tired and stressed after studying all day."
        maxLength={520}
        aria-describedby="journal-help journal-count journal-status"
      />
      <div className="mt-2 flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p id="journal-help">Use 5 to 500 characters. HTML is not accepted.</p>
        <p id="journal-count" className={characterCount > 500 ? "font-semibold text-red-700" : "font-medium text-slate-500"}>
          {characterCount}/500
        </p>
      </div>

      <div id="journal-status" aria-live="polite" className="mt-4 space-y-3">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </div>
        ) : null}

        {detectedResult && detectedMood ? (
          <div className="rounded-xl border border-slate-200 bg-white/82 p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">{detectedMood.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">Detected mood</p>
                    <h3 className="text-xl font-black text-slate-950">{detectedMood.name}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{detectedResult.reason}</p>
                {detectedResult.matchedSignals.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detectedResult.matchedSignals.map((signal) => (
                      <span key={signal} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {signal}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                  {formatConfidence(detectedResult.confidence)} confidence
                </span>
                <Button onClick={onGenerateDetected} disabled={isGenerateDisabled}>
                  Generate playlist for {detectedMood.name}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}