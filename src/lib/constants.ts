export const ROLES = {
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const EXERCISE_TYPES = {
  TACHISTOSCOPE: "TACHISTOSCOPE",
  TIMED_READING: "TIMED_READING",
  VISUAL_SPAN: "VISUAL_SPAN",
  WORD_BUILD: "WORD_BUILD",
  ORATORY: "ORATORY",
} as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[keyof typeof EXERCISE_TYPES];

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  TACHISTOSCOPE: "Taquistoscopio",
  TIMED_READING: "Lectura cronometrada",
  VISUAL_SPAN: "Amplitud visual",
  WORD_BUILD: "Léxico (Scrabble)",
  ORATORY: "Oratoria",
};

export const EXERCISE_TYPE_EMOJI: Record<ExerciseType, string> = {
  TACHISTOSCOPE: "⚡",
  TIMED_READING: "⏱️",
  VISUAL_SPAN: "👁️",
  WORD_BUILD: "🔤",
  ORATORY: "🎤",
};

export const EXERCISE_TYPE_SLUGS: Record<ExerciseType, string> = {
  TACHISTOSCOPE: "tachistoscope",
  TIMED_READING: "timed-reading",
  VISUAL_SPAN: "visual-span",
  WORD_BUILD: "word-build",
  ORATORY: "oratory",
};

export const SLUG_TO_EXERCISE_TYPE: Record<string, ExerciseType> = {
  tachistoscope: "TACHISTOSCOPE",
  "timed-reading": "TIMED_READING",
  "visual-span": "VISUAL_SPAN",
  "word-build": "WORD_BUILD",
  oratory: "ORATORY",
};

// --- Clasificación por edad (curso desde 6 hasta 65 años) ---

export const MIN_AGE = 6;
export const MAX_AGE = 65;

export type AgeBand = {
  key: string;
  label: string;
  min: number;
  max: number;
};

// Bandas para agrupar y filtrar la biblioteca.
export const AGE_BANDS: AgeBand[] = [
  { key: "ninos", label: "Niños (6-9)", min: 6, max: 9 },
  { key: "preadolescentes", label: "Preadolescentes (10-12)", min: 10, max: 12 },
  { key: "adolescentes", label: "Adolescentes (13-17)", min: 13, max: 17 },
  { key: "jovenes", label: "Jóvenes (18-30)", min: 18, max: 30 },
  { key: "adultos", label: "Adultos (31-50)", min: 31, max: 50 },
  { key: "mayores", label: "Adultos mayores (51-65)", min: 51, max: 65 },
];

export function ageBandForAge(age: number): AgeBand {
  return (
    AGE_BANDS.find((b) => age >= b.min && age <= b.max) ??
    AGE_BANDS[AGE_BANDS.length - 1]
  );
}

// 18 niveles mapeados a una edad recomendada (edad = dificultad creciente).
export const LEVEL_AGES: { level: number; ageMin: number; ageMax: number }[] = [
  { level: 1, ageMin: 6, ageMax: 7 },
  { level: 2, ageMin: 7, ageMax: 8 },
  { level: 3, ageMin: 8, ageMax: 9 },
  { level: 4, ageMin: 9, ageMax: 10 },
  { level: 5, ageMin: 10, ageMax: 11 },
  { level: 6, ageMin: 11, ageMax: 12 },
  { level: 7, ageMin: 12, ageMax: 13 },
  { level: 8, ageMin: 13, ageMax: 14 },
  { level: 9, ageMin: 14, ageMax: 15 },
  { level: 10, ageMin: 15, ageMax: 17 },
  { level: 11, ageMin: 17, ageMax: 19 },
  { level: 12, ageMin: 19, ageMax: 22 },
  { level: 13, ageMin: 22, ageMax: 26 },
  { level: 14, ageMin: 26, ageMax: 31 },
  { level: 15, ageMin: 31, ageMax: 38 },
  { level: 16, ageMin: 38, ageMax: 46 },
  { level: 17, ageMin: 46, ageMax: 55 },
  { level: 18, ageMin: 55, ageMax: 65 },
];

export function ageLabel(ageMin: number, ageMax: number): string {
  return `${ageMin}-${ageMax} años`;
}
