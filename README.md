# expresto-examples

Example application for
[expresto-server](https://github.com/tmatzke1905/expresto-server).

This repository contains:

- a runnable demo application served by `expresto-server`
- a committed static preview under `preview/index.html`
- the project plan in [roadmap.md](./roadmap.md)

## Requirements

- Node.js `22+`
- npm `11+`

Recommended:

- run `nvm use` in the repository because `.nvmrc` is pinned to Node.js `22`

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

The build generates:

- `apps/server/dist` for the server output
- `apps/web/dist` for the regular web build
- `preview/` for the committed static preview

## Run

```bash
npm run start
```

The application is then available at:

- `http://127.0.0.1:3100`

## Use The Application

### Login

The start page is a login screen.

Demo credentials:

- username: `demo`
- password: `showcase-2026!`

The login uses HTTP Basic Auth against:

- `POST /api/auth/login`

After a successful login, the backend creates a JWT. The frontend stores that
JWT locally and validates the active session through:

- `GET /api/auth/session`

### Protected Workspace

After login, the protected workspace is shown.

Current AP4 capabilities:

- responsive feature navigation for all planned `expresto-server` pages
- one shared page structure for demo, code examples, and documentation notes
- runtime, JWT, and session metadata side panels
- fixed application title: `expresto-examples`

### Static Preview

The committed preview can be opened directly without setup:

- [preview/index.html](./preview/index.html)

Notes:

- in `file://` mode there is no real backend runtime
- login, session state, and live-demo pages use preview data or prepared placeholders
- run `npm run build` whenever the committed preview should be refreshed

## Important Commands

```bash
npm run build
npm run build:web
npm run build:server
npm run build:preview
npm run start
npm run dev:web
npm run dev:server
npm run check:structure
```

## Additional Documentation

- roadmap: [roadmap.md](./roadmap.md)
- AP1 foundation notes: [docs/ap1-foundation.md](./docs/ap1-foundation.md)
- AP2 bootstrap notes: [docs/ap2-bootstrap.md](./docs/ap2-bootstrap.md)
- AP3 auth-flow notes: [docs/ap3-auth-flow.md](./docs/ap3-auth-flow.md)
- AP4 frontend notes: [docs/ap4-frontend-navigation.md](./docs/ap4-frontend-navigation.md)
