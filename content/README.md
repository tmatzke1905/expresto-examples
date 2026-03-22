# Content Structure

This directory separates authored content from runtime code.

- `features/`: curated feature descriptions and documentation summaries
- `features/navigation.json`: shared feature menu metadata for the protected app shell
- `features/page-content.ts`: authored page copy and code-example selection
- `snippets/`: code examples shown in the UI
- `snippets/snippet-registry.ts`: shared snippet metadata used by the web app
- `preview/`: static preview data used when the repository build is opened
  without a running server
- `preview/live-demo.json`: prepared EventBus, scheduler, and socket preview values for planned demos
