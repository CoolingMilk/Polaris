export type ThoughtLeaderPost = {
  id: string;
  publishedAt: string;
  summary: string;
};

export type ThoughtLeader = {
  name: string;
  handle: string;
  leanLabel: "Left" | "Center" | "Right";
  intensity: "Extreme" | "Moderate";
  latestPosts: ThoughtLeaderPost[];
};

// MVP list: hardcoded handles + mocked posts.
// Next step: fetch latest 2-3 posts per handle via RSS proxy / backend endpoint.
export function getMockThoughtLeaders(): ThoughtLeader[] {
  const mk = (name: string, handle: string, leanLabel: ThoughtLeader["leanLabel"], intensity: ThoughtLeader["intensity"]) =>
    ({
      name,
      handle,
      leanLabel,
      intensity,
      latestPosts: [
        {
          id: `${handle}-1`,
          publishedAt: "Today",
          summary:
            "Quick take on the latest headline, framed from their perspective.",
        },
        {
          id: `${handle}-2`,
          publishedAt: "Yesterday",
          summary:
            "Longer thread summary: what happened, why it matters, and the suggested path forward.",
        },
      ],
    }) satisfies ThoughtLeader;

  return [
    // Extreme left (5)
    mk("Alexandria Ocasio-Cortez", "AOC", "Left", "Extreme"),
    mk("Hasan Piker", "hasanabi", "Left", "Extreme"),
    mk("Brian Krassenstein", "krassenstein", "Left", "Extreme"),
    mk("Mehdi Hasan", "mehdirhasan", "Left", "Extreme"),
    mk("The Young Turks", "TheYoungTurks", "Left", "Extreme"),

    // Center / moderate (5)
    mk("Krystal Ball", "krystalball", "Center", "Moderate"),
    mk("Bill Maher", "billmaher", "Center", "Moderate"),
    mk("Andrew Yang", "AndrewYang", "Center", "Moderate"),
    mk("Ezra Klein", "ezraklein", "Center", "Moderate"),
    mk("Nate Silver", "NateSilver538", "Center", "Moderate"),

    // Extreme right (5)
    mk("Ben Shapiro", "benshapiro", "Right", "Extreme"),
    mk("Tucker Carlson", "TuckerCarlson", "Right", "Extreme"),
    mk("Jack Posobiec", "JackPosobiec", "Right", "Extreme"),
    mk("Candace Owens", "RealCandaceO", "Right", "Extreme"),
    mk("Charlie Kirk", "charliekirk11", "Right", "Extreme"),
  ];
}

export function groupThoughtLeaders(leaders: ThoughtLeader[]): {
  extremeLeft: ThoughtLeader[];
  center: ThoughtLeader[];
  extremeRight: ThoughtLeader[];
} {
  const extremeLeft = leaders.filter(
    (l) => l.leanLabel === "Left" && l.intensity === "Extreme",
  );
  const center = leaders.filter((l) => l.leanLabel === "Center");
  const extremeRight = leaders.filter(
    (l) => l.leanLabel === "Right" && l.intensity === "Extreme",
  );

  return { extremeLeft, center, extremeRight };
}
