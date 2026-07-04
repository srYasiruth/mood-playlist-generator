type StatusBannerProps = {
  message: string;
  tone?: "info" | "warning";
};

export function StatusBanner({ message, tone = "info" }: StatusBannerProps) {
  const toneClass =
    tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-sky-200 bg-sky-50 text-sky-900";

  return <p className={`rounded-lg border px-4 py-3 text-sm ${toneClass}`}>{message}</p>;
}
