import { requiredCategories } from '../data/prompts';
import type { AppState, Channel } from '../types';

export function strengthLabel(count: number) {
  if (count === 0) return 'Empty';
  if (count < 5) return 'Started';
  if (count < 15) return 'Useful';
  if (count < 40) return 'Strong';
  return 'Very strong';
}

export function categoryCounts(state: AppState) {
  return requiredCategories.map((category) => ({
    category,
    count: state.samples.filter((sample) => sample.category === category).length,
  }));
}

export function recommendedCategory(state: AppState) {
  const counts = categoryCounts(state);
  return [...counts].sort((a, b) => a.count - b.count || a.category.localeCompare(b.category))[0]?.category;
}

export function channelCounts(state: AppState) {
  const channels: Channel[] = ['email', 'casual', 'professional', 'sales', 'social'];
  return channels.map((channel) => ({
    channel,
    count: state.samples.filter((sample) => sample.channel === channel).length,
  }));
}
