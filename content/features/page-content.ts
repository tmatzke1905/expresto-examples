import type { SharedSnippetId } from "../snippets/snippet-registry";

export type AuthoredFeaturePageCodeExampleRef =
  | {
      type: "navigation-entry";
      description: string;
      emphasis: "current" | "variant";
      sourceLabel: string;
      title: string;
    }
  | {
      type: "shared-snippet";
      snippetId: SharedSnippetId;
    };

export type AuthoredFeaturePageContent = {
  codeExamples: AuthoredFeaturePageCodeExampleRef[];
  demo: {
    bullets: string[];
    status: "implemented" | "planned";
    summary: string;
    title: string;
  };
  description: string;
  documentation: Array<{
    body: string;
    reference: string;
    title: string;
  }>;
  eyebrow: string;
  highlights: string[];
  intro: string;
};

export const featurePageContent: Record<string, AuthoredFeaturePageContent> = {
  overview: {
    eyebrow: "AP4 foundation",
    intro: "Entry point for the authenticated application shell.",
    description:
      "expresto-examples now exposes a stable workspace shell with shared navigation, responsive layout behavior, and a reusable page structure for every feature.",
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
        type: "shared-snippet",
        snippetId: "overview.protected-shell-rendering"
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
        type: "shared-snippet",
        snippetId: "bootstrap.server-runtime"
      },
      {
        type: "shared-snippet",
        snippetId: "bootstrap.health-endpoint"
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
        type: "shared-snippet",
        snippetId: "controllers.auth-controller"
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
        type: "shared-snippet",
        snippetId: "security.jwt-creation"
      },
      {
        type: "shared-snippet",
        snippetId: "security.verify-session"
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
        "AP5 now feeds this page from shared content and prepared preview payloads before the live event transport is added in AP6 and AP7.",
      bullets: [
        "Buttons for Greeting, Warning, and Info",
        "Backend event emission via the demo EventBus flow",
        "UI text field updated from the resulting message"
      ]
    },
    codeExamples: [
      {
        type: "navigation-entry",
        title: "Current page registration",
        description:
          "The feature is already registered in the shared navigation model that drives the protected shell.",
        emphasis: "current",
        sourceLabel: "Current implementation"
      },
      {
        type: "shared-snippet",
        snippetId: "contracts.event-bus-demo"
      }
    ],
    documentation: [
      {
        title: "Interactive goal",
        body: "This page must eventually make EventBus flows visible instead of describing them abstractly. The planned buttons and text field already shape the UI now.",
        reference: "roadmap.md"
      },
      {
        title: "AP5 contribution",
        body: "AP5 centralizes the curated preview messages, snippet storage, and shared authored content so the later live demo can focus on behavior rather than presentation wiring.",
        reference: "docs/ap5-content-system.md"
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
        "The AP5 content system now keeps the preview timestamps, documentation notes, and code-example structure ready for the later job-driven demo.",
      bullets: [
        "One job runs every ten seconds",
        "The current time becomes a demo message payload",
        "The WebSocket page will display the live updates"
      ]
    },
    codeExamples: [
      {
        type: "navigation-entry",
        title: "Current page registration",
        description: "The feature already exists in the shared navigation map and can be reviewed in the protected workspace.",
        emphasis: "current",
        sourceLabel: "Current implementation"
      },
      {
        type: "shared-snippet",
        snippetId: "contracts.scheduler-clock-tick"
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
        body: "Static preview mode mirrors the same widget structure with prepared timestamps instead of a running backend job.",
        reference: "content/preview/live-demo.json"
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
        "AP5 prepares the page, shared preview feed, and authored content structure for the JWT-protected live connection that arrives in AP7.",
      bullets: [
        "Connection state indicator",
        "Latest clock tick from the scheduler",
        "Shared feed for EventBus and scheduler messages"
      ]
    },
    codeExamples: [
      {
        type: "navigation-entry",
        title: "Current page registration",
        description: "The page is already reachable in the shared navigation even before the transport code is added.",
        emphasis: "current",
        sourceLabel: "Current implementation"
      },
      {
        type: "shared-snippet",
        snippetId: "contracts.live-demo-message"
      }
    ],
    documentation: [
      {
        title: "Security dependency",
        body: "The WebSocket page depends on the already implemented JWT flow, which is why AP3 had to finish before the live socket demo can be added safely.",
        reference: "docs/ap3-auth-flow.md"
      },
      {
        title: "Shared preview feed",
        body: "AP5 centralizes prepared preview messages so the later socket UI can already demonstrate the intended feed structure without a running transport.",
        reference: "content/preview/live-demo.json"
      }
    ]
  }
};
