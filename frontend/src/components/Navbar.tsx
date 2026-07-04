import { NavLink } from "react-router-dom";
import { useMoodTheme } from "../hooks/useMoodTheme";

const links = [
  { label: "Home", to: "/" },
  { label: "Results", to: "/results" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" }
];

export function Navbar() {
  const { selectedMood, theme } = useMoodTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <NavLink to="/" className="flex items-center gap-3 text-lg font-bold text-slate-950">
          <span
            className="grid size-10 place-items-center rounded-lg text-lg text-white shadow-sm"
            style={{ background: theme.coverGradient }}
            aria-hidden="true"
          >
            ♪
          </span>
          <span>Mood Playlist</span>
        </NavLink>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {selectedMood ? (
            <span className="mr-1 rounded-full bg-white/70 px-3 py-1 font-medium text-slate-700">
              {selectedMood.emoji} {selectedMood.name}
            </span>
          ) : null}
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 transition ${
                  isActive ? "bg-slate-950 text-white" : "hover:bg-white/70 hover:text-slate-950"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
