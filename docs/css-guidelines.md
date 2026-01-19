# CSS Guidelines

This project uses a **constraint-based design system**. These rules ensure visual consistency and prevent arbitrary styling decisions.

## Core Principle

> If a value isn't in the design system, you can't use it.

No `padding: 14px`. No `color: #3a7b8c`. Use the predefined values or don't use it at all.

---

## File Organization

| File                       | What belongs there                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `globals.css`              | **Design system only** — variables, spacing utilities, color utilities, typography, resets, truly reusable patterns |
| `ComponentName.module.css` | **Component-specific styles** — used in one component only                                                          |
| `page.module.css`          | **Page-specific styles** — used on one page only                                                                    |

### Rule: If it's used in only one place, it doesn't go in globals.css

```
globals.css          → .padding-16px (used everywhere)
Navigation.module.css → .navItem (only used in Navigation.tsx)
page.module.css      → .mapContainer (only used on map page)
```

---

## Spacing

### Allowed Values

```
4px, 8px, 12px, 16px, 24px, 32px, 40px, 56px, 80px, 104px, 192px
```

### NOT Allowed

```
14px, 18px, 20px, 30px, 48px, 64px, 100px, or any other value
```

### Available Classes

```css
/* Bottom padding */
.padding-bottom-4px    .padding-bottom-8px    .padding-bottom-12px
.padding-bottom-16px   .padding-bottom-24px   .padding-bottom-32px
.padding-bottom-40px   .padding-bottom-56px   .padding-bottom-80px
.padding-bottom-104px  .padding-bottom-192px

/* Top padding */
.padding-top-4px    .padding-top-8px    .padding-top-12px
.padding-top-16px   .padding-top-24px   .padding-top-32px
.padding-top-40px   .padding-top-56px   .padding-top-80px
.padding-top-104px  .padding-top-192px

/* Bottom margin */
.margin-bottom-4px    .margin-bottom-8px    .margin-bottom-12px
.margin-bottom-16px   .margin-bottom-24px   .margin-bottom-32px
.margin-bottom-40px   .margin-bottom-56px   .margin-bottom-80px
.margin-bottom-104px  .margin-bottom-192px

/* Top margin */
.margin-top-4px    .margin-top-8px    .margin-top-12px
.margin-top-16px   .margin-top-24px   .margin-top-32px
.margin-top-40px   .margin-top-56px   .margin-top-80px
.margin-top-104px  .margin-top-192px
```

### Usage

```tsx
// Good
<div className="padding-bottom-16px">
<div className="margin-top-24px">

// Bad - arbitrary value
<div style={{ paddingBottom: '14px' }}>

// Bad - not in the system
<div className="pb-3">  // This isn't a real class
```

---

## Colors

### Palette

```css
/* Teal scale (dark theme background/text) */
--teal-100: #e3e5e6 /* Lightest */ --teal-200: #c6cccc --teal-300: #aab2b3
  /* Common text color */ --teal-400: #8e999a /* Muted text */
  --teal-500: #717f80 --teal-600: #556667 /* Borders */ --teal-700: #394c4e
  /* Darker borders */ --teal-750: #2a3f41 --teal-800: #1c3334
  /* Card backgrounds */ --teal-850: #0e2628 /* Hover states */
  --teal-900: #00191b /* Page background */ /* Accent colors */
  --bright-teal-300: #a6dad9 /* Links, highlights */ --bright-teal-500: #6cbdbb
  /* Primary accent */ /* Base */ --white: white;
```

### Available Classes

```css
/* Text colors - full teal scale */
.color-teal-100   .color-teal-200   .color-teal-300   .color-teal-400
.color-teal-500   .color-teal-600   .color-teal-700   .color-teal-750
.color-teal-800   .color-teal-850   .color-teal-900

/* Text colors - accent */
.color-bright-teal-300   .color-bright-teal-500
.color-light-teal        .color-teal          /* aliases for bright-teal-300 */

/* Text colors - base */
.color-white

/* Background colors - full teal scale */
.bg-teal-100   .bg-teal-200   .bg-teal-300   .bg-teal-400
.bg-teal-500   .bg-teal-600   .bg-teal-700   .bg-teal-750
.bg-teal-800   .bg-teal-850   .bg-teal-900

/* Background colors - accent */
.bg-bright-teal-300   .bg-bright-teal-500

/* Background colors - base */
.bg-white
```

### Usage

```tsx
// Good - use the variable
background-color: var(--teal-800);

// Good - use the class
<p className="color-teal-300">

// Bad - hardcoded hex
background-color: #1c3334;

// Bad - arbitrary color
color: #3a7b8c;
```

---

## Typography

### Headings

Already styled globally. Just use the tags:

```tsx
<h1>  // 72px, weight 400, tight letter-spacing
<h2>  // 28px, weight 300
<h3>  // 22px, weight 300
```

### Paragraph Variants

```css
.paragraph-small        /* 15px */
.paragraph-small-bold   /* 15px, weight 600 */
.paragraph-xs           /* 13px */
.paragraph-xs-bold      /* 13px, weight 600 */
.paragraph-default-bold /* 16px, weight 600 */
```

### Font

Inter only. Already set up via next/font.

---

## Borders & Shadows

### Border Radius

```css
/* Standard values used in the codebase */
4px   - small elements (icons, checkboxes)
8px   - buttons
16px  - cards
20px  - pills/nav items
24px  - large buttons
```

### Shadows

```css
.drop-shadow       /* Standard card shadow */
.drop-shadow-light /* Subtle shadow */
.drop-shadow-dark  /* Heavier shadow */
```

---

## Layout

### Containers

```css
.content-container  /* Max-width centered container for page content */
.container-default  /* 87.2vw max-width */
```

### Flex Utilities

```css
.flex-gap-8px   /* Flex with 8px gap */
.flex-gap-56px  /* Flex with 56px gap */
.flex-horizontal_center /* Flex, align center */
```

---

## Responsive Breakpoints

```css
@media (max-width: 991px) /* Tablet and below */ @media (max-width: 767px); /* Mobile */
```

### Hide on Mobile

```css
.hide-mobile  /* display: none on mobile */
```

---

## Adding New Styles

### Before adding anything, ask:

1. **Is there already a class for this?** Check globals.css first.
2. **Will this be used in multiple places?**
   - Yes → Add to globals.css
   - No → Add to a .module.css file
3. **Does this value exist in the design system?**
   - No → Don't use it. Pick the nearest allowed value.

### When creating a new utility class:

```css
/* Add to globals.css with clear naming */
.margin-bottom-24px {
  margin-bottom: 24px;
}
```

### When creating a component-specific class:

```css
/* Add to ComponentName.module.css */
.specialCard {
  /* styles specific to this component */
}
```

Then import it:

```tsx
import styles from './ComponentName.module.css'

<div className={styles.specialCard}>
```

---

## Common Mistakes

| Mistake                               | Why it's wrong                 | Fix                                                  |
| ------------------------------------- | ------------------------------ | ---------------------------------------------------- |
| `style={{ padding: 14 }}`             | Arbitrary value                | Use `.padding-bottom-12px` or `.padding-bottom-16px` |
| `className="text-gray-500"`           | Tailwind class (not installed) | Use `.color-teal-400`                                |
| `color: #aab2b3`                      | Hardcoded hex                  | Use `var(--teal-300)`                                |
| Adding `.card-special` to globals.css | Used in one place              | Put in a .module.css file                            |

---

## Quick Reference Card

```
SPACING:     4  8  12  16  24  32  40  56  80  104  192 (px)
COLORS:      --teal-100 to --teal-900, --bright-teal-300/500
TYPOGRAPHY:  h1/h2/h3, .paragraph-small, .paragraph-xs
RADIUS:      4  8  16  20  24 (px)
BREAKPOINTS: 991px (tablet), 767px (mobile)
```
