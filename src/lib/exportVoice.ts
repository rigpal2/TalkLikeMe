import type { AppState, Sample } from '../types';
import { categoryCounts, channelCounts, recommendedCategory, strengthLabel } from './progress';

function escapeMd(text: string) {
  return text.trim().replace(/\n{3,}/g, '\n\n');
}

function sampleBlock(sample: Sample, index: number) {
  return `### Example ${index + 1}: ${sample.category} / ${sample.channel}\n\n**Original AI-ish draft:**\n\n> ${escapeMd(sample.promptText).replace(/\n/g, '\n> ')}\n\n**My rewrite:**\n\n> ${escapeMd(sample.rewrite).replace(/\n/g, '\n> ')}\n`;
}

export function buildVoiceMarkdown(state: AppState) {
  const sampleCount = state.samples.length;
  const categories = categoryCounts(state);
  const channels = channelCounts(state);
  const topExamples = state.samples.slice(-12).reverse();
  const avoided = state.negatives.map((negative) => `- ${negative.phrase}`).join('\n') || '- Add phrases here as you reject generic wording.';

  return `# TalkLikeMe Voice Instructions\n\nThis file is designed to help an AI assistant write in my voice. Treat it as an instruction file first, and a style guide second. Preserve my meaning, but rewrite with my phrasing, pacing, and level of directness.\n\n## Quick Instructions for AI\n\n- Use the rewrite examples below as the source of truth.\n- Prefer wording that sounds like the examples, not generic polished AI copy.\n- Do not use phrases listed under \"Phrases I Avoid.\"\n- Match the channel when available: email, casual, professional, sales, or social.\n- If there is not enough evidence for a channel, stay simple, direct, and human.\n- Do not over-apologize, over-explain, or add fake enthusiasm unless the examples show that style.\n\n## Current Profile Strength\n\n- Samples collected: ${sampleCount}\n- Overall strength: ${strengthLabel(sampleCount)}\n- Next recommended category: ${recommendedCategory(state) ?? 'none'}\n\n## Channel Coverage\n\n${channels.map((item) => `- ${item.channel}: ${item.count} sample${item.count === 1 ? '' : 's'} (${strengthLabel(item.count)})`).join('\n')}\n\n## Category Coverage\n\n${categories.map((item) => `- ${item.category}: ${item.count} sample${item.count === 1 ? '' : 's'}`).join('\n')}\n\n## Phrases I Avoid\n\n${avoided}\n\n## Rewrite Examples\n\n${topExamples.length ? topExamples.map(sampleBlock).join('\n') : 'No rewrite examples collected yet.'}\n\n## How to Use This File\n\nWhen generating a draft for me, first infer the relevant channel and situation. Then use the examples above to match my natural wording. If a draft sounds like a press release, generic email template, or polished AI response, rewrite it to be more like the examples.\n`;
}

export function buildVoiceJson(state: AppState) {
  return JSON.stringify(
    {
      app: 'TalkLikeMe',
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      sampleCount: state.samples.length,
      negativeCount: state.negatives.length,
      strength: strengthLabel(state.samples.length),
      nextRecommendedCategory: recommendedCategory(state),
      channels: channelCounts(state),
      categories: categoryCounts(state),
      samples: state.samples,
      negatives: state.negatives,
    },
    null,
    2,
  );
}

export function buildJsonl(rows: unknown[]) {
  return rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : '');
}

export function buildSynthesisPrompt(state: AppState) {
  return `You are helping me create a personal AI writing instruction file called voice.md.\n\nGoal: infer my natural writing voice from paired examples where I rewrote generic or AI-ish drafts into my own words.\n\nPlease produce a practical instruction file that another AI assistant can use to write like me. Include:\n\n1. Quick rules for writing as me\n2. Tone and pacing\n3. Email-specific guidance\n4. Casual/professional differences if supported by evidence\n5. Phrases and patterns to avoid\n6. Before/after examples\n7. A final copy-paste instruction block for future AI writing tasks\n\nImportant:\n- Do not invent style traits that are not supported by the examples.\n- Prefer concrete rules over vague adjectives.\n- Preserve the raw examples as evidence.\n- Make the file useful as an instruction document, not a personality essay.\n\nNegative examples / phrases I rejected:\n${buildJsonl(state.negatives)}\n\nRewrite examples:\n${buildJsonl(state.samples)}\n`;
}

export function downloadFile(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
