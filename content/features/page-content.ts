import type { SharedSnippetId } from "../snippets/snippet-registry";

const EXPRESTO_REPOSITORY_URL = "https://github.com/tmatzke1905/expresto-server";
const EXPRESTO_DOCS_BASE_URL = `${EXPRESTO_REPOSITORY_URL}/blob/main/docs`;
const EXPRESTO_README_URL = `${EXPRESTO_REPOSITORY_URL}/blob/main/README.md`;

export type DocumentationReferenceLink = {
  referenceLabel: string;
  referenceUrl: string;
};

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

export type AuthoredFeaturePageDocumentationNote = DocumentationReferenceLink & {
  body: string;
  title: string;
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
  documentation: AuthoredFeaturePageDocumentationNote[];
  eyebrow: string;
  highlights: string[];
  intro: string;
};

function docsReference(label: string, docFileName: string): DocumentationReferenceLink {
  return {
    referenceLabel: label,
    referenceUrl: `${EXPRESTO_DOCS_BASE_URL}/${docFileName}`
  };
}

export function getReadmeDocumentationReference(
  label = "expresto-server README"
): DocumentationReferenceLink {
  return {
    referenceLabel: label,
    referenceUrl: EXPRESTO_README_URL
  };
}

export function getFeatureDocumentationReference(featureId: string): DocumentationReferenceLink {
  if (featureId === "bootstrap") {
    return docsReference("Configuration docs", "configuration.md");
  }

  if (featureId === "controllers") {
    return docsReference("Controllers docs", "controllers.md");
  }

  if (featureId === "security") {
    return docsReference("Security docs", "security.md");
  }

  if (featureId === "lifecycle-hooks") {
    return docsReference("Lifecycle Hooks docs", "lifecycle-hooks.md");
  }

  if (featureId === "service-registry") {
    return docsReference("Service Registry docs", "service-registry.md");
  }

  if (featureId === "event-system") {
    return docsReference("Event System docs", "event-system.md");
  }

  if (featureId === "scheduler") {
    return docsReference("Scheduler docs", "scheduler.md");
  }

  if (featureId === "websocket") {
    return docsReference("WebSocket docs", "websocket.md");
  }

  if (featureId === "metrics") {
    return docsReference("Metrics docs", "metrics.md");
  }

  if (featureId === "public-api") {
    return docsReference("Public API docs", "public-api.md");
  }

  return getReadmeDocumentationReference("README / Framework overview");
}

export const featurePageContent: Record<string, AuthoredFeaturePageContent> = {
  overview: {
    eyebrow: "Workspace guide",
    intro: "Entry point for the authenticated framework workspace.",
    description:
      "The overview page introduces the secured example application and frames the rest of the feature pages around the documented expresto-server surface.",
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
        "Feature cards summarize the current workspace coverage.",
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
        title: "Framework scope",
        body: "The README positions expresto-server as an Express-based framework for secured, observable APIs with controllers, hooks, metrics, schedulers, and optional WebSocket support.",
        ...getReadmeDocumentationReference("README / Framework scope")
      },
      {
        title: "Documented feature map",
        body: "The repository documentation links dedicated guides for configuration, controllers, security, hooks, services, the event system, scheduler, websocket, metrics, and the public API.",
        ...getReadmeDocumentationReference("README / Documentation index")
      }
    ]
  },
  bootstrap: {
    eyebrow: "Runtime bootstrap",
    intro: "Bootstrap, configuration loading, and static web delivery.",
    description:
      "This page connects the running server bootstrap with the frontend shell so users can inspect how the shared runtime is assembled before moving into deeper framework features.",
    highlights: [
      "The server reads JSON configuration and passes it into createServer().",
      "The React build is attached to the same runtime as the API endpoints.",
      "The preview build is generated separately for repository-only usage."
    ],
    demo: {
      status: "implemented",
      title: "Current bootstrap evidence",
      summary:
        "The runtime snapshot and delivery cards on this page reflect the current bootstrap implementation that is already serving the app.",
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
        title: "Quick start runtime",
        body: "The quick-start path centers on createServer(...) and then starts listening explicitly on the returned Express app, which matches how this example runtime is assembled.",
        ...getReadmeDocumentationReference("README / Quick start")
      },
      {
        title: "Configuration shape",
        body: "The configuration guide documents host, port, contextRoot, controllersPath, auth, metrics, telemetry, scheduler, and websocket options that shape the runtime.",
        ...docsReference("Configuration docs", "configuration.md")
      }
    ]
  },
  controllers: {
    eyebrow: "Controller docs",
    intro: "Controller files define the route tree and security modes.",
    description:
      "The controllers page reads a runtime-backed route catalog so the workspace can show public, Basic, and JWT handlers side by side with their source files.",
    highlights: [
      "The route catalog is surfaced through a dedicated demo controller instead of static placeholder text.",
      "Security remains declared per handler through public, basic, or jwt route metadata.",
      "The page ties the health, auth, and demo endpoints together as one concrete routing story."
    ],
    demo: {
      status: "implemented",
      title: "Runtime-backed controller catalog",
      summary:
        "The workspace loads the live controller catalog from the backend and shows the route tree with mixed security modes.",
      bullets: [
        "GET /api/system/health",
        "POST /api/auth/login",
        "GET /api/auth/session",
        "GET /api/demo/core-features",
        "POST /api/demo/events/:presetId"
      ]
    },
    codeExamples: [
      {
        type: "shared-snippet",
        snippetId: "controllers.demo-controller"
      },
      {
        type: "shared-snippet",
        snippetId: "controllers.auth-controller"
      }
    ],
    documentation: [
      {
        title: "Controller contract",
        body: "The controllers guide documents the stable controller shape: route prefix, handler definitions, HTTP method, path, and handler-level security metadata.",
        ...docsReference("Controllers docs", "controllers.md")
      },
      {
        title: "Route security modes",
        body: "The security guide explains how public, Basic, and JWT handlers coexist in the same runtime, which is exactly what this page demonstrates through the current endpoints.",
        ...docsReference("Security docs", "security.md")
      }
    ]
  },
  security: {
    eyebrow: "Security docs",
    intro: "Basic Auth login, JWT issuance, and client-side session reuse.",
    description:
      "This page documents the full authentication flow that powers the current workspace: visible demo credentials, Basic-authenticated login, JWT creation, local storage, and protected session checks.",
    highlights: [
      "The login screen intentionally shows the static demo credentials.",
      "The server signs a JWT after successful Basic authentication.",
      "The frontend reuses that token for protected requests and preview-mode simulation."
    ],
    demo: {
      status: "implemented",
      title: "Current auth lifecycle",
      summary:
        "The security page reuses the active session metadata and token viewer from the current authentication implementation.",
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
        title: "Authentication flow",
        body: "The security guide covers Basic Auth, JWT validation, and protected route handling, which matches the login and session endpoints used by this workspace.",
        ...docsReference("Security docs", "security.md")
      },
      {
        title: "Stable JWT helpers",
        body: "The public API documentation lists signToken and verifyToken among the supported helpers, which is the contract behind the current login implementation.",
        ...docsReference("Public API docs", "public-api.md")
      }
    ]
  },
  "lifecycle-hooks": {
    eyebrow: "Lifecycle docs",
    intro: "Lifecycle hook registration, ordering, and request-aware security interception.",
    description:
      "The lifecycle hooks page exposes the registered hook set and a recorded runtime trace so startup, middleware, and secure-request phases are visible in one place.",
    highlights: [
      "The runtime registers initialize, startup, preInit, postInit, and security hooks through the shared HookManager.",
      "Hook execution is recorded so the page can show actual ordering instead of a static checklist.",
      "The security hook becomes visible through the protected session and EventBus requests in the workspace."
    ],
    demo: {
      status: "implemented",
      title: "Recorded hook execution",
      summary:
        "The page loads the current hook trace from the runtime endpoint and keeps the registered hook list aligned with the running server.",
      bullets: [
        "Shared HookManager registration in the server runtime",
        "Recorded initialize, startup, preInit, and postInit execution",
        "Security hook trace entries triggered by protected requests"
      ]
    },
    codeExamples: [
      {
        type: "shared-snippet",
        snippetId: "hooks.registration"
      }
    ],
    documentation: [
      {
        title: "Lifecycle phases",
        body: "The lifecycle guide documents initialize, startup, middleware, post-initialization, shutdown, and security hooks as the supported extension points around the runtime.",
        ...docsReference("Lifecycle Hooks docs", "lifecycle-hooks.md")
      },
      {
        title: "Hook context",
        body: "The framework contracts describe the hook context shape, including config, logger, eventBus, services, and request when a hook runs during request processing.",
        ...docsReference("Framework Contracts docs", "framework-contracts.md")
      }
    ]
  },
  "service-registry": {
    eyebrow: "Service registry docs",
    intro: "Services registered during startup and inspected from the authenticated workspace.",
    description:
      "The Service Registry page shows the demo services that are registered during startup and then consumed by the controllers and EventBus flow.",
    highlights: [
      "The startup hook registers concrete in-memory services in the framework ServiceRegistry.",
      "The workspace shows both the registry names and the curated service capabilities.",
      "The EventBus message board depends on a registered service rather than on component-local state."
    ],
    demo: {
      status: "implemented",
      title: "Runtime service inventory",
      summary:
        "The service list comes from the same runtime endpoint as the hook and controller data and reflects what the startup hook registered.",
      bullets: [
        "featureCatalog service for route metadata",
        "demoMessageBoard service for the visible EventBus text",
        "Service names remain inspectable through the framework registry"
      ]
    },
    codeExamples: [
      {
        type: "shared-snippet",
        snippetId: "services.registry"
      }
    ],
    documentation: [
      {
        title: "Service registry behavior",
        body: "The service registry guide documents registration, lookup, listing, replacement, removal, and graceful shutdown expectations for shared runtime services.",
        ...docsReference("Service Registry docs", "service-registry.md")
      },
      {
        title: "Supported public surface",
        body: "The public API documentation names ServiceRegistry as part of the supported framework extension surface, which is why this page focuses on real registered services instead of placeholder data.",
        ...docsReference("Public API docs", "public-api.md")
      }
    ]
  },
  "event-system": {
    eyebrow: "Event system docs",
    intro: "Framework events and EventBus-triggered UI updates.",
    description:
      "The Event System page triggers predefined backend presets that emit EventBus messages and update the visible text field through the runtime listener.",
    highlights: [
      "Buttons in the UI call a JWT-protected controller endpoint.",
      "The backend emits a typed EventBus message and the runtime listener updates the message-board service.",
      "Preview mode mirrors the same interaction model with committed local data."
    ],
    demo: {
      status: "implemented",
      title: "Protected EventBus interaction",
      summary:
        "The page uses a real backend flow: protected preset trigger, EventBus emission, visible message update, and recent event history.",
      bullets: [
        "Buttons for Greeting, Warning, and Info",
        "Backend event emission via the demo EventBus flow",
        "UI text field updated from the resulting message"
      ]
    },
    codeExamples: [
      {
        type: "shared-snippet",
        snippetId: "event-system.emitter"
      },
      {
        type: "shared-snippet",
        snippetId: "contracts.event-bus-demo"
      }
    ],
    documentation: [
      {
        title: "EventBus model",
        body: "The event-system guide documents the EventBus as the framework primitive for application events and listener-driven workflows, which matches the current message-board interaction.",
        ...docsReference("Event System docs", "event-system.md")
      },
      {
        title: "Supported event helpers",
        body: "The public API documentation lists EventBus and createEventPayload among the supported primitives, which is the contract behind the emitted demo messages.",
        ...docsReference("Public API docs", "public-api.md")
      }
    ]
  },
  scheduler: {
    eyebrow: "Scheduler docs",
    intro: "Recurring jobs and the scheduled clock message.",
    description:
      "The scheduler page now shows the live clock job that emits the current time every ten seconds and adds it to the shared backend feed.",
    highlights: [
      "The server-side scheduler owns the recurring time production.",
      "Every ten seconds the demo emits one clock event.",
      "The workspace shows the latest received timestamp plus a recent activity feed."
    ],
    demo: {
      status: "implemented",
      title: "Live scheduled time feed",
      summary:
        "The scheduler page reads the current tick state from the backend so the clock demo is no longer only a preview surface.",
      bullets: [
        "One job runs every ten seconds",
        "The current time becomes a demo message payload",
        "The transport feed collects those ticks for later real-time delivery"
      ]
    },
    codeExamples: [
      {
        type: "shared-snippet",
        snippetId: "scheduler.clock-job"
      },
      {
        type: "shared-snippet",
        snippetId: "contracts.scheduler-clock-tick"
      }
    ],
    documentation: [
      {
        title: "Scheduler responsibilities",
        body: "The scheduler guide documents attached and standalone job execution, job configuration, and runtime context for recurring background work.",
        ...docsReference("Scheduler docs", "scheduler.md")
      },
      {
        title: "Event-driven output",
        body: "The event-system guide matters here because the scheduler job emits a typed backend event that the transport feed can reuse immediately.",
        ...docsReference("Event System docs", "event-system.md")
      }
    ]
  },
  metrics: {
    eyebrow: "Metrics docs",
    intro: "Prometheus metrics and live runtime visibility.",
    description:
      "The metrics page now shows the configured metrics endpoint and a live preview of exported Prometheus samples from the running server.",
    highlights: [
      "The runtime exposes a Prometheus endpoint through the shared server.",
      "The workspace reads back a short sample of exported metrics lines for visibility.",
      "The metrics preview stays aligned with the current runtime configuration and endpoint path."
    ],
    demo: {
      status: "implemented",
      title: "Live metrics preview",
      summary:
        "The metrics page loads a short preview of the current Prometheus output so the observability surface is no longer only a future placeholder.",
      bullets: [
        "Configured metrics endpoint path",
        "Sample metric names from the current runtime",
        "Raw Prometheus lines rendered directly in the workspace"
      ]
    },
    codeExamples: [
      {
        type: "shared-snippet",
        snippetId: "live-demo.runtime-loader"
      }
    ],
    documentation: [
      {
        title: "Prometheus endpoint",
        body: "The metrics guide documents the built-in Prometheus export endpoint and the runtime metrics that expresto-server keeps for requests, services, and route registration.",
        ...docsReference("Metrics docs", "metrics.md")
      },
      {
        title: "Configuration switch",
        body: "The configuration guide explains how metrics are enabled and how the endpoint path can be customized, which is reflected directly by the runtime snapshot on this page.",
        ...docsReference("Configuration docs", "configuration.md")
      }
    ]
  },
  websocket: {
    eyebrow: "WebSocket docs",
    intro: "Protected real-time delivery for clock ticks and EventBus messages.",
    description:
      "The WebSocket page now shows the backend feed and socket readiness state while the dedicated client-side socket bridge is still being layered on top.",
    highlights: [
      "JWT state from the current security flow becomes the transport credential.",
      "Clock ticks and EventBus messages already share one visible backend feed.",
      "The page keeps the socket path and runtime readiness visible while the live bridge is still being completed."
    ],
    demo: {
      status: "planned",
      title: "Socket transport groundwork",
      summary:
        "The backend feed and socket readiness data are already available. The dedicated live socket client is the next step on top of that shared transport model.",
      bullets: [
        "Connection state indicator",
        "Shared feed for EventBus and scheduler messages",
        "Configured socket path and JWT transport expectation"
      ]
    },
    codeExamples: [
      {
        type: "shared-snippet",
        snippetId: "live-demo.runtime-loader"
      },
      {
        type: "shared-snippet",
        snippetId: "contracts.live-demo-message"
      }
    ],
    documentation: [
      {
        title: "Socket runtime",
        body: "The websocket guide documents the shared HTTP server integration, Socket.IO path, and protected transport behavior that this page is incrementally preparing.",
        ...docsReference("WebSocket docs", "websocket.md")
      },
      {
        title: "Protected transport",
        body: "The security guide matters here because the current JWT flow is the credential model that later protects the socket connection.",
        ...docsReference("Security docs", "security.md")
      }
    ]
  }
};
