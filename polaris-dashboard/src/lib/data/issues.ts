export type IssueItem = {
  issue: string;
  percent: number;
  sourceNote?: string;
};

// MVP: mocked. Replace with Gallup "Most Important Problem" scrape.
export function getMockIssues(): IssueItem[] {
  return [
    { issue: "Economy / Inflation", percent: 24 },
    { issue: "Immigration", percent: 16 },
    { issue: "Healthcare", percent: 12 },
    { issue: "Crime / Public safety", percent: 11 },
    { issue: "Democracy / Governance", percent: 9 },
    { issue: "Taxes / Federal spending", percent: 8 },
    { issue: "Foreign policy", percent: 7 },
    { issue: "Housing affordability", percent: 6 },
    { issue: "Education", percent: 5 },
    { issue: "Climate / Environment", percent: 4 },
  ];
}
