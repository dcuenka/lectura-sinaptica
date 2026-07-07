"use client";

import Link from "next/link";

export default function ExerciseResult({
  score,
  wpm,
  comprehensionPct,
  saving,
  saved,
  detail,
}: {
  score: number;
  wpm?: number | null;
  comprehensionPct?: number | null;
  saving: boolean;
  saved: boolean;
  detail?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto">
      <div className="text-4xl">{score >= 70 ? "🎉" : "💪"}</div>
      <h2 className="mt-3 text-2xl font-bold text-slate-900">{Math.round(score)}%</h2>
      <p className="text-slate-500">Puntaje de este intento</p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {wpm != null && (
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="font-bold text-slate-900">{Math.round(wpm)}</div>
            <div className="text-slate-500">palabras/min</div>
          </div>
        )}
        {comprehensionPct != null && (
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="font-bold text-slate-900">{Math.round(comprehensionPct)}%</div>
            <div className="text-slate-500">comprensión</div>
          </div>
        )}
      </div>

      {detail && <div className="mt-4 text-left text-sm">{detail}</div>}

      <p className="mt-6 text-sm text-slate-400">
        {saving ? "Guardando resultado..." : saved ? "Resultado guardado ✓" : ""}
      </p>

      <Link
        href="/dashboard/student"
        className="mt-4 inline-block rounded-md bg-indigo-600 px-5 py-2 text-white font-semibold hover:bg-indigo-700 transition"
      >
        Volver a mi panel
      </Link>
    </div>
  );
}
