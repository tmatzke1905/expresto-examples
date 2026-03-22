import { APP_TITLE } from "../../lib/app-config";
import type { FeatureMenuItem } from "../../lib/session";

export type FeaturePageCodeExample = {
  description: string;
  emphasis: "current" | "variant";
  filePath: string;
  language: "json" | "ts" | "tsx";
  sourceLabel: string;
  title: string;
  code: string;
};

export type FeaturePageDocumentationNote = {
  body: string;
  reference: string;
  title: string;
};

export type FeaturePageDemo = {
  bullets: string[];
  status: "implemented" | "planned";
  summary: string;
  title: string;
};

export type FeaturePageDescriptor = {
  demo: FeaturePageDemo;
  description: string;
  documentation: FeaturePageDocumentationNote[];
  highlights: string[];
  intro: string;
  codeExamples: FeaturePageCodeExample[];
  eyebrow: string;
};

const overviewSelectionSnippet = `
const selectedFeature =
  session?.features.find(feature => feature.id === selectedFeatureId) ??
  session?.features[0] ??
  null;

if (authState === "authenticated" && session) {
  return (
    <ProtectedShell
      modeLabel={modeLabel}
      onLogout={handleLogout}
      onSelectFeature={handleSelectFeature}
      runtimeSnapshot={runtimeSnapshot}
      selectedFeature={selectedFeature}
      session={session}
    />
  );
}
`.trim();

const bootstrapRuntimeSnippet = `
async function main(): Promise<void> {
  const config = await loadConfig();
  const runtime = await createServer(config);
  const host = config.host ?? "0.0.0.0";

  attachStaticWebApp({
    app: runtime.app,
    excludedPrefixes: [config.contextRoot, config.metrics?.endpoint ?? "/__metrics", "/socket.io"],
    logger: runtime.logger.app,
    webDistPath
  });

  runtime.app.listen(config.port, host, () => {
    runtime.logger.app.info("expresto-examples runtime ready", {
      apiRoot: config.contextRoot,
      host,
      port: config.port,
      webDistPath
    });
  });
}
`.trim();

const bootstrapHealthSnippet = `
export default {
  route: "/system",
  handlers: [
    {
      method: "get",
      path: "/health",
      secure: false,
      handler: (_req: ExtRequest, res: ExtResponse) => {
        res.json({
          appName: "expresto-examples",
          healthEndpoint: "/api/system/health",
          mode: "server",
          status: "ready"
        });
      }
    }
  ]
};
`.trim();

const controllerSnippet = `
export default {
  route: "/auth",
  handlers: [
    {
      method: "post",
      path: "/login",
      secure: "basic",
      handler: async (req: AuthenticatedRequest, res: ExtResponse) => {
        const sessionUser = normalizeSessionUser(req.user);
        const claims = createJwtClaims(sessionUser.username);
        const token = await signToken(
          claims,
          demoJwtConfig.secret,
          demoJwtConfig.algorithm,
          demoJwtConfig.expiresIn
        );

        res.json({ claims, token, tokenType: "Bearer", user: sessionUser });
      }
    }
  ]
};
`.trim();

const securityServerSnippet = `
const token = await signToken(
  claims,
  demoJwtConfig.secret,
  demoJwtConfig.algorithm,
  demoJwtConfig.expiresIn
);

res.json({
  claims,
  expiresIn: demoJwtConfig.expiresIn,
  issuedAt: new Date().toISOString(),
  mode: "server",
  source: "apps/server/src/controllers/auth.controller.ts",
  token,
  tokenType: "Bearer",
  user: sessionUser
});
`.trim();

const securityClientSnippet = `
export async function verifySession(token: string): Promise<SessionState> {
  const response = await fetch("/api/auth/session", {
    headers: {
      Authorization: \`Bearer \${token}\`
    }
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as SessionResponse;
  return enrichSession(data, token);
}
`.trim();

const eventPayloadSnippet = `
type DemoEventMessage = {
  kind: "event-bus-demo";
  preset: "Greeting" | "Warning" | "Info";
  text: string;
};
`.trim();

const schedulerPayloadSnippet = `
type ClockTickMessage = {
  kind: "clock-tick";
  source: "scheduler";
  sentAt: string;
};
`.trim();

const websocketPayloadSnippet = `
type LiveDemoMessage =
  | { kind: "clock-tick"; sentAt: string; source: "scheduler" }
  | { kind: "event-bus-demo"; preset: "Greeting" | "Warning" | "Info"; text: string };
`.trim();

function createNavigationSnippet(feature: FeatureMenuItem): string {
  return JSON.stringify(
    {
      id: feature.id,
      title: feature.title,
      summary: feature.summary,
      package: feature.package,
      status: feature.status
    },
    null,
    2
  );
}

function createGenericPage(feature: FeatureMenuItem): FeaturePageDescriptor {
  const isImplemented = feature.status === "implemented";

  return {
    eyebrow: feature.package,
    intro: feature.summary,
    description: feature.detail,
    highlights: [
      `Navigation target is available in the protected shell today.`,
      `This page already uses the shared AP4 structure for description, demo, code, and documentation.`,
      isImplemented
        ? "The current runtime contains an initial implementation that future packages can expand."
        : "The detailed runtime behavior will be added in the scheduled work package."
    ],
    demo: {
      status: isImplemented ? "implemented" : "planned",
      title: isImplemented ? "Current workspace behavior" : "Planned demo surface",
      summary: isImplemented
        ? `${feature.title} already contributes to the running workspace and is described through the AP4 page template.`
        : `AP4 keeps the ${feature.title} route, navigation entry, and content shell ready for the later live demo work.`,
      bullets: [
        `Primary work package: ${feature.package}`,
        isImplemented
          ? "The page focuses on what already runs in the repository today."
          : "The page explains the intended outcome before the runtime-specific code arrives.",
        "Preview mode will keep the same layout and explain mocked versus live behavior."
      ]
    },
    codeExamples: [
      {
        title: "Current implementation in the repository",
        description:
          "Until the dedicated feature logic lands, the page uses the shared navigation registration as the source of truth for title, package, and status.",
        emphasis: "current",
        filePath: "content/features/navigation.json",
        language: "json",
        sourceLabel: "Feature registration",
        code: createNavigationSnippet(feature)
      }
    ],
    documentation: [
      {
        title: "Current scope",
        body: `${feature.title} is already part of the authenticated information architecture, even when its live backend demo is scheduled for a later package.`,
        reference: "roadmap.md"
      },
      {
        title: "AP4 responsibility",
        body: "The current work package guarantees that every feature page can present description, demo guidance, code examples, and curated notes in one consistent structure.",
        reference: "docs/ap4-frontend-navigation.md"
      }
    ]
  };
}

const featureOverrides: Record<string, FeaturePageDescriptor> = {
  overview: {
    eyebrow: "AP4 foundation",
    intro: "Entry point for the authenticated application shell.",
    description:
      `${APP_TITLE} now exposes a stable workspace shell with shared navigation, responsive layout behavior, and a reusable page structure for every feature.`,
    highlights: [
      "The selected feature is reflected inside the main content area instead of using isolated one-off panels.",
      "Desktop, tablet, and mobile layouts use the same content model with adapted navigation behavior.",
      "The application keeps one fixed visible title and one fixed browser title."
    ],
    demo: {
      status: "implemented",
      title: "Live workspace overview",
      summary:
        "The overview page uses the active session and feature registry to show the current implementation scope of the repository.",
      bullets: [
        "Feature cards summarize the current roadmap state.",
        "The runtime mode badge switches between live runtime and repository preview.",
        "The selected feature can be deep-linked through the URL hash."
      ]
    },
    codeExamples: [
      {
        title: "Shared protected-shell rendering",
        description:
          "The authenticated app resolves the active feature and renders the shared shell around it.",
        emphasis: "current",
        filePath: "apps/web/src/app/App.tsx",
        language: "tsx",
        sourceLabel: "Current implementation",
        code: overviewSelectionSnippet
      }
    ],
    documentation: [
      {
        title: "Why this page exists",
        body: "The overview page gives the user one stable landing area after login and acts as the anchor for all subsequent framework pages.",
        reference: "roadmap.md"
      },
      {
        title: "What AP4 adds",
        body: "AP4 turns the earlier JWT shell into an actual application workspace with feature navigation, a consistent information model, and responsive states.",
        reference: "docs/ap4-frontend-navigation.md"
      }
    ]
  },
  bootstrap: {
    eyebrow: "AP2 runtime",
    intro: "Bootstrap, configuration loading, and static web delivery.",
    description:
      "This page connects the existing server bootstrap with the frontend shell so users can inspect how the shared runtime is assembled before deeper feature pages land.",
    highlights: [
      "The server reads JSON configuration and passes it into createServer().",
      "The React build is attached to the same runtime as the API endpoints.",
      "The preview build is generated separately for repository-only usage."
    ],
    demo: {
      status: "implemented",
      title: "Current bootstrap evidence",
      summary:
        "The runtime snapshot and delivery cards on this page reflect the real AP2 bootstrap implementation that is already serving the app.",
      bullets: [
        "Health endpoint confirms the runtime is reachable.",
        "Static asset delivery points to apps/web/dist.",
        "Preview mode mirrors the same information from committed preview data."
      ]
    },
    codeExamples: [
      {
        title: "Server bootstrap",
        description: "The main entry point creates the runtime and attaches the built React application.",
        emphasis: "current",
        filePath: "apps/server/src/main.ts",
        language: "ts",
        sourceLabel: "Current implementation",
        code: bootstrapRuntimeSnippet
      },
      {
        title: "Runtime health endpoint",
        description: "The health controller provides the bootstrap metadata used by the UI.",
        emphasis: "variant",
        filePath: "apps/server/src/controllers/system.controller.ts",
        language: "ts",
        sourceLabel: "Supporting endpoint",
        code: bootstrapHealthSnippet
      }
    ],
    documentation: [
      {
        title: "Runtime composition",
        body: "One expresto-server runtime is responsible for API delivery, authentication endpoints, and the built frontend bundle.",
        reference: "docs/ap2-bootstrap.md"
      },
      {
        title: "Preview strategy",
        body: "The repository preview keeps the same user-facing page structure while replacing live server calls with prepared local data.",
        reference: "README.md"
      }
    ]
  },
  controllers: {
    eyebrow: "AP6 target with AP3 foundation",
    intro: "Controller files define the route tree and security modes.",
    description:
      "The dedicated controllers page is planned for AP6, but AP4 already surfaces the controller model through the currently implemented health and auth handlers.",
    highlights: [
      "Routes are grouped by controller and handler definitions.",
      "Security is declared per handler through secure: false, basic, or jwt.",
      "The existing auth controller already demonstrates protected versus public concerns."
    ],
    demo: {
      status: "implemented",
      title: "Current controller set",
      summary:
        "The repository currently exposes a public health endpoint plus Basic and JWT-protected auth handlers. AP6 will expand that into a fuller routing showcase.",
      bullets: [
        "GET /api/system/health",
        "POST /api/auth/login",
        "GET /api/auth/session"
      ]
    },
    codeExamples: [
      {
        title: "Current protected controller",
        description:
          "The auth controller already mixes route metadata with handler-level security and response shaping.",
        emphasis: "current",
        filePath: "apps/server/src/controllers/auth.controller.ts",
        language: "ts",
        sourceLabel: "Current implementation",
        code: controllerSnippet
      }
    ],
    documentation: [
      {
        title: "Current repository evidence",
        body: "Even before AP6, the app already contains real controller files that show how routing and security declarations fit together.",
        reference: "apps/server/src/controllers"
      },
      {
        title: "Planned AP6 expansion",
        body: "AP6 will add dedicated route examples, more controller files, and a richer page-level demo for HTTP behaviors.",
        reference: "roadmap.md"
      }
    ]
  },
  security: {
    eyebrow: "AP3 security flow",
    intro: "Basic Auth login, JWT issuance, and client-side session reuse.",
    description:
      "This page documents the full authentication flow that already powers the current workspace: visible demo credentials, Basic-authenticated login, JWT creation, local storage, and protected session checks.",
    highlights: [
      "The login screen intentionally shows the static demo credentials.",
      "The server signs a JWT after successful Basic authentication.",
      "The frontend reuses that token for protected requests and preview-mode simulation."
    ],
    demo: {
      status: "implemented",
      title: "Current auth lifecycle",
      summary:
        "The security page reuses the active session metadata and token viewer from the real AP3 implementation.",
      bullets: [
        "Basic Auth login endpoint issues the JWT.",
        "JWT session endpoint validates the stored token.",
        "Preview mode uses the same UI with deterministic local data."
      ]
    },
    codeExamples: [
      {
        title: "JWT creation on the server",
        description: "The login handler signs the token and returns the session envelope to the client.",
        emphasis: "current",
        filePath: "apps/server/src/controllers/auth.controller.ts",
        language: "ts",
        sourceLabel: "Current implementation",
        code: securityServerSnippet
      },
      {
        title: "JWT validation in the frontend",
        description: "The web client restores the stored token and validates it against the protected session endpoint.",
        emphasis: "variant",
        filePath: "apps/web/src/lib/session.ts",
        language: "ts",
        sourceLabel: "Client flow",
        code: securityClientSnippet
      }
    ],
    documentation: [
      {
        title: "Implemented today",
        body: "The security flow is not planned work anymore; it is the live gate into every authenticated feature page in the workspace.",
        reference: "docs/ap3-auth-flow.md"
      },
      {
        title: "Why it matters for later pages",
        body: "JWT state becomes the shared credential for protected API calls and future WebSocket authorization in the later demo packages.",
        reference: "roadmap.md"
      }
    ]
  },
  "event-system": {
    eyebrow: "AP6/AP7 live demo target",
    intro: "Framework events and EventBus-triggered UI updates.",
    description:
      "The Event System page is prepared for the later button-driven demo in which predefined actions emit EventBus messages and update a text field in the UI.",
    highlights: [
      "Buttons in the UI will map to predefined backend payloads.",
      "The visible text field is the user-facing sink for EventBus output.",
      "Preview mode will show the same interaction model with prepared example values."
    ],
    demo: {
      status: "planned",
      title: "Planned EventBus interaction",
      summary:
        "AP4 establishes the page, notes, and code-example structure before the live event transport is added in AP6 and AP7.",
      bullets: [
        "Buttons for Greeting, Warning, and Info",
        "Backend event emission via the demo EventBus flow",
        "UI text field updated from the resulting message"
      ]
    },
    codeExamples: [
      {
        title: "Current page registration",
        description: "The feature is already registered in the shared navigation model that drives the protected shell.",
        emphasis: "current",
        filePath: "content/features/navigation.json",
        language: "json",
        sourceLabel: "Current implementation",
        code: createNavigationSnippet({
          id: "event-system",
          title: "Event System",
          summary: "Framework events, application events, and EventBus flows.",
          detail: "",
          package: "AP6/AP7",
          status: "planned"
        })
      },
      {
        title: "Planned payload shape",
        description: "A small typed message contract keeps the later EventBus demo predictable across live and preview mode.",
        emphasis: "variant",
        filePath: "apps/web/src/features/pages/feature-page-content.ts",
        language: "ts",
        sourceLabel: "Planned variant",
        code: eventPayloadSnippet
      }
    ],
    documentation: [
      {
        title: "Interactive goal",
        body: "This page must eventually make EventBus flows visible instead of describing them abstractly. The planned buttons and text field already shape the UI now.",
        reference: "roadmap.md"
      },
      {
        title: "AP4 contribution",
        body: "The page template ensures the later live behavior can be dropped into the same structure without redesigning navigation or layout.",
        reference: "docs/ap4-frontend-navigation.md"
      }
    ]
  },
  scheduler: {
    eyebrow: "AP7 live demo target",
    intro: "Recurring jobs and the scheduled clock message.",
    description:
      "The scheduler page is prepared for the later live demo in which a background job emits the current time every ten seconds and hands it to the WebSocket layer.",
    highlights: [
      "The server-side scheduler owns the recurring time production.",
      "Every ten seconds the demo emits one clock event.",
      "The UI will show the latest received timestamp plus a short activity feed."
    ],
    demo: {
      status: "planned",
      title: "Planned scheduled time feed",
      summary:
        "The AP4 page describes the later job and keeps a dedicated area ready for the visible clock widget.",
      bullets: [
        "One job runs every ten seconds",
        "The current time becomes a demo message payload",
        "The WebSocket page will display the live updates"
      ]
    },
    codeExamples: [
      {
        title: "Current page registration",
        description: "The feature already exists in the shared navigation map and can be reviewed in the protected workspace.",
        emphasis: "current",
        filePath: "content/features/navigation.json",
        language: "json",
        sourceLabel: "Current implementation",
        code: createNavigationSnippet({
          id: "scheduler",
          title: "Scheduler",
          summary: "Cron-driven background jobs inside the runtime.",
          detail: "",
          package: "AP7",
          status: "planned"
        })
      },
      {
        title: "Planned message contract",
        description: "The later scheduler demo uses a small payload shape that is easy to surface in both live and preview mode.",
        emphasis: "variant",
        filePath: "apps/web/src/features/pages/feature-page-content.ts",
        language: "ts",
        sourceLabel: "Planned variant",
        code: schedulerPayloadSnippet
      }
    ],
    documentation: [
      {
        title: "End-to-end role",
        body: "The scheduler is the source of the visible live clock. It does not stop at background work; it drives a user-visible demo.",
        reference: "roadmap.md"
      },
      {
        title: "Preview expectation",
        body: "Static preview mode will mirror the same widget structure with prepared timestamps instead of a running backend job.",
        reference: "README.md"
      }
    ]
  },
  websocket: {
    eyebrow: "AP7 live transport target",
    intro: "Protected real-time delivery for clock ticks and EventBus messages.",
    description:
      "The WebSocket page is reserved for the later real-time transport layer that forwards scheduler ticks and EventBus messages into the authenticated UI.",
    highlights: [
      "JWT state from AP3 becomes the transport credential.",
      "Clock ticks and EventBus messages share one visible feed in the UI.",
      "The page will make connection state and reconnection behavior visible."
    ],
    demo: {
      status: "planned",
      title: "Planned socket demo",
      summary:
        "AP4 prepares the page, documentation notes, and code-example structure for the JWT-protected live connection that arrives in AP7.",
      bullets: [
        "Connection state indicator",
        "Latest clock tick from the scheduler",
        "Shared feed for EventBus and scheduler messages"
      ]
    },
    codeExamples: [
      {
        title: "Current page registration",
        description: "The page is already reachable in the shared navigation even before the transport code is added.",
        emphasis: "current",
        filePath: "content/features/navigation.json",
        language: "json",
        sourceLabel: "Current implementation",
        code: createNavigationSnippet({
          id: "websocket",
          title: "WebSocket",
          summary: "JWT-protected real-time transport on the shared server.",
          detail: "",
          package: "AP7",
          status: "planned"
        })
      },
      {
        title: "Planned live message union",
        description: "One message contract keeps clock events and EventBus updates renderable through the same UI feed.",
        emphasis: "variant",
        filePath: "apps/web/src/features/pages/feature-page-content.ts",
        language: "ts",
        sourceLabel: "Planned variant",
        code: websocketPayloadSnippet
      }
    ],
    documentation: [
      {
        title: "Security dependency",
        body: "The WebSocket page depends on the already implemented JWT flow, which is why AP3 had to finish before the live socket demo can be added safely.",
        reference: "docs/ap3-auth-flow.md"
      },
      {
        title: "User-visible outcome",
        body: "The page is meant to make real-time transport obvious: connection state, incoming messages, and the shared live feed should all be visible.",
        reference: "roadmap.md"
      }
    ]
  }
};

export function getFeaturePageDescriptor(feature: FeatureMenuItem): FeaturePageDescriptor {
  return featureOverrides[feature.id] ?? createGenericPage(feature);
}
