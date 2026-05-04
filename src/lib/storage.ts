import type { AppState } from '../types';

const STORAGE_KEY = 'talklikeme:v1';

export const emptyState: AppState = {
  samples: [],
  negatives: [],
  skippedPromptIds: [],
};

export function loadState(): AppState {
  if (typeof window === 'undefined') return emptyState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState;

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      samples: Array.isArray(parsed.samples) ? parsed.samples : [],
      negatives: Array.isArray(parsed.negatives) ? parsed.negatives : [],
      skippedPromptIds: Array.isArray(parsed.skippedPromptIds) ? parsed.skippedPromptIds : [],
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  window.localStorage.removeItem(STORAGE_KEY);
}
