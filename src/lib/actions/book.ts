"use server";

import { cookies } from "next/headers";
import { createHash } from "crypto";
import { redirect } from "next/navigation";

const COOKIE_NAME = "book_token";

function adminKey(): string {
  // Configura ADMIN_BOOK_KEY en Vercel para producción.
  return process.env.ADMIN_BOOK_KEY ?? "openbrain-admin-2026";
}

function expectedToken(): string {
  return createHash("sha256").update(adminKey()).digest("hex");
}

export async function isBookUnlocked(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === expectedToken();
}

export type BookGateState = { error?: string } | undefined;

export async function unlockBook(
  _prev: BookGateState,
  formData: FormData
): Promise<BookGateState> {
  const key = String(formData.get("key") ?? "");
  if (key !== adminKey()) {
    return { error: "Clave incorrecta." };
  }
  const store = await cookies();
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  redirect("/admin/libro");
}

export async function lockBook() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/admin/libro");
}
