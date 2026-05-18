# Project Health — UI

Production frontend for the Project Health feature inside the Shema OBT
platform. Talks to the `project-health` app inside `tripod-backend` at
`/api/project-health/*`.

Warm cream foundation with the OBT Project Health palette — clay terracotta,
sage growth, earth grounding — grounded in the Shemá design language. Six
supported interview languages: English, Português, Español, Français, Bahasa
Indonesia, Kiswahili.

## Stack

- Vite + React 18 + TypeScript
- [`wouter`](https://github.com/molefrog/wouter) for routing
- [`zustand`](https://github.com/pmndrs/zustand) for state (auth + interview)
- [`axios`](https://axios-http.com) (single client in `src/lib/api/`)
- [`i18next`](https://www.i18next.com) + `react-i18next` for i18n (6 locales)
- [`lucide-react`](https://lucide.dev) icons
- Tailwind CSS 3 with custom design tokens (cream / earth / clay / sage)

## Run — local (no docker)

Vite's dev server runs on host node and proxies `/api` to
`http://localhost:8000` automatically (see `vite.config.ts`). Pair it with the
`tripod-backend` running locally in docker.

```sh
npm install
npm run dev                              # Vite at http://localhost:5173
# In another shell, run the backend:
# cd ../tripod-backend && SECRETS_PROJECT_ID=shemaobt-secrets docker compose up --build backend
```

## Run — local (dockerized prod build)

Builds the production image, serves it via nginx on `:8080`, and reverse-proxies
`/api` to whatever backend the `gcp-secrets` sidecar resolves.

```sh
cp .env.example .env
# Default BACKEND_TARGET=local proxies /api to host.docker.internal:8000
docker compose up --build
open http://localhost:8080
```

To point the dockerized frontend at the production backend (URL fetched from
GCP Secret Manager `tripod_backend_cloud_run_url`):

```sh
gcloud auth application-default login    # one-time
BACKEND_TARGET=remote docker compose up --build
```

Override the host port: `PORT=3000 docker compose up`.

## CI/CD

- **`.github/workflows/lint.yml`** runs on every PR: ESLint + `tsc --noEmit`.
- **`.github/workflows/deploy.yml`** runs on push to `main` (and via
  `workflow_dispatch`): builds the image, pushes to GCP Artifact Registry
  `project-health-ui`, deploys to Cloud Run service `project-health-ui` with
  the runtime `BACKEND_URL` injected from Secret Manager.

GitHub repo secrets required: `GCP_PROJECT_ID`, `GCP_SA_KEY`. The Secret
Manager secret `tripod_backend_cloud_run_url` must exist in the
`shemaobt-secrets` project and hold the `tripod-backend` Cloud Run URL (no
trailing slash). It is shared across all UIs that talk to tripod-backend.

To create or rotate the backend URL secret:

```sh
echo -n 'https://tripod-backend.shemaywam.com' | \
  gcloud secrets versions add tripod_backend_cloud_run_url \
  --data-file=- \
  --project=shemaobt-secrets
```

## Routes

| Route | Screen | Auth |
|---|---|---|
| `/` | Welcome — language picker, project/team fields, "Begin interview" | Public |
| `/interview/:id` | Interview — chat thread, voice input, finish button | Interview token |
| `/completion` | Completion — generating report, blocked/expired handling | Interview token |
| `/team-report/:reportId` | Team report — warm, supportive summary | Public (UUID) |
| `/login` | Sign in | Public |
| `/signup` | Create supervisor account | Public |
| `/forgot-password` | Request password reset link | Public |
| `/reset-password` | Set new password (token in query) | Public |
| `/pending-approval` | Waiting for admin to grant the `admin` role | Signed in |
| `/admin` | Dashboard — recent interviews + reports | `admin` role |
| `/admin/reports/:id` | Admin report — domain scores, risks, actions | `admin` role |
| `/admin/invite` | Invite another admin by email | `admin` role |
| `*` | 404 | Public |

## Notes

- All API calls go to relative `/api/*` URLs — the bundle is backend-URL
  agnostic. In dev, Vite proxies `/api` to localhost; in prod, nginx
  reverse-proxies it to the runtime-injected `$BACKEND_URL`.
- Tailwind tokens (cream/earth/clay/sage palette + animations) live in
  `tailwind.config.js`. Base CSS lives in `src/styles/theme.css`.
- Interview tokens are short-lived JWTs (24h) issued by the backend at
  POST `/interviews`; the frontend stores them in `sessionStorage` so a
  refresh inside the interview keeps the session alive but a new tab
  starts fresh.
- The 7 sustainability domains, prompts, and scoring framework are owned
  by the backend (`tripod-backend/app/services/project_health/`); the
  frontend never sees the scoring logic — only the rendered reports.
