import { PrismaClient } from "@prisma/client";
import { EXERCISE_TYPES } from "../src/lib/constants";
import type {
  TachistoscopeConfig,
  TimedReadingConfig,
  VisualSpanConfig,
} from "../src/lib/exercise-configs";

const prisma = new PrismaClient();

async function main() {
  // Solo reemplaza los ejercicios de ejemplo (createdById null),
  // sin tocar los que hayan creado los profesores.
  await prisma.exercise.deleteMany({ where: { createdById: null } });

  const tachistoscopeExercises: { title: string; level: number; config: TachistoscopeConfig }[] = [
    {
      title: "Palabras cortas",
      level: 1,
      config: {
        displayMs: 900,
        items: ["sol", "casa", "flor", "pan", "luna", "rio", "gato", "mar"],
      },
    },
    {
      title: "Frases breves",
      level: 2,
      config: {
        displayMs: 600,
        items: [
          "el sol brilla",
          "la casa azul",
          "un perro corre",
          "leo un libro",
          "llueve mucho hoy",
        ],
      },
    },
    {
      title: "Frases rápidas",
      level: 3,
      config: {
        displayMs: 350,
        items: [
          "el tren llega tarde",
          "mi hermana estudia mucho",
          "el gato duerme en el sofá",
          "compramos fruta fresca",
          "el cielo está despejado",
        ],
      },
    },
    {
      title: "Frases largas (avanzado)",
      level: 4,
      config: {
        displayMs: 250,
        items: [
          "los estudiantes resolvieron el problema juntos",
          "la ciudad amaneció cubierta de niebla espesa",
          "el científico anotó cuidadosamente sus resultados",
          "aprender a leer rápido requiere práctica diaria",
          "el río caudaloso atravesaba todo el valle verde",
        ],
      },
    },
    {
      title: "Destello relámpago (experto)",
      level: 5,
      config: {
        displayMs: 160,
        items: [
          "extraordinario",
          "la perseverancia construye el éxito",
          "conocimiento",
          "pensamiento crítico y análisis profundo",
          "responsabilidad",
          "la curiosidad impulsa todo aprendizaje",
        ],
      },
    },
  ];

  const timedReadingExercises: { title: string; level: number; config: TimedReadingConfig }[] = [
    {
      title: "El jardín de Ana",
      level: 1,
      config: {
        text:
          "Ana tiene un jardín pequeño detrás de su casa. Todos los días riega las plantas antes de ir a la escuela. Le gusta cultivar tomates, flores y hierbas aromáticas. Su planta favorita es un rosal que le regaló su abuela.",
        questions: [
          {
            question: "¿Dónde está el jardín de Ana?",
            options: ["Frente a la escuela", "Detrás de su casa", "En el parque", "En la azotea"],
            correctIndex: 1,
          },
          {
            question: "¿Cuál es la planta favorita de Ana?",
            options: ["Un tomate", "Una hierba", "Un rosal", "Un cactus"],
            correctIndex: 2,
          },
        ],
      },
    },
    {
      title: "Un viaje al bosque",
      level: 2,
      config: {
        text:
          "El sábado pasado, la familia Torres fue de excursión a un bosque cercano. Caminaron durante dos horas siguiendo un sendero rodeado de árboles altos. Vieron ardillas, escucharon el canto de los pájaros y encontraron un pequeño arroyo de agua muy clara. Al mediodía, se sentaron sobre unas rocas a comer sándwiches y frutas. Antes de regresar, el papá tomó varias fotografías del paisaje para recordar el día.",
        questions: [
          {
            question: "¿Cuánto tiempo caminaron?",
            options: ["Una hora", "Dos horas", "Tres horas", "Todo el día"],
            correctIndex: 1,
          },
          {
            question: "¿Qué encontraron en el sendero?",
            options: [
              "Un lago grande",
              "Un arroyo de agua clara",
              "Una cascada",
              "Una cueva",
            ],
            correctIndex: 1,
          },
          {
            question: "¿Qué hicieron al mediodía?",
            options: [
              "Regresaron a casa",
              "Tomaron fotografías",
              "Comieron sobre unas rocas",
              "Nadaron en el arroyo",
            ],
            correctIndex: 2,
          },
        ],
      },
    },
    {
      title: "La biblioteca del pueblo",
      level: 3,
      config: {
        text:
          "Hace treinta años, la biblioteca del pueblo era apenas una habitación con un puñado de libros donados por los vecinos. Con el tiempo, gracias al esfuerzo de varios voluntarios, creció hasta convertirse en un espacio amplio y luminoso, visitado cada semana por cientos de personas. Hoy cuenta con una sección infantil, salas de estudio silenciosas y talleres de lectura para adultos mayores. La bibliotecaria principal, que trabaja allí desde que era joven, asegura que el secreto de su éxito ha sido escuchar siempre lo que la comunidad necesita.",
        questions: [
          {
            question: "¿Cómo era la biblioteca al principio?",
            options: [
              "Un edificio de tres pisos",
              "Una habitación con pocos libros",
              "Un espacio digital",
              "Una carpa temporal",
            ],
            correctIndex: 1,
          },
          {
            question: "¿Qué ofrece la biblioteca actualmente?",
            options: [
              "Solo libros para niños",
              "Únicamente préstamo de películas",
              "Sección infantil, salas de estudio y talleres",
              "Clases de idiomas exclusivamente",
            ],
            correctIndex: 2,
          },
          {
            question: "Según la bibliotecaria, ¿cuál es el secreto de su éxito?",
            options: [
              "Tener muchos libros",
              "Escuchar lo que la comunidad necesita",
              "Cobrar membresías",
              "Cerrar temprano",
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    {
      title: "El origen de la escritura (avanzado)",
      level: 4,
      config: {
        text:
          "La escritura no apareció de un día para otro, sino que fue el resultado de miles de años de necesidad humana por registrar información. Las primeras marcas conocidas surgieron en Mesopotamia hacia el año 3300 antes de Cristo, cuando los comerciantes necesitaban llevar la cuenta de sus granos y ganado. Al principio usaban pequeñas fichas de arcilla con símbolos, pero con el tiempo esos símbolos se grabaron directamente sobre tablillas húmedas usando una caña puntiaguda. Este sistema, llamado cuneiforme, permitió no solo anotar transacciones, sino también leyes, poemas y relatos. Con la escritura, por primera vez en la historia, el conocimiento pudo viajar a través del tiempo y del espacio sin depender de la memoria de una persona. Civilizaciones muy distantes desarrollaron sus propios sistemas de forma independiente, como los jeroglíficos egipcios o los caracteres chinos, demostrando que la necesidad de comunicarse por escrito es una constante de la humanidad.",
        questions: [
          {
            question: "¿Por qué surgió originalmente la escritura?",
            options: [
              "Para escribir poemas",
              "Para llevar la cuenta de granos y ganado",
              "Para redactar leyes",
              "Para enviar cartas de amor",
            ],
            correctIndex: 1,
          },
          {
            question: "¿Cómo se llama el sistema de escritura de Mesopotamia?",
            options: ["Jeroglífico", "Alfabético", "Cuneiforme", "Braille"],
            correctIndex: 2,
          },
          {
            question: "Según el texto, ¿qué permitió la escritura por primera vez?",
            options: [
              "Que el conocimiento viajara en el tiempo sin depender de la memoria",
              "Que la gente hablara más rápido",
              "Que desaparecieran los comerciantes",
              "Que todos aprendieran a leer",
            ],
            correctIndex: 0,
          },
          {
            question: "¿Qué demuestran los jeroglíficos egipcios y los caracteres chinos?",
            options: [
              "Que Mesopotamia copió a Egipto",
              "Que solo una civilización inventó la escritura",
              "Que distintas civilizaciones crearon sistemas de forma independiente",
              "Que la escritura es reciente",
            ],
            correctIndex: 2,
          },
        ],
      },
    },
  ];

  const visualSpanExercises: { title: string; level: number; config: VisualSpanConfig }[] = [
    {
      title: "Pares de palabras",
      level: 1,
      config: {
        displayMs: 900,
        rows: [
          ["sol", "luna"],
          ["casa", "árbol"],
          ["gato", "perro"],
          ["mesa", "silla"],
        ],
      },
    },
    {
      title: "Tríos de palabras",
      level: 2,
      config: {
        displayMs: 700,
        rows: [
          ["rojo", "verde", "azul"],
          ["libro", "lápiz", "goma"],
          ["playa", "monte", "río"],
          ["pan", "leche", "queso"],
        ],
      },
    },
    {
      title: "Filas amplias",
      level: 3,
      config: {
        displayMs: 500,
        rows: [
          ["norte", "sur", "este", "oeste"],
          ["uno", "dos", "tres", "cuatro"],
          ["lunes", "martes", "miércoles", "jueves"],
          ["manzana", "pera", "uva", "kiwi"],
        ],
      },
    },
    {
      title: "Cinco palabras (avanzado)",
      level: 4,
      config: {
        displayMs: 380,
        rows: [
          ["árbol", "flor", "hoja", "raíz", "tallo"],
          ["cero", "cinco", "diez", "quince", "veinte"],
          ["azul", "rojo", "verde", "negro", "blanco"],
          ["perro", "gato", "pez", "ave", "rana"],
        ],
      },
    },
    {
      title: "Amplitud experta (seis)",
      level: 5,
      config: {
        displayMs: 280,
        rows: [
          ["sol", "mar", "luz", "paz", "voz", "red"],
          ["enero", "marzo", "mayo", "julio", "agosto", "octubre"],
          ["norte", "sur", "este", "oeste", "centro", "borde"],
          ["mente", "idea", "foco", "meta", "logro", "reto"],
        ],
      },
    },
  ];

  for (const ex of tachistoscopeExercises) {
    await prisma.exercise.create({
      data: {
        type: EXERCISE_TYPES.TACHISTOSCOPE,
        title: ex.title,
        level: ex.level,
        config: JSON.stringify(ex.config),
      },
    });
  }

  for (const ex of timedReadingExercises) {
    await prisma.exercise.create({
      data: {
        type: EXERCISE_TYPES.TIMED_READING,
        title: ex.title,
        level: ex.level,
        config: JSON.stringify(ex.config),
      },
    });
  }

  for (const ex of visualSpanExercises) {
    await prisma.exercise.create({
      data: {
        type: EXERCISE_TYPES.VISUAL_SPAN,
        title: ex.title,
        level: ex.level,
        config: JSON.stringify(ex.config),
      },
    });
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
