import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeAttempts, computeGamification } from "@/lib/stats";
import CopyCode from "@/components/CopyCode";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const classGroup = await prisma.classGroup.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { user: true },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!classGroup) notFound();
  if (classGroup.teacherId !== session!.user.id) redirect("/dashboard/teacher");

  const studentIds = classGroup.enrollments.map((e) => e.user.id);
  const attempts = await prisma.attempt.findMany({
    where: { userId: { in: studentIds } },
  });

  const attemptsByStudent = new Map<string, typeof attempts>();
  for (const a of attempts) {
    const list = attemptsByStudent.get(a.userId) ?? [];
    list.push(a);
    attemptsByStudent.set(a.userId, list);
  }

  // Fila por alumno con estadísticas y gamificación.
  const rows = classGroup.enrollments.map(({ user }) => {
    const list = attemptsByStudent.get(user.id) ?? [];
    return {
      user,
      summary: summarizeAttempts(list),
      game: computeGamification(list),
    };
  });

  const classStars = rows.reduce((s, r) => s + r.game.totalStars, 0);
  const classAttempts = attempts.length;
  const topStudent = rows
    .slice()
    .sort((a, b) => b.game.totalStars - a.game.totalStars)[0];

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-10">
      <Link href="/dashboard/teacher" className="text-sm text-blue-600 hover:underline">
        ← Mis clases
      </Link>

      <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{classGroup.name}</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          Código de invitación: <CopyCode code={classGroup.inviteCode} />
        </div>
      </div>

      {/* Resumen de la clase */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Alumnos" value={String(rows.length)} />
        <SummaryCard label="Ejercicios hechos" value={String(classAttempts)} />
        <SummaryCard label="⭐ Estrellas de la clase" value={String(classStars)} />
        <SummaryCard
          label="🏆 Más estrellas"
          value={topStudent && topStudent.game.totalStars > 0 ? topStudent.user.name : "—"}
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Alumno</th>
              <th className="px-4 py-3 font-medium">Intentos</th>
              <th className="px-4 py-3 font-medium">⭐ Estrellas</th>
              <th className="px-4 py-3 font-medium">🔥 Racha</th>
              <th className="px-4 py-3 font-medium">WPM</th>
              <th className="px-4 py-3 font-medium">Comprensión</th>
              <th className="px-4 py-3 font-medium">Última actividad</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  Aún no hay alumnos en esta clase. Comparte el código de invitación.
                </td>
              </tr>
            )}
            {rows.map(({ user, summary, game }) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="text-slate-400 text-xs">{user.email}</div>
                  {game.badges.some((b) => b.earned) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {game.badges
                        .filter((b) => b.earned)
                        .map((b) => (
                          <span key={b.key} title={b.label}>
                            {b.emoji}
                          </span>
                        ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{summary.totalAttempts}</td>
                <td className="px-4 py-3 font-semibold text-amber-600">{game.totalStars}</td>
                <td className="px-4 py-3">
                  {game.streak > 0 ? `${game.streak} ${game.streak === 1 ? "día" : "días"}` : "—"}
                </td>
                <td className="px-4 py-3">
                  {summary.avgWpm != null ? Math.round(summary.avgWpm) : "—"}
                </td>
                <td className="px-4 py-3">
                  {summary.avgComprehension != null
                    ? `${Math.round(summary.avgComprehension)}%`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {summary.lastActivity
                    ? summary.lastActivity.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-900 truncate">{value}</div>
    </div>
  );
}
