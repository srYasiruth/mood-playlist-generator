import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PlaylistCard } from "../components/PlaylistCard";
import { getSharedPlaylist } from "../services/shareService";
import type { SharedPlaylistPublic } from "../types/share";

function getSharedErrorMessage(error: unknown) {
  if (error instanceof AxiosError && error.response?.status === 404) {
    return "This shared playlist link is no longer available.";
  }
  return "Could not load this shared playlist. Please check the link and try again.";
}

export function SharedPlaylistPage() {
  const navigate = useNavigate();
  const { shareId } = useParams();
  const [sharedPlaylist, setSharedPlaylist] = useState<SharedPlaylistPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSharedPlaylist() {
    if (!shareId) {
      setError("Shared playlist link is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getSharedPlaylist(shareId);
      setSharedPlaylist(data);
    } catch (loadError) {
      setError(getSharedErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSharedPlaylist();
  }, [shareId]);

  if (isLoading) {
    return <LoadingState message="Loading shared playlist..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadSharedPlaylist}
      />
    );
  }

  if (!sharedPlaylist) {
    return (
      <EmptyState
        title="Shared playlist not found"
        message="This link may have been disabled or mistyped."
        action={<Button onClick={() => navigate("/")}>Generate your own playlist</Button>}
      />
    );
  }

  return (
    <section className="space-y-7">
      <div className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Shared playlist</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
          {sharedPlaylist.mood} recommendations
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          {sharedPlaylist.query ? `Query: ${sharedPlaylist.query} · ` : ""}
          Source: {sharedPlaylist.source} · {sharedPlaylist.inputType === "text" ? "Journal detected" : "Manual mood"}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Shared links include playlist details only. Private account details and journal text are not included.
        </p>
        <Button className="mt-5" onClick={() => navigate("/")}>Generate your own playlist</Button>
      </div>

      {sharedPlaylist.playlists.length === 0 ? (
        <EmptyState title="No playlists in this share" message="The shared playlist result is empty." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {sharedPlaylist.playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </section>
  );
}