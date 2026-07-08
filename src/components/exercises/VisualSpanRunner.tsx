"use client";

import { useEffect, useState } from "react";
import { submitAttempt } from "@/lib/actions/attempts";
import type { VisualSpanConfig } from "@/lib/exercise-configs";
import ExerciseResult from "./ExerciseResult";
import ExerciseProgress from "./ExerciseProgress";
import { playCorrect, playWrong } from "@/lib/sounds";

type Phase = "intro" | "countdown" | "flash" | "answer" | "feedback" | "done";

function normalizeWord(s: string) {
  return s.trim().toLowerCase();
}

export default function VisualSpanRunner({
  exerciseId,
  config,
}: {
  exerciseId: string;
  config: VisualSpanConfig;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [rowIndex, setRowIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [lastRowCorrect, setLastRowCorrect] = useState(0);
  const [accCorrect, setAccCorrect] = useState(0);
  const [accTotal, setAccTotal] = useState(0);

  const totalRows = config.rows.length;

  useEffect(() => {
    if (phase !== "countdown") return;
    const t = setTimeout(() => setPhase("flash"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "flash") return;
    const t = setTimeout(() => setPhase("answer"), config.displayMs);
    return () => clearTimeout(t);
  }, [phase, config.displayMs]);

  async function finish() {
    setPhase("done");
    const score = accTotal > 0 ? (accCorrect / accTotal) * 100 : 0;
    setFinalScore(score);
    const durationMs = Date.now() - startedAt;
    setSaving(true);
    try {
      await submitAttempt({ exerciseId, score, durationMs });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (phase !== "feedback") return;
    const t = setTimeout(() => {
      if (rowIndex + 1 < totalRows) {
        setRowIndex((i) => i + 1);
        setPhase("countdown");
      } else {
        finish();
      }
    }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function start() {
    setStartedAt(Date.now());
    setRowIndex(0);
    setAccCorrect(0);
    setAccTotal(0);
    setPhase("countdown");
  }

  function submitAnswer() {
    const row = config.rows[rowIndex];
    const guessed = new Set(answer.split(/\s+/).filter(Boolean).map(normalizeWord));
    const actual = row.map(normalizeWord);
    const rowCorrect = actual.filter((w) => guessed.has(w)).length;

    setAccCorrect((c) => c + rowCorrect);
    setAccTotal((t) => t + actual.length);
    setLastRowCorrect(rowCorrect);
    setAnswer("");
    if (rowCorrect > 0) playCorrect();
    else playWrong();
    setPhase("feedback");
  }

  if (phase === "intro") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900">¿Listo?</h2>
        <p className="mt-2 text-slate-600">
          Verás filas de palabras por muy poco tiempo, sin mover los ojos de lado a lado. Luego
          escribe todas las palabras que recuerdes, separadas por espacio.
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
    return <ExerciseResult score={finalScore} saving={saving} saved={saved} />;
  }

  const row = config.rows[rowIndex];

  return (
    <div className="max-w-lg mx-auto text-center">
      <ExerciseProgress
        current={rowIndex}
        total={totalRows}
        label={`Fila ${rowIndex + 1} de ${totalRows}`}
      />

      <div
        className={`min-h-32 flex flex-col items-center justify-center gap-2 rounded-xl border-2 bg-white px-4 py-4 transition ${
          phase === "feedback"
            ? lastRowCorrect > 0
              ? "border-green-400 bg-green-50"
              : "border-red-300 bg-red-50"
            : "border-slate-200"
        }`}
      >
        {phase === "countdown" && <span className="text-slate-400">Prepárate...</span>}
        {phase === "flash" && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {row.map((word, i) => (
              <span key={i} className="text-2xl font-bold text-slate-900">
                {word}
              </span>
            ))}
          </div>
        )}
        {phase === "answer" && <span className="text-slate-300 text-sm">¿Qué palabras viste?</span>}
        {phase === "feedback" && (
          <>
            <span
              className={`text-sm font-bold ${lastRowCorrect > 0 ? "text-green-700" : "text-red-600"}`}
            >
              {lastRowCorrect} de {row.length} correctas
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {row.map((word, i) => (
                <span key={i} className="text-xl font-semibold text-slate-800">
                  {word}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {phase === "answer" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitAnswer();
          }}
          className="mt-4"
        >
          <input
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe las palabras separadas por espacio"
          />
          <button
            type="submit"
            className="mt-3 rounded-md bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            Siguiente
          </button>
        </form>
      )}
    </div>
  );
}
