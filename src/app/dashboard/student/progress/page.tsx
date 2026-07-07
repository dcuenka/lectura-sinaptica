import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EXERCISE_TYPE_LABELS, type ExerciseType } from "@/lib/constants";
import ProgressChart, { type ProgressPoint } from "@/components/ProgressChart";

export default async function StudentProgressPage() {
  const session = await auth();
  const userId = session!.user.id;

  const attempts = await prisma.attempt.findMany({
    where: { userId },
    include: { exercise: true },
    orderBy: { createdAt: "asc" },
  });

  const chartData: ProgressPoint[] = attempts.map((a) => ({
    date: a.createdAt.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
    wpm: a.wpm,
    comprehension: a.comprehensionPct,
  }));

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-10">
      <Link href="/dashboard/student" className="text-sm text-indigo-600 hover:underline">
        ← Mi panel
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">Mi progreso</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <ProgressChart data={chartData} />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Ejercicio</th>
              <th className="px-4 py-3 font-medium">Puntaje</th>
              <th className="px-4 py-3 font-medium">PPM</th>
              <th className="px-4 py-3 font-medium">Comprensión</th>
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Aún no tienes intentos registrados.
                </td>
              </tr>
            )}
            {[...attempts].reverse().map((a) => (
              <tr key={a.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-500">
                  {a.createdAt.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{a.exercise.title}</div>
                  <div className="text-xs text-slate-400">
                    {EXERCISE_TYPE_LABELS[a.exercise.type as ExerciseType]}
                  </div>
                </td>
                <td className="px-4 py-3">{Math.round(a.score)}%</td>
                <td className="px-4 py-3">{a.wpm != null ? Math.round(a.wpm) : "—"}</td>
                <td className="px-4 py-3">
                  {a.comprehensionPct != null ? `${Math.round(a.comprehensionPct)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
