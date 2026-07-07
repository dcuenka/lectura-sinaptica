export type TachistoscopeConfig = {
  displayMs: number;
  items: string[];
};

export type TimedReadingQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type TimedReadingConfig = {
  text: string;
  questions: TimedReadingQuestion[];
};

export type VisualSpanConfig = {
  displayMs: number;
  rows: string[][];
};
