# AISafety.com Documentation

> AI safety community resource website — Next.js + TypeScript + Airtable

## Quick Reference

|                |                                     |
| -------------- | ----------------------------------- |
| **Framework**  | Next.js 16 (App Router)             |
| **Language**   | TypeScript                          |
| **Styling**    | Constraint-based CSS (not Tailwind) |
| **Data**       | Airtable                            |
| **Deployment** | Vercel                              |

## Documentation

- **[Project Overview](./project-overview.md)** — What this project is, structure, key features
- **[Architecture](./architecture.md)** — Technical decisions, data flow, API reference
- **[Development Guide](./development-guide.md)** — How to run, add pages, add components
- **[CSS Guidelines](./css-guidelines.md)** — Design system rules, spacing, colors, file organization

## Getting Started

```bash
nvm use
npm install
# Add AIRTABLE_TOKEN and AIRTABLE_BASE_ID to .env.local
npm run dev
```

## Project Structure

```
src/
├── app/           # Pages + API routes
│   ├── api/       # Backend endpoints
│   └── map/       # Interactive field map
├── components/    # Reusable UI (4 components)
public/images/     # Static assets
docs/              # This documentation
```

## Existing Documentation

- [README.md](../README.md) — Basic setup instructions
- [CLAUDE.md](../CLAUDE.md) — AI development guidelines

---

_Generated 2026-01-18 by document-project workflow_
