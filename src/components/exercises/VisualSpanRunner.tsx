"use client";

import { useEffect, useState } from "react";
import { submitAttempt } from "@/lib/actions/attempts";
import type { VisualSpanConfig } from "@/lib/exercise-configs";
import ExerciseResult from "./ExerciseResult";

type Phase = "intro" | "countdown" | "flash" | "answer" | "done";

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
  const [correctWords, setCorrectWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

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

  function start() {
    setStartedAt(Date.now());
    setRowIndex(0);
    setCorrectWords(0);
    setTotalWords(0);
    setPhase("countdown");
  }

  function submitAnswer() {
    const row = config.rows[rowIndex];
    const guessed = new Set(answer.split(/\s+/).filter(Boolean).map(normalizeWord));
    const actual = row.map(normalizeWord);
    const rowCorrect = actual.filter((w) => guessed.has(w)).length;

    const updatedCorrect = correctWords + rowCorrect;
    const updatedTotal = totalWords + actual.length;
    setCorrectWords(updatedCorrect);
    setTotalWords(updatedTotal);
    setAnswer("");

    if (rowIndex + 1 < totalRows) {
      setRowIndex((i) => i + 1);
      setPhase("countdown");
    } else {
      finish(updatedCorrect, updatedTotal);
    }
  }

  async function finish(finalCorrect: number, finalTotal: number) {
    setPhase("done");
    const score = (finalCorrect / finalTotal) * 100;
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
          className="mt-6 rounded-md bg-indigo-600 px-6 py-2 text-white font-semibold hover:bg-indigo-700 transition"
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
      <p className="text-sm text-slate-400 mb-4">
        Fila {rowIndex + 1} de {totalRows}
      </p>

      <div className="h-32 flex items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white px-4">
        {phase === "countdown" && <span className="text-slate-400">Prepárate...</span>}
        {phase === "flash" &&
          row.map((word, i) => (
            <span key={i} className="text-2xl font-bold text-slate-900">
              {word}
            </span>
          ))}
        {phase === "answer" && <span className="text-slate-300 text-sm">¿Qué palabras viste?</span>}
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
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Escribe las palabras separadas por espacio"
          />
          <button
            type="submit"
            className="mt-3 rounded-md bg-indigo-600 px-5 py-2 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Siguiente
          </button>
        </form>
      )}
    </div>
  );
}
