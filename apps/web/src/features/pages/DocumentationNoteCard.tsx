import type { FeaturePageDocumentationNote } from "./feature-page-content";
import { DocumentationReference } from "./DocumentationReference";

type DocumentationNoteCardProps = {
  note: FeaturePageDocumentationNote;
};

export function DocumentationNoteCard({ note }: DocumentationNoteCardProps) {
  return (
    <section className="documentation-card">
      <DocumentationReference label={note.referenceLabel} url={note.referenceUrl} />
      <h3>{note.title}</h3>
      <p>{note.body}</p>
    </section>
  );
}
