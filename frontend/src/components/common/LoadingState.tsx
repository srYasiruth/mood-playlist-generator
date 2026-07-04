type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Finding playlists that fit your mood..." }: LoadingStateProps) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-8 text-center shadow-sm backdrop-blur" role="status">
      <div className="mx-auto size-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
      <p className="mt-4 font-medium text-slate-700">{message}</p>
    </div>
  );
}
