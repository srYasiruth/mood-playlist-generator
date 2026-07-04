import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { StatusBanner } from "../components/common/StatusBanner";
import { useAuth } from "../hooks/useAuth";
import type { AuthErrorResponse } from "../types/auth";

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (error.response?.data as AuthErrorResponse | undefined)?.message ?? "Login failed.";
  }
  return "Login failed.";
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sessionMessage } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";
      navigate(redirectTo);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-slate-500">Welcome back</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Login</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Sign in to save favorite moods and keep playlist generation history.
      </p>
      {sessionMessage ? <div className="mt-4"><StatusBanner message={sessionMessage} tone="warning" /></div> : null}
      {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</p> : null}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button disabled={isLoading} type="submit">{isLoading ? "Logging in..." : "Login"}</Button>
          <Button onClick={() => navigate("/register")} variant="secondary">Create account</Button>
        </div>
      </form>
    </section>
  );
}
