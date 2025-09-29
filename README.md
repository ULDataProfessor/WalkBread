# WalkBread

WalkBread is a Progressive Web App (PWA) that helps people discover nearby bakeries, explore store details, and plan a bread-focused walking adventure.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Build the Tailwind CSS bundle (needed any time you change `src/styles/tailwind.css`):

```bash
npm run build:css
```

3. Serve the app over HTTP to avoid browser CORS errors with the web manifest and service worker:

```bash
npm start
```

The `start` script runs a lightweight static server on <http://localhost:5173>. Visit that URL in your browser to explore the WalkBread MVP.

### Development Workflow

- `npm run dev` – watches `src/styles/tailwind.css` and regenerates `css/tailwind.css` on save.
- `npm run build:css` – produces a minified Tailwind build for production.
- `npm start` – builds CSS and serves the app with automatic cache busting.

## Project Structure Highlights

- `index.html` – Application shell and UI markup.
- `js/stores.js` – Sample bakery dataset used for the MVP experience.
- `js/app.js` – WalkBread application logic, including map rendering, filters, and service worker registration.
- `src/styles/tailwind.css` – Tailwind entry file with custom utility/component layers.
- `css/tailwind.css` – Generated stylesheet consumed by `index.html`.
- `sw.js` – Basic service worker stub.

## Notes

- Tailwind CSS now ships from a local build instead of the CDN for production readiness.
- Always access the app via `npm start` (or another HTTP server such as `python -m http.server`) so the browser can load `manifest.json` and register the service worker without CORS issues.
