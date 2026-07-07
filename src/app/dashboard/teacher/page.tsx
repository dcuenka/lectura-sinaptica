import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateClassForm from "@/components/CreateClassForm";
import CopyCode from "@/components/CopyCode";

export default async function TeacherDashboard() {
  const session = await auth();
  const teacherId = session!.user.id;

  const classes = await prisma.classGroup.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Mis clases</h1>
      <p className="mt-1 text-slate-500">
        Crea una clase, comparte el código con tus alumnos y sigue su progreso.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <CreateClassForm />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {classes.length === 0 && (
          <p className="text-slate-500 col-span-2">
            Aún no tienes clases. Crea la primera arriba.
          </p>
        )}

        {classes.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-400 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-lg text-slate-900">{c.name}</h2>
              <span className="text-sm text-slate-500">
                {c._count.enrollments} alumno{c._count.enrollments === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <CopyCode code={c.inviteCode} />
              <Link
                href={`/dashboard/teacher/classes/${c.id}`}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Ver clase →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
