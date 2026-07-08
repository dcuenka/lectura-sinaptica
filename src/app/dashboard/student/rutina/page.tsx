import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  EXERCISE_TYPES,
  EXERCISE_TYPE_EMOJI,
  EXERCISE_TYPE_LABELS,
  EXERCISE_TYPE_SLUGS,
  ageLabel,
  type ExerciseType,
} from "@/lib/constants";

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default async function RutinaPage() {
  const session = await auth();
  const userId = session!.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { classGroup: { select: { teacherId: true } } },
  });
  const teacherIds = enrollments.map((e) => e.classGroup.teacherId);

  const [exercises, attempts] = await Promise.all([
    prisma.exercise.findMany({
      where: { OR: [{ createdById: null }, { createdById: { in: teacherIds } }] },
      orderBy: [{ level: "asc" }],
    }),
    prisma.attempt.findMany({ where: { userId } }),
  ]);

  // Un ejercicio por cada tipo (el de menor nivel disponible) = rutina del día.
  const routine = Object.values(EXERCISE_TYPES)
    .map((type) => exercises.find((e) => e.type === type))
    .filter((e): e is (typeof exercises)[number] => Boolean(e));

  const today = new Date();
  const doneTodayIds = new Set(
    attempts.filter((a) => sameDay(a.createdAt, today)).map((a) => a.exerciseId)
  );

  const doneCount = routine.filter((e) => doneTodayIds.has(e.id)).length;
  const pct = routine.length ? Math.round((doneCount / routine.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 py-10">
      <Link href="/dashboard/student" className="text-sm text-blue-600 hover:underline">
        ← Mi panel
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">🏋️ Rutina de entrenamiento</h1>
      <p className="mt-1 text-slate-500">
        Una clase dinámica: haz un ejercicio de cada tipo. ¡Completa los {routine.length} para
        terminar tu sesión de hoy!
      </p>

      {/* Progreso de la rutina */}
      <div className="mt-5">
        <div className="flex justify-between text-sm text-slate-500 mb-1">
          <span>
            {doneCount} de {routine.length} completados hoy
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="progress-fill h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {pct === 100 && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-green-700 font-semibold">
          🎉 ¡Completaste tu rutina de hoy! Vuelve mañana para mantener tu racha.
        </div>
      )}

      <ol className="mt-6 space-y-3">
        {routine.map((ex, i) => {
          const type = ex.type as ExerciseType;
          const done = doneTodayIds.has(ex.id);
          return (
            <li key={ex.id}>
              <Link
                href={`/exercises/${EXERCISE_TYPE_SLUGS[type]}/${ex.id}`}
                className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                  done
                    ? "border-green-200 bg-green-50"
                    : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
                    done ? "bg-green-500 text-white" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    {EXERCISE_TYPE_EMOJI[type]} {EXERCISE_TYPE_LABELS[type]}
                  </div>
                  <div className="text-xs text-slate-500">
                    Nivel {ex.level} · {ageLabel(ex.ageMin, ex.ageMax)}
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {done ? "Repetir" : "Empezar"} →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
