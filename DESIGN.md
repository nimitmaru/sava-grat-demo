# Design System: Sava Auto-GRAT Platform

## 1. Creative North Star: "The Architectural Ledger"

This platform handles high-stakes wealth transfer decisions. The design must project **institutional authority** and **quiet confidence** — the visual language of a firm that manages billions, not a SaaS startup. We achieve this through deep chromatic anchoring, editorial typography, and a strict no-line philosophy that replaces borders with tonal layering.

The aesthetic is Swiss-influenced financial editorial: precise, spacious, and intentional. Every pixel earns its place.

---

## 2. Colors & Surface Philosophy

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#001b44` | Sidebar, primary buttons, anchoring elements |
| `primary-container` | `#002f6c` | Active sidebar states, gradient endpoints, overlays |
| `on-primary` | `#ffffff` | Text on primary surfaces |
| `on-primary-container` | `#7999dc` | Muted text on dark surfaces |
| `on-primary-fixed-variant` | `#224583` | Secondary text on primary |
| `primary-fixed` | `#d8e2ff` | Action chips, light primary accents |
| `primary-fixed-dim` | `#aec6ff` | Hover states on primary-fixed |

### Neutral Surfaces

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#fbf9f8` | Page canvas / base layer |
| `surface` | `#fbf9f8` | Equivalent to background |
| `surface-container-lowest` | `#ffffff` | Cards, interactive content modules |
| `surface-container-low` | `#f5f3f3` | Sidebar backgrounds for content sections, table headers |
| `surface-container` | `#efeded` | Subsection backgrounds, divider zones |
| `surface-container-high` | `#eae8e7` | Inactive panels, hover states |
| `surface-container-highest` | `#e4e2e2` | Input tracks, disabled states |
| `surface-dim` | `#dbd9d9` | Empty states, muted areas |
| `surface-bright` | `#fbf9f8` | Emphasized clean areas |
| `on-surface` | `#1b1c1c` | Primary text color (never use pure #000) |
| `on-surface-variant` | `#434750` | Secondary labels, metadata |
| `on-background` | `#1b1c1c` | Body text |

### Signal Colors (functional only — never decorative)

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#006d43` | Success states, positive trends, wealth transferred |
| `secondary-container` | `#75f8b3` | Success backgrounds (pills, badges) |
| `on-secondary-container` | `#007147` | Success text on secondary-container |
| `tertiary-fixed-dim` | `#fbbc00` | Warning states, pending actions, maturing GRATs |
| `tertiary-fixed` | `#ffdfa0` | Warning backgrounds |
| `error` | `#ba1a1a` | Errors, underperforming GRATs, critical alerts |
| `error-container` | `#ffdad6` | Error backgrounds |
| `on-error-container` | `#93000a` | Error text on error-container |

### Outline & Borders

| Token | Hex | Usage |
|-------|-----|-------|
| `outline` | `#747781` | Visible structural outlines (rare) |
| `outline-variant` | `#c4c6d2` | Ghost borders — max 15% opacity |

### The "No-Line" Rule

**Prohibit 1px solid borders for sectioning.** Define structural boundaries through background shifts:
- Place `surface-container-lowest` (#ffffff) cards on `surface-container-low` (#f5f3f3) or `background` (#fbf9f8)
- The subtle shift from warm-white to pure-white creates natural "lift"
- If a border is absolutely required for accessibility, use `outline-variant` at **15% opacity max**
- Table row dividers: use `outline-variant` at **10% opacity** (`border-outline-variant/10`)

### The Glass & Gradient Rule

Hero elements and active navigation use a gradient to add dimensional depth:
- **Direction:** 135deg (top-left to bottom-right)
- **From:** `primary` (#001b44)
- **To:** `primary-container` (#002f6c)
- Use for: hero stat cards, active sidebar items, overlay panels
- For floating modals: `surface-container-lowest` at 80% opacity + `backdrop-blur(20px)`

---

## 3. Typography

### Font Stack

| Role | Family | Weights | Source |
|------|--------|---------|--------|
| **Display & Headlines** | Manrope | 700, 800 | Google Fonts |
| **Body & UI** | Geist Sans | 400, 500, 600 | `next/font/google` (already in project) |
| **Data & Tables** | Geist Mono | 400, 500 | `next/font/google` (already in project) |

**Why Geist over Inter:** Geist is purpose-built for high-density UI — it has a taller x-height than Inter, tighter default letter-spacing, and renders crisper at small sizes on screen. It's already loaded in the Next.js project. We use Manrope only for the big editorial moments (page titles, hero KPIs) where its geometric weight creates visual authority.

### Type Scale

The key to this system is **dramatic contrast** — KPI values should be 5-8x larger than their labels. If everything looks "the same size," the hierarchy is broken.

| Token | Size | Weight | Font | Letter-spacing | Usage |
|-------|------|--------|------|---------------|-------|
| `display-lg` | 3rem / 48px | 800 | Manrope | -0.02em (tight) | Hero KPI on dark gradient cards. Max 1 per page. |
| `display-md` | 2.25rem / 36px | 800 | Manrope | -0.02em | Secondary KPIs, large metric values |
| `headline-lg` | 1.5rem / 24px | 800 | Manrope | -0.01em | Page titles ("Wealth Transfer Summary") |
| `headline-sm` | 1.125rem / 18px | 700 | Manrope | -0.01em | Section/module titles ("Per-Client Performance") |
| `title-md` | 0.9375rem / 15px | 600 | Geist Sans | 0 | Card titles, dialog titles |
| `body-md` | 0.875rem / 14px | 400 | Geist Sans | 0 | Body text, descriptions, table cell text |
| `body-sm` | 0.8125rem / 13px | 400 | Geist Sans | 0 | Secondary body, metadata values |
| `label-lg` | 0.75rem / 12px | 600 | Geist Sans | 0.01em | Inline labels, form field labels |
| `label-md` | 0.6875rem / 11px | 500 | Geist Sans | 0.04em | Metadata, secondary info |
| `label-sm` | 0.625rem / 10px | 700 | Geist Sans | 0.08em | Table column headers, micro-labels (ALWAYS uppercase) |
| `label-xs` | 0.5625rem / 9px | 600 | Geist Sans | 0.06em | Pill text, chart axis labels |
| `mono-md` | 0.875rem / 14px | 500 | Geist Mono | 0 | Financial values in tables, IDs, rates |
| `mono-lg` | 1.125rem / 18px | 500 | Geist Mono | 0 | Inline financial values at medium emphasis |

### Typography Rules

**Weight hierarchy — the 3-tier rule:**
1. **Anchors** (Manrope 800): Page titles and hero KPIs. These are the first thing the eye hits. Use `text-on-surface` (#1b1c1c) or white on dark backgrounds. Negative letter-spacing (-0.02em) at display sizes to keep them tight.
2. **Content** (Geist Sans 400-500): Body text, table cells, descriptions. Use `text-on-surface` for primary, `text-on-surface-variant` (#434750) for secondary.
3. **Labels** (Geist Sans 600-700, small + tracked): Column headers, KPI labels, metadata. These recede visually — always uppercase, wide letter-spacing (0.04-0.08em), and `text-on-surface-variant`. The small size + tracking creates a refined "engraved" look.

**Specific patterns:**
- **KPI blocks:** `label-sm` (uppercase, tracked) sitting above `display-lg` or `display-md`. The label should feel like a whisper; the value should feel like a shout. Minimum 4:1 size ratio between value and label.
- **Table column headers:** `label-sm`, uppercase, `tracking-[0.08em]`, `font-bold`, color `on-surface-variant`. Never sentence case.
- **Financial values in tables:** Use `mono-md` (Geist Mono) for dollar amounts and percentages — the monospace alignment makes columns scannable. Right-align all numerical columns.
- **Unit suffixes** ($, %, M, K, min): Same font as the value but regular weight (400) and one step smaller in size. No space between value and suffix for currency ($4.2M), space for units (24.5 min).
- **Never use pure #000000 for text.** Use `on-surface` (#1b1c1c).
- **Trend indicators:** Use `label-md` weight 600, color `secondary` (#006d43) for positive, `error` (#ba1a1a) for negative. Always prefix with arrow icon, never just +/- text.

---

## 4. Elevation & Depth

Depth comes from light and tonal layering — never from heavy shadows.

### Tonal Layers

| Level | Token | Hex | Usage |
|-------|-------|-----|-------|
| 0 (Base) | `background` | `#fbf9f8` | Page canvas |
| 1 (Section) | `surface-container-low` | `#f5f3f3` | Content regions, table header rows |
| 2 (Card) | `surface-container-lowest` | `#ffffff` | Interactive cards, data modules |
| 3 (Floating) | Glass effect | 80% opacity + blur | Modals, tooltips, overlays |

### Shadow Rules

- **No default CSS shadows.** Tint all shadows with the primary navy.
- **Ambient shadow for floating elements:** `box-shadow: 0 20px 40px rgba(0, 27, 68, 0.06)`
- **Subtle card shadow (optional):** `shadow-sm` — only for primary interactive cards
- **Ghost borders:** `outline-variant` at 15% opacity when a border is required for accessibility

---

## 5. Spacing & Layout

### Spacing Tokens

Use Tailwind's spacing scale. Key tokens for this system:

| Token | Size | Usage |
|-------|------|-------|
| `1.5` | 0.375rem | List item gaps (no dividers) |
| `2` | 0.5rem | Compact internal spacing |
| `3` | 0.75rem | Default component padding |
| `4` | 1rem | Standard gaps |
| `6` | 1.5rem | Content area padding, card padding |
| `8` | 2rem | Section gutters |
| `16` | 4rem | Major functional block separation |
| `20` | 5rem | Hero spacing |

### Layout Structure

```
┌──────────────────────────────────────────────────┐
│ Sidebar (w-64)  │  Main Content                  │
│ bg-primary      │  ┌─────────────────────────────┐│
│                 │  │ Header (h-16)               ││
│ - Logo/Brand    │  │ bg-surface-container-lowest ││
│ - Navigation    │  ├─────────────────────────────┤│
│ - User Profile  │  │ Scrollable Canvas           ││
│                 │  │ bg-background               ││
│                 │  │ p-6 space-y-6               ││
│                 │  │                             ││
│                 │  │ [Content Modules]           ││
│                 │  └─────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

- **Sidebar:** Fixed `w-64`, `bg-primary`, full height
- **Header:** `h-16`, `bg-surface-container-lowest`, bottom border `outline-variant/10`
- **Canvas:** `flex-1 overflow-y-auto p-6 space-y-6 bg-background`
- **Grid:** 12-column grid with `gap-6` for major layouts

### Responsive Grid

- **Metric cards:** `grid-cols-4` on desktop, stack on mobile
- **Split layouts:** `grid-cols-12` — typically 8/4 or 7/5 splits for content + sidebar panels
- **Tables:** Full width, `overflow-x-auto` for mobile

---

## 6. Components

### Sidebar Navigation

```
- bg-primary, full height
- Logo: icon in rounded-lg bg-primary-container + text-xl font-extrabold
- Subtitle: text-[10px] text-on-primary-container uppercase tracking-wider
- Nav items: px-4 py-3 rounded-xl, flex items-center gap-3
  - Active: bg-primary-container text-white
  - Inactive: text-on-primary-container hover:bg-white/5
- User profile: border-t border-white/10, avatar + name + role
```

### Header Bar

```
- h-16, bg-surface-container-lowest
- Left: search input (bg-surface-container-low, rounded-full, no border)
- Center/Right: page title (text-sm font-bold text-primary)
- Far right: notification bell (with error dot), settings icon, user avatar
- Bottom border: border-outline-variant/10
```

### Stat Cards

Two variants:

**Hero Stat (dark gradient):**
```
- bg-gradient-to-br from-primary to-primary-container
- text-white, position relative, overflow-hidden
- Label: font-headline text-[10px] font-bold uppercase tracking-[0.08em] opacity-60
- Large value: font-headline text-5xl font-extrabold tracking-tight -mt-1
  - Unit suffix: text-base font-normal ml-1
- Trend line: text-[11px] font-semibold text-secondary-container mt-2
- Optional sparkline bars at bottom (h-16, flex items-end gap-1)
- Decorative blur circle: absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl
```

**Light Stat:**
```
- bg-surface-container-lowest
- border border-outline-variant/10
- Label: font-body text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant
- Value: font-headline text-4xl font-extrabold text-primary tracking-tight
  - Unit suffix: text-sm font-normal ml-1
- Trend indicator: text-[11px] font-semibold text-secondary, flex items-center gap-1 with trending_up icon
```

### Tables

```
- Container: bg-surface-container-lowest rounded-xl shadow-sm
- Header section: p-6, title (font-headline text-lg font-extrabold text-primary) + subtitle (text-sm text-on-surface-variant), border-b border-outline-variant/10
- Column headers: bg-surface-container-low/50, text-[10px] font-extrabold uppercase tracking-[0.08em] text-on-surface-variant
- Rows: hover:bg-primary-fixed/20 transition-colors
- Row dividers: divide-y divide-outline-variant/10
- Name/text cells: text-sm font-semibold text-on-surface (primary column), text-sm font-medium (secondary)
- Financial values: font-mono text-sm font-medium text-right text-primary (use Geist Mono for aligned columns)
- Percentage/trend values: font-mono text-sm font-bold, text-secondary for positive, text-error for negative
```

### Status Pills

```
- Base: inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight
- Dot: w-1.5 h-1.5 rounded-full (matching signal color)

Variants:
- Active/Success: bg-secondary-container text-on-secondary-container, dot bg-secondary
- Warning/Pending: bg-tertiary-fixed/30 text-on-tertiary-fixed-variant, dot bg-tertiary-fixed-dim
- Error/Critical: bg-error-container text-on-error-container, dot bg-error (animate-ping for live alerts)
- Neutral/New: bg-surface-container-high text-on-surface-variant
```

### Buttons

```
Primary: bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold
Secondary: bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-xl text-sm font-bold
Action chip: bg-primary-fixed text-on-primary-fixed-variant px-3 py-1.5 rounded-lg text-sm font-semibold
```

### Input Fields

```
- bg-surface-container-highest (or surface-container-low for search)
- No border by default
- On focus: ring-2 ring-primary/20 (or bottom stroke transition to primary)
- Search: rounded-full with material icon prefix
- Form inputs: rounded-xl or rounded-lg
```

### Progress Bars

```
- Track: bg-surface-container h-2 rounded-full overflow-hidden
- Fill: bg-primary (default), bg-secondary (success), bg-error (critical)
- Label: text-xs font-bold adjacent to bar
```

### Cards (Content Modules)

```
- bg-surface-container-lowest rounded-xl
- shadow-sm (subtle only)
- No divider lines between internal items — use spacing (gap-3 or space-y-3)
- Header: p-6, title in headline-sm + description in body text
- Separate header from content with border-b border-outline-variant/10 (the one exception to no-line rule)
```

### Glassmorphism Overlays

```
- bg-primary/95 backdrop-blur shadow-2xl
- rounded-xl border border-white/10
- Text: text-on-primary for titles, text-on-primary-container for labels
- Use for: floating legend panels, quick-view overlays, map controls
```

---

## 7. Icons

**Library:** Material Symbols Outlined (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

**Usage:**
- Default: `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`
- Filled (active nav, hero elements): `font-variation-settings: 'FILL' 1`
- Small inline: `text-sm` on the icon span
- Alignment: `vertical-align: middle`

**Key icons for GRAT platform:**
- `dashboard` — Dashboard
- `group` — Clients
- `calculate` — GRAT Modeling
- `analytics` — Reports
- `monitoring` — 7520 Rate Monitor
- `settings` — Settings
- `trending_up` / `trending_down` — Trends
- `schedule` — Annuity schedules
- `autorenew` — Rollovers
- `swap_horiz` — Asset substitution
- `attach_money` — Financial values
- `notifications` — Alerts
- `add` — Create new
- `search` — Search

---

## 8. Data Visualization

- **Sparklines:** Monochromatic (primary) by default. Only use `secondary` (green) or `error` (red) if delta exceeds 10%.
- **Bar charts:** Use `secondary-container` with varying opacity (40-100%) for sparkline bars within stat cards.
- **Line charts:** SVG with `stroke: secondary`, `stroke-width: 2`, no fill.
- **Chart backgrounds:** `surface-container-lowest` with subtle gradient (`surface-container-low` to `background`).
- **Rate chart (7520):** Bar style with current month highlighted in `secondary`, historical bars in `primary-fixed-dim`.

---

## 9. GRAT-Specific Patterns

### GRAT Status Mapping

| Status | Color System | Pill Style |
|--------|-------------|------------|
| Active | secondary system | bg-secondary-container text-on-secondary-container |
| Maturing | tertiary system | bg-tertiary-fixed/30 text-on-tertiary-fixed-variant |
| Pending Rollover | primary system | bg-primary-fixed text-on-primary-fixed-variant |
| Rolled (historical) | neutral | bg-surface-container-high text-on-surface-variant, opacity-60 |
| Underperforming | error system | bg-error-container text-on-error-container |
| New | neutral | bg-surface-container text-on-surface-variant |

### Financial Number Formatting

- **Currency:** Always formatted with $ prefix, comma separators, no decimals for values > $1000: `$4,200,000`
- **Compact currency:** Use suffix for display metrics: `$4.2M`, `$680K`
- **Percentages:** One decimal place: `5.20%`, `+8.3%`
- **Positive trends:** Prefix with `+`, color `secondary`, with `trending_up` icon
- **Negative trends:** Prefix with `-`, color `error`, with `trending_down` icon

### Advisory Signal Cards

```
Favorable: bg-secondary-container/20 border border-secondary/20, text-on-secondary-container
Neutral: bg-surface-container, text-on-surface-variant
Unfavorable: bg-error-container/20 border border-error/20, text-on-error-container
```

---

## 10. Do's and Don'ts

### Do
- **Use white space as structure.** Spacing tokens `16` and `20` between major blocks.
- **Layer surfaces** — always check if a background shift can replace a line.
- **Use Manrope at display scale** for hero KPIs to create editorial gravitas. Manrope is the "voice" — Geist is the "workhorse."
- **Use Geist Mono for financial data** in tables — monospace alignment makes dollar columns scannable.
- **Create dramatic size contrast** — KPI labels at 10px uppercase, values at 36-48px bold. If they look "similar sized," the hierarchy is broken.
- **Use negative letter-spacing on large headlines** (-0.02em) and wide letter-spacing on small labels (0.08em). This contrast is what makes the typography feel premium.
- **Tint shadows with primary navy** — never use default gray shadows.
- **Right-align numerical values** in tables for rapid scanning.
- **Left-align strings** — names, descriptions, labels.

### Don't
- **Never use pure #000000.** Use `on-surface` (#1b1c1c) for text.
- **Never use Inter.** Use Geist Sans for body/UI and Geist Mono for data. Manrope is the only non-Geist font.
- **Never use Manrope for body text.** It's display/headline only. Using it everywhere flattens the hierarchy.
- **Never set labels and values at similar sizes.** Labels should be 2-4x smaller than the values they describe.
- **Never use default CSS box-shadows.** Tint with primary navy at low opacity.
- **Never use 1px solid borders for sectioning.** Background shifts only.
- **Never use large corner radii** on structural elements. Default is `0.125rem`. Use `rounded-xl` only for buttons and interactive elements.
- **Never center-align data in tables.** Left for text, right for numbers.
- **Never use signal colors decoratively.** Green = success. Amber = warning. Red = error. No exceptions.
- **Never use "information blue."** Informational states use `primary` charcoal/navy.

---

## 11. Tailwind Configuration Reference

```js
colors: {
  "on-primary": "#ffffff",
  "surface-variant": "#e4e2e2",
  "on-secondary-fixed-variant": "#005232",
  "primary-container": "#002f6c",
  "on-primary-fixed-variant": "#224583",
  "background": "#fbf9f8",
  "primary-fixed-dim": "#aec6ff",
  "secondary-container": "#75f8b3",
  "surface-dim": "#dbd9d9",
  "tertiary-container": "#412e00",
  "on-secondary-fixed": "#002111",
  "error-container": "#ffdad6",
  "on-error-container": "#93000a",
  "secondary": "#006d43",
  "surface-bright": "#fbf9f8",
  "tertiary": "#271a00",
  "tertiary-fixed-dim": "#fbbc00",
  "surface-container": "#efeded",
  "primary": "#001b44",
  "on-tertiary-container": "#c39100",
  "surface-container-high": "#eae8e7",
  "on-tertiary-fixed": "#261a00",
  "surface": "#fbf9f8",
  "inverse-on-surface": "#f2f0f0",
  "secondary-fixed": "#78fbb6",
  "on-secondary": "#ffffff",
  "surface-container-lowest": "#ffffff",
  "error": "#ba1a1a",
  "on-tertiary-fixed-variant": "#5c4300",
  "on-secondary-container": "#007147",
  "outline-variant": "#c4c6d2",
  "inverse-primary": "#aec6ff",
  "outline": "#747781",
  "surface-container-highest": "#e4e2e2",
  "surface-container-low": "#f5f3f3",
  "on-error": "#ffffff",
  "primary-fixed": "#d8e2ff",
  "secondary-fixed-dim": "#59de9b",
  "on-background": "#1b1c1c",
  "on-surface-variant": "#434750",
  "inverse-surface": "#303030",
  "on-tertiary": "#ffffff",
  "tertiary-fixed": "#ffdfa0",
  "on-primary-container": "#7999dc",
  "surface-tint": "#3c5d9c",
  "on-surface": "#1b1c1c",
  "on-primary-fixed": "#001a42"
},
fontFamily: {
  "headline": ["Manrope", "var(--font-geist-sans)", "sans-serif"],
  "body": ["var(--font-geist-sans)", "sans-serif"],
  "mono": ["var(--font-geist-mono)", "monospace"]
},
letterSpacing: {
  "tightest": "-0.02em",
  "tight": "-0.01em",
  "normal": "0",
  "wide": "0.01em",
  "wider": "0.04em",
  "widest": "0.08em"
},
borderRadius: {
  DEFAULT: "0.125rem",
  lg: "0.25rem",
  xl: "0.5rem",
  full: "0.75rem"
}
```

---

## 12. Scrollbar Styling

```css
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #c4c6d2; border-radius: 10px; }
```
