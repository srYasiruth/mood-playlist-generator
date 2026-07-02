import type { ReactNode } from "react";

type ThemeBackgroundProps = {
  children: ReactNode;
};

export function ThemeBackground({ children }: ThemeBackgroundProps) {
  return <div className="min-h-screen bg-slate-50 text-slate-950">{children}</div>;
}

