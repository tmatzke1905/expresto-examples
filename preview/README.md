# Preview Build Target

The finished static preview build will be committed into this folder.

Why `preview/` and not `dist/`?

- `dist/` is ignored by the repository-wide `.gitignore`
- the project goal explicitly requires a versioned, openable static build in
  the repository
- keeping the preview target separate avoids mixing generated preview files
  with local build output
