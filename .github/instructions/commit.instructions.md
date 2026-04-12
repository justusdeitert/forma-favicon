---
description: "Use before every commit. Review changed files for correctness and commit with this repository's message format."
---

# Commit Format

- Use Conventional Commit prefixes: `feat:`, `fix:`, `refactor:`, `style:`, `perf:`, `test:`, `docs:`, `chore:`
- Do not use scope parentheses in the title. Use `feat: ...`, not `feat(scope): ...`
- Title should be short and imperative
- Body is optional for small commits
- If body is used, use a flat bullet list
- Every bullet line must start with a capital letter after `- `
- Keep body concise and focused on observable changes

## Good examples

- `fix: prevent duplicate favicon output`
- `docs: add WordPress.org listing link`

## Body example

- Add conflict notice when Site Icon is active
- Keep generated output logic unchanged

# Pre-Commit Checklist

- No debug leftovers (`console.log`, temporary comments, quick hacks)
- No dead code or unused imports introduced
- Frontend and PHP changes follow existing project patterns
- Build output is regenerated when source changes require it
- `readme.txt` and plugin metadata stay accurate when behavior changes
- Commit includes only related files
