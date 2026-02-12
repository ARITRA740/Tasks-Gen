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

## Submission Reply Template

Project chosen: **B**

Live link: `https://<your-live-domain>`

GitHub link: `https://github.com/ARITRA740/Tasks-Gen`
