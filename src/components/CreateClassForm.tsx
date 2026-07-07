"use client";

import { useActionState } from "react";
import { createClass, type FormState } from "@/lib/actions/classes";

const initialState: FormState = undefined;

export default function CreateClassForm() {
  const [state, formAction, pending] = useActionState(createClass, initialState);

  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-3">
      <input
        name="name"
        required
        placeholder="Nombre de la clase (ej: 5to Grado B)"
        className="flex-1 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 whitespace-nowrap"
      >
        {pending ? "Creando..." : "+ Crear clase"}
      </button>
      {state?.error && <p className="text-sm text-red-600 self-center">{state.error}</p>}
    </form>
  );
}
