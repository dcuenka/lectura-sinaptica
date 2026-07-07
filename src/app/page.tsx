import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

const STEPS = [
  {
    title: "1. Regístrate",
    text: "Crea tu cuenta con el código que te dio tu profesor y entra a tu clase en segundos.",
  },
  {
    title: "2. Entrena",
    text: "Practica ejercicios de taquistoscopio, lectura cronometrada y amplitud visual a tu propio ritmo.",
  },
  {
    title: "3. Mejora",
    text: "Observa cómo tu velocidad y comprensión crecen práctica tras práctica.",
  },
];

const EXERCISES = [
  {
    emoji: "⚡",
    title: "Taquistoscopio",
    text: "Palabras y frases que aparecen por milisegundos para entrenar la percepción visual rápida.",
  },
  {
    emoji: "⏱️",
    title: "Lectura cronometrada",
    text: "Textos con temporizador y preguntas de comprensión para medir palabras por minuto y entendimiento.",
  },
  {
    emoji: "👁️",
    title: "Amplitud visual",
    text: "Columnas de palabras que amplían el campo visual y reducen los saltos oculares al leer.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-white to-white -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28 text-center">
          <Image
            src={BRAND.logo}
            alt={BRAND.name}
            width={120}
            height={120}
            priority
            className="mx-auto h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-sm"
          />
          <span className="mt-6 inline-block rounded-full bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1">
            {BRAND.name} · {BRAND.product}
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Entrena tu <span className="text-blue-600">lectura sináptica cerebral</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Practica ejercicios de velocidad y comprensión lectora a tu propio ritmo y observa
            cómo tu cerebro mejora clase a clase.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              Registrarme como alumno
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-white px-6 py-3 text-slate-700 font-semibold border border-slate-300 hover:border-amber-400 transition"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900">
            ¿Cómo funciona?
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="text-center sm:text-left">
                <h3 className="font-semibold text-lg text-blue-700">{step.title}</h3>
                <p className="mt-2 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900">
          Tipos de ejercicios
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {EXERCISES.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition"
            >
              <div className="text-3xl">{ex.emoji}</div>
              <h3 className="mt-3 font-semibold text-lg text-slate-900">{ex.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{ex.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-center text-sm text-slate-400">
        {BRAND.name} · {BRAND.product} — plataforma de práctica de lectura veloz y comprensión.
      </footer>
    </div>
  );
}
