"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, EXERCISE_TYPES, type ExerciseType } from "@/lib/constants";
import type {
  TachistoscopeConfig,
  TimedReadingConfig,
  VisualSpanConfig,
  WordBuildConfig,
  OratoryConfig,
} from "@/lib/exercise-configs";
import { MIN_AGE, MAX_AGE } from "@/lib/constants";

export type FormState = { error?: string } | undefined;

function parseLevel(raw: FormDataEntryValue | null): number {
  const n = parseInt(String(raw ?? "1"), 10);
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > 18) return 18;
  return n;
}

function parseAge(raw: FormDataEntryValue | null, fallback: number): number {
  const n = parseInt(String(raw ?? ""), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(MIN_AGE, Math.min(MAX_AGE, n));
}

function buildConfig(type: ExerciseType, formData: FormData): { config: string } | { error: string } {
  if (type === EXERCISE_TYPES.TACHISTOSCOPE) {
    const displayMs = parseInt(String(formData.get("displayMs") ?? "600"), 10);
    const items = String(formData.get("items") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return { error: "Agrega al menos una palabra o frase." };
    if (Number.isNaN(displayMs) || displayMs < 50 || displayMs > 5000)
      return { error: "El tiempo debe estar entre 50 y 5000 ms." };
    const config: TachistoscopeConfig = { displayMs, items };
    return { config: JSON.stringify(config) };
  }

  if (type === EXERCISE_TYPES.VISUAL_SPAN) {
    const displayMs = parseInt(String(formData.get("displayMs") ?? "700"), 10);
    const rows = String(formData.get("rows") ?? "")
      .split("\n")
      .map((line) => line.trim().split(/\s+/).filter(Boolean))
      .filter((r) => r.length > 0);
    if (rows.length === 0) return { error: "Agrega al menos una fila de palabras." };
    if (Number.isNaN(displayMs) || displayMs < 50 || displayMs > 5000)
      return { error: "El tiempo debe estar entre 50 y 5000 ms." };
    const config: VisualSpanConfig = { displayMs, rows };
    return { config: JSON.stringify(config) };
  }

  if (type === EXERCISE_TYPES.WORD_BUILD) {
    const items = String(formData.get("items") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [answer, ...hintParts] = line.split("|");
        return { answer: (answer ?? "").trim(), hint: hintParts.join("|").trim() };
      })
      .filter((it) => it.answer && it.hint);
    if (items.length === 0)
      return {
        error: "Agrega al menos una palabra con pista, en formato: palabra | pista",
      };
    const config: WordBuildConfig = { items };
    return { config: JSON.stringify(config) };
  }

  if (type === EXERCISE_TYPES.ORATORY) {
    const items = String(formData.get("items") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, prompt, tip, secs] = line.split("|").map((p) => (p ?? "").trim());
        const seconds = parseInt(secs ?? "45", 10);
        return {
          title: title ?? "",
          prompt: prompt ?? "",
          tip: tip ?? "",
          seconds: Number.isNaN(seconds) ? 45 : Math.max(10, Math.min(180, seconds)),
        };
      })
      .filter((it) => it.title && it.prompt);
    if (items.length === 0)
      return {
        error: "Agrega al menos un reto, en formato: título | consigna | técnica | segundos",
      };
    const config: OratoryConfig = { items };
    return { config: JSON.stringify(config) };
  }

  // TIMED_READING
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return { error: "Escribe el texto de lectura." };

  const questions: TimedReadingConfig["questions"] = [];
  const questionCount = parseInt(String(formData.get("questionCount") ?? "0"), 10);
  for (let i = 0; i < questionCount; i++) {
    const q = String(formData.get(`q_${i}_question`) ?? "").trim();
    if (!q) continue;
    const options = [0, 1, 2, 3]
      .map((oi) => String(formData.get(`q_${i}_opt_${oi}`) ?? "").trim())
      .filter(Boolean);
    if (options.length < 2)
      return { error: `La pregunta ${i + 1} necesita al menos 2 opciones.` };
    const correctIndex = parseInt(String(formData.get(`q_${i}_correct`) ?? "0"), 10);
    if (correctIndex < 0 || correctIndex >= options.length)
      return { error: `Marca la respuesta correcta de la pregunta ${i + 1}.` };
    questions.push({ question: q, options, correctIndex });
  }
  if (questions.length === 0)
    return { error: "Agrega al menos una pregunta de comprensión." };

  const config: TimedReadingConfig = { text, questions };
  return { config: JSON.stringify(config) };
}

async function requireTeacher() {
  const session = await auth();
  if (!session || session.user.role !== ROLES.TEACHER) {
    return null;
  }
  return session;
}

export async function createExercise(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireTeacher();
  if (!session) return { error: "Solo los profesores pueden crear ejercicios." };

  const type = String(formData.get("type") ?? "") as ExerciseType;
  if (!Object.values(EXERCISE_TYPES).includes(type)) return { error: "Tipo inválido." };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Ponle un título al ejercicio." };

  const built = buildConfig(type, formData);
  if ("error" in built) return { error: built.error };

  await prisma.exercise.create({
    data: {
      type,
      title,
      level: parseLevel(formData.get("level")),
      ageMin: parseAge(formData.get("ageMin"), MIN_AGE),
      ageMax: parseAge(formData.get("ageMax"), MAX_AGE),
      config: built.config,
      createdById: session.user.id,
    },
  });

  revalidatePath("/dashboard/teacher/exercises");
  redirect("/dashboard/teacher/exercises");
}

export async function updateExercise(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireTeacher();
  if (!session) return { error: "Solo los profesores pueden editar ejercicios." };

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing) return { error: "El ejercicio no existe." };
  if (existing.createdById !== session.user.id)
    return { error: "Solo puedes editar los ejercicios que tú creaste." };

  const type = existing.type as ExerciseType;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Ponle un título al ejercicio." };

  const built = buildConfig(type, formData);
  if ("error" in built) return { error: built.error };

  await prisma.exercise.update({
    where: { id },
    data: {
      title,
      level: parseLevel(formData.get("level")),
      ageMin: parseAge(formData.get("ageMin"), existing.ageMin),
      ageMax: parseAge(formData.get("ageMax"), existing.ageMax),
      config: built.config,
    },
  });

  revalidatePath("/dashboard/teacher/exercises");
  redirect("/dashboard/teacher/exercises");
}

export async function deleteExercise(formData: FormData) {
  const session = await requireTeacher();
  if (!session) return;

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing || existing.createdById !== session.user.id) return;

  await prisma.exercise.delete({ where: { id } });
  revalidatePath("/dashboard/teacher/exercises");
}
