import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeAttempts } from "@/lib/stats";
import {
  EXERCISE_TYPE_LABELS,
  EXERCISE_TYPE_SLUGS,
  EXERCISE_TYPES,
  type ExerciseType,
} from "@/lib/constants";

const TYPE_EMOJI: Record<ExerciseType, string> = {
  TACHISTOSCOPE: "⚡",
  TIMED_READING: "⏱️",
  VISUAL_SPAN: "👁️",
};

export default async function StudentDashboard() {
  const session = await auth();
  const userId = session!.user.id;

  // Teachers of the classes this student is enrolled in.
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { classGroup: { select: { teacherId: true } } },
  });
  const teacherIds = enrollments.map((e) => e.classGroup.teacherId);

  const [exercises, attempts] = await Promise.all([
    prisma.exercise.findMany({
      where: {
        OR: [{ createdById: null }, { createdById: { in: teacherIds } }],
      },
      orderBy: [{ type: "asc" }, { level: "asc" }],
    }),
    prisma.attempt.findMany({ where: { userId } }),
  ]);

  const summary = summarizeAttempts(attempts);

  const grouped = Object.values(EXERCISE_TYPES).map((type) => ({
    type,
    exercises: exercises.filter((e) => e.type === type),
  }));

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Hola, {session!.user.name}</h1>
      <p className="mt-1 text-slate-500">Elige un ejercicio para practicar hoy.</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Intentos totales" value={String(summary.totalAttempts)} />
        <StatCard
          label="Velocidad promedio"
          value={summary.avgWpm != null ? `${Math.round(summary.avgWpm)} ppm` : "—"}
        />
        <StatCard
          label="Comprensión"
          value={summary.avgComprehension != null ? `${Math.round(summary.avgComprehension)}%` : "—"}
        />
        <Link
          href="/dashboard/student/progress"
          className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex flex-col justify-center items-center text-blue-700 font-medium hover:bg-blue-100 transition"
        >
          Ver mi progreso →
        </Link>
      </div>

      <div className="mt-10 space-y-8">
        {grouped.map(({ type, exercises: list }) => (
          <div key={type}>
            <h2 className="font-semibold text-lg text-slate-900">
              {TYPE_EMOJI[type]} {EXERCISE_TYPE_LABELS[type]}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {list.map((ex) => (
                <Link
                  key={ex.id}
                  href={`/exercises/${EXERCISE_TYPE_SLUGS[type]}/${ex.id}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-400 hover:shadow-sm transition"
                >
                  <div className="text-xs font-medium text-blue-600">Nivel {ex.level}</div>
                  <div className="mt-1 font-medium text-slate-900">{ex.title}</div>
                </Link>
              ))}
              {list.length === 0 && (
                <p className="text-slate-400 text-sm col-span-3">
                  Aún no hay ejercicios de este tipo.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
