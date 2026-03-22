# AP2 Bootstrap Decisions

This document captures the concrete implementation choices for
AP2 "expresto-server Bootstrap und Auslieferung der React-Anwendung".

## Installed Package Baseline

The current package baseline was verified against the npm registry on
2026-03-22 before installation.

- `expresto-server@1.0.0-beta`
- `express@5.2.1`
- `react@19.2.4`
- `react-dom@19.2.4`
- `vite@8.0.1`
- `@vitejs/plugin-react@6.0.1`
- `typescript@5.9.3`

Important note:

- `expresto-server` currently exposes `1.0.0-beta` as its npm `latest` tag.
  This is a conscious exception to the stable-version rule because the example
  application targets that framework directly.

## Build Outputs

- server TypeScript compiles to `apps/server/dist`
- regular React build compiles to `apps/web/dist`
- repository preview build compiles to `preview/`

The preview folder remains versioned in git. A helper script clears previous
generated preview files while keeping repository documentation in place before a
new preview build is written.

## Runtime Shape

- `apps/server/src/main.ts` loads the JSON runtime config
- the config is normalized before boot so controller resolution always points to
  the built controller output
- after `createServer(...)` completes, the same Express runtime also serves the
  React application from `apps/web/dist`
- a fallback HTML handler keeps non-API routes available for later client-side
  routing work

## Initial AP2 Demo Endpoint

The first bootstrap endpoint is:

- `GET /api/system/health`

It returns a small runtime payload that the React application can display when
served through the real `expresto-server` runtime.

## Preview Mode

- preview mode reads curated data from `content/preview/bootstrap.json`
- the React app automatically switches to that preview payload when opened via
  `file://`
- this keeps `preview/index.html` useful even when no backend is running
