import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-800"
      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50";

  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${variantClass} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

