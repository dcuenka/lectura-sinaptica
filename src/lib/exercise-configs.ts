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

export type WordBuildItem = {
  answer: string;
  hint: string;
};

export type WordBuildConfig = {
  items: WordBuildItem[];
};

export type OratoryItem = {
  title: string;
  prompt: string;
  tip: string;
  seconds: number;
};

export type OratoryConfig = {
  items: OratoryItem[];
};
