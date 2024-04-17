# pnpm override in monorepo

pnpm's `overrides` feature allows you to override the version of a package in a monorepo.
This is useful when you have a package that depends on a different version of a package than the rest of the monorepo.

```
$ rg "react"
packages/app-b/package.json
10:    "react": "18.2.0"

packages/app-a/package.json
10:    "react": "18.1.0"

pnpm-lock.yaml
8:  react: 18.2.0
14:      react:
20:      react:
26:      react:
43:  /react@18.2.0:

package.json
13:    "react": "18.2.0"
17:      "react": "$react"

$ pnpm ls

dependencies:
react 18.2.0
```
