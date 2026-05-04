import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { prompts } from './data/prompts';
import { buildJsonl, buildSynthesisPrompt, buildVoiceJson, buildVoiceMarkdown, downloadFile } from './lib/exportVoice';
import { categoryCounts, recommendedCategory, strengthLabel } from './lib/progress';
import { emptyState, loadState, resetState, saveState } from './lib/storage';
import type { AppState, NegativeExample, Prompt, Sample } from './types';

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickPrompt(state: AppState): Prompt {
  const nextCategory = recommendedCategory(state);
  const usedIds = new Set(state.samples.map((sample) => sample.promptId));
  const skippedIds = new Set(state.skippedPromptIds.slice(-5));
  const categoryMatches = prompts.filter((prompt) => prompt.category === nextCategory && !usedIds.has(prompt.id));
  const unused = prompts.filter((prompt) => !usedIds.has(prompt.id) && !skippedIds.has(prompt.id));
  const pool = categoryMatches.length ? categoryMatches : unused.length ? unused : prompts;
  return pool[Math.floor(Math.random() * pool.length)];
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>(() => pickPrompt(loadState()));
  const [rewrite, setRewrite] = useState('');
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const counts = useMemo(() => categoryCounts(state), [state]);
  const nextCategory = useMemo(() => recommendedCategory(state), [state]);
  const voiceMd = useMemo(() => buildVoiceMarkdown(state), [state]);

  function advance(nextState: AppState) {
    setCurrentPrompt(pickPrompt(nextState));
    setRewrite('');
  }

  function submitRewrite() {
    if (!rewrite.trim()) return;

    const sample: Sample = {
      id: uid('sample'),
      promptId: currentPrompt.id,
      channel: currentPrompt.channel,
      category: currentPrompt.category,
      mode: currentPrompt.mode,
      register: currentPrompt.register,
      promptText: currentPrompt.text,
      setup: currentPrompt.setup,
      rewrite: rewrite.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextState = { ...state, samples: [...state.samples, sample] };
    setState(nextState);
    advance(nextState);
  }

  function skipPrompt() {
    const nextState = { ...state, skippedPromptIds: [...state.skippedPromptIds, currentPrompt.id] };
    setState(nextState);
    advance(nextState);
  }

  function markNotMe() {
    const negative: NegativeExample = {
      id: uid('negative'),
      promptId: currentPrompt.id,
      phrase: currentPrompt.text,
      reason: 'too-ai',
      createdAt: new Date().toISOString(),
    };
    const nextState = { ...state, negatives: [...state.negatives, negative] };
    setState(nextState);
  }

  function clearAll() {
    if (!window.confirm('Clear all local TalkLikeMe samples from this browser?')) return;
    resetState();
    setState(emptyState);
    setRewrite('');
    setCurrentPrompt(pickPrompt(emptyState));
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">TalkLikeMe</p>
          <h1>Build an AI voice file by rewriting tiny pieces of text.</h1>
        </div>
        <div className="stats">
          <span>{state.samples.length} samples</span>
          <span>{strengthLabel(state.samples.length)}</span>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel progress-panel">
          <p className="panel-label">Coverage</p>
          <h2>Next: {nextCategory}</h2>
          <div className="coverage-list">
            {counts.map((item) => (
              <div className="coverage-row" key={item.category}>
                <span>{item.category}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
          <button className="ghost full" onClick={() => setShowExport((value) => !value)}>
            {showExport ? 'Hide exports' : 'Show exports'}
          </button>
          <button className="ghost full danger" onClick={clearAll}>Reset local data</button>
        </aside>

        <section className="card prompt-card">
          <div className="prompt-meta">
            <span>{currentPrompt.channel}</span>
            <span>{currentPrompt.category}</span>
            <span>{currentPrompt.mode}</span>
          </div>
          <h2>{currentPrompt.title}</h2>
          {currentPrompt.setup && <p className="setup">{currentPrompt.setup}</p>}
          <blockquote>{currentPrompt.text}</blockquote>
          <p className="ask">{currentPrompt.ask}</p>
          <textarea
            value={rewrite}
            onChange={(event) => setRewrite(event.target.value)}
            placeholder="Type how you would actually say it..."
            rows={7}
          />
          <div className="actions">
            <button onClick={submitRewrite} disabled={!rewrite.trim()}>Submit rewrite</button>
            <button className="secondary" onClick={skipPrompt}>Skip</button>
            <button className="ghost" onClick={markNotMe}>This sounds fake / not me</button>
          </div>
        </section>
      </section>

      {showExport && (
        <section className="export-grid">
          <div className="card export-card">
            <h2>Export</h2>
            <p>Everything stays in this browser until you download it. No login, no backend, no API calls.</p>
            <div className="export-actions">
              <button onClick={() => downloadFile('voice.md', voiceMd, 'text/markdown')}>Download voice.md</button>
              <button onClick={() => downloadFile('voice.json', buildVoiceJson(state), 'application/json')}>Download voice.json</button>
              <button onClick={() => downloadFile('examples.jsonl', buildJsonl(state.samples))}>Download examples.jsonl</button>
              <button onClick={() => downloadFile('negative_examples.jsonl', buildJsonl(state.negatives))}>Download negative_examples.jsonl</button>
              <button onClick={() => downloadFile('synthesis-prompt.md', buildSynthesisPrompt(state), 'text/markdown')}>Download synthesis prompt</button>
            </div>
          </div>
          <div className="card preview-card">
            <h2>voice.md preview</h2>
            <pre>{voiceMd}</pre>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
