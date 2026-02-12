# Task Generator & Feature Planner

A production-ready React + Tailwind web app that converts feature inputs into:
- user stories
- engineering tasks
- risks and unknowns

It includes editing, task reordering, markdown export, local history (last 5 specs), and a `/status` health route.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS + lucide-react
- Backend: Node + Express (OpenAI proxy)
- Model: `gpt-4o-mini`
- Persistence: browser LocalStorage

## Security
- No API keys in source code.
- OpenAI key is read on the server from environment variables.
- `.env` is ignored by git.

## Environment
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Local Run

```bash
npm install
npm run dev:full
```

- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:8787`

## Production Run

```bash
npm run build
npm run start
```

App is served from `http://localhost:8787`.

## One-command Docker Run

```bash
docker compose up --build
```

Then open `http://localhost:8787`.

## Scripts
- `npm run dev` - Vite dev server
- `npm run dev:server` - API server in watch mode
- `npm run dev:full` - run frontend + backend together
- `npm run build` - production build
- `npm run start` - serve built app + API
- `npm run test` - run tests

## Checks and Testing
- Unit tests for LocalStorage history and API utility (Vitest)
- CI workflow runs tests + build on push/PR

## Deploy (Render)
This repo includes `render.yaml` for quick deployment.

1. Connect the GitHub repo in Render.
2. Create a new Web Service from repo.
3. Set env var `OPENAI_API_KEY`.
4. Deploy.

## Deploy (Vercel)
This repo is also configured for Vercel with serverless API routes:
- `api/generate.js`
- `api/status/llm.js`

Steps:
1. Import this GitHub repo into Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variable:
   - `OPENAI_API_KEY=your_openai_api_key_here`
6. Deploy.

## HOSTED LINKS

Project chosen: **A**

Live link: `https://tasks-gen.vercel.app/`

GitHub link: `https://github.com/ARITRA740/Tasks-Gen`
