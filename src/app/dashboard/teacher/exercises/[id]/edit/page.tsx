import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ExerciseType } from "@/lib/constants";
import ExerciseEditorForm, {
  type ExerciseInitial,
} from "@/components/exercises/ExerciseEditorForm";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) notFound();
  if (exercise.createdById !== session!.user.id) {
    redirect("/dashboard/teacher/exercises");
  }

  const initial: ExerciseInitial = {
    id: exercise.id,
    type: exercise.type as ExerciseType,
    title: exercise.title,
    level: exercise.level,
    config: JSON.parse(exercise.config),
  };

  return (
    <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 py-10">
      <Link
        href="/dashboard/teacher/exercises"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Ejercicios
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Editar ejercicio</h1>
      <div className="mt-6">
        <ExerciseEditorForm initial={initial} />
      </div>
    </div>
  );
}
