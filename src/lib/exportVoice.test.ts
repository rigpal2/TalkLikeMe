import { describe, expect, it } from 'vitest';
import { buildJsonl, buildSynthesisPrompt, buildVoiceMarkdown } from './exportVoice';
import type { AppState } from '../types';

const state: AppState = {
  skippedPromptIds: [],
  negatives: [
    {
      id: 'neg-1',
      promptId: 'p1',
      phrase: 'I hope this email finds you well.',
      reason: 'too-ai',
      createdAt: '2026-05-03T00:00:00.000Z',
    },
  ],
  samples: [
    {
      id: 'sample-1',
      promptId: 'p1',
      channel: 'email',
      category: 'follow-up',
      mode: 'rewrite',
      register: 'professional',
      promptText: 'I wanted to follow up at your earliest convenience.',
      rewrite: 'Wanted to see if you had a chance to look at this.',
      createdAt: '2026-05-03T00:00:00.000Z',
    },
  ],
};

describe('exports', () => {
  it('builds an instruction-oriented markdown voice file', () => {
    const md = buildVoiceMarkdown(state);
    expect(md).toContain('# TalkLikeMe Voice Instructions');
    expect(md).toContain('Quick Instructions for AI');
    expect(md).toContain('I hope this email finds you well.');
    expect(md).toContain('Wanted to see if you had a chance');
  });

  it('preserves raw examples as jsonl', () => {
    const jsonl = buildJsonl(state.samples);
    expect(jsonl.trim().split('\n')).toHaveLength(1);
    expect(JSON.parse(jsonl).rewrite).toContain('Wanted to see');
  });

  it('builds a copy-paste synthesis prompt', () => {
    const prompt = buildSynthesisPrompt(state);
    expect(prompt).toContain('personal AI writing instruction file');
    expect(prompt).toContain('Negative examples');
    expect(prompt).toContain('Rewrite examples');
  });
});
