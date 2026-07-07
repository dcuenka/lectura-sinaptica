type AttemptLike = {
  wpm: number | null;
  comprehensionPct: number | null;
  score: number;
  createdAt: Date;
};

export function summarizeAttempts(attempts: AttemptLike[]) {
  const totalAttempts = attempts.length;

  const wpmValues = attempts.map((a) => a.wpm).filter((v): v is number => v != null);
  const comprehensionValues = attempts
    .map((a) => a.comprehensionPct)
    .filter((v): v is number => v != null);

  const avg = (values: number[]) =>
    values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null;

  const lastActivity = attempts.reduce<Date | null>((latest, a) => {
    if (!latest || a.createdAt > latest) return a.createdAt;
    return latest;
  }, null);

  return {
    totalAttempts,
    avgWpm: avg(wpmValues),
    avgComprehension: avg(comprehensionValues),
    avgScore: avg(attempts.map((a) => a.score)),
    lastActivity,
  };
}
