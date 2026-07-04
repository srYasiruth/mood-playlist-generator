import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import type { AuthErrorResponse } from "../types/auth";

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (error.response?.data as AuthErrorResponse | undefined)?.message ?? "Registration failed.";
  }
  return "Registration failed.";
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, confirmPassword });
      navigate("/dashboard");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-slate-500">Create your account</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Register</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Save favorite moods and keep a private history of generated playlist recommendations.
      </p>
      {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</p> : null}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" autoComplete="name" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" autoComplete="email" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" autoComplete="new-password" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" autoComplete="new-password" />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button disabled={isLoading} type="submit">{isLoading ? "Creating..." : "Create account"}</Button>
          <Button onClick={() => navigate("/login")} variant="secondary">Login instead</Button>
        </div>
      </form>
    </section>
  );
}
