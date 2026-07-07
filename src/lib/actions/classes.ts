"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export type FormState = { error?: string } | undefined;

export async function createClass(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session || session.user.role !== ROLES.TEACHER) {
    return { error: "Solo los profesores pueden crear clases." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "El nombre de la clase es requerido." };
  }

  let inviteCode = generateInviteCode();
  for (let attempts = 0; attempts < 5; attempts++) {
    const existing = await prisma.classGroup.findUnique({ where: { inviteCode } });
    if (!existing) break;
    inviteCode = generateInviteCode();
  }

  await prisma.classGroup.create({
    data: {
      name,
      inviteCode,
      teacherId: session.user.id,
    },
  });

  revalidatePath("/dashboard/teacher");
}
