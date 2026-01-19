# AISafety.com Project Overview

## What is this?

AISafety.com is a community resource website for the AI safety ecosystem. It helps people find events, organizations, jobs, funding, and learning resources related to AI safety.

## Key Features

- **Field Map** (`/map`) — Interactive D3.js visualization showing 323+ organizations in the AI safety space
- **Events & Training** (`/events-and-training`) — Upcoming events and programs
- **Homepage** (`/`) — Card-based landing page linking to all resources

## Tech Stack (Quick Reference)

| What          | Technology                                    |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 16 (App Router)                       |
| Language      | TypeScript                                    |
| Styling       | Constraint-based CSS utilities (not Tailwind) |
| Data          | Airtable (external database)                  |
| Visualization | D3.js for the map                             |

## Project Structure

```
src/
├── app/                    # Pages and API routes
│   ├── page.tsx           # Homepage
│   ├── map/               # Interactive field map
│   ├── events-and-training/
│   ├── api/               # Backend API routes
│   │   ├── map/           # Fetches org data from Airtable
│   │   └── last-updated/  # Timestamp endpoints
│   ├── layout.tsx         # Root layout (nav + footer)
│   └── globals.css        # All styles (~1200 lines)
├── components/            # Reusable UI pieces
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── LastUpdated.tsx
│   └── UpButton.tsx
public/
├── images/               # Icons, logos, background images
backup/
├── *.html               # Original WebFlow exports (reference only)
```

## Data Flow

1. **Airtable** stores all content (orgs, events, metadata)
2. **API Routes** fetch from Airtable with 5-minute caching
3. **Pages** render the data (server-side or client-side depending on interactivity)

## CSS Architecture

This project uses a **constraint-based utility class system** instead of Tailwind:

```css
/* Only these spacing values exist - prevents design inconsistency */
.padding-8px {
  padding-bottom: 8px;
}
.padding-16px {
  padding-bottom: 16px;
}
.padding-24px {
  padding-bottom: 24px;
}
/* No arbitrary values like 14px allowed! */
```

Design tokens are CSS variables in `globals.css`:

- Colors: `--teal-100` through `--teal-900`, `--bright-teal-300/500`
- Typography: Inter font with defined heading/paragraph styles

## Environment Setup

Requires `.env.local` with:

```
AIRTABLE_TOKEN=your_token
AIRTABLE_BASE_ID=your_base_id
```

## Origin

Migrated from WebFlow. The `backup/` folder contains original HTML exports for reference.
