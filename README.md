# TalkLikeMe

TalkLikeMe is a local-first voice calibration game. It shows generic or AI-ish writing, you rewrite it the way you would naturally say it, and the app turns those examples into exportable voice files for AI assistants.

The first version is intentionally simple:

- no login
- no backend
- no API keys
- no hosted user data
- browser-local storage only
- downloadable exports

## Why this exists

Most people do not have a clean archive of writing that sounds like them and has not already been polished by AI. TalkLikeMe collects better data by asking for small rewrites instead of asking someone to write a long style guide from scratch.

## Exports

The app can download:

- `voice.md` — instruction-oriented voice file for Claude, ChatGPT, Cursor, Hermes, etc.
- `voice.json` — structured profile and raw data
- `examples.jsonl` — every prompt/rewrite pair
- `negative_examples.jsonl` — phrases the user marked as fake/not-me
- `synthesis-prompt.md` — copy-paste prompt for using your own LLM subscription to refine `voice.md`

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Privacy model

TalkLikeMe stores data in the browser's local storage. Nothing is sent to a server. The recommended v1 workflow is to export `synthesis-prompt.md` and paste it into the LLM product you already use.

## MVP scope

Included now:

- rewrite/edit/rate-style prompts
- email-first prompt bank
- casual, professional, sales, and social categories
- skip prompts
- mark fake/not-me phrases
- coverage/progress tracking
- instruction-first `voice.md` export

Not included yet:

- hosted accounts
- team profiles
- direct LLM API integrations
- OAuth-based integrations
- cloud sync
