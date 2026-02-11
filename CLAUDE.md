# AISafety.com – Webflow Migration

## Goal

Replicate the live site (aisafety.com) exactly in Next.js. This is a pixel-perfect migration, not a redesign.

## Critical Workflow

1. **Check the live site first.** Before building or modifying any page, open https://aisafety.com in Playwright (headless) and study the current layout, spacing, colors, fonts, and behavior. Don't guess from memory.
2. **Reference the backup files.** HTML snapshots of the live site are in `backup/`. Use these as source-of-truth for structure and class names.
3. **Read the CSS guidelines.** Before writing styles, read `docs/css-guidelines.md` for the project's approach to converting Webflow CSS.
4. **Always compare your work.** After making changes, visually compare the local dev site against the live site using Playwright screenshots side-by-side. Flag any differences before moving on.

## Reference Files

- `backup/` — HTML snapshots of every live page
- `backup/css/` — Original Webflow CSS
- `docs/css-guidelines.md` — How to handle CSS in this project
- `docs/architecture.md` — Project architecture notes
- `docs/claude.md` — Development philosophy and patterns
