import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-slate-500">Coming in Phase 4</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Register</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Account creation, JWT handling, and saved history arrive after the backend auth phase.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => navigate("/")}>Back home</Button>
        <Button onClick={() => navigate("/login")} variant="secondary">
          Login placeholder
        </Button>
      </div>
    </section>
  );
}
