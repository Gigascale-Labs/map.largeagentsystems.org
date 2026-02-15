# AISafety.com – Webflow Migration

## Goal

Replicate the live site (aisafety.com) exactly in Next.js. This is a pixel-perfect migration, not a redesign. **The one exception:** when the designer has made a change (visible in CSS guides, design files, etc.), follow the designer's version rather than the live site.

## Critical Workflow

1. **Check the live site first.** Before building or modifying any page, open https://aisafety.com in Playwright (headless) and study the current layout, spacing, colors, fonts, and behavior. Don't guess from memory.
2. **Reference the backup files.** HTML snapshots of the live site are in `backup/`. Use these as source-of-truth for structure and class names.
3. **Read the CSS guidelines.** Before writing styles, read `docs/css-guidelines.md` for the project's approach to converting Webflow CSS.
4. **Always compare your work.** After every visual change, take a screenshot of the local result and compare it to the live site (using Playwright). The two should look identical unless explicitly told otherwise. Flag any differences before moving on.
5. **Verify every fix.** After making a fix, always open the new site and compare it to the live site to confirm the fix actually worked and didn't break anything else visually. Don't assume — check.

## CSS: Never Recreate, Always Reuse

The #1 source of sloppy code in this project is recreating styles that already exist in `globals.css`. **Never write CSS for something that already has a class.** Buttons, typography, spacing, colors, shadows, layout — these are all defined once in `globals.css`. Use those classes. Don't create new ones that duplicate them, even partially.

If a button hover looks wrong, fix the shared `.button-primary` definition — don't add a one-off hover style. That way every button is fixed at once. This is the whole point of standardizing: define once, reference everywhere.

## Reference Files

- `backup/` — HTML snapshots of every live page
- `backup/css/` — Original Webflow CSS
- `docs/css-guidelines.md` — How to handle CSS in this project
- `docs/architecture.md` — Project architecture notes
- `docs/claude.md` — Development philosophy and patterns
