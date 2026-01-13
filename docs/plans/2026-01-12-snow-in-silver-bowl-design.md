# Snow in a Silver Bowl: Site Redesign

A visual redesign guided by the Zen aesthetic of Yugen - subtle, profound beauty through restraint and emptiness.

## Guiding Principle

"Snow in a silver bowl" - content that reveals itself against generous emptiness. The bowl (whitespace, structure) holds the snow (content) without competing with it. What is suggested rather than stated.

## Color Palette

| Role | Value | Description |
|------|-------|-------------|
| Background | `#FAF9F6` | Warm cream, aged laid paper |
| Primary text | `#3D3833` | Deep warm gray, settled ink |
| Secondary text | `#7D766D` | Soft gray for metadata |
| Borders/accents | `#D4D0C8` | Silver-gray, hairline dividers |
| Divider (subtle) | `#E8E4DD` | Barely visible separator |
| Focus/links | `#5C6B73` | Muted blue-gray |

## Typography

System serif stack for zero loading cost:

```css
font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif;
```

- Body: `1rem` (16px), line-height `1.8`
- Headings: Same family, `font-weight: 600`, line-height `1.3`
- Small text: `0.875rem`, slight positive letter-spacing

## Spacing

Generous whitespace as presence, not absence:

- Max-width: `640px` (unchanged)
- Page padding: `3rem` mobile, `5rem` desktop
- Header to content: `4rem`
- Between sections: `3rem`
- Content to footer: `6rem`

## Elements

### Header

- Site title: Regular weight, `1.125rem`, no decoration
- Navigation: `0.875rem`, `2rem` gaps between links
- No border - whitespace separates from content

### Footer

- Text: `0.8125rem`, secondary gray
- Generous margin above (`6rem`)
- No border

### Links

- Default: No underline, primary text color
- Hover: Subtle underline appears
- Quiet reveal, not state change

### Blockquotes

- Left padding: `1.5rem`
- Left border: `1px solid #D4D0C8`
- Color: Secondary gray
- Style: Italic

### Dividers

- Prefer whitespace over lines
- When needed: `1px solid #E8E4DD`
- No dotted lines

## Reading List

Two states based on whether notes exist:

### Books without notes

- Title + author on single line
- Title in primary text, author in secondary gray
- Compact, quiet presence

### Books with notes

- Same title/author treatment
- Notes below with left indent or margin
- Notes in smaller text (`0.9375rem`), secondary gray
- Optional: faint left border (`2px solid #E8E4DD`)
- Feels like marginalia, not equal content

## Implementation

1. Update `assets/css/main.css`:
   - New CSS variables for palette
   - Typography changes
   - Spacing adjustments
   - Element refinements

2. Update `pages/reading/index.vue`:
   - Structure for two-state hierarchy
   - Classes for notes styling

3. Verify inheritance on other pages:
   - Index (article list)
   - About
   - Uses
   - Article detail pages

## What We're Not Adding

- No JavaScript interactions
- No custom web fonts
- No animations (beyond subtle hover)
- No decorative elements

The restraint is the point.
