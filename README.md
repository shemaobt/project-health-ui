# OBT Project Health — v2 Prototype

Click-through React + Vite + TypeScript prototype, all 7 screens, mocked data only.
No backend, no real auth, no real LLM.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build     # type-check + production bundle to dist/
npm run preview   # serve the production bundle
```

## Run with Docker

```bash
docker compose up --build
```

Open http://localhost:8080. The container builds the Vite bundle and serves it
through nginx. `Ctrl+C` to stop, `docker compose down` to clean up.

## What's mocked

- Interview chat: scripted facilitator replies, no real LLM.
- Voice input / TTS playback: visual affordances only, no audio.
- Magic-link auth: any email works, no email sent.
- Admin dashboard: 6 hardcoded interviews; only the Andean row has full
  report data, the others reuse Andean's scored data with their own
  metadata (project / team / language / date).

## Layout

```
src/
├── main.tsx           — React mount + theme.css import
├── App.tsx            — screen router
├── pages/             — one file per screen
├── components/
│   ├── primitives.tsx — atoms (buttons, eyebrows, icons, cards, etc.)
│   ├── composites.tsx — composed widgets (PageHeader, BadgeItem, etc.)
│   └── pdf.tsx        — html2pdf wrapper + DownloadPdfButton
├── lib/
│   ├── api.ts         — mock backend (async functions, fixture data)
│   └── hooks.ts       — useFetch
└── styles/
    └── theme.css      — body bg, paper texture, focus ring, animations
```
