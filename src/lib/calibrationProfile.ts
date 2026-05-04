import { calibrationQuestions } from '../data/calibration';
import type { AppState, CalibrationAnswer, CalibrationQuestion, ResponseRating } from '../types';

export type CalibrationProfile = {
  answeredCount: number;
  questionCount: number;
  ratedCount: number;
  summary: string;
  selectedTraits: string[];
  likedTraits: string[];
  dislikedTraits: string[];
  bestRatedResponses: ResponseRating[];
  worstRatedResponses: ResponseRating[];
};

function optionTrait(question: CalibrationQuestion, answer?: CalibrationAnswer) {
  if (!answer) return undefined;
  return question.options.find((option) => option.id === answer.optionId)?.trait;
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function traitCounts(ratings: ResponseRating[], predicate: (rating: ResponseRating) => boolean) {
  const counts = new Map<string, number>();
  ratings.filter(predicate).forEach((rating) => {
    rating.traits.forEach((trait) => counts.set(trait, (counts.get(trait) ?? 0) + 1));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([trait]) => trait);
}

export function buildCalibrationProfile(state: AppState): CalibrationProfile {
  const calibrationAnswers = Array.isArray(state.calibrationAnswers) ? state.calibrationAnswers : [];
  const responseRatings = Array.isArray(state.responseRatings) ? state.responseRatings : [];
  const answersByQuestion = new Map(calibrationAnswers.map((answer) => [answer.questionId, answer]));
  const selectedTraits = unique(
    calibrationQuestions
      .map((question) => optionTrait(question, answersByQuestion.get(question.id)))
      .filter((trait): trait is string => Boolean(trait)),
  );

  const likedTraits = traitCounts(responseRatings, (rating) => rating.rating >= 4);
  const dislikedTraits = traitCounts(responseRatings, (rating) => rating.rating <= 2);
  const bestRatedResponses = [...responseRatings].filter((rating) => rating.rating >= 4).sort((a, b) => b.rating - a.rating).slice(0, 8);
  const worstRatedResponses = [...responseRatings].filter((rating) => rating.rating <= 2).sort((a, b) => a.rating - b.rating).slice(0, 8);

  const summaryParts = [
    selectedTraits.length ? `Quiz says: ${selectedTraits.slice(0, 10).join(', ')}.` : 'No quiz answers yet.',
    likedTraits.length ? `Strong rated preferences: ${likedTraits.slice(0, 8).join(', ')}.` : 'No strongly liked example responses yet.',
    dislikedTraits.length ? `Avoid signals: ${dislikedTraits.slice(0, 8).join(', ')}.` : 'No strongly disliked response patterns yet.',
  ];

  return {
    answeredCount: calibrationAnswers.length,
    questionCount: calibrationQuestions.length,
    ratedCount: responseRatings.length,
    summary: summaryParts.join(' '),
    selectedTraits,
    likedTraits,
    dislikedTraits,
    bestRatedResponses,
    worstRatedResponses,
  };
}
