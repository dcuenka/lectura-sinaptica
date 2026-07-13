"use client";

import { useActionState } from "react";
import Image from "next/image";
import { unlockBook, type BookGateState } from "@/lib/actions/book";
import { BRAND } from "@/lib/brand";

const initial: BookGateState = undefined;

export default function BookGate() {
  const [state, formAction, pending] = useActionState(unlockBook, initial);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
        <Image
          src={BRAND.logo}
          alt={BRAND.name}
          width={64}
          height={64}
          className="mx-auto h-16 w-16 object-contain"
        />
        <h1 className="mt-4 text-xl font-bold text-slate-900">📖 Libro de conceptos</h1>
        <p className="mt-1 text-sm text-slate-500">Área privada del autor. Ingresa tu clave.</p>

        <form action={formAction} className="mt-6 space-y-4">
          {state?.error && (
            <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{state.error}</p>
          )}
          <input
            name="key"
            type="password"
            required
            autoFocus
            placeholder="Clave de administrador"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {pending ? "Verificando..." : "Abrir libro"}
          </button>
        </form>
      </div>
    </div>
  );
}
