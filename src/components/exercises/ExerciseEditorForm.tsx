"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createExercise,
  updateExercise,
  type FormState,
} from "@/lib/actions/exercises";
import {
  EXERCISE_TYPES,
  EXERCISE_TYPE_LABELS,
  type ExerciseType,
} from "@/lib/constants";
import type {
  TachistoscopeConfig,
  TimedReadingConfig,
  VisualSpanConfig,
  WordBuildConfig,
  OratoryConfig,
} from "@/lib/exercise-configs";

type EditableQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type ExerciseInitial = {
  id: string;
  type: ExerciseType;
  title: string;
  level: number;
  ageMin: number;
  ageMax: number;
  config:
    | TachistoscopeConfig
    | TimedReadingConfig
    | VisualSpanConfig
    | WordBuildConfig
    | OratoryConfig;
};

const initialState: FormState = undefined;

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function ExerciseEditorForm({
  initial,
}: {
  initial?: ExerciseInitial;
}) {
  const isEdit = Boolean(initial);
  const action = isEdit ? updateExercise : createExercise;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [type, setType] = useState<ExerciseType>(
    initial?.type ?? EXERCISE_TYPES.TACHISTOSCOPE
  );

  // Timed reading questions state
  const initialQuestions: EditableQuestion[] =
    initial && initial.type === EXERCISE_TYPES.TIMED_READING
      ? (initial.config as TimedReadingConfig).questions.map((q) => ({
          question: q.question,
          options: [0, 1, 2, 3].map((i) => q.options[i] ?? ""),
          correctIndex: q.correctIndex,
        }))
      : [{ question: "", options: ["", "", "", ""], correctIndex: 0 }];
  const [questions, setQuestions] = useState<EditableQuestion[]>(initialQuestions);

  function updateQuestion(qi: number, patch: Partial<EditableQuestion>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, ...patch } : q))
    );
  }
  function updateOption(qi: number, oi: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) }
          : q
      )
    );
  }

  const tConfig = initial?.type === EXERCISE_TYPES.TACHISTOSCOPE
    ? (initial.config as TachistoscopeConfig)
    : null;
  const vConfig = initial?.type === EXERCISE_TYPES.VISUAL_SPAN
    ? (initial.config as VisualSpanConfig)
    : null;
  const rConfig = initial?.type === EXERCISE_TYPES.TIMED_READING
    ? (initial.config as TimedReadingConfig)
    : null;
  const wConfig = initial?.type === EXERCISE_TYPES.WORD_BUILD
    ? (initial.config as WordBuildConfig)
    : null;
  const oConfig = initial?.type === EXERCISE_TYPES.ORATORY
    ? (initial.config as OratoryConfig)
    : null;

  return (
    <form action={formAction} className="space-y-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="type" value={type} />

      {state?.error && (
        <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{state.error}</p>
      )}

      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de ejercicio
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.values(EXERCISE_TYPES).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  type === t
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-600"
                }`}
              >
                {EXERCISE_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
        <input
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="Ej: Palabras cortas nivel 1"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nivel (1-18)</label>
          <input
            name="level"
            type="number"
            min={1}
            max={18}
            defaultValue={initial?.level ?? 1}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Edad mín.</label>
          <input
            name="ageMin"
            type="number"
            min={6}
            max={65}
            defaultValue={initial?.ageMin ?? 6}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Edad máx.</label>
          <input
            name="ageMax"
            type="number"
            min={6}
            max={65}
            defaultValue={initial?.ageMax ?? 65}
            className={inputClass}
          />
        </div>
      </div>

      {/* TACHISTOSCOPE fields */}
      {type === EXERCISE_TYPES.TACHISTOSCOPE && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tiempo en pantalla (milisegundos)
            </label>
            <input
              name="displayMs"
              type="number"
              min={50}
              max={5000}
              defaultValue={tConfig?.displayMs ?? 600}
              className={`${inputClass} w-40`}
            />
            <p className="mt-1 text-xs text-slate-500">
              Menos milisegundos = más difícil. Sugerencia: 900 (fácil) a 250 (difícil).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Palabras o frases (una por línea)
            </label>
            <textarea
              name="items"
              rows={6}
              required
              defaultValue={tConfig?.items.join("\n")}
              placeholder={"sol\ncasa\nel perro corre"}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* VISUAL SPAN fields */}
      {type === EXERCISE_TYPES.VISUAL_SPAN && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tiempo en pantalla (milisegundos)
            </label>
            <input
              name="displayMs"
              type="number"
              min={50}
              max={5000}
              defaultValue={vConfig?.displayMs ?? 700}
              className={`${inputClass} w-40`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Filas de palabras (una fila por línea, palabras separadas por espacio)
            </label>
            <textarea
              name="rows"
              rows={6}
              required
              defaultValue={vConfig?.rows.map((r) => r.join(" ")).join("\n")}
              placeholder={"sol luna\ncasa árbol perro\nrojo verde azul"}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* WORD BUILD (léxico) fields */}
      {type === EXERCISE_TYPES.WORD_BUILD && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Palabras y pistas (una por línea, formato: palabra | pista)
            </label>
            <textarea
              name="items"
              rows={6}
              required
              defaultValue={wConfig?.items
                .map((it) => `${it.answer} | ${it.hint}`)
                .join("\n")}
              placeholder={"gato | Mascota que dice miau\nescuela | Lugar donde aprendes"}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">
              El alumno verá la pista y las letras desordenadas para formar la palabra.
            </p>
          </div>
        </div>
      )}

      {/* ORATORY (oratoria) fields */}
      {type === EXERCISE_TYPES.ORATORY && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Retos (uno por línea, formato: título | consigna | técnica | segundos)
            </label>
            <textarea
              name="items"
              rows={6}
              required
              defaultValue={oConfig?.items
                .map((it) => `${it.title} | ${it.prompt} | ${it.tip} | ${it.seconds}`)
                .join("\n")}
              placeholder={"Mi día | Cuenta qué hiciste hoy | Ordena con primero/después | 30"}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">
              El alumno verá la consigna y la técnica, tendrá un temporizador para hablar y luego se
              autoevalúa.
            </p>
          </div>
        </div>
      )}

      {/* TIMED READING fields */}
      {type === EXERCISE_TYPES.TIMED_READING && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Texto de lectura
            </label>
            <textarea
              name="text"
              rows={7}
              required
              defaultValue={rConfig?.text}
              placeholder="Pega aquí el texto que leerán los alumnos..."
              className={inputClass}
            />
          </div>

          <input type="hidden" name="questionCount" value={questions.length} />

          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700">Preguntas de comprensión</p>
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-lg bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Pregunta {qi + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((prev) => prev.filter((_, i) => i !== qi))
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <input
                  name={`q_${qi}_question`}
                  value={q.question}
                  onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                  placeholder="Escribe la pregunta"
                  className={inputClass}
                />
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q_${qi}_correct`}
                        value={oi}
                        checked={q.correctIndex === oi}
                        onChange={() => updateQuestion(qi, { correctIndex: oi })}
                        title="Marcar como respuesta correcta"
                      />
                      <input
                        name={`q_${qi}_opt_${oi}`}
                        value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                        placeholder={`Opción ${oi + 1}${oi > 1 ? " (opcional)" : ""}`}
                        className={inputClass}
                      />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Marca el círculo de la opción correcta. Deja vacías las opciones que no uses (mínimo 2).
                </p>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setQuestions((prev) => [
                  ...prev,
                  { question: "", options: ["", "", "", ""], correctIndex: 0 },
                ])
              }
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              + Agregar otra pregunta
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {pending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear ejercicio"}
        </button>
        <Link
          href="/dashboard/teacher/exercises"
          className="text-sm text-slate-600 hover:underline"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
