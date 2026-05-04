import { describe, expect, it } from 'vitest';
import { calibrationQuestions, ratingScenarios } from '../data/calibration';
import { buildCalibrationProfile } from './calibrationProfile';
import type { AppState } from '../types';

const state: AppState = {
  skippedPromptIds: [],
  samples: [],
  negatives: [],
  calibrationAnswers: [
    { questionId: 'directness', optionId: 'very-direct', createdAt: '2026-05-03T00:00:00.000Z' },
    { questionId: 'length', optionId: 'short', createdAt: '2026-05-03T00:00:00.000Z' },
    { questionId: 'openers', optionId: 'hey-name', createdAt: '2026-05-03T00:00:00.000Z' },
  ],
  responseRatings: [
    {
      id: 'rating-1',
      scenarioId: 'delay-update',
      responseId: 'own-it-specific',
      rating: 5,
      prompt: 'Rate a customer delay update.',
      responseText: 'Hey John — quick update, your order is running about two weeks behind.',
      traits: ['owns the issue', 'specific next update'],
      createdAt: '2026-05-03T00:00:00.000Z',
    },
    {
      id: 'rating-2',
      scenarioId: 'delay-update',
      responseId: 'corporate-apology',
      rating: 1,
      prompt: 'Rate a customer delay update.',
      responseText: 'I sincerely apologize for any inconvenience this may have caused.',
      traits: ['formal', 'generic apology'],
      createdAt: '2026-05-03T00:00:00.000Z',
    },
  ],
};

describe('calibration', () => {
  it('ships a 20-question quick calibration bank', () => {
    expect(calibrationQuestions).toHaveLength(20);
    expect(calibrationQuestions.every((question) => question.options.length >= 3)).toBe(true);
  });

  it('ships response rating scenarios with multiple variants', () => {
    expect(ratingScenarios.length).toBeGreaterThanOrEqual(4);
    expect(ratingScenarios.every((scenario) => scenario.responses.length >= 4)).toBe(true);
  });

  it('derives baseline voice guidance from quiz answers and rated examples', () => {
    const profile = buildCalibrationProfile(state);
    expect(profile.summary).toContain('very direct');
    expect(profile.summary).toContain('short');
    expect(profile.likedTraits).toContain('owns the issue');
    expect(profile.dislikedTraits).toContain('formal');
    expect(profile.bestRatedResponses[0].rating).toBe(5);
  });
});
