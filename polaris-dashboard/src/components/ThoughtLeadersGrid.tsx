import type { ThoughtLeader } from "@/lib/data/thoughtLeaders";

function Pill(props: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-700">
      {props.children}
    </span>
  );
}

export function ThoughtLeadersGrid(props: { leaders: ThoughtLeader[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {props.leaders.map((leader) => (
        <div
          key={leader.handle}
          className="rounded-xl border border-zinc-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-zinc-900">
                {leader.name}
              </div>
              <div className="mt-0.5 truncate text-sm text-zinc-600">
                @{leader.handle}
              </div>
            </div>
            <Pill>{leader.leanLabel}</Pill>
          </div>

          <ul className="mt-3 space-y-2">
            {leader.latestPosts.slice(0, 3).map((p) => (
              <li key={p.id} className="rounded-lg bg-zinc-50 p-3">
                <div className="text-xs text-zinc-500">{p.publishedAt}</div>
                <div className="mt-1 text-sm text-zinc-900">{p.summary}</div>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs text-zinc-500">
            MVP note: Posts are mocked. Next step is fetching via RSS proxies or
            a lightweight backend endpoint.
          </p>
        </div>
      ))}
    </div>
  );
}
