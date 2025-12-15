import { unstable_cache } from "next/cache";

export type ApprovalTrendPoint = {
  /** ISO date (YYYY-MM-DD) */
  date: string;
  approve: number;
  disapprove: number;
  /** approve - disapprove */
  net: number;
};

export type ApprovalTrend = {
  source: {
    /** Human-readable source label */
    label: string;
    /** Source page URL */
    url: string;
  };
  /** ISO timestamp */
  updatedAt: string;
  points: ApprovalTrendPoint[];
};

const RCPOLL_TRUMP_APPROVAL_URL =
  "https://www.realclearpolling.com/polls/approval/donald-trump/approval-rating";

function parseYmdToIsoDate(ymdWithSlashes: string): string | null {
  // Input: YYYY/MM/DD
  const m = /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/.exec(ymdWithSlashes);
  if (!m) return null;
  const [, y, mo, d] = m;
  return `${y}-${mo}-${d}`;
}

function clampPercent(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function extractPollPointsFromHtml(html: string): ApprovalTrendPoint[] {
  // RealClearPolling is a Next.js site and often embeds poll objects inside
  // inlined, escaped JSON strings. We intentionally do a lightweight regex
  // extraction here for MVP robustness (no private API reliance).
  //
  // We look for patterns like:
  //   \"data_end_date\":\"2025/05/29\" ... \"candidate\":[{\"name\":\"Approve\"...\"value\":\"53\"}, ...]
  //
  // NOTE: This may break if the page markup changes.
  const pollRegex =
    /\\"data_end_date\\":\\"([0-9]{4}\/[0-9]{2}\/[0-9]{2})\\"[\s\S]*?\\"candidate\\":\\\[([\s\S]*?)\\\]\s*,\\"undecided\\"/g;

  const pointsByDate = new Map<
    string,
    { approveSum: number; disapproveSum: number; count: number }
  >();

  for (const match of html.matchAll(pollRegex)) {
    const endDate = match[1];
    const candidates = match[2] ?? "";

    const iso = parseYmdToIsoDate(endDate);
    if (!iso) continue;

    const approveMatch =
      /\\"name\\":\\"Approve\\"[\s\S]*?\\"value\\":\\"([0-9]+(?:\.[0-9]+)?)\\"/.exec(
        candidates,
      );
    const disapproveMatch =
      /\\"name\\":\\"Disapprove\\"[\s\S]*?\\"value\\":\\"([0-9]+(?:\.[0-9]+)?)\\"/.exec(
        candidates,
      );

    if (!approveMatch || !disapproveMatch) continue;

    const approve = clampPercent(Number(approveMatch[1]));
    const disapprove = clampPercent(Number(disapproveMatch[1]));

    const prev = pointsByDate.get(iso) ?? {
      approveSum: 0,
      disapproveSum: 0,
      count: 0,
    };

    pointsByDate.set(iso, {
      approveSum: prev.approveSum + approve,
      disapproveSum: prev.disapproveSum + disapprove,
      count: prev.count + 1,
    });
  }

  const points: ApprovalTrendPoint[] = [];
  for (const [date, agg] of pointsByDate.entries()) {
    const approve = agg.approveSum / agg.count;
    const disapprove = agg.disapproveSum / agg.count;
    points.push({
      date,
      approve: Number(approve.toFixed(1)),
      disapprove: Number(disapprove.toFixed(1)),
      net: Number((approve - disapprove).toFixed(1)),
    });
  }

  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}

function mockTrend(): ApprovalTrend {
  const today = new Date();
  const points: ApprovalTrendPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const date = d.toISOString().slice(0, 10);
    const approve = 44 + Math.sin(i / 6) * 1.2;
    const disapprove = 51 + Math.cos(i / 7) * 1.0;
    points.push({
      date,
      approve: Number(approve.toFixed(1)),
      disapprove: Number(disapprove.toFixed(1)),
      net: Number((approve - disapprove).toFixed(1)),
    });
  }

  return {
    source: {
      label: "Mock (offline)",
      url: "",
    },
    updatedAt: new Date().toISOString(),
    points,
  };
}

const getCachedExtractedPoints = unstable_cache(
  async (): Promise<ApprovalTrendPoint[]> => {
    const res = await fetch(RCPOLL_TRUMP_APPROVAL_URL, {
      // The HTML response is large (>2MB) and cannot be stored in Next's data cache.
      // We fetch without caching, then cache only the small extracted result.
      cache: "no-store",
      headers: {
        // Some sites behave better with a UA.
        "user-agent":
          "Mozilla/5.0 (compatible; PolarisDashboard/1.0; +https://example.com)",
        "accept-language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    return extractPollPointsFromHtml(html);
  },
  ["polaris:approval:rcpoll:extracted"],
  { revalidate: 60 * 60 },
);

export async function getTrumpApprovalTrend(options?: {
  /** How far back to keep points (in days). */
  days?: number;
}): Promise<ApprovalTrend> {
  const days = options?.days ?? 365;

  try {
    const extracted = await getCachedExtractedPoints();

    // If extraction fails (markup change), fall back to mock rather than breaking the UI.
    if (extracted.length < 10) return mockTrend();

    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - days);
    const cutoffIso = cutoff.toISOString().slice(0, 10);

    const points = extracted.filter((p) => p.date >= cutoffIso);

    return {
      source: {
        label: "RealClearPolling (poll list → daily average)",
        url: RCPOLL_TRUMP_APPROVAL_URL,
      },
      updatedAt: new Date().toISOString(),
      points,
    };
  } catch {
    return mockTrend();
  }
}
