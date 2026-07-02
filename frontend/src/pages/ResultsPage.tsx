import { PlaylistCard } from "../components/PlaylistCard";
import type { Playlist } from "../types/playlist";

const placeholderPlaylists: Playlist[] = [
  {
    id: "phase-1",
    title: "Future Playlist Results",
    provider: "Spotify",
    externalUrl: ""
  }
];

export function ResultsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Results</h1>
        <p className="mt-2 text-slate-600">Playlist results will appear here in a future phase.</p>
      </div>
      {placeholderPlaylists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </section>
  );
}

