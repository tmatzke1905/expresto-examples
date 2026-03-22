import type { ReactNode } from "react";

import type { RuntimeSnapshot } from "../../lib/runtime-snapshot";
import type { FeatureMenuItem } from "../../lib/session";
import { DocumentationNoteCard } from "./DocumentationNoteCard";
import type { FeaturePageDescriptor } from "./feature-page-content";
import { SnippetCard } from "./SnippetCard";

type PageStatePanelProps = {
  body: string;
  tone?: "default" | "error" | "loading";
  title: string;
};

type FeaturePageTemplateProps = {
  demoContent: ReactNode;
  feature: FeatureMenuItem;
  page: FeaturePageDescriptor;
  runtimeSnapshot: RuntimeSnapshot | null;
};

function formatStatusLabel(value: string): string {
  if (value === "implemented") {
    return "Implemented";
  }

  if (value === "planned") {
    return "Planned";
  }

  return value;
}

export function PageStatePanel({
  body,
  tone = "default",
  title
}: PageStatePanelProps) {
  return (
    <div className={`state-panel state-panel--${tone}`}>
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

export function FeaturePageTemplate({
  demoContent,
  feature,
  page,
  runtimeSnapshot
}: FeaturePageTemplateProps) {
  return (
    <section className="feature-page">
      <article className="panel feature-hero-panel">
        <div className="feature-hero-panel__topline">
          <span className="hero__eyebrow">{page.eyebrow}</span>

          <div className="feature-badges">
            <span className="feature-badge">{formatStatusLabel(feature.status)}</span>
            <span className="feature-badge feature-badge--muted">{feature.package}</span>
          </div>
        </div>

        <div className="panel__header">
          <h2>{feature.title}</h2>
          <p>{page.description}</p>
        </div>

        <div className="detail-grid detail-grid--hero">
          <div className="detail-card">
            <span className="detail-card__label">API root</span>
            <strong>{runtimeSnapshot?.contextRoot ?? "Loading runtime..."}</strong>
          </div>
          <div className="detail-card">
            <span className="detail-card__label">Runtime mode</span>
            <strong>{runtimeSnapshot?.mode ?? "pending"}</strong>
          </div>
          <div className="detail-card">
            <span className="detail-card__label">Feature status</span>
            <strong>{formatStatusLabel(feature.status)}</strong>
          </div>
        </div>
      </article>

      <article className="panel">
        <div className="panel__header">
          <h2>Feature overview</h2>
          <p>{page.intro}</p>
        </div>

        <div className="highlight-grid">
          {page.highlights.map(highlight => (
            <div className="highlight-card" key={highlight}>
              {highlight}
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <div className="panel__header">
          <h2>Demo surface</h2>
          <p>{page.demo.summary}</p>
        </div>

        <div className="demo-callout">
          <div className="demo-callout__header">
            <strong>{page.demo.title}</strong>
            <span
              className={`feature-badge${
                page.demo.status === "implemented" ? "" : " feature-badge--muted"
              }`}
            >
              {formatStatusLabel(page.demo.status)}
            </span>
          </div>

          <ul className="bullet-list">
            {page.demo.bullets.map(bullet => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="demo-surface">{demoContent}</div>
      </article>

      <article className="panel">
        <div className="panel__header">
          <h2>Code examples</h2>
          <p>
            Every page shows the current implementation first. Additional variants are only shown
            when they clarify the feature.
          </p>
        </div>

        <div className="snippet-stack">
          {page.codeExamples.map(example => (
            <SnippetCard example={example} key={`${example.filePath}-${example.title}`} />
          ))}
        </div>
      </article>

      <article className="panel">
        <div className="panel__header">
          <h2>Documentation notes</h2>
          <p>Short curated guidance that keeps the feature aligned with the roadmap and runtime.</p>
        </div>

        <div className="documentation-grid">
          {page.documentation.map(note => (
            <DocumentationNoteCard key={`${note.reference}-${note.title}`} note={note} />
          ))}
        </div>
      </article>
    </section>
  );
}
