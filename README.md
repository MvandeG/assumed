# Assumed

A phone-first PWA for one nightly practice. Vite, React, TypeScript, Tailwind, `vite-plugin-pwa`, `idb-keyval`. No backend.

```bash
npm install
npm run dev        # local development
npm run build      # outputs dist/ (static, deploy anywhere)
npm run preview    # serve the production build, service worker included
```

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`, served at `/<repo-name>/`. To build for a sub-path yourself, set `BASE_PATH` (for example `BASE_PATH=/assumed/ npm run build`; in Git Bash on Windows prefix it with `MSYS_NO_PATHCONV=1`).

`dist/` also deploys as-is to Netlify, Vercel or Cloudflare Pages; `public/_redirects` handles the SPA fallback there.

## Layout

- `src/copy/en.ts` – every user-facing string
- `src/data/` – types, IndexedDB access, export/import, React store
- `src/screens/` – one file per screen; `src/App.tsx` is the screen state machine
- `src/lib/` – hints, `.ics` generation, platform checks
- `scripts/make-icons.mjs` – regenerates the PNG icons (`node scripts/make-icons.mjs`)

## Still to check on real devices (build step 8)

- Install on an iPhone (Safari > Share > Add to Home Screen) and an Android phone (Chrome > Install app).
- With the installed app, turn on airplane mode and open it.
- Add the bedtime reminder from inside the installed app and confirm the `.ics` opens in Apple Calendar and imports into Google Calendar with a daily alert.
