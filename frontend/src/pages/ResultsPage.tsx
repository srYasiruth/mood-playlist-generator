import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PlaylistCard } from "../components/PlaylistCard";
import { useMoodTheme } from "../hooks/useMoodTheme";
import { usePlaylistMock } from "../hooks/usePlaylistMock";
import type { Mood } from "../types/mood";
import type { Playlist } from "../types/playlist";

type ResultsLocationState = {
  mood?: Mood;
  playlists?: Playlist[];
};

export function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as ResultsLocationState | null;
  const { selectedMood, setSelectedMood, theme } = useMoodTheme();
  const { playlists, setPlaylists, isLoading, error, generate } = usePlaylistMock();
  const activeMood = routeState?.mood ?? selectedMood;

  useEffect(() => {
    if (routeState?.mood) {
      setSelectedMood(routeState.mood);
    }

    if (routeState?.playlists?.length) {
      setPlaylists(routeState.playlists);
    }
  }, [routeState?.mood, routeState?.playlists, setPlaylists, setSelectedMood]);

  useEffect(() => {
    if (!routeState?.playlists?.length && activeMood && playlists.length === 0 && !isLoading) {
      generate(activeMood);
    }
  }, [activeMood, generate, isLoading, playlists.length, routeState?.playlists?.length]);

  const handleRegenerate = async () => {
    if (activeMood) {
      await generate(activeMood);
    }
  };

  if (!activeMood) {
    return (
      <EmptyState
        title="Choose a mood first"
        message="Playlist results need a selected mood. Head back home, pick the feeling that fits, and generate your mock recommendations."
        action={<Button onClick={() => navigate("/")}>Back to Home</Button>}
      />
    );
  }

  return (
    <section className="space-y-7">
      <div className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal" style={{ color: theme.accent }}>
              Mock playlist results
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              {activeMood.emoji} {activeMood.name} recommendations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              These cards use local mock data for Phase 2. Spotify and YouTube calls will be routed through the backend in a later phase.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleRegenerate} disabled={isLoading}>
              {isLoading ? "Regenerating..." : "Regenerate"}
            </Button>
            <Button onClick={() => navigate("/")} variant="secondary">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {error ? <ErrorState message={error} onRetry={handleRegenerate} /> : null}
      {isLoading ? <LoadingState /> : null}
      {!isLoading && playlists.length === 0 ? (
        <EmptyState
          title="No playlists yet"
          message="Use Regenerate to create mock playlists for the selected mood."
          action={<Button onClick={handleRegenerate}>Generate now</Button>}
        />
      ) : null}
      {!isLoading && playlists.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
