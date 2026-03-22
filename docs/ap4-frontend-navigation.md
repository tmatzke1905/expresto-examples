# AP4 Frontend Navigation Notes

## Goal

Turn the AP3 protected shell into a real application workspace with:

- responsive navigation
- one shared page template for every feature
- clear loading, empty, and planned states
- a fixed visible application title

## Implemented Decisions

### 1. Fixed Application Title

The application title is now fixed to `expresto-examples`.

It is applied in three places:

- browser title
- login screen
- protected workspace header

### 2. Shared Feature Page Template

Each feature page now follows the same structure:

1. title and high-level status
2. feature overview
3. demo surface
4. code examples
5. documentation notes

This keeps later AP6 and AP7 pages consistent without redesigning the shell.

### 3. Code Examples In The UI

Every feature page shows code examples directly inside the UI.

Rules for AP4:

- the current implementation is always shown first
- variants are only shown when they explain the feature better
- planned pages still show the current repository implementation, for example their shared
  navigation registration

AP5 will later move this into a more reusable content and snippet system.

### 4. Responsive Navigation

Desktop:

- left-side feature navigation
- central feature page column
- right-side runtime and session rail

Mobile:

- feature navigation becomes a drawer
- the drawer is opened through the top-bar button
- the content column and the info rail stack vertically

### 5. Feature Coverage In AP4

The shell already includes page content for all planned feature entries.

Current stronger AP4 coverage:

- Overview
- Bootstrap & Configuration
- Controllers & Routing
- Security
- Event System
- Scheduler
- WebSocket

The remaining pages use the same template with current repository status, code examples, and
documentation notes until their dedicated implementation package is completed.

## Result

AP4 establishes the stable frontend structure that later packages can fill with deeper runtime
demos without changing the overall user experience.
