import type { IssueItem } from "@/lib/data/issues";

export function IssuesRanking(props: { issues: IssueItem[] }) {
  return (
    <ol className="space-y-3">
      {props.issues.slice(0, 10).map((it, idx) => (
        <li key={it.issue} className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
            {idx + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium text-zinc-900">
                {it.issue}
              </span>
              <span className="text-sm tabular-nums text-zinc-700">
                {it.percent}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-zinc-800"
                style={{ width: `${Math.min(100, Math.max(0, it.percent))}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
