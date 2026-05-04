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

export type AppState = {
  samples: Sample[];
  negatives: NegativeExample[];
  skippedPromptIds: string[];
};
