"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export type FormState = { error?: string } | undefined;

export async function registerUser(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();

  if (!name || !email || !password || !role) {
    return { error: "Faltan campos requeridos." };
  }

  if (role !== ROLES.TEACHER && role !== ROLES.STUDENT) {
    return { error: "Rol inválido." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  let classGroupId: string | null = null;
  if (role === ROLES.STUDENT) {
    if (!inviteCode) {
      return { error: "Los alumnos necesitan el código de invitación de su clase." };
    }
    const classGroup = await prisma.classGroup.findUnique({ where: { inviteCode } });
    if (!classGroup) {
      return { error: "Código de invitación no válido." };
    }
    classGroupId = classGroup.id;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  if (classGroupId) {
    await prisma.enrollment.create({
      data: { userId: user.id, classGroupId },
    });
  }

  redirect("/login?registered=1");
}
