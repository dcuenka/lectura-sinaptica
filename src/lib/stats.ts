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

export function starsForScore(score: number): number {
  if (score >= 80) return 3;
  if (score >= 50) return 2;
  if (score > 0) return 1;
  return 0;
}

export type Badge = { key: string; emoji: string; label: string; earned: boolean };

// Puntos, racha de días e insignias, calculados desde los intentos.
export function computeGamification(attempts: { score: number; createdAt: Date }[]) {
  const totalStars = attempts.reduce((s, a) => s + starsForScore(a.score), 0);
  const totalAttempts = attempts.length;
  const perfect = attempts.filter((a) => a.score >= 80).length;

  // Racha: días consecutivos (hasta hoy o ayer) con al menos un intento.
  const dayKeys = new Set(
    attempts.map((a) => {
      const d = a.createdAt;
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let streak = 0;
  const cursor = new Date();
  // Si hoy no practicó pero ayer sí, la racha sigue contando desde ayer.
  if (!dayKeys.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dayKeys.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const badges: Badge[] = [
    { key: "first", emoji: "🎯", label: "Primer ejercicio", earned: totalAttempts >= 1 },
    { key: "ten", emoji: "🔟", label: "10 ejercicios", earned: totalAttempts >= 10 },
    { key: "fifty", emoji: "🏅", label: "50 ejercicios", earned: totalAttempts >= 50 },
    { key: "perfect5", emoji: "🌟", label: "5 excelentes", earned: perfect >= 5 },
    { key: "streak3", emoji: "🔥", label: "Racha de 3 días", earned: streak >= 3 },
    { key: "streak7", emoji: "⚡", label: "Racha de 7 días", earned: streak >= 7 },
    { key: "stars50", emoji: "👑", label: "50 estrellas", earned: totalStars >= 50 },
  ];

  return { totalStars, streak, badges };
}
