import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EXERCISE_TYPES } from "@/lib/constants";
import type { OratoryConfig } from "@/lib/exercise-configs";
import OratoryRunner from "@/components/exercises/OratoryRunner";

export default async function OratoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = await prisma.exercise.findUnique({ where: { id } });

  if (!exercise || exercise.type !== EXERCISE_TYPES.ORATORY) notFound();

  const config: OratoryConfig = JSON.parse(exercise.config);

  return (
    <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 py-10">
      <h1 className="text-xl font-bold text-slate-900 text-center">{exercise.title}</h1>
      <div className="mt-8">
        <OratoryRunner exerciseId={exercise.id} config={config} />
      </div>
    </div>
  );
}
