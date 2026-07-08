"use client";

import { useEffect, useState } from "react";
import { submitAttempt } from "@/lib/actions/attempts";
import type { OratoryConfig } from "@/lib/exercise-configs";
import ExerciseResult from "./ExerciseResult";
import ExerciseProgress from "./ExerciseProgress";
import { playFinish } from "@/lib/sounds";

type Phase = "intro" | "prepare" | "speaking" | "rating" | "done";

export default function OratoryRunner({
  exerciseId,
  config,
}: {
  exerciseId: string;
  config: OratoryConfig;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [ratings, setRatings] = useState<number[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const total = config.items.length;
  const current = config.items[index];

  // Cronómetro de la fase "hablando".
  useEffect(() => {
    if (phase !== "speaking") return;
    if (remaining <= 0) return;
    const t = setTimeout(() => {
      if (remaining <= 1) {
        setPhase("rating");
      } else {
        setRemaining((r) => r - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, remaining]);

  function start() {
    setStartedAt(Date.now());
    setIndex(0);
    setRatings([]);
    setPhase("prepare");
  }

  function beginSpeaking() {
    setRemaining(current.seconds);
    setPhase("speaking");
  }

  function rate(stars: number) {
    const updated = [...ratings, stars];
    setRatings(updated);
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setPhase("prepare");
    } else {
      finish(updated);
    }
  }

  async function finish(allRatings: number[]) {
    const avg = allRatings.reduce((s, r) => s + r, 0) / allRatings.length;
    const score = (avg / 5) * 100;
    setFinalScore(score);
    setPhase("done");
    playFinish();
    // eslint-disable-next-line react-hooks/purity
    const durationMs = Date.now() - startedAt;
    setSaving(true);
    try {
      await submitAttempt({ exerciseId, score, durationMs });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (phase === "intro") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-lg mx-auto">
        <div className="text-4xl">🎤</div>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Practica tu oratoria</h2>
        <p className="mt-2 text-slate-600">
          Harás {total} retos de expresión oral. Para cada uno verás una técnica y un tiempo para
          hablar en voz alta. Al terminar, evalúas cómo lo hiciste. ¡Habla de pie y en voz clara!
        </p>
        <button
          onClick={start}
          className="mt-6 rounded-md bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition"
        >
          Empezar
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <ExerciseResult
        score={finalScore}
        saving={saving}
        saved={saved}
        detail={
          <p className="text-slate-500 text-center">
            Puntaje según tu autoevaluación. ¡Mientras más practicas, mejor hablas!
          </p>
        }
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <ExerciseProgress
        current={index}
        total={total}
        label={`Reto ${index + 1} de ${total}`}
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-lg text-slate-900">{current.title}</h3>
        <p className="mt-2 text-slate-800">{current.prompt}</p>

        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          <span className="font-semibold">💡 Técnica:</span> {current.tip}
        </div>

        {phase === "prepare" && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Tendrás {current.seconds} segundos para hablar en voz alta.
            </p>
            <button
              onClick={beginSpeaking}
              className="mt-3 rounded-md bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition"
            >
              Empezar a hablar
            </button>
          </div>
        )}

        {phase === "speaking" && (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-500 text-3xl font-bold text-blue-700 animate-pulse">
              {remaining}
            </div>
            <p className="mt-3 text-slate-600 font-medium">🎙️ ¡Habla ahora!</p>
            <button
              onClick={() => setPhase("rating")}
              className="mt-4 rounded-md bg-slate-100 px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 transition"
            >
              Terminé
            </button>
          </div>
        )}

        {phase === "rating" && (
          <div className="mt-6 text-center">
            <p className="font-medium text-slate-800">¿Cómo lo hiciste?</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => rate(s)}
                  className="text-3xl hover:scale-125 transition"
                  title={`${s} de 5`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Sé honesto: te ayuda a medir tu progreso.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
