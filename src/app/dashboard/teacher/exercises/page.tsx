import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EXERCISE_TYPE_LABELS, type ExerciseType } from "@/lib/constants";
import { deleteExercise } from "@/lib/actions/exercises";

const TYPE_EMOJI: Record<ExerciseType, string> = {
  TACHISTOSCOPE: "⚡",
  TIMED_READING: "⏱️",
  VISUAL_SPAN: "👁️",
};

export default async function TeacherExercisesPage() {
  const session = await auth();
  const teacherId = session!.user.id;

  const [myExercises, defaultExercises] = await Promise.all([
    prisma.exercise.findMany({
      where: { createdById: teacherId },
      orderBy: [{ type: "asc" }, { level: "asc" }],
    }),
    prisma.exercise.findMany({
      where: { createdById: null },
      orderBy: [{ type: "asc" }, { level: "asc" }],
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ejercicios</h1>
          <p className="mt-1 text-slate-500">
            Crea tus propios ejercicios. Tus alumnos verán los tuyos y los de ejemplo.
          </p>
        </div>
        <Link
          href="/dashboard/teacher/exercises/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
        >
          + Nuevo ejercicio
        </Link>
      </div>

      <h2 className="mt-8 font-semibold text-lg text-slate-900">Mis ejercicios</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {myExercises.length === 0 && (
          <p className="text-slate-500 col-span-2 text-sm">
            Todavía no has creado ejercicios. Usa el botón &quot;Nuevo ejercicio&quot;.
          </p>
        )}
        {myExercises.map((ex) => (
          <div
            key={ex.id}
            className="rounded-xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-3"
          >
            <div>
              <div className="text-xs font-medium text-blue-600">
                {TYPE_EMOJI[ex.type as ExerciseType]}{" "}
                {EXERCISE_TYPE_LABELS[ex.type as ExerciseType]} · Nivel {ex.level}
              </div>
              <div className="mt-1 font-medium text-slate-900">{ex.title}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/dashboard/teacher/exercises/${ex.id}/edit`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Editar
              </Link>
              <form action={deleteExercise}>
                <input type="hidden" name="id" value={ex.id} />
                <button className="text-sm text-red-600 hover:underline">Borrar</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-semibold text-lg text-slate-900">
        Ejercicios de ejemplo (incluidos)
      </h2>
      <p className="text-sm text-slate-500">
        Estos vienen listos y también los ven tus alumnos. No se pueden editar.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {defaultExercises.map((ex) => (
          <div
            key={ex.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <div className="text-xs text-slate-500">
              {TYPE_EMOJI[ex.type as ExerciseType]} Nivel {ex.level}
            </div>
            <div className="text-sm font-medium text-slate-800">{ex.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/dashboard/teacher" className="text-sm text-blue-600 hover:underline">
          ← Volver a mis clases
        </Link>
      </div>
    </div>
  );
}
