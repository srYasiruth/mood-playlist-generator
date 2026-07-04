import type { Mood } from "../types/mood";

type MoodCardProps = {
  mood: Mood;
  isSelected?: boolean;
  onSelect?: (mood: Mood) => void;
};

export function MoodCard({ mood, isSelected = false, onSelect }: MoodCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(mood)}
      aria-pressed={isSelected}
      className="group h-full rounded-xl text-left transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: mood.theme.accent }}
    >
      <article
        className={`flex h-full flex-col gap-4 rounded-xl border p-4 shadow-sm backdrop-blur transition ${
          isSelected ? "scale-[1.02] shadow-xl" : "bg-white/76 hover:shadow-lg"
        }`}
        style={{
          background: isSelected ? mood.theme.surface : undefined,
          borderColor: isSelected ? mood.theme.accent : mood.theme.border,
          boxShadow: isSelected ? `0 20px 45px ${mood.theme.ring}` : undefined
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-3xl" aria-hidden="true">
            {mood.emoji}
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: mood.theme.accentSoft, color: mood.theme.accent }}
          >
            {isSelected ? "Selected" : "Mood"}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-950">{mood.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{mood.description}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {mood.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-600">
              {genre}
            </span>
          ))}
        </div>
      </article>
    </button>
  );
}
