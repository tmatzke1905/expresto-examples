# expresto-examples Roadmap

## Vision

The application should demonstrate how a project can be built with
`expresto-server` in practice:

- `expresto-server` delivers both the React application and the API from one shared runtime
- the start page is a login screen with visible static demo credentials
- the login uses HTTP Basic Auth and then issues a JWT for all protected flows
- after login, the user lands in a responsive application with navigation for all framework features
- the repository also contains a committed static preview that can be opened directly through `index.html`
- Scheduler, EventBus, and WebSocket are presented as connected live demos through visible UI elements
- every feature page explains one framework topic through documentation, code examples, and a live or previewable demo

## Global Product Rules

These rules are mandatory for the project going forward:

- the application uses one fixed static title: `expresto-examples`
- every feature page must show UI code examples
- those code examples must prioritize the current implementation first
- additional variants may be shown when they add practical value or clarify alternative approaches
- all documentation must be written in English
- all visible application text must be written in English

## Scope

Confirmed v1 topics from `expresto-server`:

- runtime bootstrap with `createServer()`
- JSON configuration
- file-based controllers
- routing and route security
- HTTP Basic Auth and JWT
- lifecycle hooks
- service registry
- EventBus / event system
- scheduler
- WebSocket support
- Prometheus metrics and OpenTelemetry basics
- public API and framework contracts

Not part of the first stable demo scope:

- clustering
- plugin system

## Delivery Modes

1. Full demo runtime with `expresto-server`
2. Static preview from the repository by opening `index.html` directly

Live mode:

- real integration of server, API, authentication, scheduler, and WebSocket

Preview mode:

- immediate product and documentation view without setup
- server-dependent features run with mock data, read-only states, or prepared example values

## Target Architecture

1. `expresto-server` bootstraps the application through `createServer(...)`.
2. The framework loads demo controllers for the feature endpoints.
3. The framework also serves the built React application as a static web app.
4. The login page shows the static demo Basic Auth credentials openly.
5. The login calls a backend endpoint that validates Basic Auth and creates a JWT through the framework helpers.
6. The frontend stores the JWT client-side and reuses it for protected HTTP and WebSocket flows.
7. In live mode, the scheduler emits the current time every ten seconds.
8. WebSocket pushes that time to connected clients in real time.
9. Buttons in the UI trigger demo endpoints that emit EventBus events with predefined text payloads.
10. EventBus listeners forward those demo messages back into the UI so a text field is visibly updated.
11. Every feature page follows one shared structure for description, documentation excerpt, code examples, and demo area.
12. A static preview build is generated and committed with relative assets so it can be opened directly from the repository.

## Interactive Live Demos

### Scheduler -> WebSocket -> UI

- one demo scheduler job runs every ten seconds
- the job produces the current server time as a demo message
- that message is broadcast to connected clients over WebSocket
- the UI shows connection state, the latest received time, and ideally a small live feed

### EventBus -> UI Action -> Text Field

- the Event System page provides buttons with predefined actions such as `Greeting`, `Warning`, and `Info`
- clicking a button calls a backend demo endpoint
- the backend emits an EventBus event with a predefined text
- a listener processes that event and forwards the text to the UI
- the UI writes the received text into a visible text field

### Preview Without Server

- the static repository preview simulates those live demos with prepared example values
- the same UI elements stay visible
- the difference between live mode and preview mode is clearly labeled

## Page Map

| Page | Focus | Backend demo |
|------|-------|--------------|
| Login | Basic Auth -> JWT flow | token issue, error states |
| Overview | introduction, architecture, navigation | runtime info, configuration |
| Bootstrap & Configuration | `createServer()`, config, startup rules | sample config, startup path |
| Controllers & Routing | controller shape, routes, security modes | public and protected endpoints |
| Security | Basic, JWT, security hooks | login, protected route, auth state |
| Lifecycle Hooks | hook order and hook context | hook logs and registration |
| Service Registry | service registration and usage | demo service, lookup, shutdown hints |
| Event System | EventBus, events, payloads | buttons trigger demo events and update a text field |
| Scheduler | cron jobs and scheduler events | demo job sends the current time every 10s |
| WebSocket | JWT-protected Socket.IO connection | live delivery of scheduler time and EventBus messages |
| Metrics & Observability | Prometheus, telemetry, runtime visibility | `__metrics`, optional runtime info |
| Public API & Contracts | stable API surface and contracts | types, contracts, copy-paste snippets |

## Status Overview

| Work package | Status | Summary |
|------|--------|---------|
| AP1 | implemented | repository foundation, workspaces, preview target, base docs |
| AP2 | implemented | `createServer()` bootstrap, JSON config, web delivery, preview build |
| AP3 | implemented | Basic login, JWT session, protected shell, preview session |
| AP4 | implemented | responsive frontend foundation, shared page template, and mobile feature navigation |
| AP5 | open | shared system for documentation, snippets, and preview data |
| AP6 | open | core pages for routing, security, hooks, services, and event system |
| AP7 | open | live demos for scheduler, WebSocket, and observability |
| AP8 | open | public API and stable contracts as reference pages |
| AP9 | open | QA, tests, preview validation, and final documentation |

## Current Progress

### AP1

Completed:

- root workspace with `apps/server` and `apps/web`
- structured content storage under `content/`
- committed preview target `preview/`
- shared Node.js and TypeScript baseline
- documented design decisions in `docs/ap1-foundation.md`
- repository validation through `npm run check:structure`

### AP2

Completed:

- `createServer()` bootstrap in `apps/server/src/main.ts`
- JSON runtime configuration in `apps/server/config/middleware.config.json`
- first controller endpoint through `GET /api/system/health`
- static web delivery from `apps/web/dist`
- separate preview build written to `preview/`
- root scripts for build and start
- documented AP2 decisions in `docs/ap2-bootstrap.md`

### AP3

Completed:

- Basic-protected login endpoint `POST /api/auth/login`
- JWT-protected session endpoint `GET /api/auth/session`
- login screen with visible demo credentials
- JWT creation and session restoration in the frontend
- protected application shell with feature menu and sign-out
- preview session through `content/preview/auth-session.json`
- documented AP3 decisions in `docs/ap3-auth-flow.md`

### AP4

Completed:

- fixed application title applied consistently as `expresto-examples`
- responsive app shell with desktop layout and mobile feature drawer
- shared page structure for description, demo surface, code examples, and documentation notes
- empty, loading, and planned-state surfaces for feature pages and runtime metadata
- feature-specific AP4 content for overview, bootstrap, controllers, security, and planned live-demo pages
- code examples shown in the UI with current implementation first and variants when useful
- all repository-facing documentation and visible application text kept in English
- documented AP4 decisions in `docs/ap4-frontend-navigation.md`

## Work Packages

### AP4: Responsive Frontend Foundation And Feature Navigation

Goal:
Create a stable, mobile-friendly, and extensible UI structure.

Scope:

- build the application layout for desktop and mobile
- implement the main navigation for all features
- create one shared page template for title, description, demo, code, and documentation
- define loading, error, and empty states
- apply the fixed application title consistently across the UI
- ensure all visible UI copy remains English

Outcome:

- responsive frontend foundation
- consistent UX across all feature pages

### AP5: Shared Documentation And Code Example System

Goal:
Feed the feature pages from reusable content building blocks.

Scope:

- define the format for feature content, for example Markdown or structured JSON/TS objects
- store code snippets locally in the repository
- curate documentation excerpts from the `expresto-server` docs
- build shared components for snippet rendering, copy actions, and documentation references
- manage static preview data for preview mode centrally
- prepare predefined demo texts and example time events for the interactive UI demos
- define how the current implementation is presented as the primary code example for each feature
- define when and how additional variants are displayed

Outcome:

- central content basis for all pages
- no runtime dependency on GitHub

### AP6: Core Pages For HTTP And Runtime Features

Goal:
Make the most important framework capabilities visible through concrete endpoints and examples.

Scope:

- page for Bootstrap & Configuration
- page for Controllers & Routing
- page for Security
- page for Lifecycle Hooks
- page for Service Registry
- page for Event System

Expected demo content:

- example controllers
- public and JWT-protected routes
- hook execution and hook context
- registered services
- event emission and event logging
- buttons for predefined EventBus actions and a text field for the resulting content
- code examples for the current implementation of each feature page

Outcome:

- complete demo of the central server-side core features

### AP7: Advanced Pages For Scheduler, WebSocket, And Observability

Goal:
Extend the runtime-heavy features into real interactive demos.

Scope:

- Scheduler page with job configuration, job state, and a live clock updated every ten seconds
- WebSocket page with JWT-protected connection and live reception of scheduler and EventBus messages
- Metrics & Observability page with Prometheus endpoint and telemetry notes
- define the end-to-end demo in which scheduler, EventBus, and WebSocket work together with UI widgets
- define a static preview rendering for all server-dependent live demos
- present code examples for the current implementation and optional variants where useful

Expected demo content:

- example job with clearly visible execution and time delivery every ten seconds
- WebSocket connection state, live message feed, and error states
- EventBus messages triggered by buttons and shown in the UI
- visible or explained metrics such as `http_requests_total`

Outcome:

- complete demo of the advanced platform features

### AP8: Public API, Contracts, And Developer Guidance

Goal:
Make the example application useful not only as a demo but also as a learning and reference project.

Scope:

- build a page for the public API and stable framework contracts
- show types, exported surfaces, and recommended authoring patterns
- clearly mark what is stable in the v1 scope and what is not
- show code examples for the current implementation and optional variants where useful

Outcome:

- practical reference project for starting with `expresto-server`

### AP9: Quality Assurance, Tests, And Final Documentation

Goal:
Stabilize the example application and make it easy for other developers to understand and use.

Scope:

- smoke tests for bootstrap, login, and core feature endpoints
- frontend checks for navigation and protected areas
- complete README, usage notes, and development workflow
- document open points and later extensions
- document and validate the build process for the committed preview output

Outcome:

- maintainable demo application with clear setup and usage documentation

## Branch And Commit Strategy

Each work package uses its own branch with the `codex/` prefix.

| Work package | Branch | Example completion commit message |
|------|--------|-----------------------------------|
| AP1 | `codex/ap1-projektgrundlage` | `Lay the repository foundation for expresto-examples` |
| AP2 | `codex/ap2-server-bootstrap` | `Integrate expresto-server and static app delivery` |
| AP3 | `codex/ap3-login-und-jwt` | `Implement demo login with Basic Auth and JWT flow` |
| AP4 | `codex/ap4-frontend-navigation` | `Create the responsive app layout and feature navigation` |
| AP5 | `codex/ap5-doku-und-snippets` | `Introduce shared documentation, snippets, and preview data` |
| AP6 | `codex/ap6-kernseiten` | `Add the core pages for routing, security, hooks, and services` |
| AP7 | `codex/ap7-live-demos` | `Connect scheduler, EventBus, and WebSocket through interactive UI demos` |
| AP8 | `codex/ap8-public-api-und-contracts` | `Document the public API and stable framework contracts in the demo app` |
| AP9 | `codex/ap9-qa-und-dokumentation` | `Complete the example app with tests, preview validation, and final docs` |

Working rules:

- every work package is developed on its assigned `codex/...` branch
- each work package ends with one clear completion commit
- before the completion commit, the implementation must be clearly documented in code and documentation
- before finishing a work run, a build or the appropriate project check must be executed

## Quality Rules

### Documentation Rule Per Work Package

- every work package must be implemented and documented clearly
- the documented project state must be updated whenever a work package is completed
- architecture decisions, deviations from the plan, and preview/live-demo specifics must be recorded

### Library Version Policy

- use the current stable version available at implementation time by default
- do not use outdated tutorial versions or intentionally old major versions
- `alpha`, `beta`, `rc`, or `canary` releases require an explicit documented reason
- lock installed dependencies afterward to keep the build reproducible

Special case:

- `expresto-server` is currently used as `1.0.0-beta` because that is still the npm `latest` tag for the target framework

### Build Rule After Every Run

- after every relevant change, a build or the matching project check must be executed
- since AP2, a real application build is mandatory
- build or check results must be mentioned briefly in the closeout

## Recommended Execution Order

1. AP1 project foundation
2. AP2 server bootstrap and frontend delivery
3. AP3 login and JWT flow
4. AP4 responsive frontend and navigation
5. AP5 shared documentation and snippet system
6. AP6 core pages
7. AP7 scheduler, WebSocket, and observability
8. AP8 public API and contracts
9. AP9 tests and final documentation

## Definition Of Done

Version 1 of this example application is complete when:

- login via Basic Auth works and issues a JWT
- all planned v1 feature pages are reachable
- every feature page shows at least one working demo and code examples for the current implementation
- variant code examples are shown whenever they materially help explain the feature
- the React application is fully delivered by `expresto-server`
- a committed static preview is included in the repository and can be opened through `index.html`
- the live UI shows a WebSocket-delivered time value updated by the scheduler every ten seconds
- EventBus actions can be triggered by buttons and fill a UI text field with predefined texts
- the navigation works cleanly on desktop and mobile
- README and roadmap clearly describe setup, usage, scope, and ongoing work
- all documentation and visible application text are in English

## References

- [expresto-server](https://github.com/tmatzke1905/expresto-server)
- [Public API](https://github.com/tmatzke1905/expresto-server/blob/main/docs/public-api.md)
