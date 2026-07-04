import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { StatusBanner } from "../components/common/StatusBanner";
import { useAuth } from "../hooks/useAuth";
import {
  clearPlaylistHistory,
  deletePlaylistHistoryItem,
  getFavoriteMoods,
  getPlaylistHistory,
  removeFavoriteMood,
  type FavoriteMood,
  type PlaylistHistoryItem
} from "../services/userService";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMood[]>([]);
  const [history, setHistory] = useState<PlaylistHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [favoriteItems, historyResponse] = await Promise.all([
        getFavoriteMoods(),
        getPlaylistHistory(1, 10)
      ]);
      setFavorites(favoriteItems);
      setHistory(historyResponse.items);
    } catch {
      setError("Could not load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [isAuthenticated]);

  const handleRemoveFavorite = async (id: string) => {
    await removeFavoriteMood(id);
    setFavorites((items) => items.filter((item) => item.id !== id));
    setMessage("Favorite mood removed.");
  };

  const handleDeleteHistory = async (id: string) => {
    await deletePlaylistHistoryItem(id);
    setHistory((items) => items.filter((item) => item.id !== id));
    setMessage("Playlist history item deleted.");
  };

  const handleClearHistory = async () => {
    await clearPlaylistHistory();
    setHistory([]);
    setMessage("Playlist history cleared.");
  };

  if (authLoading) {
    return <LoadingState message="Checking your session..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <EmptyState
        title="Log in to view your dashboard"
        message="Your favorite moods and playlist history are saved only when you are signed in."
        action={<Button onClick={() => navigate("/login", { state: { from: "/dashboard" } })}>Login</Button>}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
        <p className="text-sm font-semibold text-slate-500">Your account</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Dashboard</h1>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
        </div>
        <Button className="mt-6" onClick={() => navigate("/")}>Generate a playlist</Button>
      </div>

      {message ? <StatusBanner message={message} /> : null}
      {error ? <ErrorState message={error} onRetry={loadDashboard} /> : null}
      {isLoading ? <LoadingState message="Loading your saved data..." /> : null}

      <section className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Favorite moods</h2>
            <p className="mt-1 text-sm text-slate-600">Save moods from the Home or Results page.</p>
          </div>
        </div>
        {favorites.length === 0 ? (
          <p className="mt-5 rounded-xl bg-white/70 p-5 text-sm text-slate-600">No favorites yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <article key={favorite.id} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">{favorite.mood.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{favorite.mood.description ?? "Saved mood"}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => navigate("/")} variant="secondary">Use mood</Button>
                  <Button onClick={() => handleRemoveFavorite(favorite.id)} variant="ghost">Remove</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Playlist history</h2>
            <p className="mt-1 text-sm text-slate-600">Generated while signed in.</p>
          </div>
          <Button disabled={history.length === 0} onClick={handleClearHistory} variant="secondary">Clear history</Button>
        </div>
        {history.length === 0 ? (
          <p className="mt-5 rounded-xl bg-white/70 p-5 text-sm text-slate-600">No playlist history yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {history.map((item) => {
              const playlistCount = item.resultData?.playlists?.length ?? 0;
              const firstPlaylist = item.resultData?.playlists?.[0];
              return (
                <article key={item.id} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-bold text-slate-950">{item.mood}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.searchQuery ?? "No query"} · {item.apiSource} · {playlistCount} playlists
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {firstPlaylist ? (
                        <Button onClick={() => window.open(firstPlaylist.externalUrl, "_blank", "noopener,noreferrer")}>Open first</Button>
                      ) : null}
                      <Button onClick={() => handleDeleteHistory(item.id)} variant="ghost">Delete</Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
