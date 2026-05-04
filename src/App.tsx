import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { calibrationQuestions, ratingScenarios } from './data/calibration';
import { prompts } from './data/prompts';
import { buildJsonl, buildSynthesisPrompt, buildVoiceJson, buildVoiceMarkdown, downloadFile } from './lib/exportVoice';
import { categoryCounts, recommendedCategory, strengthLabel } from './lib/progress';
import { emptyState, loadState, resetState, saveState } from './lib/storage';
import type { AppState, CalibrationAnswer, NegativeExample, Prompt, ResponseRating, Sample } from './types';

type ModeView = 'quiz' | 'ratings' | 'write';

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

function ratingFor(state: AppState, scenarioId: string, responseId: string) {
  return state.responseRatings.find((rating) => rating.scenarioId === scenarioId && rating.responseId === responseId)?.rating;
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>(() => pickPrompt(loadState()));
  const [rewrite, setRewrite] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [mode, setMode] = useState<ModeView>('quiz');
  const [ratingScenarioIndex, setRatingScenarioIndex] = useState(0);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const counts = useMemo(() => categoryCounts(state), [state]);
  const nextCategory = useMemo(() => recommendedCategory(state), [state]);
  const voiceMd = useMemo(() => buildVoiceMarkdown(state), [state]);
  const voiceJson = useMemo(() => buildVoiceJson(state), [state]);
  const examplesJsonl = useMemo(() => buildJsonl(state.samples), [state]);
  const negativesJsonl = useMemo(() => buildJsonl(state.negatives), [state]);
  const ratingsJsonl = useMemo(() => buildJsonl(state.responseRatings), [state]);
  const synthesisPrompt = useMemo(() => buildSynthesisPrompt(state), [state]);

  const answeredIds = new Set(state.calibrationAnswers.map((answer) => answer.questionId));
  const currentQuestion = calibrationQuestions.find((question) => !answeredIds.has(question.id)) ?? calibrationQuestions[0];
  const quizComplete = state.calibrationAnswers.length >= calibrationQuestions.length;
  const currentRatingScenario = ratingScenarios[ratingScenarioIndex % ratingScenarios.length];
  const totalRatingSlots = ratingScenarios.reduce((sum, scenario) => sum + scenario.responses.length, 0);

  function advance(nextState: AppState) {
    setCurrentPrompt(pickPrompt(nextState));
    setRewrite('');
  }

  function answerQuestion(questionId: string, optionId: string) {
    const answer: CalibrationAnswer = { questionId, optionId, createdAt: new Date().toISOString() };
    const nextState = {
      ...state,
      calibrationAnswers: [...state.calibrationAnswers.filter((item) => item.questionId !== questionId), answer],
    };
    setState(nextState);
    if (nextState.calibrationAnswers.length >= calibrationQuestions.length) setMode('ratings');
  }

  function rateResponse(responseId: string, rating: 1 | 2 | 3 | 4 | 5) {
    const response = currentRatingScenario.responses.find((item) => item.id === responseId);
    if (!response) return;
    const nextRating: ResponseRating = {
      id: uid('rating'),
      scenarioId: currentRatingScenario.id,
      responseId,
      rating,
      prompt: currentRatingScenario.prompt,
      responseText: response.text,
      traits: response.traits,
      createdAt: new Date().toISOString(),
    };
    setState((previous) => ({
      ...previous,
      responseRatings: [
        ...previous.responseRatings.filter((item) => !(item.scenarioId === currentRatingScenario.id && item.responseId === responseId)),
        nextRating,
      ],
    }));
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
      contextFacts: currentPrompt.contextFacts,
      inventDetails: currentPrompt.inventDetails,
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
      reason: currentPrompt.mode === 'compose' ? 'bad-context' : 'too-ai',
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
    setMode('quiz');
    setCurrentPrompt(pickPrompt(emptyState));
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">TalkLikeMe</p>
          <h1>Build your AI voice file without uploading private emails.</h1>
          <p className="hero-copy">Start with 20 quick style questions, rate example responses 1–5, then write a few realistic scenarios to sharpen the last mile.</p>
        </div>
        <div className="stats">
          <span>{state.calibrationAnswers.length}/20 quiz</span>
          <span>{state.responseRatings.length}/{totalRatingSlots} ratings</span>
          <span>{state.samples.length} samples</span>
          <span>{strengthLabel(state.samples.length + Math.floor(state.responseRatings.length / 4) + Math.floor(state.calibrationAnswers.length / 5))}</span>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel progress-panel">
          <p className="panel-label">Calibration</p>
          <div className="mode-tabs">
            <button className={mode === 'quiz' ? 'active' : 'ghost'} onClick={() => setMode('quiz')}>20 questions</button>
            <button className={mode === 'ratings' ? 'active' : 'ghost'} onClick={() => setMode('ratings')}>Rate examples</button>
            <button className={mode === 'write' ? 'active' : 'ghost'} onClick={() => setMode('write')}>Write scenarios</button>
          </div>
          <div className="coverage-list">
            <div className="coverage-row"><span>Quiz</span><strong>{state.calibrationAnswers.length}/{calibrationQuestions.length}</strong></div>
            <div className="coverage-row"><span>Ratings</span><strong>{state.responseRatings.length}/{totalRatingSlots}</strong></div>
            <div className="coverage-row"><span>Written examples</span><strong>{state.samples.length}</strong></div>
          </div>
          <p className="panel-label">Writing coverage</p>
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

        {mode === 'quiz' && (
          <section className="card prompt-card calibration-card">
            <div className="prompt-meta">
              <span>quick calibration</span>
              <span>{state.calibrationAnswers.length + (quizComplete ? 0 : 1)} of {calibrationQuestions.length}</span>
              <span>{currentQuestion.category}</span>
            </div>
            <h2>{quizComplete ? 'Quick calibration complete' : currentQuestion.question}</h2>
            <p className="setup">This gets the first 80% without asking for private emails or making you write from scratch.</p>
            {quizComplete ? (
              <div className="completion-box">
                <p>You answered all 20 questions. Next, rate examples so TalkLikeMe can learn what sounds like you without requiring original writing yet.</p>
                <button onClick={() => setMode('ratings')}>Rate example responses</button>
              </div>
            ) : (
              <div className="option-grid">
                {currentQuestion.options.map((option) => (
                  <button className="option-card" key={option.id} onClick={() => answerQuestion(currentQuestion.id, option.id)}>
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {mode === 'ratings' && (
          <section className="card prompt-card calibration-card">
            <div className="prompt-meta">
              <span>rate examples</span>
              <span>{ratingScenarioIndex + 1} of {ratingScenarios.length}</span>
              <span>{currentRatingScenario.category}</span>
            </div>
            <h2>{currentRatingScenario.prompt}</h2>
            <p className="setup">{currentRatingScenario.context}</p>
            <p className="permission">Rate each response 1–5 based on how much it sounds like you. 5 = very me. 1 = not me at all.</p>
            <div className="rating-list">
              {currentRatingScenario.responses.map((response) => (
                <article className="rating-card" key={response.id}>
                  <p>{response.text}</p>
                  <div className="rating-buttons" aria-label={`Rate ${response.id}`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        className={ratingFor(state, currentRatingScenario.id, response.id) === value ? 'selected-rating' : 'ghost'}
                        key={value}
                        onClick={() => rateResponse(response.id, value as 1 | 2 | 3 | 4 | 5)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="actions">
              <button className="secondary" onClick={() => setRatingScenarioIndex((index) => Math.max(0, index - 1))}>Previous</button>
              <button onClick={() => setRatingScenarioIndex((index) => Math.min(ratingScenarios.length - 1, index + 1))}>Next example set</button>
              <button className="ghost" onClick={() => setMode('write')}>Skip to writing</button>
            </div>
          </section>
        )}

        {mode === 'write' && (
          <section className="card prompt-card">
            <div className="prompt-meta">
              <span>{currentPrompt.channel}</span>
              <span>{currentPrompt.category}</span>
              <span>{currentPrompt.mode}</span>
            </div>
            <h2>{currentPrompt.title}</h2>
            {currentPrompt.setup && <p className="setup">{currentPrompt.setup}</p>}

            {currentPrompt.contextFacts?.length ? (
              <div className="scenario-grid">
                <div>
                  <p className="mini-label">Known facts</p>
                  <ul>
                    {currentPrompt.contextFacts.map((fact) => <li key={fact}>{fact}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="mini-label">You may make up</p>
                  <ul>
                    {currentPrompt.inventDetails?.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </div>
              </div>
            ) : null}

            <blockquote>{currentPrompt.text}</blockquote>
            <p className="ask">{currentPrompt.ask}</p>
            <p className="permission">It is okay to invent realistic names, times, benefits, numbers, options, or context. That is part of your voice.</p>
            <textarea
              value={rewrite}
              onChange={(event) => setRewrite(event.target.value)}
              placeholder="Write the actual message you would send. Add realistic details if the prompt is underspecified..."
              rows={9}
            />
            <div className="actions">
              <button onClick={submitRewrite} disabled={!rewrite.trim()}>Submit response</button>
              <button className="secondary" onClick={skipPrompt}>Skip</button>
              <button className="ghost" onClick={markNotMe}>This prompt/context is not useful</button>
            </div>
          </section>
        )}
      </section>

      {showExport && (
        <section className="export-grid">
          <div className="card export-card">
            <h2>Export</h2>
            <p>Everything stays in this browser until you download it. No login, no backend, no API calls.</p>
            <p className="export-note">voice.json now includes quiz answers and 1–5 response ratings. JSONL files with no rows can still be empty by design.</p>
            <div className="export-actions">
              <button onClick={() => downloadFile('voice.md', voiceMd, 'text/markdown;charset=utf-8')}>Download voice.md</button>
              <button onClick={() => downloadFile('voice.json', voiceJson, 'application/json;charset=utf-8')}>Download voice.json</button>
              <button onClick={() => downloadFile('examples.jsonl', examplesJsonl, 'application/x-ndjson;charset=utf-8')}>Download examples.jsonl</button>
              <button onClick={() => downloadFile('response_ratings.jsonl', ratingsJsonl, 'application/x-ndjson;charset=utf-8')}>Download response_ratings.jsonl</button>
              <button onClick={() => downloadFile('negative_examples.jsonl', negativesJsonl, 'application/x-ndjson;charset=utf-8')}>Download negative_examples.jsonl</button>
              <button onClick={() => downloadFile('synthesis-prompt.md', synthesisPrompt, 'text/markdown;charset=utf-8')}>Download synthesis prompt</button>
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
