import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { JournalInput } from "../components/common/JournalInput";
import { LoadingState } from "../components/common/LoadingState";
import { StatusBanner } from "../components/common/StatusBanner";
import { MoodCard } from "../components/MoodCard";
import { useMoodTheme } from "../hooks/useMoodTheme";
import { usePlaylistMock } from "../hooks/usePlaylistMock";
import { getMoodCatalog } from "../services/moodService";
import type { Mood } from "../types/mood";

export function HomePage() {
  const navigate = useNavigate();
  const { selectedMood, setSelectedMood, theme } = useMoodTheme();
  const { isLoading, error, statusMessage, generate } = usePlaylistMock();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);
  const [catalogMessage, setCatalogMessage] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [journalMessage, setJournalMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMoods() {
      setIsLoadingMoods(true);
      const result = await getMoodCatalog();

      if (!isMounted) {
        return;
      }

      setMoods(result.moods);
      setCatalogMessage(result.message ?? null);
      setIsLoadingMoods(false);
    }

    loadMoods();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerate = async () => {
    if (!selectedMood) {
      return;
    }

    const response = await generate(selectedMood);
    if (response?.playlists.length) {
      navigate("/results", {
        state: {
          mood: selectedMood,
          playlists: response.playlists,
          playlistResponse: response
        }
      });
    }
  };

  const handleDetectMood = () => {
    setJournalMessage(
      journalText.trim()
        ? "Mood detection arrives in Phase 5. Pick a mood card for now and the UI will adapt instantly."
        : "Write a few words first, then this Phase 5 placeholder can respond."
    );
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
            Phase 3 playlist API connected
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal" style={{ color: theme.accent }}>
              Mood-Based Playlist Generator
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              How are you feeling today?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              Pick a mood and get playlist recommendations shaped around the feeling. The backend uses Spotify when credentials are configured, with safe demo suggestions otherwise.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={!selectedMood || isLoading} onClick={handleGenerate}>
              {isLoading ? "Generating..." : "Generate playlist"}
            </Button>
            <Button variant="secondary" onClick={() => setSelectedMood(null)} disabled={!selectedMood}>
              Clear mood
            </Button>
          </div>
          {catalogMessage ? <StatusBanner message={catalogMessage} tone="warning" /> : null}
          {statusMessage ? <StatusBanner message={statusMessage} /> : null}
          {error ? <ErrorState message={error} onRetry={handleGenerate} /> : null}
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/76 p-5 shadow-xl backdrop-blur">
          <div
            className="rounded-xl p-6 text-white shadow-inner"
            style={{ background: selectedMood?.theme.coverGradient ?? theme.coverGradient }}
          >
            <p className="text-sm font-semibold text-white/78">Selected mood</p>
            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl" aria-hidden="true">
                  {selectedMood?.emoji ?? "🎵"}
                </p>
                <h2 className="mt-3 text-3xl font-black">{selectedMood?.name ?? "Choose a mood"}</h2>
              </div>
              <p className="max-w-48 text-right text-sm leading-6 text-white/82">
                {selectedMood?.description ?? "Your background and playlist mood will shift after selection."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4" aria-labelledby="mood-section-title">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="mood-section-title" className="text-2xl font-black text-slate-950">
              Choose a mood
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Only one mood can be active at a time. Each card carries its own theme and playlist cues.
            </p>
          </div>
          {selectedMood ? (
            <span className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700">
              Current: {selectedMood.emoji} {selectedMood.name}
            </span>
          ) : null}
        </div>

        {isLoadingMoods ? <LoadingState message="Loading moods..." /> : null}
        {!isLoadingMoods && moods.length === 0 ? (
          <EmptyState title="No moods available" message="Mood data could not be loaded yet." />
        ) : null}
        {!isLoadingMoods && moods.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {moods.map((mood) => (
              <MoodCard
                key={mood.id}
                mood={mood}
                isSelected={selectedMood?.id === mood.id}
                onSelect={setSelectedMood}
              />
            ))}
          </div>
        ) : null}
      </section>

      {isLoading ? <LoadingState /> : null}

      <JournalInput value={journalText} onChange={setJournalText} onDetect={handleDetectMood} />
      {journalMessage ? <StatusBanner message={journalMessage} /> : null}
    </section>
  );
}
