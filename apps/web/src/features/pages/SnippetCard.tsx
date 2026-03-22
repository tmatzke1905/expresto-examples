import { useEffect, useState } from "react";

import type { FeaturePageCodeExample } from "./feature-page-content";

type SnippetCardProps = {
  example: FeaturePageCodeExample;
};

type CopyState = "copied" | "error" | "idle";

export function SnippetCard({ example }: SnippetCardProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copyState]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  const copyLabel =
    copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy code";

  return (
    <section className="snippet-card">
      <div className="snippet-card__header">
        <div>
          <h3>{example.title}</h3>
          <p>{example.description}</p>
        </div>

        <div className="snippet-card__meta">
          <span
            className={`feature-badge${example.emphasis === "current" ? "" : " feature-badge--muted"}`}
          >
            {example.sourceLabel}
          </span>
          <span className="snippet-path">{example.filePath}</span>
        </div>
      </div>

      <div className="snippet-card__actions">
        <button className="secondary-button snippet-copy-button" onClick={handleCopy} type="button">
          {copyLabel}
        </button>
      </div>

      <pre className={`snippet-block language-${example.language}`}>
        <code>{example.code}</code>
      </pre>
    </section>
  );
}
