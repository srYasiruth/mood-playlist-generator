import type { Playlist } from "../types/playlist";

type PlaylistCardProps = {
  playlist: Playlist;
};

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-950">{playlist.title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        {playlist.provider} placeholder playlist for future music API results.
      </p>
    </article>
  );
}

