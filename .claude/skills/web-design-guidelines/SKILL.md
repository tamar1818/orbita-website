---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  source: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Load the guidelines: try the source URL below first; if it can't be fetched,
   use the vendored copy in [guidelines.md](guidelines.md) (same content, saved 2026-10).
2. Read the specified files (or ask the user for files/pattern)
3. Check against all rules in the guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

## Project notes (Webico)

- Pages are server-rendered HTML strings (`pages/*.js`, `views/static/*.html`, `lib/layout.js`),
  not React — map React-specific rules (`onClick`, `<Link>`) to their plain HTML/JS equivalents
  in `assets/js/main.js`.
- Design tokens live in `assets/css/style.css` (`:root`) and are documented in `DESIGN.md`.

## Usage

When a user provides a file or pattern argument:
1. Load the guidelines
2. Read the specified files
3. Apply all rules
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
