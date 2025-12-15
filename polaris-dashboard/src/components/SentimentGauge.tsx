export type SentimentSlice = { label: string; value: number };

export function SentimentGauge(props: {
  topic: string;
  slices?: SentimentSlice[];
  comingSoon?: boolean;
}) {
  if (props.comingSoon) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <p className="text-sm font-medium text-zinc-900">{props.topic}</p>
        <p className="mt-1 text-sm text-zinc-600">
          Real-time social sentiment is coming soon. For V1 we’ll start with a
          simple keyword-based model and/or a free-tier API.
        </p>
      </div>
    );
  }

  const slices = props.slices ?? [
    { label: "Positive", value: 33 },
    { label: "Neutral", value: 34 },
    { label: "Negative", value: 33 },
  ];

  const total = slices.reduce((s, x) => s + x.value, 0) || 1;

  const colors: Record<string, string> = {
    Positive: "bg-emerald-600",
    Neutral: "bg-zinc-500",
    Negative: "bg-rose-600",
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-zinc-900">{props.topic}</p>
        <p className="mt-1 text-sm text-zinc-600">
          Share of recent posts by sentiment.
        </p>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
        <div className="flex h-full w-full">
          {slices.map((s) => (
            <div
              key={s.label}
              className={colors[s.label] ?? "bg-zinc-800"}
              style={{ width: `${(s.value / total) * 100}%` }}
              aria-label={`${s.label}: ${s.value}%`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {slices.map((s) => (
          <div key={s.label} className="rounded-lg bg-zinc-50 p-3">
            <div className="text-xs font-medium text-zinc-700">{s.label}</div>
            <div className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">
              {Math.round((s.value / total) * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
