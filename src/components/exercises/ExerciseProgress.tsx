export default function ExerciseProgress({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label ?? `${current} de ${total}`}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="progress-fill h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
