import Link from "next/link";

const STEPS = [
  {
    title: "1. Regístrate",
    text: "El profesor crea sus clases y comparte un código de invitación. Los alumnos se registran con ese código en segundos.",
  },
  {
    title: "2. Entrena",
    text: "Cada alumno practica ejercicios de taquistoscopio, lectura cronometrada y amplitud visual a su propio ritmo.",
  },
  {
    title: "3. Mide el progreso",
    text: "El profesor ve en tiempo real la velocidad, comprensión y evolución de cada alumno y de toda la clase.",
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1 mb-6">
          Para profesores y sus alumnos
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
          Entrena la <span className="text-indigo-600">lectura sináptica</span> de tus alumnos
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Crea tus clases, invita a tus alumnos y déjalos practicar ejercicios de velocidad y
          comprensión lectora. Tú ves el progreso de cada uno, ellos ven su propia mejora.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-white px-6 py-3 text-slate-700 font-semibold border border-slate-300 hover:border-indigo-400 transition"
          >
            Ya tengo cuenta
          </Link>
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
                <h3 className="font-semibold text-lg text-indigo-700">{step.title}</h3>
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
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl">{ex.emoji}</div>
              <h3 className="mt-3 font-semibold text-lg text-slate-900">{ex.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{ex.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            ¿Listo para que tus alumnos empiecen a practicar?
          </h2>
          <p className="mt-3 text-indigo-100">
            Crea tu cuenta de profesor, arma tu primera clase y comparte el código con tus alumnos.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-md bg-white px-6 py-3 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
          >
            Empezar ahora
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-center text-sm text-slate-400">
        Lectura Sináptica — plataforma de práctica de lectura veloz y comprensión.
      </footer>
    </div>
  );
}
