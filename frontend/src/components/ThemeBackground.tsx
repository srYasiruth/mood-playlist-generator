import type { ReactNode } from "react";
import { useMoodTheme } from "../hooks/useMoodTheme";

type ThemeBackgroundProps = {
  children: ReactNode;
};

export function ThemeBackground({ children }: ThemeBackgroundProps) {
  const { theme } = useMoodTheme();

  return (
    <div
      className="min-h-screen text-slate-950 transition-colors duration-500"
      style={{ background: theme.background }}
    >
      <div className="min-h-screen bg-white/10 backdrop-blur-[1px]">{children}</div>
    </div>
  );
}
