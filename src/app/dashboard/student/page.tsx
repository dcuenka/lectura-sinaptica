import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeAttempts } from "@/lib/stats";
import {
  AGE_BANDS,
  ageBandForAge,
  ageLabel,
  EXERCISE_TYPE_EMOJI,
  EXERCISE_TYPE_LABELS,
  EXERCISE_TYPE_SLUGS,
  type ExerciseType,
} from "@/lib/constants";

type ExerciseRow = {
  id: string;
  type: string;
  title: string;
  level: number;
  ageMin: number;
  ageMax: number;
};

export default async function StudentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ edad?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const { edad } = await searchParams;

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
      orderBy: [{ level: "asc" }, { type: "asc" }],
    }),
    prisma.attempt.findMany({ where: { userId } }),
  ]);

  const summary = summarizeAttempts(attempts);

  // Agrupar por banda de edad.
  const byBand = new Map<string, ExerciseRow[]>();
  for (const ex of exercises as ExerciseRow[]) {
    const band = ageBandForAge(ex.ageMin);
    const list = byBand.get(band.key) ?? [];
    list.push(ex);
    byBand.set(band.key, list);
  }

  const activeBands = AGE_BANDS.filter(
    (b) => (!edad || edad === b.key) && (byBand.get(b.key)?.length ?? 0) > 0
  );

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

      {/* Filtro por edad */}
      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip label="Todas las edades" href="/dashboard/student" active={!edad} />
        {AGE_BANDS.map((b) => (
          <FilterChip
            key={b.key}
            label={b.label}
            href={`/dashboard/student?edad=${b.key}`}
            active={edad === b.key}
          />
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {activeBands.map((band) => (
          <div key={band.key}>
            <h2 className="text-lg font-bold text-slate-900">{band.label}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(byBand.get(band.key) ?? []).map((ex) => {
                const type = ex.type as ExerciseType;
                return (
                  <Link
                    key={ex.id}
                    href={`/exercises/${EXERCISE_TYPE_SLUGS[type]}/${ex.id}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-400 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600">
                        {EXERCISE_TYPE_EMOJI[type]} {EXERCISE_TYPE_LABELS[type]}
                      </span>
                      <span className="text-[11px] text-slate-400">Nivel {ex.level}</span>
                    </div>
                    <div className="mt-1 font-medium text-slate-900 text-sm">
                      {ex.title.split(" · ")[0]}
                    </div>
                    <div className="mt-1 text-[11px] text-amber-600">
                      {ageLabel(ex.ageMin, ex.ageMax)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {activeBands.length === 0 && (
          <p className="text-slate-400 text-sm">No hay ejercicios para este filtro.</p>
        )}
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

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-white border border-slate-300 text-slate-600 hover:border-blue-400"
      }`}
    >
      {label}
    </Link>
  );
}
