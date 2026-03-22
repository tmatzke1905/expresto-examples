type DocumentationReferenceProps = {
  reference: string;
};

export function DocumentationReference({ reference }: DocumentationReferenceProps) {
  return <span className="documentation-reference">{reference}</span>;
}
