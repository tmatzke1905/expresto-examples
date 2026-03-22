import {
  featurePageContent,
  getFeatureDocumentationReference,
  getReadmeDocumentationReference,
  type AuthoredFeaturePageCodeExampleRef
} from "../../../../../content/features/page-content";
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
  referenceLabel: string;
  referenceUrl: string;
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
      "The page is fed by the shared content model instead of embedding all content in UI code.",
      isImplemented
        ? "The current runtime contains an initial implementation that can be expanded without changing the page shell."
        : "The detailed runtime behavior is still being added while the page structure and references are already in place."
    ],
    demo: {
      status: isImplemented ? "implemented" : "planned",
      title: isImplemented ? "Current workspace behavior" : "Planned demo surface",
      summary: isImplemented
        ? `${feature.title} already contributes to the running workspace and is grounded in the current repository implementation.`
        : `The ${feature.title} route and content shell are already in place while the runtime-specific behavior is still being added.`,
      bullets: [
        `Category: ${feature.package}`,
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
        title: "Official framework guide",
        body: `${feature.title} already maps to the documented expresto-server feature surface, even when the example application is still expanding the live demo behavior.`,
        ...getFeatureDocumentationReference(feature.id)
      },
      {
        title: "Framework overview",
        body: "The README collects the supported v1 scope and links the dedicated guides that the example application builds on page by page.",
        ...getReadmeDocumentationReference("README / Supported v1 scope")
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
