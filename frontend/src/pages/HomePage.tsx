import { Button } from "../components/Button";
import { MoodCard } from "../components/MoodCard";
import type { Mood } from "../types/mood";

const placeholderMoods: Mood[] = [
  { id: "happy", name: "Happy" },
  { id: "relaxed", name: "Relaxed" },
  { id: "focused", name: "Focused" }
];

export function HomePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-slate-950">
          Mood-Based Playlist Generator
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Phase 1 placeholder home page. Mood selection and journal input will be built in later
          phases.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {placeholderMoods.map((mood) => (
          <MoodCard key={mood.id} mood={mood} />
        ))}
      </div>
      <Button>Generate Playlist Placeholder</Button>
    </section>
  );
}

