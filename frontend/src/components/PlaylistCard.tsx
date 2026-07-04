import { Button } from "./Button";
import type { Playlist } from "../types/playlist";

type PlaylistCardProps = {
  playlist: Playlist;
};

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/60 bg-white/82 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <div
        className="flex aspect-[16/9] items-end p-4 text-white"
        style={{ background: playlist.coverGradient }}
        role="img"
        aria-label={`${playlist.title} cover artwork placeholder`}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-white/80">
            {playlist.provider} placeholder
          </p>
          <h3 className="mt-1 text-xl font-bold">{playlist.title}</h3>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-slate-600">{playlist.description}</p>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">{playlist.trackCount} tracks</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{playlist.moodTag}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">Mock data</span>
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
          <Button onClick={() => window.open(playlist.externalUrl, "_blank", "noopener,noreferrer")}>
            Open Playlist
          </Button>
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
