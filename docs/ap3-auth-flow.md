# AP3 Authentication Flow Decisions

This document captures the implementation details for
AP3 "Login-Flow, Session-Grundlage und geschuetzte Anwendung".

## Demo Credentials

The project now ships with one explicit demo account:

- username: `demo`
- password: `showcase-2026!`

Those credentials are intentionally shown on the login screen.

## Runtime Security Setup

The `expresto-server` runtime now enables:

- Basic Auth for `POST /api/auth/login`
- JWT Auth for `GET /api/auth/session`

JWT settings:

- algorithm: `HS256`
- expiresIn: `1h`

## API Contract

### `POST /api/auth/login`

- security mode: `basic`
- purpose: validates the demo credentials through the framework security layer
- response: JWT, user object, and metadata describing the session source

### `GET /api/auth/session`

- security mode: `jwt`
- purpose: verifies a stored token and restores the protected app shell
- response: JWT claims, user object, and metadata for the current session

## Frontend Session Model

- the login page is the default entry screen
- generated JWTs are stored in `localStorage`
- on reload, the app revalidates the stored token through
  `GET /api/auth/session`
- after successful login, the user enters a protected shell with a feature menu
  for all planned expresto-server pages

## Preview Mode

- `file://` mode uses `content/preview/auth-session.json`
- preview login still requires the same demo credentials shown on screen
- after login, the same protected shell is rendered with a mock JWT session
