import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { StatusBanner } from "../components/common/StatusBanner";
import { PlaylistCard } from "../components/PlaylistCard";
import { useAuth } from "../hooks/useAuth";
import { useMoodTheme } from "../hooks/useMoodTheme";
import { usePlaylistMock } from "../hooks/usePlaylistMock";
import { saveFavoriteMood } from "../services/userService";
import type { Mood } from "../types/mood";
import type { Playlist, PlaylistGenerationResponse } from "../types/playlist";

type ResultsLocationState = {
  mood?: Mood;
  playlists?: Playlist[];
  playlistResponse?: PlaylistGenerationResponse;
};

export function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as ResultsLocationState | null;
  const { selectedMood, setSelectedMood, theme } = useMoodTheme();
  const { isAuthenticated } = useAuth();
  const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null);
  const {
    playlists,
    setPlaylists,
    isLoading,
    error,
    statusMessage,
    setStatusMessage,
    lastResponse,
    setLastResponse,
    generate,
    regenerate
  } = usePlaylistMock();
  const activeMood = routeState?.mood ?? selectedMood;

  useEffect(() => {
    if (routeState?.mood) {
      setSelectedMood(routeState.mood);
    }

    if (routeState?.playlists?.length) {
      setPlaylists(routeState.playlists);
    }

    if (routeState?.playlistResponse) {
      setLastResponse(routeState.playlistResponse);
      setStatusMessage(routeState.playlistResponse.meta?.message ?? null);
    }
  }, [routeState?.mood, routeState?.playlistResponse, routeState?.playlists, setLastResponse, setPlaylists, setSelectedMood, setStatusMessage]);

  useEffect(() => {
    if (!routeState?.playlists?.length && activeMood && playlists.length === 0 && !isLoading) {
      generate(activeMood);
    }
  }, [activeMood, generate, isLoading, playlists.length, routeState?.playlists?.length]);

  const handleRegenerate = async () => {
    if (activeMood) {
      await regenerate(activeMood);
    }
  };

  const handleSaveFavorite = async () => {
    if (!activeMood) {
      return;
    }

    if (!isAuthenticated) {
      setFavoriteMessage("Please log in to save favorite moods.");
      return;
    }

    try {
      await saveFavoriteMood(activeMood);
      setFavoriteMessage(`${activeMood.name} saved to your favorite moods.`);
    } catch {
      setFavoriteMessage("Could not save this favorite mood. Please try again.");
    }
  };

  if (!activeMood) {
    return (
      <EmptyState
        title="Choose a mood first"
        message="Playlist results need a selected mood. Head back home, pick the feeling that fits, and generate your recommendations."
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
              Playlist results
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              {activeMood.emoji} {activeMood.name} recommendations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Query: <span className="font-semibold text-slate-950">{lastResponse?.query ?? "selecting..."}</span>
              {lastResponse?.meta?.cached ? " · Cached response" : ""}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleRegenerate} disabled={isLoading}>
              {isLoading ? "Regenerating..." : "Regenerate"}
            </Button>
            <Button onClick={() => navigate("/")} variant="secondary">
              Back to Home
            </Button>
            <Button onClick={handleSaveFavorite} variant="ghost">
              Save mood
            </Button>
          </div>
        </div>
      </div>

      {statusMessage ? <StatusBanner message={statusMessage} /> : null}
      {favoriteMessage ? <StatusBanner message={favoriteMessage} tone={isAuthenticated ? "info" : "warning"} /> : null}
      {error ? <ErrorState message={error} onRetry={handleRegenerate} /> : null}
      {isLoading ? <LoadingState /> : null}
      {!isLoading && playlists.length === 0 ? (
        <EmptyState
          title="No playlists yet"
          message="Use Regenerate to create playlists for the selected mood."
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
