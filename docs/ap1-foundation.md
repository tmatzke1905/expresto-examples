# AP1 Foundation Decisions

This document captures the repository-level decisions made while implementing
AP1 "Projektgrundlage und technische Leitplanken".

## Repository Layout

```txt
.
|- apps/
|  |- server/
|  |  |- config/
|  |  `- src/
|  |     |- controllers/
|  |     |- hooks/
|  |     |- jobs/
|  |     |- lib/
|  |     `- services/
|  `- web/
|     |- public/
|     `- src/
|        |- app/
|        |- components/
|        |- features/
|        |- lib/
|        `- styles/
|- content/
|  |- features/
|  |- preview/
|  `- snippets/
|- docs/
|- preview/
`- scripts/
```

## Purpose Of The Main Folders

- `apps/server`: future expresto-server runtime, controllers, hooks, jobs, and
  service integrations
- `apps/web`: future React application
- `content/features`: curated feature descriptions and documentation summaries
- `content/snippets`: code samples rendered inside the UI
- `content/preview`: static example data for the repository preview mode
- `preview`: versioned static build target that must remain commit-friendly
- `docs`: project decisions and implementation notes
- `scripts`: repository-level helper scripts

## Build And Start Concept

AP1 deliberately establishes the folder and workspace layout without committing
to the final toolchain wiring yet. The implementation path for the next work
packages is:

1. AP2 wires the server workspace to `expresto-server`.
2. AP4 wires the web workspace to the chosen React toolchain.
3. The versioned repository preview is written to `preview/` instead of
   `dist/`, because `dist/` is intentionally ignored in `.gitignore`.

The root workspace already reserves a repository-level validation script:

- `npm run check:structure`

That script verifies the AP1 foundation paths before later work packages start
adding runtime code.

## Documentation And Content Strategy

- Curated framework documentation stays in this repository and is not fetched
  at runtime.
- UI-facing snippets are stored separately from explanatory text so they can be
  rendered independently.
- Preview-only data lives under `content/preview` and should mirror the live
  UI states closely enough that the static `index.html` remains useful.

## Naming And Organization Rules

- server runtime code goes into `apps/server/src`
- browser code goes into `apps/web/src`
- one feature should have matching content entries under `content/features` and
  `content/snippets`
- repository preview assets belong in `preview/`
- shared helper code should live under a `lib/` folder inside the owning app

## AP1 Deliverables

AP1 is considered complete when:

- the repository structure exists and is tracked in git
- the Node.js baseline is explicit through `.nvmrc`
- the shared TypeScript baseline exists
- the preview build target is fixed to `preview/`
- README and project docs describe the decisions made here
