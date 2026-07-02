import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Results", to: "/results" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" }
];

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <NavLink to="/" className="text-lg font-semibold text-slate-950">
          Mood Playlist
        </NavLink>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "font-semibold text-slate-950" : "hover:text-slate-950"
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

