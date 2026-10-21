# KaTeX 0.17.0

This directory vendors the browser distribution of KaTeX 0.17.0 so the blog's
LaTeX formulas render without a CDN or build step.

- Source: https://github.com/KaTeX/KaTeX/releases/tag/v0.17.0
- Distribution files: https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/
- `LICENSE.txt`: KaTeX MIT license
- `FONTS_LICENSE.txt`: KaTeX fonts MIT license

The page loads `katex.min.css`, `katex.min.js`, and
`contrib/auto-render.min.js`. The complete font set referenced by the KaTeX
stylesheet is retained under `fonts/`.
