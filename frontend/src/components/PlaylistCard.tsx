import { Button } from "./Button";
import type { Playlist } from "../types/playlist";

type PlaylistCardProps = {
  playlist: Playlist;
};

function sourceLabel(source: string) {
  if (source === "spotify") {
    return "Spotify";
  }
  if (source === "fallback") {
    return "Demo suggestions";
  }
  return source;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const artworkLabel = `${playlist.title} cover artwork`;

  return (
    <article className="overflow-hidden rounded-xl border border-white/60 bg-white/82 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex aspect-[16/9] items-end overflow-hidden p-4 text-white" style={{ background: playlist.coverGradient }}>
        {playlist.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt={artworkLabel}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-normal text-white/80">
            {sourceLabel(playlist.source)}
          </p>
          <h3 className="mt-1 text-xl font-bold">{playlist.title}</h3>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-slate-600">
          {playlist.description || "A playlist recommendation selected for this mood."}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">{playlist.trackCount ?? 0} tracks</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{playlist.mood}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{sourceLabel(playlist.source)}</span>
        </div>
        {playlist.tracks?.length ? (
          <ul className="space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
            {playlist.tracks.map((track) => (
              <li key={track.id} className="flex justify-between gap-3">
                <span>{track.title}</span>
                <span className="shrink-0 text-slate-400">{track.artist}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button onClick={() => window.open(playlist.externalUrl, "_blank", "noopener,noreferrer")}>Open Playlist</Button>
          <Button disabled variant="secondary" title="Save arrives in a later phase">
            Save soon
          </Button>
          <Button disabled variant="ghost" title="Sharing arrives in a later phase">
            Share soon
          </Button>
        </div>
      </div>
    </article>
  );
}
