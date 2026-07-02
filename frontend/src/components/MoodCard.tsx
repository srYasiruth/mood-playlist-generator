import type { Mood } from "../types/mood";

type MoodCardProps = {
  mood: Mood;
};

export function MoodCard({ mood }: MoodCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-950">{mood.name}</h3>
      {mood.description ? <p className="mt-2 text-sm text-slate-600">{mood.description}</p> : null}
    </article>
  );
}

