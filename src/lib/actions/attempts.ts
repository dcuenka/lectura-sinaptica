"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AttemptInput = {
  exerciseId: string;
  score: number;
  wpm?: number;
  comprehensionPct?: number;
  durationMs: number;
};

export async function submitAttempt(input: AttemptInput) {
  const session = await auth();
  if (!session) {
    throw new Error("Debes iniciar sesión para guardar tu progreso.");
  }

  await prisma.attempt.create({
    data: {
      userId: session.user.id,
      exerciseId: input.exerciseId,
      score: input.score,
      wpm: input.wpm,
      comprehensionPct: input.comprehensionPct,
      durationMs: input.durationMs,
    },
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/progress");
}
