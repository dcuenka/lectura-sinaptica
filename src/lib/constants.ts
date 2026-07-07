export const ROLES = {
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const EXERCISE_TYPES = {
  TACHISTOSCOPE: "TACHISTOSCOPE",
  TIMED_READING: "TIMED_READING",
  VISUAL_SPAN: "VISUAL_SPAN",
} as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[keyof typeof EXERCISE_TYPES];

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  TACHISTOSCOPE: "Taquistoscopio",
  TIMED_READING: "Lectura cronometrada",
  VISUAL_SPAN: "Amplitud visual",
};

export const EXERCISE_TYPE_SLUGS: Record<ExerciseType, string> = {
  TACHISTOSCOPE: "tachistoscope",
  TIMED_READING: "timed-reading",
  VISUAL_SPAN: "visual-span",
};

export const SLUG_TO_EXERCISE_TYPE: Record<string, ExerciseType> = {
  tachistoscope: "TACHISTOSCOPE",
  "timed-reading": "TIMED_READING",
  "visual-span": "VISUAL_SPAN",
};
