import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeAttempts } from "@/lib/stats";
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

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Alumno</th>
              <th className="px-4 py-3 font-medium">Intentos</th>
              <th className="px-4 py-3 font-medium">WPM promedio</th>
              <th className="px-4 py-3 font-medium">Comprensión</th>
              <th className="px-4 py-3 font-medium">Última actividad</th>
            </tr>
          </thead>
          <tbody>
            {classGroup.enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Aún no hay alumnos en esta clase. Comparte el código de invitación.
                </td>
              </tr>
            )}
            {classGroup.enrollments.map(({ user }) => {
              const summary = summarizeAttempts(attemptsByStudent.get(user.id) ?? []);
              return (
                <tr key={user.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-slate-400 text-xs">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">{summary.totalAttempts}</td>
                  <td className="px-4 py-3">
                    {summary.avgWpm != null ? `${Math.round(summary.avgWpm)} ppm` : "—"}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
