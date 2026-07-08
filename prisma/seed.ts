import { PrismaClient } from "@prisma/client";
import { EXERCISE_TYPES, LEVEL_AGES } from "../src/lib/constants";
import type {
  TachistoscopeConfig,
  TimedReadingConfig,
  VisualSpanConfig,
  WordBuildConfig,
} from "../src/lib/exercise-configs";

const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/*  Bancos de contenido graduados por "tier" (dificultad 1..6).        */
/*  tier = ceil(level / 3)  ->  L1-3=tier1 ... L16-18=tier6            */
/* ------------------------------------------------------------------ */

// Palabras sueltas por tier (cortas y comunes -> largas y cultas).
const TIER_WORDS: string[][] = [
  // tier 1 (6-8)
  ["sol", "pan", "luz", "mar", "casa", "gato", "perro", "flor", "mesa", "niño", "mano", "pie", "ojo", "agua", "pelo", "rana", "oso", "pez", "ala", "uva", "sal", "río", "voz", "cielo"],
  // tier 2 (8-11)
  ["campo", "libro", "verde", "playa", "fruta", "nube", "tierra", "queso", "ratón", "camino", "puente", "manzana", "escuela", "amigo", "juego", "carta", "bosque", "montaña", "estrella", "ventana", "invierno", "verano", "familia", "silla"],
  // tier 3 (11-14)
  ["historia", "ciencia", "planeta", "energía", "cultura", "esfuerzo", "memoria", "símbolo", "paisaje", "aventura", "biblioteca", "experimento", "personaje", "territorio", "civilización", "instrumento", "curiosidad", "movimiento", "naturaleza", "geografía", "matemática", "personalidad", "comunidad", "importancia"],
  // tier 4 (14-19)
  ["hipótesis", "fenómeno", "análisis", "estrategia", "argumento", "consecuencia", "perspectiva", "estructura", "abstracto", "coherencia", "diversidad", "influencia", "innovación", "compromiso", "resiliencia", "autonomía", "prejuicio", "empatía", "criterio", "síntesis", "vocabulario", "razonamiento", "evidencia", "contexto"],
  // tier 5 (19-31)
  ["perseverancia", "conocimiento", "epistemología", "paradigma", "idiosincrasia", "verosímil", "inefable", "efímero", "dicotomía", "ambivalencia", "pragmático", "elocuencia", "sutileza", "intrínseco", "meticuloso", "ecuánime", "perspicaz", "trascendencia", "objetividad", "abstracción", "inherente", "heurística", "cognición", "metáfora"],
  // tier 6 (31-65)
  ["idiosincrático", "epistémico", "hermenéutica", "yuxtaposición", "ontológico", "perspicacia", "inconmensurable", "paradigmático", "verbigracia", "prolegómeno", "sincretismo", "taxonomía", "dialéctica", "fenomenología", "heterogéneo", "propedéutico", "exhaustividad", "quintaesencia", "ecléctico", "inextricable", "consuetudinario", "connotación", "polisemia", "etimología"],
];

// Frases por tier (para taquistoscopio de niveles medios/altos).
const TIER_PHRASES: string[][] = [
  ["el sol brilla", "la casa azul", "un gato salta", "leo un libro", "corre el perro"],
  ["el tren llega tarde", "mi amiga estudia mucho", "el cielo está despejado", "compramos fruta fresca", "los niños juegan afuera"],
  ["la historia despierta curiosidad", "el experimento salió bien", "leer amplía la mente", "el paisaje era impresionante", "la energía no se destruye"],
  ["la hipótesis fue confirmada", "el argumento resultó coherente", "analizamos varias perspectivas", "la evidencia respalda la teoría", "la innovación exige compromiso"],
  ["la perseverancia construye el éxito", "el conocimiento transforma la realidad", "un razonamiento meticuloso y sutil", "la elocuencia persuade con claridad", "toda abstracción parte de lo concreto"],
  ["la hermenéutica interpreta el sentido", "un enfoque ecléctico e integrador", "la dialéctica confronta ideas opuestas", "conceptos inconmensurables entre sí", "la quintaesencia del pensamiento crítico"],
];

// Léxico con pistas para el ejercicio tipo Scrabble (word build).
const TIER_LEXICON: { word: string; hint: string }[][] = [
  // tier 1
  [
    { word: "sol", hint: "Estrella que nos da luz de día" },
    { word: "gato", hint: "Mascota que dice miau" },
    { word: "casa", hint: "Lugar donde vives" },
    { word: "flor", hint: "Nace en las plantas y huele bien" },
    { word: "agua", hint: "Líquido que bebemos" },
    { word: "luna", hint: "Se ve en el cielo de noche" },
    { word: "pan", hint: "Se hace con harina y se come" },
    { word: "mar", hint: "Gran extensión de agua salada" },
  ],
  // tier 2
  [
    { word: "escuela", hint: "Lugar donde vas a aprender" },
    { word: "bosque", hint: "Sitio con muchos árboles" },
    { word: "puente", hint: "Cruza un río o una calle" },
    { word: "estrella", hint: "Punto de luz en el cielo nocturno" },
    { word: "manzana", hint: "Fruta roja o verde" },
    { word: "ventana", hint: "Por ella entra la luz al cuarto" },
    { word: "familia", hint: "Papás, hijos y hermanos" },
    { word: "camino", hint: "Por donde se anda para llegar" },
  ],
  // tier 3
  [
    { word: "ciencia", hint: "Estudia la naturaleza con método" },
    { word: "energía", hint: "Capacidad de producir trabajo o movimiento" },
    { word: "memoria", hint: "Facultad de recordar" },
    { word: "planeta", hint: "Astro que gira alrededor del Sol" },
    { word: "aventura", hint: "Experiencia emocionante y arriesgada" },
    { word: "biblioteca", hint: "Lugar lleno de libros" },
    { word: "curiosidad", hint: "Ganas de saber y descubrir" },
    { word: "paisaje", hint: "Vista de un lugar natural" },
  ],
  // tier 4
  [
    { word: "hipotesis", hint: "Suposición que se pone a prueba" },
    { word: "empatia", hint: "Ponerse en el lugar del otro" },
    { word: "criterio", hint: "Norma para juzgar o decidir" },
    { word: "sintesis", hint: "Resumen que une las partes" },
    { word: "evidencia", hint: "Prueba clara de algo" },
    { word: "autonomia", hint: "Capacidad de decidir por uno mismo" },
    { word: "coherencia", hint: "Relación lógica entre ideas" },
    { word: "resiliencia", hint: "Capacidad de superar la adversidad" },
  ],
  // tier 5
  [
    { word: "efimero", hint: "Que dura muy poco tiempo" },
    { word: "elocuencia", hint: "Hablar con fuerza y persuasión" },
    { word: "perspicaz", hint: "Que percibe con agudeza" },
    { word: "dicotomia", hint: "División en dos partes opuestas" },
    { word: "meticuloso", hint: "Que cuida cada detalle" },
    { word: "pragmatico", hint: "Orientado a lo práctico y útil" },
    { word: "inefable", hint: "Que no se puede expresar con palabras" },
    { word: "intrinseco", hint: "Propio de algo por su naturaleza" },
  ],
  // tier 6
  [
    { word: "hermeneutica", hint: "Arte de interpretar textos" },
    { word: "eclectico", hint: "Que combina estilos o ideas diversas" },
    { word: "dialectica", hint: "Confrontación de ideas para hallar la verdad" },
    { word: "taxonomia", hint: "Ciencia de clasificar y ordenar" },
    { word: "etimologia", hint: "Origen e historia de las palabras" },
    { word: "connotacion", hint: "Significado sugerido, más allá del literal" },
    { word: "polisemia", hint: "Cuando una palabra tiene varios sentidos" },
    { word: "quintaesencia", hint: "Lo más puro y esencial de algo" },
  ],
];

/* ------------------------------------------------------------------ */
/*  Lecturas graduadas (una por nivel, 18 en total).                   */
/* ------------------------------------------------------------------ */

type Reading = { text: string; questions: TimedReadingConfig["questions"] };

const READINGS: Reading[] = [
  // L1
  {
    text: "El gato de Ana es blanco. Le gusta dormir al sol. Por la tarde juega con una pelota roja.",
    questions: [
      { question: "¿De qué color es el gato?", options: ["Negro", "Blanco", "Café"], correctIndex: 1 },
      { question: "¿Con qué juega el gato?", options: ["Una pelota", "Un hueso", "Una cuerda"], correctIndex: 0 },
    ],
  },
  // L2
  {
    text: "Pablo tiene una bicicleta azul. Cada mañana va al parque con su perro. Allí corren juntos y saludan a sus amigos.",
    questions: [
      { question: "¿De qué color es la bicicleta?", options: ["Roja", "Verde", "Azul"], correctIndex: 2 },
      { question: "¿A dónde va Pablo por la mañana?", options: ["Al parque", "A la escuela", "Al mercado"], correctIndex: 0 },
    ],
  },
  // L3
  {
    text: "Ana tiene un jardín pequeño detrás de su casa. Todos los días riega las plantas antes de ir a la escuela. Le gusta cultivar tomates, flores y hierbas. Su planta favorita es un rosal que le regaló su abuela.",
    questions: [
      { question: "¿Dónde está el jardín?", options: ["Frente a la escuela", "Detrás de su casa", "En el parque"], correctIndex: 1 },
      { question: "¿Cuál es su planta favorita?", options: ["Un tomate", "Un rosal", "Un cactus"], correctIndex: 1 },
      { question: "¿Cuándo riega las plantas?", options: ["Por la noche", "Antes de la escuela", "Los domingos"], correctIndex: 1 },
    ],
  },
  // L4
  {
    text: "El sábado, la familia Torres fue de excursión a un bosque cercano. Caminaron dos horas por un sendero rodeado de árboles altos. Vieron ardillas y escucharon a los pájaros. Al mediodía comieron sobre unas rocas y luego regresaron felices.",
    questions: [
      { question: "¿Cuánto caminaron?", options: ["Una hora", "Dos horas", "Todo el día"], correctIndex: 1 },
      { question: "¿Qué animales vieron?", options: ["Ardillas", "Osos", "Lobos"], correctIndex: 0 },
      { question: "¿Dónde comieron?", options: ["En un restaurante", "Sobre unas rocas", "En casa"], correctIndex: 1 },
    ],
  },
  // L5
  {
    text: "La luz viaja más rápido que el sonido. Por eso, en una tormenta, primero vemos el relámpago y luego escuchamos el trueno, aunque ocurran al mismo tiempo. Contando los segundos entre ambos podemos calcular a qué distancia cayó el rayo.",
    questions: [
      { question: "¿Qué viaja más rápido?", options: ["El sonido", "La luz", "El viento"], correctIndex: 1 },
      { question: "¿Qué percibimos primero?", options: ["El trueno", "El relámpago", "La lluvia"], correctIndex: 1 },
      { question: "¿Para qué sirve contar los segundos?", options: ["Para calcular la distancia del rayo", "Para medir la lluvia", "Para saber la hora"], correctIndex: 0 },
    ],
  },
  // L6
  {
    text: "Las abejas son insectos fundamentales para la vida. Al volar de flor en flor recogen néctar y, sin proponérselo, transportan polen. Ese proceso, llamado polinización, permite que muchas plantas produzcan frutos y semillas. Sin las abejas, gran parte de los alimentos que comemos desaparecería.",
    questions: [
      { question: "¿Qué recogen las abejas de las flores?", options: ["Agua", "Néctar", "Hojas"], correctIndex: 1 },
      { question: "¿Cómo se llama el proceso descrito?", options: ["Digestión", "Polinización", "Evaporación"], correctIndex: 1 },
      { question: "¿Qué pasaría sin las abejas?", options: ["Nada", "Habría más flores", "Faltarían muchos alimentos"], correctIndex: 2 },
    ],
  },
  // L7
  {
    text: "Hace treinta años, la biblioteca del pueblo era apenas una habitación con pocos libros donados por los vecinos. Con el esfuerzo de varios voluntarios creció hasta convertirse en un espacio amplio y luminoso, visitado cada semana por cientos de personas. Hoy tiene sección infantil, salas de estudio y talleres para adultos mayores.",
    questions: [
      { question: "¿Cómo era la biblioteca al principio?", options: ["Un edificio enorme", "Una habitación con pocos libros", "Una carpa"], correctIndex: 1 },
      { question: "¿Quiénes la hicieron crecer?", options: ["El gobierno", "Voluntarios", "Una empresa"], correctIndex: 1 },
      { question: "¿Qué ofrece hoy?", options: ["Solo novelas", "Sección infantil, salas y talleres", "Únicamente películas"], correctIndex: 1 },
    ],
  },
  // L8
  {
    text: "La escritura no apareció de golpe. Surgió hacia el año 3300 a.C. en Mesopotamia, cuando los comerciantes necesitaban registrar sus granos y ganado. Al principio usaban fichas de arcilla y luego grabaron símbolos sobre tablillas con una caña. Ese sistema, el cuneiforme, permitió conservar leyes, relatos y cuentas, y que el conocimiento viajara a través del tiempo.",
    questions: [
      { question: "¿Por qué surgió la escritura?", options: ["Para escribir poemas", "Para registrar granos y ganado", "Por diversión"], correctIndex: 1 },
      { question: "¿Cómo se llama ese sistema?", options: ["Alfabeto", "Cuneiforme", "Jeroglífico"], correctIndex: 1 },
      { question: "¿Qué permitió la escritura?", options: ["Que el conocimiento viajara en el tiempo", "Hablar más rápido", "Viajar lejos"], correctIndex: 0 },
    ],
  },
  // L9
  {
    text: "El cerebro humano consume cerca del veinte por ciento de la energía del cuerpo, aunque representa solo el dos por ciento de su peso. Este órgano nunca descansa por completo: incluso mientras dormimos, ordena recuerdos y repara conexiones. Leer con frecuencia crea nuevas rutas entre las neuronas y, con la práctica, la lectura se vuelve más veloz y comprensiva.",
    questions: [
      { question: "¿Cuánta energía consume el cerebro?", options: ["El 2%", "El 20%", "La mitad"], correctIndex: 1 },
      { question: "¿Qué hace el cerebro mientras dormimos?", options: ["Se apaga", "Ordena recuerdos", "No hace nada"], correctIndex: 1 },
      { question: "¿Qué efecto tiene leer con frecuencia?", options: ["Cansa las neuronas", "Crea nuevas rutas neuronales", "No cambia nada"], correctIndex: 1 },
    ],
  },
  // L10
  {
    text: "La lectura veloz no consiste en pasar los ojos a toda prisa por el texto, sino en reducir el número de fijaciones que hacen los ojos en cada línea. Un lector principiante se detiene casi en cada palabra; un lector entrenado abarca grupos de palabras de un solo vistazo. Con ejercicios adecuados, la vista aprende a captar ideas completas y la comprensión, lejos de disminuir, suele aumentar.",
    questions: [
      { question: "¿En qué consiste realmente la lectura veloz?", options: ["Mover los ojos a toda prisa", "Reducir las fijaciones oculares", "Saltarse palabras"], correctIndex: 1 },
      { question: "¿Qué hace un lector entrenado?", options: ["Se detiene en cada palabra", "Abarca grupos de palabras", "Lee en voz alta"], correctIndex: 1 },
      { question: "¿Qué ocurre con la comprensión?", options: ["Suele aumentar", "Siempre baja", "Desaparece"], correctIndex: 0 },
    ],
  },
  // L11
  {
    text: "Durante siglos se creyó que el talento era innato y fijo. Sin embargo, la investigación moderna sobre el aprendizaje muestra que la práctica deliberada —repetir con objetivos claros, recibir retroalimentación y salir de la zona de confort— transforma el desempeño en casi cualquier disciplina. No basta con repetir por repetir: la clave está en corregir errores de forma consciente y sostener el esfuerzo en el tiempo.",
    questions: [
      { question: "¿Qué se creía sobre el talento?", options: ["Que era innato y fijo", "Que no existía", "Que se compraba"], correctIndex: 0 },
      { question: "¿Qué transforma el desempeño?", options: ["La práctica deliberada", "La suerte", "El descanso"], correctIndex: 0 },
      { question: "¿Cuál es la clave según el texto?", options: ["Repetir sin pensar", "Corregir errores conscientemente", "Evitar la retroalimentación"], correctIndex: 1 },
    ],
  },
  // L12
  {
    text: "La memoria no funciona como una grabadora que reproduce el pasado con fidelidad. Cada vez que recordamos algo, reconstruimos el recuerdo y, en ese proceso, podemos modificarlo sin darnos cuenta. Por eso dos personas que vivieron el mismo hecho pueden narrarlo de maneras distintas y ambas estar convencidas de su versión. Comprender esta plasticidad nos vuelve más humildes al juzgar lo que creemos recordar.",
    questions: [
      { question: "¿Cómo funciona la memoria según el texto?", options: ["Como una grabadora fiel", "Reconstruyendo el recuerdo", "Sin cambios nunca"], correctIndex: 1 },
      { question: "¿Por qué dos personas narran distinto un mismo hecho?", options: ["Porque mienten", "Porque cada una reconstruye el recuerdo", "Porque no estaban"], correctIndex: 1 },
      { question: "¿Qué actitud propone el texto?", options: ["Más humildad al juzgar recuerdos", "Confiar ciegamente en la memoria", "Ignorar el pasado"], correctIndex: 0 },
    ],
  },
  // L13
  {
    text: "El lenguaje no solo describe el mundo: también moldea la forma en que lo percibimos. Algunos idiomas distinguen decenas de términos para colores o parentescos que otros agrupan en una sola palabra, y esa riqueza léxica afina la atención de sus hablantes hacia ciertos matices. Ampliar el vocabulario, por tanto, no es un adorno: es adquirir herramientas más finas para pensar, distinguir y expresar la realidad.",
    questions: [
      { question: "¿Qué hace el lenguaje además de describir?", options: ["Moldea cómo percibimos", "Nada más", "Confunde"], correctIndex: 0 },
      { question: "¿Qué afina la riqueza léxica de un idioma?", options: ["La atención hacia los matices", "La velocidad al correr", "El oído musical"], correctIndex: 0 },
      { question: "¿Qué significa ampliar el vocabulario?", options: ["Un simple adorno", "Herramientas más finas para pensar", "Perder el tiempo"], correctIndex: 1 },
    ],
  },
  // L14
  {
    text: "La atención es un recurso limitado y, en la era digital, profundamente disputado. Cada notificación fragmenta la concentración y obliga al cerebro a un costoso reinicio para retomar la tarea previa. Estudios sobre productividad sugieren que las interrupciones frecuentes no solo alargan el trabajo, sino que degradan su calidad. Cultivar periodos de foco sostenido, sin estímulos externos, se ha vuelto una habilidad tan valiosa como escasa.",
    questions: [
      { question: "¿Cómo describe el texto la atención?", options: ["Un recurso ilimitado", "Un recurso limitado y disputado", "Algo irrelevante"], correctIndex: 1 },
      { question: "¿Qué provoca cada notificación?", options: ["Mejora el foco", "Fragmenta la concentración", "Da energía"], correctIndex: 1 },
      { question: "¿Qué se ha vuelto valioso y escaso?", options: ["El foco sostenido", "Las interrupciones", "El ruido"], correctIndex: 0 },
    ],
  },
  // L15
  {
    text: "El pensamiento crítico no consiste en oponerse a todo, sino en suspender el juicio el tiempo suficiente para examinar las razones que sostienen una afirmación. Implica distinguir entre correlación y causa, reconocer los propios sesgos y valorar la calidad de la evidencia antes que la fuerza con que se defiende una idea. En un entorno saturado de información, esta disciplina intelectual es la mejor defensa contra la manipulación.",
    questions: [
      { question: "¿En qué consiste el pensamiento crítico?", options: ["Oponerse a todo", "Examinar las razones antes de juzgar", "Creer lo primero que se lee"], correctIndex: 1 },
      { question: "¿Qué implica, según el texto?", options: ["Distinguir correlación de causa", "Ignorar la evidencia", "Confiar en la fuerza del discurso"], correctIndex: 0 },
      { question: "¿Contra qué protege?", options: ["Contra la manipulación", "Contra el aburrimiento", "Contra el cansancio"], correctIndex: 0 },
    ],
  },
  // L16
  {
    text: "La noción de progreso, tan central en la modernidad, rara vez es lineal. La historia avanza mediante tensiones: cada innovación resuelve problemas antiguos mientras engendra otros inéditos. La imprenta democratizó el saber y a la vez multiplicó la propaganda; la industrialización elevó el nivel de vida y deterioró el ambiente. Pensar el progreso con lucidez exige abandonar tanto el optimismo ingenuo como el pesimismo estéril, y sopesar, caso por caso, sus costos y beneficios.",
    questions: [
      { question: "¿Cómo es el progreso según el texto?", options: ["Siempre lineal", "Rara vez lineal", "Inexistente"], correctIndex: 1 },
      { question: "¿Qué ejemplo se da sobre la imprenta?", options: ["Democratizó el saber y multiplicó la propaganda", "Solo trajo beneficios", "No cambió nada"], correctIndex: 0 },
      { question: "¿Qué exige pensar el progreso con lucidez?", options: ["Optimismo ingenuo", "Sopesar costos y beneficios", "Pesimismo total"], correctIndex: 1 },
    ],
  },
  // L17
  {
    text: "La distinción entre información y conocimiento es más profunda de lo que parece. La información se acumula; el conocimiento se organiza. Disponer de datos ilimitados no garantiza comprender: sin marcos conceptuales que jerarquicen y conecten esos datos, la abundancia se vuelve ruido. El verdadero aprendizaje no reside en almacenar hechos, sino en tejer relaciones entre ellos, de modo que cada nuevo dato encuentre un lugar dentro de una estructura significativa capaz de anticipar y explicar.",
    questions: [
      { question: "¿Cuál es la diferencia planteada?", options: ["No hay diferencia", "La información se acumula, el conocimiento se organiza", "El conocimiento se acumula sin más"], correctIndex: 1 },
      { question: "¿Qué ocurre sin marcos conceptuales?", options: ["La abundancia se vuelve ruido", "Todo se comprende igual", "Mejora la memoria"], correctIndex: 0 },
      { question: "¿En qué reside el verdadero aprendizaje?", options: ["En almacenar hechos", "En tejer relaciones entre ellos", "En memorizar sin entender"], correctIndex: 1 },
    ],
  },
  // L18
  {
    text: "Toda lectura profunda es, en el fondo, un diálogo. El lector no recibe pasivamente el texto: lo interroga, lo contrasta con su experiencia, anticipa lo que vendrá y revisa sus hipótesis a medida que avanza. Esta actividad silenciosa, invisible desde fuera, distingue al lector competente del que apenas descifra signos. Cultivarla requiere tiempo y deliberación, pues la comprensión madura no se improvisa: se construye página a página, con paciencia, atención y una curiosidad que no se apaga ante la primera dificultad.",
    questions: [
      { question: "¿Qué es, en el fondo, la lectura profunda?", options: ["Un dictado", "Un diálogo", "Un examen"], correctIndex: 1 },
      { question: "¿Qué hace el lector competente?", options: ["Recibe el texto pasivamente", "Interroga y contrasta el texto", "Solo descifra signos"], correctIndex: 1 },
      { question: "¿Cómo se construye la comprensión madura?", options: ["Se improvisa", "Página a página, con paciencia", "De un solo golpe"], correctIndex: 1 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Generadores por tipo, graduados por nivel.                         */
/* ------------------------------------------------------------------ */

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const tierOf = (level: number) => Math.min(6, Math.ceil(level / 3)); // 1..6

// Toma n elementos de un arreglo empezando en un desplazamiento (determinista).
function pick<T>(arr: T[], n: number, offset: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n && i < arr.length; i++) {
    out.push(arr[(offset + i) % arr.length]);
  }
  return out;
}

function tachistoscopeFor(level: number): TachistoscopeConfig {
  const tier = tierOf(level);
  const displayMs = clamp(950 - level * 42, 130, 950);
  const usePhrases = level >= 7;
  const pool = usePhrases ? TIER_PHRASES[tier - 1] : TIER_WORDS[tier - 1];
  const count = usePhrases ? 5 : 8;
  return { displayMs, items: pick(pool, count, level * 3) };
}

function visualSpanFor(level: number): VisualSpanConfig {
  const tier = tierOf(level);
  const displayMs = clamp(1050 - level * 45, 160, 1050);
  const width = clamp(2 + Math.floor((level - 1) / 2), 2, 8);
  const words = TIER_WORDS[tier - 1];
  const rows: string[][] = [];
  for (let r = 0; r < 4; r++) {
    rows.push(pick(words, width, level * 5 + r * width));
  }
  return { displayMs, rows };
}

function wordBuildFor(level: number): WordBuildConfig {
  const tier = tierOf(level);
  const pool = TIER_LEXICON[tier - 1];
  const count = clamp(4 + Math.floor(level / 6), 4, 6);
  const chosen = pick(pool, count, level * 2);
  return { items: chosen.map((it) => ({ answer: it.word, hint: it.hint })) };
}

function timedReadingFor(level: number): TimedReadingConfig {
  return READINGS[level - 1];
}

/* ------------------------------------------------------------------ */

async function main() {
  // Solo reemplaza los ejercicios de ejemplo (createdById null),
  // sin tocar los que hayan creado los profesores.
  await prisma.exercise.deleteMany({ where: { createdById: null } });

  let created = 0;

  for (const { level, ageMin, ageMax } of LEVEL_AGES) {
    const ageTag = `${ageMin}-${ageMax} años`;

    await prisma.exercise.create({
      data: {
        type: EXERCISE_TYPES.TACHISTOSCOPE,
        title: `Taquistoscopio · Nivel ${level} (${ageTag})`,
        level,
        ageMin,
        ageMax,
        config: JSON.stringify(tachistoscopeFor(level)),
      },
    });

    await prisma.exercise.create({
      data: {
        type: EXERCISE_TYPES.VISUAL_SPAN,
        title: `Amplitud visual · Nivel ${level} (${ageTag})`,
        level,
        ageMin,
        ageMax,
        config: JSON.stringify(visualSpanFor(level)),
      },
    });

    await prisma.exercise.create({
      data: {
        type: EXERCISE_TYPES.WORD_BUILD,
        title: `Léxico Scrabble · Nivel ${level} (${ageTag})`,
        level,
        ageMin,
        ageMax,
        config: JSON.stringify(wordBuildFor(level)),
      },
    });

    await prisma.exercise.create({
      data: {
        type: EXERCISE_TYPES.TIMED_READING,
        title: `Lectura cronometrada · Nivel ${level} (${ageTag})`,
        level,
        ageMin,
        ageMax,
        config: JSON.stringify(timedReadingFor(level)),
      },
    });

    created += 4;
  }

  console.log(`Seed completado: ${created} ejercicios (18 niveles × 4 tipos).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
