// Contenido del "Libro de conceptos" de Open Brain.
// Autor: Diego Alejandro Cuenca. Organizado en tomos → capítulos → conceptos.
// Diego sube cada concepto y aquí se desarrolla con definición, base científica y ejercicios.

export type ConceptEntry = {
  term: string;
  definition: string;
  science?: string; // dato o respaldo científico
};

export type BookExercise = {
  title: string;
  instructions: string;
  items?: string[]; // líneas/consignas del ejercicio (imprimibles)
};

export type Chapter = {
  title: string;
  intro?: string;
  concepts: ConceptEntry[];
  exercises: BookExercise[];
};

export type Tomo = {
  title: string;
  subtitle?: string;
  chapters: Chapter[];
};

export type ConceptBook = {
  title: string;
  subtitle: string;
  author: string;
  edition: string;
  acknowledgment: string;
  prologue: string;
  introduction: string;
  tomos: Tomo[];
};

export const CONCEPT_BOOK: ConceptBook = {
  title: "Lectura Sináptica Cerebral",
  subtitle: "Libro de Conceptos · Método Open Brain",
  author: "Diego Alejandro Cuenca",
  edition: "Primera edición",
  acknowledgment:
    "Dedico esta obra a mis alumnos, verdadera razón de este método, y a sus familias por confiar en que aprender a leer mejor transforma la vida. Agradezco a quienes, con su curiosidad y esfuerzo, demostraron día a día que la mente se entrena a cualquier edad. Este libro es de ustedes y para ustedes.",
  prologue:
    "La lectura no es un don reservado a unos pocos: es una habilidad que se entrena. Durante años observé cómo estudiantes de todas las edades avanzaban cuando la práctica dejaba de ser repetición mecánica y se convertía en un entrenamiento consciente del cerebro. De esa experiencia nació el método Open Brain y, con él, este libro de conceptos. Aquí reúno, en un lenguaje claro, las ideas que sostienen la Lectura Sináptica Cerebral: por qué funcionan, qué dice la ciencia y cómo llevarlas a la práctica. Que estas páginas sean una guía para docentes, alumnos y para toda mente que quiera seguir creciendo.",
  introduction:
    "Este libro está organizado en tomos y capítulos. Cada concepto se presenta con una definición clara, su respaldo en la investigación sobre lectura, memoria y aprendizaje, y ejercicios prácticos que pueden imprimirse para el desarrollo del curso. No es necesario leerlo de corrido: puede consultarse por concepto, según lo que se esté trabajando en clase. Cada capítulo cierra con ejercicios listos para llevar al aula. Úsalo como referencia, como plan de trabajo y como compañero de práctica.",
  tomos: [
    {
      title: "Tomo I — Fundamentos de la Lectura Sináptica",
      subtitle: "Los cimientos del método",
      chapters: [
        {
          title: "Capítulo 1 — ¿Qué es la lectura sináptica? (ejemplo)",
          intro:
            "Este capítulo es un ejemplo del formato. Cuando envíes tu primer concepto, lo desarrollaré aquí con su definición, base científica y ejercicios imprimibles.",
          concepts: [
            {
              term: "Fijación ocular",
              definition:
                "Es cada breve detención del ojo sobre el texto durante la lectura. Entre fijación y fijación, el ojo salta (movimiento llamado sacádico). Cuantas menos fijaciones necesita un lector por línea, más rápido lee.",
              science:
                "Estudios sobre movimientos oculares muestran que un lector principiante realiza casi una fijación por palabra, mientras que un lector entrenado abarca varias palabras en cada una, reduciendo el número total de fijaciones y aumentando la velocidad sin perder comprensión.",
            },
          ],
          exercises: [
            {
              title: "Ejercicio 1.1 — Cuenta tus fijaciones",
              instructions:
                "Lee el siguiente párrafo e intenta abarcar dos o tres palabras de un solo golpe de vista. Marca con una raya cada vez que sientas que tu ojo se detiene.",
              items: [
                "El | sol | brilla | sobre | el | campo | verde.",
                "Los | niños | leen | juntos | en | la | biblioteca.",
                "(Este es un ejercicio de ejemplo; se reemplazará por los tuyos.)",
              ],
            },
          ],
        },
      ],
    },
  ],
};
