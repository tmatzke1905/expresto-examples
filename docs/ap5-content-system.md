# AP5 Content System Notes

## Goal

Turn the feature pages into a content-driven system instead of keeping curated texts and code
snippets embedded in UI modules.

## Implemented Decisions

### 1. Shared authored page content

Feature-specific page copy now lives in `content/features/page-content.ts`.

This includes:

- page intros and descriptions
- highlight bullets
- demo summaries
- curated documentation notes
- code example selection

The web workspace now consumes this file instead of hardcoding the content directly in the page
resolver.

### 2. Snippet registry with local snippet files

Code examples are now stored in `content/snippets/`.

Each snippet is authored as a local file and registered through
`content/snippets/snippet-registry.ts`.

This establishes one shared source for:

- title
- description
- source label
- emphasis (`current` or `variant`)
- displayed file path
- snippet code

### 3. Shared UI components for code and references

The feature pages now use shared components for:

- snippet rendering
- copy-to-clipboard actions
- documentation reference badges

This keeps the AP4 page template intact while moving AP5-specific presentation details into reusable
building blocks.

### 4. Central preview data for planned live demos

Prepared preview values for the later EventBus, Scheduler, and WebSocket demos now live in
`content/preview/live-demo.json`.

This file contains:

- predefined EventBus texts
- prepared scheduler tick examples
- prepared socket feed messages

The protected shell now reads these values for the current planned demo placeholders.

### 5. Primary-versus-variant snippet rules

The content system now encodes whether a snippet is:

- the primary current implementation
- an additional variant or planned contract

This keeps the AP4 rule enforceable in code instead of leaving it to page-by-page convention.

## Result

AP5 establishes a reusable content layer for feature pages, central snippet storage, copy-ready
code rendering, and centrally managed preview data for later live demos.
