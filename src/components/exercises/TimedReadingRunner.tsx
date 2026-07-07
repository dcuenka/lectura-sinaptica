"use client";

import { useState } from "react";
import { submitAttempt } from "@/lib/actions/attempts";
import type { TimedReadingConfig } from "@/lib/exercise-configs";
import ExerciseResult from "./ExerciseResult";

type Phase = "intro" | "reading" | "questions" | "done";

export default function TimedReadingRunner({
  exerciseId,
  config,
}: {
  exerciseId: string;
  config: TimedReadingConfig;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [startedAt, setStartedAt] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    () => new Array(config.questions.length).fill(-1)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comprehensionPct, setComprehensionPct] = useState(0);

  function startReading() {
    setStartedAt(Date.now());
    setPhase("reading");
  }

  function finishReading() {
    const elapsedMs = Date.now() - startedAt;
    const wordCount = config.text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(elapsedMs / 60000, 1 / 60);
    setWpm(wordCount / minutes);
    setPhase("questions");
  }

  const allAnswered = answers.every((a) => a !== -1);

  async function finishQuestions() {
    const correct = config.questions.reduce(
      (sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );
    const pct = (correct / config.questions.length) * 100;
    setComprehensionPct(pct);
    setPhase("done");

    const durationMs = Date.now() - startedAt;
    setSaving(true);
    try {
      await submitAttempt({
        exerciseId,
        score: pct,
        wpm,
        comprehensionPct: pct,
        durationMs,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (phase === "intro") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900">¿Listo para leer?</h2>
        <p className="mt-2 text-slate-600">
          Lee el texto lo más rápido que puedas mientras entiendes bien lo que dice. Al terminar,
          presiona &quot;Terminé de leer&quot;.
        </p>
        <button
          onClick={startReading}
          className="mt-6 rounded-md bg-indigo-600 px-6 py-2 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Empezar a leer
        </button>
      </div>
    );
  }

  if (phase === "reading") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-800 whitespace-pre-wrap">
          {config.text}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={finishReading}
            className="rounded-md bg-indigo-600 px-6 py-2 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Terminé de leer
          </button>
        </div>
      </div>
    );
  }

  if (phase === "questions") {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        {config.questions.map((q, qi) => (
          <div key={qi} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-medium text-slate-900">{q.question}</p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition ${
                    answers[qi] === oi
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() =>
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[qi] = oi;
                        return next;
                      })
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={finishQuestions}
            disabled={!allAnswered}
            className="rounded-md bg-indigo-600 px-6 py-2 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Enviar respuestas
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExerciseResult
      score={comprehensionPct}
      wpm={wpm}
      comprehensionPct={comprehensionPct}
      saving={saving}
      saved={saved}
    />
  );
}
