import { useParams } from "react-router-dom";

export function SharedPlaylistPage() {
  const { shareId } = useParams();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-950">Shared Playlist</h1>
      <p className="text-slate-600">
        Shared playlist placeholder for share id: <span className="font-medium">{shareId}</span>
      </p>
    </section>
  );
}

