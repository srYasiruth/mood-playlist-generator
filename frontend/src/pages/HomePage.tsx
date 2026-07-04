import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { JournalInput } from "../components/common/JournalInput";
import { LoadingState } from "../components/common/LoadingState";
import { StatusBanner } from "../components/common/StatusBanner";
import { MoodCard } from "../components/MoodCard";
import { useAuth } from "../hooks/useAuth";
import { useMoodTheme } from "../hooks/useMoodTheme";
import { usePlaylistMock } from "../hooks/usePlaylistMock";
import { detectMood, getMoodCatalog } from "../services/moodService";
import { saveFavoriteMood } from "../services/userService";
import type { DetectMoodResponse, Mood } from "../types/mood";
import type { PlaylistInputType } from "../types/playlist";

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === "string") {
      return message;
    }
    if (!error.response) {
      return "Mood detection needs the backend connection. Please start the backend and try again.";
    }
  }

  return "Could not detect a mood from that text. Please try again.";
}

export function HomePage() {
  const navigate = useNavigate();
  const { selectedMood, setSelectedMood, theme } = useMoodTheme();
  const { isAuthenticated } = useAuth();
  const { isLoading, error, statusMessage, generate } = usePlaylistMock();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);
  const [catalogMessage, setCatalogMessage] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [isDetectingMood, setIsDetectingMood] = useState(false);
  const [detectedResult, setDetectedResult] = useState<DetectMoodResponse | null>(null);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [generationInputType, setGenerationInputType] = useState<PlaylistInputType>("manual");
  const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null);

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

  const detectedMood = useMemo(
    () => moods.find((mood) => mood.id === detectedResult?.detectedMood) ?? null,
    [detectedResult?.detectedMood, moods]
  );

  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
    setGenerationInputType("manual");
    setFavoriteMessage(null);
  };

  const runGenerate = async (inputType: PlaylistInputType) => {
    if (!selectedMood) {
      return;
    }

    const response = await generate(selectedMood, inputType);
    if (response?.playlists.length) {
      navigate("/results", {
        state: {
          mood: selectedMood,
          playlists: response.playlists,
          playlistResponse: response,
          inputType
        }
      });
    }
  };

  const handleGenerate = async () => {
    await runGenerate(generationInputType);
  };

  const handleGenerateDetected = async () => {
    if (!detectedMood) {
      return;
    }

    setSelectedMood(detectedMood);
    setGenerationInputType("text");
    const response = await generate(detectedMood, "text");
    if (response?.playlists.length) {
      navigate("/results", {
        state: {
          mood: detectedMood,
          playlists: response.playlists,
          playlistResponse: response,
          inputType: "text"
        }
      });
    }
  };

  const handleSaveFavorite = async () => {
    if (!selectedMood) {
      return;
    }

    if (!isAuthenticated) {
      setFavoriteMessage("Please log in to save favorite moods.");
      return;
    }

    try {
      await saveFavoriteMood(selectedMood);
      setFavoriteMessage(`${selectedMood.name} saved to your favorite moods.`);
    } catch {
      setFavoriteMessage("Could not save this favorite mood. Please try again.");
    }
  };

  const handleDetectMood = async () => {
    const text = journalText.trim();
    setJournalError(null);
    setDetectedResult(null);

    if (text.length < 5) {
      setJournalError("Journal text must be at least 5 characters.");
      return;
    }

    if (journalText.length > 500) {
      setJournalError("Journal text must be 500 characters or fewer.");
      return;
    }

    if (/<[^>]+>/.test(text)) {
      setJournalError("Journal text cannot include HTML.");
      return;
    }

    setIsDetectingMood(true);
    try {
      const result = await detectMood({ text });
      setDetectedResult(result);
      const mood = moods.find((item) => item.id === result.detectedMood);
      if (mood) {
        setSelectedMood(mood);
        setGenerationInputType("text");
      }
    } catch (detectError) {
      setJournalError(getErrorMessage(detectError));
    } finally {
      setIsDetectingMood(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
            Phase 5 journal mood detection connected
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal" style={{ color: theme.accent }}>
              Mood-Based Playlist Generator
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              How are you feeling today?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              Pick a mood manually or write a short journal entry so the app can suggest the closest mood before generating playlists.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={!selectedMood || isLoading} onClick={handleGenerate}>
              {isLoading ? "Generating..." : "Generate playlist"}
            </Button>
            <Button variant="secondary" onClick={() => { setSelectedMood(null); setGenerationInputType("manual"); }} disabled={!selectedMood}>
              Clear mood
            </Button>
            <Button variant="ghost" onClick={handleSaveFavorite} disabled={!selectedMood}>
              Save favorite
            </Button>
          </div>
          {generationInputType === "text" && selectedMood ? (
            <StatusBanner message={`Using detected ${selectedMood.name} mood for this generation.`} />
          ) : null}
          {catalogMessage ? <StatusBanner message={catalogMessage} tone="warning" /> : null}
          {statusMessage ? <StatusBanner message={statusMessage} /> : null}
          {favoriteMessage ? <StatusBanner message={favoriteMessage} tone={isAuthenticated ? "info" : "warning"} /> : null}
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
              Only one mood can be active at a time. Manual selection overrides detected mood for playlist history.
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
                onSelect={handleSelectMood}
              />
            ))}
          </div>
        ) : null}
      </section>

      {isLoading ? <LoadingState /> : null}

      <JournalInput
        value={journalText}
        onChange={setJournalText}
        onDetect={handleDetectMood}
        onGenerateDetected={handleGenerateDetected}
        detectedResult={detectedResult}
        detectedMood={detectedMood}
        isDetecting={isDetectingMood}
        error={journalError}
        isGenerateDisabled={!detectedMood || isLoading}
      />
    </section>
  );
}