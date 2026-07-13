import { isBookUnlocked, lockBook } from "@/lib/actions/book";
import { CONCEPT_BOOK } from "@/lib/concept-book";
import BookGate from "@/components/book/BookGate";
import PrintButton from "@/components/book/PrintButton";

export const metadata = {
  title: "Libro de conceptos · Open Brain",
};

export default async function LibroPage() {
  const unlocked = await isBookUnlocked();
  if (!unlocked) return <BookGate />;

  const book = CONCEPT_BOOK;

  return (
    <div className="book-root mx-auto max-w-3xl w-full px-4 sm:px-6 py-10">
      {/* Barra de acciones (no se imprime) */}
      <div className="no-print flex items-center justify-between gap-3 mb-8">
        <form action={lockBook}>
          <button className="text-sm text-slate-500 hover:text-slate-700">🔒 Cerrar libro</button>
        </form>
        <PrintButton label="🖨️ Imprimir libro" />
      </div>

      <article className="book-print-area space-y-10 text-slate-800 leading-relaxed">
        {/* Portada */}
        <header className="text-center border-b border-slate-200 pb-8">
          <div className="text-5xl">📖</div>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{book.title}</h1>
          <p className="mt-1 text-lg text-slate-600">{book.subtitle}</p>
          <p className="mt-6 text-sm uppercase tracking-widest text-slate-400">Autor</p>
          <p className="text-xl font-semibold text-slate-900">{book.author}</p>
          <p className="mt-1 text-sm text-slate-400">{book.edition}</p>
        </header>

        {/* Agradecimiento */}
        <section className="page-block">
          <h2 className="text-xl font-bold text-slate-900">Agradecimiento</h2>
          <p className="mt-2 italic text-slate-700">{book.acknowledgment}</p>
        </section>

        {/* Prólogo */}
        <section className="page-block">
          <h2 className="text-xl font-bold text-slate-900">Prólogo</h2>
          <p className="mt-2 whitespace-pre-line">{book.prologue}</p>
        </section>

        {/* Introducción */}
        <section className="page-block">
          <h2 className="text-xl font-bold text-slate-900">Introducción</h2>
          <p className="mt-2 whitespace-pre-line">{book.introduction}</p>
        </section>

        {/* Tomos */}
        {book.tomos.map((tomo, ti) => (
          <section key={ti} className="page-block">
            <h2 className="text-2xl font-extrabold text-blue-700 border-b-2 border-amber-300 pb-2">
              {tomo.title}
            </h2>
            {tomo.subtitle && <p className="mt-1 text-slate-500 italic">{tomo.subtitle}</p>}

            {tomo.chapters.map((ch, ci) => (
              <div key={ci} className="mt-6">
                <h3 className="text-xl font-bold text-slate-900">{ch.title}</h3>
                {ch.intro && <p className="mt-2 text-slate-700">{ch.intro}</p>}

                {/* Conceptos */}
                {ch.concepts.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {ch.concepts.map((c, k) => (
                      <div key={k} className="rounded-lg border border-slate-200 p-4">
                        <h4 className="font-bold text-slate-900">{c.term}</h4>
                        <p className="mt-1">{c.definition}</p>
                        {c.science && (
                          <p className="mt-2 text-sm text-slate-600 border-l-4 border-blue-200 pl-3">
                            <span className="font-semibold">Base científica: </span>
                            {c.science}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Ejercicios imprimibles */}
                {ch.exercises.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-900">Ejercicios para el curso</h4>
                    <div className="mt-3 space-y-4">
                      {ch.exercises.map((ex, ei) => (
                        <div key={ei} className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                          <p className="font-semibold text-slate-900">{ex.title}</p>
                          <p className="mt-1 text-sm text-slate-700">{ex.instructions}</p>
                          {ex.items && ex.items.length > 0 && (
                            <ul className="mt-2 space-y-1 text-slate-800">
                              {ex.items.map((it, ii) => (
                                <li key={ii}>{it}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
