"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ApprovalTrendPoint } from "@/lib/data/approval";

function formatShortDate(isoDate: string): string {
  // isoDate: YYYY-MM-DD
  const [y, m, d] = isoDate.split("-").map((x) => Number(x));
  if (!y || !m || !d) return isoDate;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });
}

export function ApprovalChart(props: {
  points: ApprovalTrendPoint[];
  height?: number;
}) {
  const height = props.height ?? 280;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const data = useMemo(() => props.points, [props.points]);

  if (!mounted) {
    return (
      <div
        className="w-full animate-pulse rounded-xl bg-zinc-100"
        style={{ height }}
        aria-label="Loading chart"
      />
    );
  }

  return (
    <div className="min-w-0 w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fill: "#52525b", fontSize: 12 }}
            minTickGap={24}
          />
          <YAxis
            domain={[30, 70]}
            tick={{ fill: "#52525b", fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            labelFormatter={(label) => label}
            formatter={(value: unknown, name: unknown) => {
              if (typeof value === "number") return [`${value.toFixed(1)}%`, String(name)];
              return [String(value), String(name)];
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
              background: "rgba(255,255,255,0.98)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="approve"
            name="Approve"
            stroke="#0f172a"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="disapprove"
            name="Disapprove"
            stroke="#64748b"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
