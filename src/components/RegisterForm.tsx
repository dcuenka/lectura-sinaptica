"use client";

import { useActionState, useState } from "react";
import { registerUser, type FormState } from "@/lib/actions/auth";
import { ROLES } from "@/lib/constants";

const initialState: FormState = undefined;

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  const [role, setRole] = useState<string>(ROLES.STUDENT);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{state.error}</p>
      )}

      <div>
        <span className="block text-sm font-medium text-slate-700 mb-2">Soy...</span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole(ROLES.STUDENT)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
              role === ROLES.STUDENT
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-300 text-slate-600"
            }`}
          >
            Alumno
          </button>
          <button
            type="button"
            onClick={() => setRole(ROLES.TEACHER)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
              role === ROLES.TEACHER
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-300 text-slate-600"
            }`}
          >
            Profesor
          </button>
        </div>
        <input type="hidden" name="role" value={role} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
        <input
          name="name"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {role === ROLES.STUDENT && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Código de invitación de tu clase
          </label>
          <input
            name="inviteCode"
            required
            placeholder="Ej: A3F9K2"
            className="w-full rounded-md border border-slate-300 px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Pídeselo a tu profesor. Sin este código no puedes registrarte como alumno.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
      >
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
