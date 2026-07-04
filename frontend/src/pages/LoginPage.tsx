import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-slate-500">Coming in Phase 4</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Login</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Authentication is intentionally not implemented in Phase 2. This placeholder keeps the route consistent with the future app flow.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => navigate("/")}>Back home</Button>
        <Button onClick={() => navigate("/register")} variant="secondary">
          Register placeholder
        </Button>
      </div>
    </section>
  );
}
