import Link from "next/link";
import ExerciseEditorForm from "@/components/exercises/ExerciseEditorForm";

export default function NewExercisePage() {
  return (
    <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 py-10">
      <Link
        href="/dashboard/teacher/exercises"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Ejercicios
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Nuevo ejercicio</h1>
      <p className="mt-1 text-slate-500">
        Elige el tipo, ponle título y completa el contenido.
      </p>
      <div className="mt-6">
        <ExerciseEditorForm />
      </div>
    </div>
  );
}
