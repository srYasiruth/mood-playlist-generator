import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
        <p className="text-sm font-semibold text-slate-500">Coming in Phase 6</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Favorite moods, playlist history, and sharing analytics are planned for later phases. The route is styled now so navigation feels complete.
        </p>
        <Button className="mt-6" onClick={() => navigate("/")}>Explore moods</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Favorite moods", "Playlist history", "Shared playlists"].map((item) => (
          <article key={item} className="rounded-xl border border-white/60 bg-white/76 p-5 shadow-sm backdrop-blur">
            <h2 className="font-bold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm text-slate-600">Placeholder module for a future authenticated dashboard.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
