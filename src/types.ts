export type Channel = 'email' | 'casual' | 'professional' | 'sales' | 'social';
export type Mode = 'rewrite' | 'edit' | 'rate' | 'compose';
export type Register = 'casual' | 'professional' | 'warm' | 'direct' | 'bad-news' | 'apology' | 'disagreement';

export type Prompt = {
  id: string;
  channel: Channel;
  category: string;
  mode: Mode;
  register: Register;
  title: string;
  setup?: string;
  text: string;
  ask: string;
  contextFacts?: string[];
  inventDetails?: string[];
};

export type Sample = {
  id: string;
  promptId: string;
  channel: Channel;
  category: string;
  mode: Mode;
  register: Register;
  promptText: string;
  setup?: string;
  contextFacts?: string[];
  inventDetails?: string[];
  rewrite: string;
  createdAt: string;
};

export type NegativeExample = {
  id: string;
  promptId: string;
  phrase: string;
  reason: 'not-me' | 'too-ai' | 'bad-context';
  createdAt: string;
};

export type CalibrationOption = {
  id: string;
  label: string;
  description: string;
  trait: string;
};

export type CalibrationQuestion = {
  id: string;
  category: string;
  question: string;
  options: CalibrationOption[];
};

export type CalibrationAnswer = {
  questionId: string;
  optionId: string;
  createdAt: string;
};

export type RatingResponse = {
  id: string;
  text: string;
  traits: string[];
};

export type RatingScenario = {
  id: string;
  category: string;
  prompt: string;
  context: string;
  responses: RatingResponse[];
};

export type ResponseRating = {
  id: string;
  scenarioId: string;
  responseId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  responseText: string;
  traits: string[];
  createdAt: string;
};

export type AppState = {
  samples: Sample[];
  negatives: NegativeExample[];
  skippedPromptIds: string[];
  calibrationAnswers: CalibrationAnswer[];
  responseRatings: ResponseRating[];
};
