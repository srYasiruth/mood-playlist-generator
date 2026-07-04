import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { StatusBanner } from "../components/common/StatusBanner";
import { enrichMood } from "../data/moods";
import { useAuth } from "../hooks/useAuth";
import { generatePlaylists } from "../services/playlistService";
import { createShareLink, disableShareLink } from "../services/shareService";
import {
  clearPlaylistHistory,
  deletePlaylistHistoryItem,
  getDashboardStats,
  removeFavoriteMood,
  type DashboardStats
} from "../services/userService";
import type { Mood } from "../types/mood";
import type { PlaylistInputType } from "../types/playlist";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  return false;
}

function labelMood(mood: string | null) {
  return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : "None yet";
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/82 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      setError("Could not load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [isAuthenticated]);

  const handleGenerateMood = async (mood: Mood, inputType: PlaylistInputType = "manual") => {
    setActionId(`generate-${mood.id}`);
    setMessage(null);
    try {
      const response = await generatePlaylists(mood, 8, inputType);
      navigate("/results", {
        state: {
          mood,
          playlists: response.playlists,
          playlistResponse: response,
          inputType: response.inputType ?? inputType
        }
      });
    } catch {
      setMessage("Could not generate from this shortcut. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const handleGenerateFavorite = async (favorite: DashboardStats["favoriteMoods"][number]) => {
    const mood = enrichMood({
      id: favorite.mood.key,
      name: favorite.mood.name,
      description: favorite.mood.description ?? undefined
    });
    await handleGenerateMood(mood, "manual");
  };

  const handleGenerateAgain = async (history: DashboardStats["recentHistory"][number]) => {
    const mood = enrichMood({ id: history.mood, name: labelMood(history.mood) });
    await handleGenerateMood(mood, history.inputType === "text" ? "text" : "manual");
  };

  const handleRemoveFavorite = async (id: string) => {
    setActionId(id);
    await removeFavoriteMood(id);
    setMessage("Favorite mood removed.");
    await loadDashboard();
    setActionId(null);
  };

  const handleDeleteHistory = async (id: string) => {
    setActionId(id);
    await deletePlaylistHistoryItem(id);
    setMessage("Playlist history item deleted.");
    await loadDashboard();
    setActionId(null);
  };

  const handleClearHistory = async () => {
    setActionId("clear-history");
    await clearPlaylistHistory();
    setMessage("Playlist history cleared.");
    await loadDashboard();
    setActionId(null);
  };

  const handleShareHistory = async (historyId: string) => {
    setActionId(`share-${historyId}`);
    setMessage(null);
    setShareUrl(null);
    try {
      const share = await createShareLink(historyId);
      if (share.shareUrl) {
        setShareUrl(share.shareUrl);
        const copied = await copyText(share.shareUrl);
        setMessage(copied ? "Share link copied." : "Share link created. Copy it below.");
      } else {
        setMessage("Share link created.");
      }
      await loadDashboard();
    } catch {
      setMessage("Could not create a share link for this history item.");
    } finally {
      setActionId(null);
    }
  };

  const handleCopyShare = async (url: string) => {
    setShareUrl(url);
    const copied = await copyText(url);
    setMessage(copied ? "Share link copied." : "Copy the share link below.");
  };

  const handleDisableShare = async (shareId: string) => {
    setActionId(shareId);
    await disableShareLink(shareId);
    setMessage("Share link disabled.");
    await loadDashboard();
    setActionId(null);
  };

  if (authLoading) {
    return <LoadingState message="Checking your session..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <EmptyState
        title="Log in to view your dashboard"
        message="Your favorite moods, analytics, share links, and playlist history are saved only when you are signed in."
        action={<Button onClick={() => navigate("/login", { state: { from: "/dashboard" } })}>Login</Button>}
      />
    );
  }

  const maxMoodCount = Math.max(1, ...(stats?.moodCounts.map((item) => item.count) ?? [1]));

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
        <p className="text-sm font-semibold text-slate-500">Your account</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Dashboard</h1>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Journal text is not stored by default. Shared links do not include private account details.
        </p>
        <Button className="mt-6" onClick={() => navigate("/")}>Generate a playlist</Button>
      </div>

      {message ? <StatusBanner message={message} /> : null}
      {shareUrl ? (
        <div className="rounded-xl border border-white/60 bg-white/78 p-4 shadow-sm backdrop-blur">
          <label htmlFor="dashboard-share-url" className="text-sm font-bold text-slate-950">Share URL</label>
          <input
            id="dashboard-share-url"
            readOnly
            value={shareUrl}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            onFocus={(event) => event.target.select()}
          />
        </div>
      ) : null}
      {error ? <ErrorState message={error} onRetry={loadDashboard} /> : null}
      {isLoading ? <LoadingState message="Loading dashboard analytics..." /> : null}

      {stats ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Generated" value={stats.totalPlaylistsGenerated} />
            <StatCard label="Manual" value={stats.manualGenerations} />
            <StatCard label="Journal" value={stats.textGenerations} />
            <StatCard label="Favorites" value={stats.favoriteMoodCount} />
            <StatCard label="Active shares" value={stats.sharedPlaylistCount} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
              <h2 className="text-2xl font-black text-slate-950">Mood analytics</h2>
              <p className="mt-1 text-sm text-slate-600">Most selected: {labelMood(stats.mostSelectedMood)}</p>
              {stats.moodCounts.length === 0 ? (
                <p className="mt-5 rounded-xl bg-white/70 p-5 text-sm text-slate-600">No mood analytics yet.</p>
              ) : (
                <div className="mt-5 space-y-3">
                  {stats.moodCounts.map((item) => (
                    <div key={item.mood}>
                      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
                        <span>{labelMood(item.mood)}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-950" style={{ width: `${Math.max(8, (item.count / maxMoodCount) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
              <h2 className="text-2xl font-black text-slate-950">Favorite mood shortcuts</h2>
              <p className="mt-1 text-sm text-slate-600">Generate quickly from moods you saved.</p>
              {stats.favoriteMoods.length === 0 ? (
                <p className="mt-5 rounded-xl bg-white/70 p-5 text-sm text-slate-600">No favorites yet.</p>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {stats.favoriteMoods.map((favorite) => (
                    <article key={favorite.id} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm">
                      <h3 className="font-bold text-slate-950">{favorite.mood.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">{favorite.mood.description ?? "Saved mood"}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => handleGenerateFavorite(favorite)} disabled={actionId === `generate-${favorite.mood.key}`} variant="secondary">
                          Generate
                        </Button>
                        <Button onClick={() => handleRemoveFavorite(favorite.id)} disabled={actionId === favorite.id} variant="ghost">
                          Remove
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Recent playlist history</h2>
                <p className="mt-1 text-sm text-slate-600">Generate again, share, or remove recent items.</p>
              </div>
              <Button disabled={stats.recentHistory.length === 0 || actionId === "clear-history"} onClick={handleClearHistory} variant="secondary">Clear history</Button>
            </div>
            {stats.recentHistory.length === 0 ? (
              <p className="mt-5 rounded-xl bg-white/70 p-5 text-sm text-slate-600">No playlist history yet.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {stats.recentHistory.map((item) => (
                  <article key={item.id} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold text-slate-950">{labelMood(item.mood)}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.searchQuery ?? "No query"} | {item.apiSource} | {item.inputType} | {item.playlistCount} playlists
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleGenerateAgain(item)} disabled={actionId === `generate-${item.mood}`} variant="secondary">Generate again</Button>
                        <Button onClick={() => handleShareHistory(item.id)} disabled={actionId === `share-${item.id}`}>Share</Button>
                        <Button onClick={() => handleDeleteHistory(item.id)} disabled={actionId === item.id} variant="ghost">Delete</Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/60 bg-white/78 p-6 shadow-xl backdrop-blur">
            <h2 className="text-2xl font-black text-slate-950">Active shared links</h2>
            <p className="mt-1 text-sm text-slate-600">Public links show playlist data only, never your private account details.</p>
            {stats.activeShares.length === 0 ? (
              <p className="mt-5 rounded-xl bg-white/70 p-5 text-sm text-slate-600">No active shares yet.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {stats.activeShares.map((share) => (
                  <article key={share.shareId} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold text-slate-950">{labelMood(share.mood)}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {share.query ?? "No query"} | {share.source} | {share.inputType}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">{share.shareUrl}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => window.open(share.shareUrl, "_blank", "noopener,noreferrer")} variant="secondary">Open</Button>
                        <Button onClick={() => handleCopyShare(share.shareUrl)}>Copy</Button>
                        <Button onClick={() => handleDisableShare(share.shareId)} disabled={actionId === share.shareId} variant="ghost">Disable</Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}