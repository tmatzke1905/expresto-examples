import overviewSelectionSnippet from "./app/overview-selected-feature.tsx?raw";
import eventBusDemoSnippet from "./contracts/event-bus-demo.ts?raw";
import liveDemoMessageSnippet from "./contracts/live-demo-message.ts?raw";
import schedulerClockTickSnippet from "./contracts/scheduler-clock-tick.ts?raw";
import authControllerLoginSnippet from "./server/auth-controller-login.ts?raw";
import bootstrapMainSnippet from "./server/bootstrap-main.ts?raw";
import coreFeatureHooksSnippet from "./server/core-feature-hooks.ts?raw";
import coreFeatureServicesSnippet from "./server/core-feature-services.ts?raw";
import demoControllerCoreFeaturesSnippet from "./server/demo-controller-core-features.ts?raw";
import eventDemoEmitterSnippet from "./server/event-demo-emitter.ts?raw";
import jwtResponseSnippet from "./server/jwt-response.ts?raw";
import systemHealthControllerSnippet from "./server/system-health-controller.ts?raw";
import verifySessionSnippet from "./web/verify-session.ts?raw";

export type SharedSnippetLanguage = "json" | "ts" | "tsx";
export type SharedSnippetDescriptor = {
  code: string;
  description: string;
  emphasis: "current" | "variant";
  filePath: string;
  language: SharedSnippetLanguage;
  sourceLabel: string;
  title: string;
};

const snippetRegistry = {
  "overview.protected-shell-rendering": {
    title: "Shared protected-shell rendering",
    description:
      "The authenticated app resolves the active feature and renders the shared shell around it.",
    emphasis: "current",
    filePath: "apps/web/src/app/App.tsx",
    language: "tsx",
    sourceLabel: "Current implementation",
    code: overviewSelectionSnippet.trim()
  },
  "bootstrap.server-runtime": {
    title: "Server bootstrap",
    description: "The main entry point creates the runtime and attaches the built React application.",
    emphasis: "current",
    filePath: "apps/server/src/main.ts",
    language: "ts",
    sourceLabel: "Current implementation",
    code: bootstrapMainSnippet.trim()
  },
  "bootstrap.health-endpoint": {
    title: "Runtime health endpoint",
    description: "The health controller provides the bootstrap metadata used by the UI.",
    emphasis: "variant",
    filePath: "apps/server/src/controllers/system.controller.ts",
    language: "ts",
    sourceLabel: "Supporting endpoint",
    code: systemHealthControllerSnippet.trim()
  },
  "controllers.auth-controller": {
    title: "Current protected controller",
    description:
      "The auth controller already mixes route metadata with handler-level security and response shaping.",
    emphasis: "current",
    filePath: "apps/server/src/controllers/auth.controller.ts",
    language: "ts",
    sourceLabel: "Current implementation",
    code: authControllerLoginSnippet.trim()
  },
  "controllers.demo-controller": {
    title: "AP6 runtime demo controller",
    description:
      "The AP6 controller combines a public runtime snapshot endpoint with a JWT-protected EventBus trigger.",
    emphasis: "current",
    filePath: "apps/server/src/controllers/demo.controller.ts",
    language: "ts",
    sourceLabel: "Current implementation",
    code: demoControllerCoreFeaturesSnippet.trim()
  },
  "hooks.registration": {
    title: "Lifecycle hook registration",
    description:
      "AP6 registers concrete initialize, startup, preInit, postInit, and security hooks and records their execution.",
    emphasis: "current",
    filePath: "apps/server/src/lib/core-feature-demo.ts",
    language: "ts",
    sourceLabel: "Current implementation",
    code: coreFeatureHooksSnippet.trim()
  },
  "security.jwt-creation": {
    title: "JWT creation on the server",
    description: "The login handler signs the token and returns the session envelope to the client.",
    emphasis: "current",
    filePath: "apps/server/src/controllers/auth.controller.ts",
    language: "ts",
    sourceLabel: "Current implementation",
    code: jwtResponseSnippet.trim()
  },
  "security.verify-session": {
    title: "JWT validation in the frontend",
    description:
      "The web client restores the stored token and validates it against the protected session endpoint.",
    emphasis: "variant",
    filePath: "apps/web/src/lib/session.ts",
    language: "ts",
    sourceLabel: "Client flow",
    code: verifySessionSnippet.trim()
  },
  "services.registry": {
    title: "ServiceRegistry demo services",
    description:
      "The AP6 startup hook registers in-memory services so the workspace can surface real registry entries.",
    emphasis: "current",
    filePath: "apps/server/src/lib/core-feature-demo.ts",
    language: "ts",
    sourceLabel: "Current implementation",
    code: coreFeatureServicesSnippet.trim()
  },
  "event-system.emitter": {
    title: "Protected EventBus emission",
    description:
      "The Event System page triggers a JWT-protected handler that emits a typed message through the runtime EventBus.",
    emphasis: "current",
    filePath: "apps/server/src/lib/core-feature-demo.ts",
    language: "ts",
    sourceLabel: "Current implementation",
    code: eventDemoEmitterSnippet.trim()
  },
  "contracts.event-bus-demo": {
    title: "Planned payload shape",
    description:
      "A small typed message contract keeps the later EventBus demo predictable across live and preview mode.",
    emphasis: "variant",
    filePath: "content/snippets/contracts/event-bus-demo.ts",
    language: "ts",
    sourceLabel: "Planned variant",
    code: eventBusDemoSnippet.trim()
  },
  "contracts.scheduler-clock-tick": {
    title: "Planned message contract",
    description:
      "The later scheduler demo uses a small payload shape that is easy to surface in both live and preview mode.",
    emphasis: "variant",
    filePath: "content/snippets/contracts/scheduler-clock-tick.ts",
    language: "ts",
    sourceLabel: "Planned variant",
    code: schedulerClockTickSnippet.trim()
  },
  "contracts.live-demo-message": {
    title: "Planned live message union",
    description:
      "One message contract keeps clock events and EventBus updates renderable through the same UI feed.",
    emphasis: "variant",
    filePath: "content/snippets/contracts/live-demo-message.ts",
    language: "ts",
    sourceLabel: "Planned variant",
    code: liveDemoMessageSnippet.trim()
  }
} satisfies Record<string, SharedSnippetDescriptor>;

export type SharedSnippetId = keyof typeof snippetRegistry;

export function getSharedSnippet(snippetId: SharedSnippetId): SharedSnippetDescriptor {
  return snippetRegistry[snippetId];
}
