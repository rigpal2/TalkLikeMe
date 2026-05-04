import type { CalibrationQuestion, RatingScenario } from '../types';

const toneOptions = [
  { id: 'very-direct', label: 'Very direct', description: 'Say the thing plainly and move on.', trait: 'very direct' },
  { id: 'balanced', label: 'Balanced', description: 'Clear, but with a little warmth.', trait: 'balanced directness' },
  { id: 'softened', label: 'Softened', description: 'Use more cushion and relationship language.', trait: 'softened' },
  { id: 'warm-indirect', label: 'Warm/indirect', description: 'Lead with warmth before the ask.', trait: 'warm and indirect' },
];

export const calibrationQuestions: CalibrationQuestion[] = [
  { id: 'directness', category: 'tone', question: 'How direct should your writing feel?', options: toneOptions },
  { id: 'length', category: 'pacing', question: 'What length feels most like you?', options: [
    { id: 'short', label: 'Short', description: 'Usually 1–3 tight sentences.', trait: 'short' },
    { id: 'medium', label: 'Medium', description: 'Enough context, no essay.', trait: 'medium length' },
    { id: 'detailed', label: 'Detailed', description: 'Explain the reasoning and tradeoffs.', trait: 'detailed' },
  ]},
  { id: 'openers', category: 'email', question: 'What opener do you naturally use?', options: [
    { id: 'hey-name', label: 'Hey Name,', description: 'Casual and familiar.', trait: 'uses Hey Name opener' },
    { id: 'hi-name', label: 'Hi Name,', description: 'Clean and neutral.', trait: 'uses Hi Name opener' },
    { id: 'name-only', label: 'Name,', description: 'Direct with minimal opener.', trait: 'uses name-only opener' },
    { id: 'no-opener', label: 'No opener', description: 'Start with the message.', trait: 'often skips openers' },
  ]},
  { id: 'closers', category: 'email', question: 'What closer sounds most natural?', options: [
    { id: 'thanks', label: 'Thanks', description: 'Simple default.', trait: 'uses Thanks as closer' },
    { id: 'appreciate-it', label: 'Appreciate it', description: 'Slightly warmer.', trait: 'uses Appreciate it as closer' },
    { id: 'let-me-know', label: 'Let me know', description: 'Ends with a practical cue.', trait: 'closes with next-step cue' },
    { id: 'no-closer', label: 'No closer', description: 'End after the last useful sentence.', trait: 'often skips closers' },
  ]},
  { id: 'contractions', category: 'language', question: 'How often do you use contractions?', options: [
    { id: 'always', label: 'A lot', description: "I’ll, we’re, don’t, that’s feel natural.", trait: 'uses contractions freely' },
    { id: 'sometimes', label: 'Sometimes', description: 'Use them when the note is casual.', trait: 'uses contractions selectively' },
    { id: 'rarely', label: 'Rarely', description: 'Prefer more formal wording.', trait: 'rarely uses contractions' },
  ]},
  { id: 'bad-news', category: 'emotional state', question: 'When giving bad news, what is your default?', options: [
    { id: 'own-it', label: 'Own it plainly', description: 'Say what happened, take responsibility, give next step.', trait: 'owns bad news plainly' },
    { id: 'context-first', label: 'Explain context first', description: 'Give the why before the impact.', trait: 'explains context before impact' },
    { id: 'reassure-first', label: 'Reassure first', description: 'Lead with what you are doing to fix it.', trait: 'reassures before details' },
    { id: 'apologize-first', label: 'Apologize first', description: 'Start with apology and empathy.', trait: 'leads with apology' },
  ]},
  { id: 'apology-level', category: 'emotional state', question: 'How much apology sounds like you?', options: [
    { id: 'minimal', label: 'Minimal', description: '“Sorry about that” and move on.', trait: 'minimal apologies' },
    { id: 'moderate', label: 'Moderate', description: 'Own it and acknowledge impact.', trait: 'moderate apologies' },
    { id: 'heavy', label: 'Heavy', description: 'More empathy and responsibility language.', trait: 'more explicit apologies' },
  ]},
  { id: 'structure', category: 'formatting', question: 'What format should AI default to?', options: [
    { id: 'short-paragraphs', label: 'Short paragraphs', description: 'Readable blocks.', trait: 'prefers short paragraphs' },
    { id: 'bullets', label: 'Bullets', description: 'Use bullets for options or next steps.', trait: 'prefers bullets' },
    { id: 'numbered', label: 'Numbered steps', description: 'Good for sequences.', trait: 'prefers numbered steps' },
    { id: 'depends', label: 'Depends', description: 'Match the situation.', trait: 'format depends on situation' },
  ]},
  { id: 'polish', category: 'ai behavior', question: 'How polished should AI make you sound?', options: [
    { id: 'almost-unchanged', label: 'Almost unchanged', description: 'Clean typos only.', trait: 'keep drafts almost unchanged' },
    { id: 'clean-casual', label: 'Cleaner but casual', description: 'Improve clarity without making it corporate.', trait: 'clean but casual' },
    { id: 'professional', label: 'More professional', description: 'Elevate tone a bit.', trait: 'professionally polished' },
  ]},
  { id: 'enthusiasm', category: 'tone', question: 'How enthusiastic should it sound?', options: [
    { id: 'low', label: 'Low', description: 'No hype, no forced energy.', trait: 'low enthusiasm' },
    { id: 'moderate', label: 'Moderate', description: 'Positive when warranted.', trait: 'moderate enthusiasm' },
    { id: 'high', label: 'High', description: 'Use more excited language.', trait: 'high enthusiasm' },
  ]},
  { id: 'exclamation', category: 'punctuation', question: 'How do you feel about exclamation points?', options: [
    { id: 'avoid', label: 'Avoid them', description: 'Almost never.', trait: 'avoids exclamation points' },
    { id: 'rare', label: 'Rarely', description: 'Only when truly positive.', trait: 'rare exclamation points' },
    { id: 'fine', label: 'They are fine', description: 'Use naturally.', trait: 'allows exclamation points' },
  ]},
  { id: 'em-dashes', category: 'punctuation', question: 'How should AI use em dashes?', options: [
    { id: 'avoid', label: 'Avoid', description: 'They feel AI-ish or overused.', trait: 'avoids em dashes' },
    { id: 'sometimes', label: 'Sometimes', description: 'Fine if they help pacing.', trait: 'uses em dashes sparingly' },
    { id: 'often', label: 'Often', description: 'They match my rhythm.', trait: 'uses em dashes' },
  ]},
  { id: 'hedging', category: 'language', question: 'How much hedging do you use?', options: [
    { id: 'little', label: 'Very little', description: 'Avoid “just checking” and “maybe.”', trait: 'low hedging' },
    { id: 'some', label: 'Some', description: 'Use softeners when relationship matters.', trait: 'some hedging' },
    { id: 'more', label: 'A lot', description: 'Keep asks very soft.', trait: 'more hedging' },
  ]},
  { id: 'asks', category: 'email', question: 'How do you make asks?', options: [
    { id: 'specific', label: 'Specific', description: 'Ask for a clear action/date.', trait: 'specific asks' },
    { id: 'open-ended', label: 'Open-ended', description: 'Let them choose direction.', trait: 'open-ended asks' },
    { id: 'soft', label: 'Soft', description: 'Make it easy to say no.', trait: 'soft asks' },
  ]},
  { id: 'detail-level', category: 'specificity', question: 'How much concrete detail should AI add?', options: [
    { id: 'lots', label: 'A lot', description: 'Names, dates, options, next steps.', trait: 'adds concrete details' },
    { id: 'some', label: 'Some', description: 'Only what makes the message real.', trait: 'adds practical details' },
    { id: 'little', label: 'Little', description: 'Do not invent much.', trait: 'keeps invented detail minimal' },
  ]},
  { id: 'sales-style', category: 'sales', question: 'What sales/outreach style fits you?', options: [
    { id: 'plain', label: 'Plain/direct', description: 'Relevant reason + simple ask.', trait: 'plain sales style' },
    { id: 'warm', label: 'Warm consultative', description: 'Relationship and context first.', trait: 'warm consultative sales style' },
    { id: 'insight', label: 'Insight-led', description: 'Lead with observation or useful point.', trait: 'insight-led sales style' },
  ]},
  { id: 'follow-up-style', category: 'follow-up', question: 'How do you follow up?', options: [
    { id: 'quick-bump', label: 'Quick bump', description: 'Short and practical.', trait: 'quick follow-ups' },
    { id: 'value-add', label: 'Add context/value', description: 'Include one helpful reason.', trait: 'value-add follow-ups' },
    { id: 'deadline', label: 'Give a deadline/close loop', description: 'Create a clear decision point.', trait: 'deadline-driven follow-ups' },
  ]},
  { id: 'disagreement-style', category: 'disagreement', question: 'When disagreeing, how do you sound?', options: [
    { id: 'blunt', label: 'Blunt', description: 'Say no and why.', trait: 'blunt disagreement' },
    { id: 'balanced', label: 'Balanced', description: 'Acknowledge goal, then push back.', trait: 'balanced disagreement' },
    { id: 'collaborative', label: 'Collaborative', description: 'Frame as another option.', trait: 'collaborative disagreement' },
  ]},
  { id: 'avoid-phrases', category: 'anti-ai', question: 'Which AI-ish phrase bothers you most?', options: [
    { id: 'hope-finds-well', label: 'Hope this finds you well', description: 'Classic fake opener.', trait: 'avoids hope-this-finds-you-well' },
    { id: 'circle-back', label: 'Circle back / touch base', description: 'Corporate filler.', trait: 'avoids circle-back language' },
    { id: 'delve', label: 'Delve / leverage / align', description: 'AI business jargon.', trait: 'avoids AI jargon' },
    { id: 'all', label: 'All of them', description: 'Keep it human and plain.', trait: 'avoids generic AI phrases' },
  ]},
  { id: 'draft-control', category: 'ai behavior', question: 'If AI is unsure, what should it do?', options: [
    { id: 'ask', label: 'Ask me', description: 'Do not invent important facts.', trait: 'asks before inventing important facts' },
    { id: 'assume-label', label: 'Assume but label it', description: 'Make a reasonable assumption and flag it.', trait: 'labels assumptions' },
    { id: 'make-realistic', label: 'Make it realistic', description: 'Fill in plausible low-risk details.', trait: 'fills plausible low-risk details' },
  ]},
];

export const ratingScenarios: RatingScenario[] = [
  {
    id: 'delay-update',
    category: 'bad news',
    prompt: 'A customer asks why their order is late. Which responses sound like you?',
    context: 'The order is about two weeks behind. You want to own the relationship and promise a clear update.',
    responses: [
      { id: 'corporate-apology', text: 'Hi John, I sincerely apologize for the inconvenience. We are currently experiencing unexpected delays and appreciate your patience as we work through this matter.', traits: ['formal', 'generic apology', 'corporate'] },
      { id: 'own-it-specific', text: 'Hey John — quick update, your order is running about two weeks behind. That’s on us. I’m checking on the new ship date now and will send you a firm update by tomorrow.', traits: ['owns the issue', 'specific next update', 'direct'] },
      { id: 'brief-facts', text: 'John, the order is delayed about two weeks. I’ll send the updated ETA as soon as I have it.', traits: ['brief', 'low apology', 'direct'] },
      { id: 'warm-accountable', text: 'Hey John, unfortunately we hit a delay on your order. I know that’s frustrating, and I’m sorry for the miss here. I’m working on it now and will get you a clear update by tomorrow.', traits: ['warm', 'accountable', 'specific next update'] },
    ],
  },
  {
    id: 'follow-up',
    category: 'follow-up',
    prompt: 'You had a good intro call and have not heard back. Rate what sounds like you.',
    context: 'You want a short next-step call without sounding needy.',
    responses: [
      { id: 'soft-bump', text: 'Hey Sarah, just wanted to check in and see if you had any thoughts on next steps whenever you get a chance.', traits: ['soft', 'hedged', 'casual'] },
      { id: 'specific-time', text: 'Hey Sarah, wanted to see if it makes sense to do a quick 15 minute follow-up next week. Tuesday or Wednesday afternoon would work on my end.', traits: ['specific ask', 'practical', 'direct'] },
      { id: 'formal-follow', text: 'Hi Sarah, I am following up regarding our prior conversation to determine whether there is alignment around potential next steps.', traits: ['formal', 'corporate', 'abstract'] },
      { id: 'close-loop', text: 'Sarah, should I keep this on my radar or close the loop for now? Either is fine — just wanted to know where things stand.', traits: ['direct', 'close-loop', 'low pressure'] },
    ],
  },
  {
    id: 'correction',
    category: 'correction',
    prompt: 'You sent one wrong detail in a previous email. Rate the correction styles.',
    context: 'The detail matters, but it is not catastrophic.',
    responses: [
      { id: 'simple-correction', text: 'Sorry about that — I had one detail wrong in my last note. The correct date is June 12. I attached the updated version here.', traits: ['simple apology', 'specific correction', 'attachment mention'] },
      { id: 'over-apology', text: 'I sincerely apologize for the oversight and any confusion this may have caused. Please disregard my previous communication and refer to the corrected information below.', traits: ['formal', 'over-apologetic', 'corporate'] },
      { id: 'no-apology', text: 'Correction: the date is June 12, not June 10. Updated version attached.', traits: ['very brief', 'no apology', 'direct'] },
      { id: 'context-correction', text: 'Quick correction on my last email — I mixed up the delivery date. It should be June 12. Everything else in the quote is unchanged.', traits: ['plain', 'context', 'specific correction'] },
    ],
  },
  {
    id: 'direct-ask',
    category: 'direct ask',
    prompt: 'You need a decision so you can plan next steps. Rate the ask styles.',
    context: 'They have the info. You do not want to sound annoyed, but you need an answer.',
    responses: [
      { id: 'decision-specific', text: 'Can you let me know by Friday whether you want to move forward? If yes, I’ll get the next step started Monday. If not, no problem — I’ll close the loop on my end.', traits: ['specific deadline', 'clear choices', 'low pressure'] },
      { id: 'gentle-open', text: 'Whenever you have a chance, let me know what you are thinking here. Happy to talk through anything if helpful.', traits: ['soft', 'open-ended', 'warm'] },
      { id: 'blunt-decision', text: 'Do you want to move forward or not? I need to know before I spend more time on this.', traits: ['blunt', 'high directness', 'impatient'] },
      { id: 'formal-decision', text: 'Please advise on whether your team would like to proceed so that we can coordinate the appropriate next steps.', traits: ['formal', 'polished', 'corporate'] },
    ],
  },
];
