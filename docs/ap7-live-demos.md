# AP7 Live Demos

This branch starts the advanced runtime demo work with a first concrete slice:

- a live scheduler clock job that emits one backend event every ten seconds
- a shared live-demo snapshot endpoint at `GET /api/demo/live-demo`
- a backend feed that already combines scheduler ticks and EventBus messages
- a metrics preview that reads exported Prometheus lines from `__metrics`
- workspace pages for Scheduler and Metrics backed by real runtime data
- a WebSocket page that now exposes transport readiness and the shared backend
  feed while the dedicated live socket bridge is still the next step

## Current Server Pieces

- `apps/server/src/jobs/clockDemo.job.ts` emits the recurring clock-tick event
- `apps/server/src/lib/live-demo-runtime.ts` stores scheduler ticks, backend
  transport feed entries, metrics preview data, and websocket readiness
- `apps/server/src/controllers/demo.controller.ts` serves the live-demo snapshot

## Current Frontend Pieces

- `apps/web/src/lib/live-demo-runtime.ts` loads the shared live-demo snapshot
- `apps/web/src/features/shell/ProtectedShell.tsx` polls that endpoint and
  renders the Scheduler, Metrics, and transport-readiness surfaces

## Why WebSocket Is Not Fully Live Yet

The current `createServer()` integration returns the Express app, config,
logger, EventBus, hook manager, and services, but it does not expose a public
Socket.IO accessor for this custom bootstrap.

Because of that, this first AP7 slice keeps the transport feed honest:

- the backend feed already exists and is visible
- JWT transport expectations and socket path are visible
- the dedicated live socket bridge is still the remaining step on top of that
  shared backend feed
