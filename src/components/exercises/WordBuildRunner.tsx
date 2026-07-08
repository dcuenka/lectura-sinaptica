"use client";

import { useMemo, useState } from "react";
import { submitAttempt } from "@/lib/actions/attempts";
import type { WordBuildConfig } from "@/lib/exercise-configs";
import ExerciseResult from "./ExerciseResult";

type Phase = "intro" | "playing" | "done";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Mezcla determinista (sin Math.random) para evitar desajustes de hidratación.
function scramble(word: string): string[] {
  const letters = word.split("");
  const withKey = letters.map((ch, i) => ({
    ch,
    k: (ch.charCodeAt(0) * 31 + i * 7 + word.length * 13) % 97,
  }));
  withKey.sort((a, b) => a.k - b.k);
  let result = withKey.map((x) => x.ch);
  // Si por casualidad quedó igual, rota una posición.
  if (result.join("") === word && result.length > 1) {
    result = [...result.slice(1), result[0]];
  }
  return result;
}

type Tile = { ch: string; id: number; used: boolean };

export default function WordBuildRunner({
  exerciseId,
  config,
}: {
  exerciseId: string;
  config: WordBuildConfig;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [built, setBuilt] = useState<Tile[]>([]);
  const [feedback, setFeedback] = useState<"none" | "wrong" | "correct">("none");
  const [revealed, setRevealed] = useState(false);

  const total = config.items.length;
  const current = config.items[index];

  const initialTiles = useMemo(
    () => scramble(current.answer).map((ch, id) => ({ ch, id, used: false })),
    [current.answer]
  );

  function loadItem(i: number) {
    const item = config.items[i];
    setTiles(scramble(item.answer).map((ch, id) => ({ ch, id, used: false })));
    setBuilt([]);
    setFeedback("none");
    setRevealed(false);
  }

  function start() {
    setStartedAt(Date.now());
    setIndex(0);
    setSolvedCount(0);
    loadItem(0);
    setPhase("playing");
  }

  function placeTile(tile: Tile) {
    if (feedback === "correct" || revealed) return;
    setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t)));
    setBuilt((prev) => [...prev, tile]);
    setFeedback("none");
  }

  function removeBuilt(tile: Tile) {
    if (feedback === "correct" || revealed) return;
    setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, used: false } : t)));
    setBuilt((prev) => prev.filter((t) => t.id !== tile.id));
    setFeedback("none");
  }

  function clearBuilt() {
    if (feedback === "correct" || revealed) return;
    setTiles((prev) => prev.map((t) => ({ ...t, used: false })));
    setBuilt([]);
    setFeedback("none");
  }

  function check() {
    const attempt = built.map((t) => t.ch).join("");
    if (normalize(attempt) === normalize(current.answer)) {
      setFeedback("correct");
      setSolvedCount((c) => c + 1);
    } else {
      setFeedback("wrong");
    }
  }

  function reveal() {
    setRevealed(true);
    setFeedback("none");
  }

  function next() {
    if (index + 1 < total) {
      const ni = index + 1;
      setIndex(ni);
      loadItem(ni);
    } else {
      finish();
    }
  }

  async function finish() {
    const score = (solvedCount / total) * 100;
    setFinalScore(score);
    setPhase("done");
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
        <div className="text-4xl">🔤</div>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Construye la palabra</h2>
        <p className="mt-2 text-slate-600">
          Verás una pista y las letras desordenadas. Toca las fichas en orden para formar la
          palabra correcta. Son {total} palabras.
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

  const displayTiles = tiles.length ? tiles : initialTiles;
  const answerLen = current.answer.length;

  return (
    <div className="max-w-lg mx-auto">
      <p className="text-sm text-slate-400 text-center mb-4">
        Palabra {index + 1} de {total} · {solvedCount} acertadas
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Pista</p>
        <p className="text-lg font-medium text-slate-900">{current.hint}</p>

        {/* Casillas de la palabra en construcción */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 min-h-14">
          {Array.from({ length: answerLen }).map((_, i) => {
            const t = built[i];
            const correct = feedback === "correct";
            return (
              <button
                key={i}
                onClick={() => t && removeBuilt(t)}
                disabled={!t || correct || revealed}
                className={`h-12 w-10 rounded-md border-2 text-xl font-bold uppercase transition ${
                  t
                    ? correct
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-dashed border-slate-300 bg-slate-50 text-slate-300"
                }`}
              >
                {revealed ? current.answer[i]?.toUpperCase() : t ? t.ch.toUpperCase() : ""}
              </button>
            );
          })}
        </div>

        {feedback === "wrong" && (
          <p className="mt-3 text-center text-sm text-red-600">
            Aún no es correcta. Reordena las letras e inténtalo de nuevo.
          </p>
        )}
        {feedback === "correct" && (
          <p className="mt-3 text-center text-sm text-green-600 font-medium">¡Correcto! 🎉</p>
        )}
        {revealed && (
          <p className="mt-3 text-center text-sm text-slate-500">
            La palabra era: <strong className="uppercase">{current.answer}</strong>
          </p>
        )}

        {/* Fichas disponibles */}
        {feedback !== "correct" && !revealed && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {displayTiles.map((t) => (
              <button
                key={t.id}
                onClick={() => placeTile(t)}
                disabled={t.used}
                className={`h-12 w-10 rounded-md border text-xl font-bold uppercase transition ${
                  t.used
                    ? "border-slate-200 bg-slate-100 text-slate-300"
                    : "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-sm"
                }`}
              >
                {t.ch}
              </button>
            ))}
          </div>
        )}

        {/* Controles */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {feedback === "correct" || revealed ? (
            <button
              onClick={next}
              className="rounded-md bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition"
            >
              {index + 1 < total ? "Siguiente" : "Terminar"}
            </button>
          ) : (
            <>
              <button
                onClick={clearBuilt}
                className="rounded-md bg-slate-100 px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 transition"
              >
                Borrar
              </button>
              <button
                onClick={check}
                disabled={built.length !== answerLen}
                className="rounded-md bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Comprobar
              </button>
              <button
                onClick={reveal}
                className="rounded-md px-3 py-2 text-sm text-slate-400 hover:text-slate-600 transition"
              >
                Rendirse
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
