import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";

export function SharedPlaylistPage() {
  const navigate = useNavigate();
  const { shareId } = useParams();

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-slate-500">Coming in Phase 6</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Shared Playlist</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Shared playlist links will be powered by the backend later. Current share id placeholder:
        <span className="ml-1 font-semibold text-slate-950">{shareId ?? "none"}</span>
      </p>
      <Button className="mt-6" onClick={() => navigate("/")}>Back home</Button>
    </section>
  );
}
