import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseClass =
    "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55";
  const variantClass = {
    primary: "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:outline-slate-950",
    secondary:
      "border border-slate-300 bg-white/80 text-slate-950 shadow-sm hover:bg-white focus-visible:outline-slate-700",
    ghost: "text-slate-700 hover:bg-white/60 focus-visible:outline-slate-700"
  }[variant];

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}
