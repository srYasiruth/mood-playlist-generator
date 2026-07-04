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
import { createShareLink } from "../services/shareService";
import { saveFavoriteMood } from "../services/userService";
import type { Mood } from "../types/mood";
import type { Playlist, PlaylistGenerationResponse, PlaylistInputType } from "../types/playlist";

type ResultsLocationState = {
  mood?: Mood;
  playlists?: Playlist[];
  playlistResponse?: PlaylistGenerationResponse;
  inputType?: PlaylistInputType;
};

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  return false;
}

export function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as ResultsLocationState | null;
  const { selectedMood, setSelectedMood, theme } = useMoodTheme();
  const { isAuthenticated } = useAuth();
  const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [inputType, setInputType] = useState<PlaylistInputType>(routeState?.inputType ?? routeState?.playlistResponse?.inputType ?? "manual");
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
      setInputType(routeState.playlistResponse.inputType ?? routeState.inputType ?? "manual");
    } else if (routeState?.inputType) {
      setInputType(routeState.inputType);
    }
  }, [routeState?.inputType, routeState?.mood, routeState?.playlistResponse, routeState?.playlists, setLastResponse, setPlaylists, setSelectedMood, setStatusMessage]);

  useEffect(() => {
    if (!routeState?.playlists?.length && activeMood && playlists.length === 0 && !isLoading) {
      generate(activeMood, inputType);
    }
  }, [activeMood, generate, inputType, isLoading, playlists.length, routeState?.playlists?.length]);

  const handleRegenerate = async () => {
    if (activeMood) {
      const response = await regenerate(activeMood, inputType);
      if (response?.historyId) {
        setShareUrl(null);
        setShareMessage(null);
      }
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

  const handleShare = async () => {
    setShareMessage(null);
    if (!isAuthenticated) {
      setShareMessage("Please log in to create shareable links.");
      return;
    }

    const historyId = lastResponse?.historyId;
    if (!historyId) {
      setShareMessage("Generate a playlist while logged in before creating a share link.");
      return;
    }

    setIsSharing(true);
    try {
      const share = await createShareLink(historyId);
      if (share.shareUrl) {
        setShareUrl(share.shareUrl);
        const copied = await copyText(share.shareUrl);
        setShareMessage(copied ? "Share link copied." : "Share link created. Copy it below.");
      } else {
        setShareUrl(share.shareId);
        setShareMessage("Share link created. Copy the share id below.");
      }
    } catch {
      setShareMessage("Could not create a share link. Please try again.");
    } finally {
      setIsSharing(false);
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
              {inputType === "text" ? " · Journal detected mood" : ""}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleRegenerate} disabled={isLoading}>
              {isLoading ? "Regenerating..." : "Regenerate"}
            </Button>
            <Button onClick={handleShare} disabled={isSharing} variant="secondary">
              {isSharing ? "Sharing..." : "Share"}
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
      {shareMessage ? <StatusBanner message={shareMessage} tone={isAuthenticated ? "info" : "warning"} /> : null}
      {shareUrl ? (
        <div className="rounded-xl border border-white/60 bg-white/78 p-4 shadow-sm backdrop-blur">
          <label htmlFor="share-url" className="text-sm font-bold text-slate-950">Share URL</label>
          <input
            id="share-url"
            readOnly
            value={shareUrl}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            onFocus={(event) => event.target.select()}
          />
        </div>
      ) : null}
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