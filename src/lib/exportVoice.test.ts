import { describe, expect, it } from 'vitest';
import { buildJsonl, buildSynthesisPrompt, buildVoiceJson, buildVoiceMarkdown } from './exportVoice';
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
      mode: 'compose',
      register: 'professional',
      promptText: 'Write the follow-up email you would actually send.',
      setup: 'You had a good intro call with a prospect last week and have not heard back.',
      contextFacts: ['They said quoting speed was a pain point.'],
      inventDetails: ['specific day/time', 'benefit sentence'],
      rewrite: 'Wanted to see if Monday afternoon works for a quick 15 minute follow-up.',
      createdAt: '2026-05-03T00:00:00.000Z',
    },
  ],
};

describe('exports', () => {
  it('builds an instruction-oriented markdown voice file with scenario context', () => {
    const md = buildVoiceMarkdown(state);
    expect(md).toContain('# TalkLikeMe Voice Instructions');
    expect(md).toContain('Quick Instructions for AI');
    expect(md).toContain('specific details a real message would need');
    expect(md).toContain('They said quoting speed was a pain point.');
    expect(md).toContain('Wanted to see if Monday afternoon works');
  });

  it('preserves raw examples as jsonl', () => {
    const jsonl = buildJsonl(state.samples);
    expect(jsonl.trim().split('\n')).toHaveLength(1);
    const parsed = JSON.parse(jsonl);
    expect(parsed.rewrite).toContain('Wanted to see');
    expect(parsed.inventDetails).toContain('specific day/time');
  });

  it('builds non-empty structured voice json', () => {
    const json = buildVoiceJson(state);
    const parsed = JSON.parse(json);
    expect(parsed.schemaVersion).toBe(2);
    expect(parsed.sampleCount).toBe(1);
    expect(parsed.samples[0].contextFacts).toHaveLength(1);
  });

  it('builds a copy-paste synthesis prompt', () => {
    const prompt = buildSynthesisPrompt(state);
    expect(prompt).toContain('personal AI writing instruction file');
    expect(prompt).toContain('Negative examples');
    expect(prompt).toContain('Writing examples');
    expect(prompt).toContain('invented scenario details');
  });
});
