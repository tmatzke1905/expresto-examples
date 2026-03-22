type DocumentationReferenceProps = {
  label: string;
  url: string;
};

export function DocumentationReference({ label, url }: DocumentationReferenceProps) {
  return (
    <a
      className="documentation-reference"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      {label}
    </a>
  );
}
