# aakashgupta.dev

Personal site of Aakash Gupta. Astro (static) + Tailwind, with a WebGL smoke background.

- `npm run dev` to work on it locally, `npm run build && npm run preview` to see the real build.
- `npm test`, `npm run check` and `npm run build` before pushing.
- All copy lives in `src/content/portfolio.ts`.
- Every push to `master` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`). The custom domain is set by `public/CNAME`.
