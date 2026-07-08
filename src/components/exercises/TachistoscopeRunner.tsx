"use client";

import { useEffect, useState } from "react";
import { submitAttempt } from "@/lib/actions/attempts";
import type { TachistoscopeConfig } from "@/lib/exercise-configs";
import ExerciseResult from "./ExerciseResult";
import ExerciseProgress from "./ExerciseProgress";
import { playCorrect, playWrong } from "@/lib/sounds";

type Phase = "intro" | "countdown" | "flash" | "answer" | "feedback" | "done";

function normalize(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s]/g, "");
}

export default function TachistoscopeRunner({
  exerciseId,
  config,
}: {
  exerciseId: string;
  config: TachistoscopeConfig;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);

  const total = config.items.length;

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
    const score = (correctCount / total) * 100;
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

  // Tras el feedback inmediato, avanza al siguiente o termina.
  useEffect(() => {
    if (phase !== "feedback") return;
    const t = setTimeout(() => {
      if (index + 1 < total) {
        setIndex((i) => i + 1);
        setPhase("countdown");
      } else {
        finish();
      }
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function start() {
    setStartedAt(Date.now());
    setIndex(0);
    setCorrectCount(0);
    setPhase("countdown");
  }

  function submitAnswer() {
    const item = config.items[index];
    const isCorrect = normalize(answer) === normalize(item);
    setCorrectCount((c) => c + (isCorrect ? 1 : 0));
    setLastCorrect(isCorrect);
    setAnswer("");
    if (isCorrect) playCorrect();
    else playWrong();
    setPhase("feedback");
  }

  if (phase === "intro") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900">¿Listo?</h2>
        <p className="mt-2 text-slate-600">
          Verás {total} palabras o frases, una por una, durante muy poco tiempo. Escribe lo que
          alcances a leer.
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

  return (
    <div className="max-w-md mx-auto text-center">
      <ExerciseProgress
        current={index}
        total={total}
        label={`Palabra ${index + 1} de ${total}`}
      />

      <div
        className={`h-40 flex flex-col items-center justify-center rounded-xl border-2 bg-white transition ${
          phase === "feedback"
            ? lastCorrect
              ? "border-green-400 bg-green-50"
              : "border-red-300 bg-red-50"
            : "border-slate-200"
        }`}
      >
        {phase === "countdown" && <span className="text-slate-400">Prepárate...</span>}
        {phase === "flash" && (
          <span className="text-3xl font-bold text-slate-900">{config.items[index]}</span>
        )}
        {phase === "answer" && <span className="text-slate-300 text-sm">¿Qué viste?</span>}
        {phase === "feedback" && (
          <>
            <span className={`text-lg font-bold ${lastCorrect ? "text-green-700" : "text-red-600"}`}>
              {lastCorrect ? "¡Correcto! ✓" : "Casi..."}
            </span>
            <span className="mt-1 text-slate-600 text-sm">
              Era: <strong>{config.items[index]}</strong>
            </span>
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
            placeholder="Escribe lo que leíste"
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
