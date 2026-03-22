# AP6 Core Pages

AP6 turns the previously planned core framework pages into runtime-backed
surfaces inside the authenticated workspace.

## What AP6 Adds

- runtime-backed controller catalog loaded from `GET /api/demo/core-features`
- dedicated AP6 demo controller with one public and one JWT-protected handler
- recorded lifecycle hook trace for `initialize`, `startup`, `preInit`,
  `postInit`, and `security`
- concrete ServiceRegistry demo entries registered during startup
- protected EventBus preset actions that update the visible message board
- committed preview data that mirrors the same AP6 page structure without a
  running server

## Runtime Design

The AP6 server runtime registers one shared helper module in
`apps/server/src/lib/core-feature-demo.ts`.

That module is responsible for:

- registering lifecycle hooks before `createServer()` runs
- registering the `featureCatalog` and `demoMessageBoard` services during
  startup
- binding the runtime EventBus after server creation
- exposing one runtime snapshot that the frontend can load for the AP6 pages

The frontend loads that AP6 runtime snapshot through
`apps/web/src/lib/core-feature-runtime.ts`.

When the application runs in repository preview mode, the same API shape is
served from `content/preview/core-features.json`.

## Feature Coverage

The AP6 pages now surface these concrete behaviors:

- Controllers & Routing: public, Basic, and JWT routes plus source files
- Lifecycle Hooks: registered hooks and recorded execution trace
- Service Registry: registered demo services and their capabilities
- Event System: protected preset buttons, EventBus listener, selected text, and
  recent event history

Bootstrap and Security continue to use the earlier AP2 and AP3 foundations and
are extended with AP6 runtime metadata where useful.
