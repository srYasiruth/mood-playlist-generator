import { Button } from "../Button";

type JournalInputProps = {
  value: string;
  onChange: (value: string) => void;
  onDetect: () => void;
};

export function JournalInput({ value, onChange, onDetect }: JournalInputProps) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/78 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label htmlFor="journal" className="text-base font-bold text-slate-950">
            Want to write it out?
          </label>
          <p className="mt-1 text-sm text-slate-600">
            Journal mood detection is planned for Phase 5. For now, this is a safe UI placeholder.
          </p>
        </div>
        <Button onClick={onDetect} variant="secondary">
          Detect mood
        </Button>
      </div>
      <textarea
        id="journal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-white/90 p-4 text-sm leading-6 text-slate-800 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        placeholder="Type a few lines about how you feel. Real mood detection arrives in Phase 5."
      />
    </div>
  );
}
