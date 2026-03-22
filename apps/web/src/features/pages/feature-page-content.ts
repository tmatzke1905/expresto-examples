import { featurePageContent, type AuthoredFeaturePageCodeExampleRef } from "../../../../../content/features/page-content";
import { getSharedSnippet } from "../../../../../content/snippets/snippet-registry";
import type { FeatureMenuItem } from "../../lib/session";

export type FeaturePageCodeExample = {
  code: string;
  description: string;
  emphasis: "current" | "variant";
  filePath: string;
  language: "json" | "ts" | "tsx";
  sourceLabel: string;
  title: string;
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
  codeExamples: FeaturePageCodeExample[];
  demo: FeaturePageDemo;
  description: string;
  documentation: FeaturePageDocumentationNote[];
  eyebrow: string;
  highlights: string[];
  intro: string;
};

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

function resolveCodeExample(
  reference: AuthoredFeaturePageCodeExampleRef,
  feature: FeatureMenuItem
): FeaturePageCodeExample {
  if (reference.type === "shared-snippet") {
    return getSharedSnippet(reference.snippetId);
  }

  return {
    title: reference.title,
    description: reference.description,
    emphasis: reference.emphasis,
    filePath: "content/features/navigation.json",
    language: "json",
    sourceLabel: reference.sourceLabel,
    code: createNavigationSnippet(feature)
  };
}

function createGenericPage(feature: FeatureMenuItem): FeaturePageDescriptor {
  const isImplemented = feature.status === "implemented";

  return {
    eyebrow: feature.package,
    intro: feature.summary,
    description: feature.detail,
    highlights: [
      "Navigation target is available in the protected shell today.",
      "The page is now fed by the shared AP5 content model instead of embedding all content in UI code.",
      isImplemented
        ? "The current runtime contains an initial implementation that future packages can expand."
        : "The detailed runtime behavior will be added in the scheduled work package."
    ],
    demo: {
      status: isImplemented ? "implemented" : "planned",
      title: isImplemented ? "Current workspace behavior" : "Planned demo surface",
      summary: isImplemented
        ? `${feature.title} already contributes to the running workspace and is described through the shared AP5 page content system.`
        : `AP5 keeps the ${feature.title} route, navigation entry, and content shell ready for the later live demo work.`,
      bullets: [
        `Primary work package: ${feature.package}`,
        isImplemented
          ? "The page focuses on what already runs in the repository today."
          : "The page explains the intended outcome before the runtime-specific code arrives.",
        "Preview mode keeps the same layout and now uses centrally prepared content and example data."
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
        title: "AP5 content system",
        body: "AP5 moves page descriptions, documentation notes, prepared preview data, and code snippet selection into shared content files so later work packages can focus on behavior.",
        reference: "docs/ap5-content-system.md"
      }
    ]
  };
}

export function getFeaturePageDescriptor(feature: FeatureMenuItem): FeaturePageDescriptor {
  const authoredContent = featurePageContent[feature.id];

  if (!authoredContent) {
    return createGenericPage(feature);
  }

  return {
    eyebrow: authoredContent.eyebrow,
    intro: authoredContent.intro,
    description: authoredContent.description,
    highlights: authoredContent.highlights,
    demo: authoredContent.demo,
    codeExamples: authoredContent.codeExamples.map(reference => resolveCodeExample(reference, feature)),
    documentation: authoredContent.documentation
  };
}
