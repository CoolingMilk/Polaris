import { ApprovalChart } from "@/components/ApprovalChart";
import { Card } from "@/components/Card";
import { IssuesRanking } from "@/components/IssuesRanking";
import { RefreshButton } from "@/components/RefreshButton";
import { SentimentGauge } from "@/components/SentimentGauge";
import { ThoughtLeadersGrid } from "@/components/ThoughtLeadersGrid";
import { getTrumpApprovalTrend } from "@/lib/data/approval";
import { getMockIssues } from "@/lib/data/issues";
import { getMockThoughtLeaders } from "@/lib/data/thoughtLeaders";

// Segment config (ISR): keep as a simple literal for build-time validation.
export const revalidate = 3600; // ~hourly

export default async function Home() {
  const [approvalTrend] = await Promise.all([
    getTrumpApprovalTrend({ days: 180 }),
  ]);

  const issues = getMockIssues();
  const thoughtLeaders = getMockThoughtLeaders();

  const latest = approvalTrend.points.at(-1);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Polaris Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Neutral, at-a-glance signals for US political sentiment and issue
              focus.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs text-zinc-500 sm:block">
              <div>
                Data refresh: <span className="font-medium">hourly</span>
              </div>
              <div>
                Updated: <span className="font-medium">{approvalTrend.updatedAt}</span>
              </div>
            </div>
            <RefreshButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card
            title="Overall leaning / sentiment"
            description="Approval trend (approve vs disapprove)."
            right={
              latest ? (
                <div className="text-right">
                  <div className="text-xs text-zinc-500">Latest</div>
                  <div className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900">
                    {latest.approve.toFixed(1)}% / {latest.disapprove.toFixed(1)}%
                  </div>
                </div>
              ) : null
            }
          >
            <ApprovalChart points={approvalTrend.points} />
            <p className="mt-3 text-xs text-zinc-500">
              Source: <a className="underline" href={approvalTrend.source.url} target="_blank" rel="noreferrer">{approvalTrend.source.label}</a>
              {" "}
              (MVP extraction; may fall back to mock if blocked.)
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Coming next: "Right direction / wrong track" trend card.
            </p>
          </Card>

          <Card
            title="Top issues"
            description="Top 10 issues Americans say matter most (mocked for MVP)."
          >
            <IssuesRanking issues={issues} />
            <p className="mt-3 text-xs text-zinc-500">
              TODO: scrape Gallup "Most Important Problem" table and cache server-side.
            </p>
          </Card>

          <Card
            title="Social sentiment"
            description="Real-time sentiment on key topics (V1: coming soon)."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <SentimentGauge topic="Economy" comingSoon />
              <SentimentGauge topic="Immigration" comingSoon />
              <SentimentGauge topic="Healthcare" comingSoon />
              <SentimentGauge topic="Foreign policy" comingSoon />
            </div>
          </Card>

          <Card
            title="Curated thought leaders"
            description="Balanced set of voices: 5 left, 5 center, 5 right (posts mocked)."
          >
            <ThoughtLeadersGrid leaders={thoughtLeaders} />
          </Card>
        </div>

        <footer className="mt-8 text-xs text-zinc-500">
          Polaris Dashboard is designed to be neutral and transparent about data sources.
        </footer>
      </main>
    </div>
  );
}
