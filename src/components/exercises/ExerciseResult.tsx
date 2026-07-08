"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { playFinish } from "@/lib/sounds";

function starsForScore(score: number): number {
  if (score >= 80) return 3;
  if (score >= 50) return 2;
  if (score > 0) return 1;
  return 0;
}

function messageForScore(score: number): { emoji: string; text: string } {
  if (score >= 90) return { emoji: "🌟", text: "¡Excelente!" };
  if (score >= 70) return { emoji: "💪", text: "¡Muy bien!" };
  if (score >= 50) return { emoji: "👍", text: "¡Vas por buen camino!" };
  return { emoji: "🚀", text: "¡Sigue practicando!" };
}

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
  const target = Math.round(score);
  const [display, setDisplay] = useState(0);
  const stars = starsForScore(score);
  const msg = messageForScore(score);

  // Sonido de celebración al mostrar el resultado.
  useEffect(() => {
    playFinish();
  }, []);

  // Puntaje que sube animado de 0 al valor final.
  useEffect(() => {
    let raf = 0;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="result-pop rounded-2xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto shadow-sm">
      <div className="text-5xl">{msg.emoji}</div>
      <p className="mt-2 text-lg font-semibold text-slate-800">{msg.text}</p>

      {/* Estrellas */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => {
          const filled = i < stars;
          return (
            <span
              key={i}
              className={`text-4xl ${filled ? "star-pop" : ""}`}
              style={filled ? { animationDelay: `${0.25 + i * 0.18}s` } : undefined}
            >
              {filled ? "⭐" : "☆"}
            </span>
          );
        })}
      </div>

      <div className="mt-4">
        <span className="text-4xl font-extrabold text-blue-600 tabular-nums">{display}%</span>
        <p className="text-slate-500 text-sm">Puntaje de este intento</p>
      </div>

      {(wpm != null || comprehensionPct != null) && (
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
      )}

      {detail && <div className="mt-4 text-left text-sm">{detail}</div>}

      <p className="mt-6 text-sm text-slate-400">
        {saving ? "Guardando resultado..." : saved ? "Resultado guardado ✓" : ""}
      </p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <Link
          href="/dashboard/student"
          className="inline-block rounded-md bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700 transition"
        >
          Volver a mi panel
        </Link>
      </div>
    </div>
  );
}
