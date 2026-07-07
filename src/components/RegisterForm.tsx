"use client";

import { useActionState } from "react";
import { registerUser, type FormState } from "@/lib/actions/auth";
import { ROLES } from "@/lib/constants";

const initialState: FormState = undefined;

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function RegisterForm({
  mode = "student",
}: {
  mode?: "student" | "teacher";
}) {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  const isTeacher = mode === "teacher";
  const role = isTeacher ? ROLES.TEACHER : ROLES.STUDENT;

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{state.error}</p>
      )}

      <input type="hidden" name="role" value={role} />

      {isTeacher && (
        <p className="rounded-md bg-blue-50 text-blue-700 text-sm px-3 py-2">
          Registro de profesor
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
        <input name="name" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
        <input name="email" type="email" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
        <input name="password" type="password" required minLength={6} className={inputClass} />
      </div>

      {!isTeacher && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Código de invitación de tu clase
          </label>
          <input
            name="inviteCode"
            required
            placeholder="Ej: A3F9K2"
            className={`${inputClass} uppercase`}
          />
          <p className="mt-1 text-xs text-slate-500">
            Pídeselo a tu profesor. Sin este código no puedes registrarte.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
      >
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
