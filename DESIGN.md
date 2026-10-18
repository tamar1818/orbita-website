---
version: alpha
name: Webico
description: Webico's design language — a friendly Georgian web studio. White paper, near-black ink, and three soft pastel accents (lilac, lime, pink) used as solid card fills. Round geometry everywhere (24–40px radii, pill buttons), hairline borders instead of heavy shadows, and one signature gesture: buttons lift up-left and leave a hard offset shadow on hover. Headlines are tight and large; body copy is plain, short, and in Georgian.
format: https://github.com/VoltAgent/awesome-design-md

colors:
  ink: "#181818"
  ink-soft: "#33322f"
  muted: "#6b6963"
  muted-light: "#97948c"
  paper: "#ffffff"
  bg-soft: "#f4f4f5"
  bg-dark: "#181818"
  lilac: "#af98f5"      # primary accent
  lime: "#d9f879"
  pink: "#f3bde8"
  on-accent: "#181818"  # text on any accent is always ink
  line: "#18181820"     # hairline, ink at ~12%
  line-strong: "#18181840"
  ok: "#0a7d55"
  danger: "#c02626"

typography:
  display:
    fontFamily: "'Space Grotesk', 'LGV Anastasia 2025 Geo', 'Noto Sans Georgian', system-ui, sans-serif"
    note: Latin glyphs come from Space Grotesk, Georgian falls through to LGV Anastasia.
  base:
    fontFamily: "'Noto Sans Georgian', 'BPG Arial', system-ui, sans-serif"
    fontSize: 17px
  h1: { fontSize: "clamp(2.5rem, 1.5rem + 4.4vw, 5rem)", letterSpacing: "-.04em" }
  h2: { fontSize: "clamp(1.9rem, 1.3rem + 2.5vw, 3.1rem)", lineHeight: 1.06, letterSpacing: "-.04em" }
  h3: { fontSize: "clamp(1.32rem, 1.12rem + .8vw, 1.7rem)", lineHeight: 1.15 }
  button: { fontSize: ".92rem", fontWeight: 700, letterSpacing: ".04em", textTransform: uppercase }
  eyebrow: { fontSize: ".8rem", shape: pill with a lilac dot }

shapes:
  radius-sm: 16px
  radius: 24px
  radius-lg: 28px
  radius-xl: 40px
  radius-pill: 999px

elevation:
  shadow-soft: "0 2px 6px rgba(24,24,24,.04), 0 14px 34px rgba(24,24,24,.07)"
  shadow-lift: "0 6px 14px rgba(24,24,24,.06), 0 22px 50px rgba(24,24,24,.10)"
  button-hover: "2px 5px 0 0 var(--ink)  (lilac on ink buttons, white on lilac backgrounds)"

layout:
  container: 1280px (header 1360px)
  gutter-mobile: 16–20px
---

## Overview

Webico sells websites to small Georgian businesses — salons, cafés, shops, clinics. The site
has to feel approachable and fast, not corporate. Most surfaces are white; colour shows up as
whole pastel blocks (a lilac hero panel, lime and pink cards) rather than as gradients or thin
accents. Everything is rounded. Borders are hairlines (`--line`), and depth comes from the
button gesture and a soft lift on hoverable cards.

Source of truth: `assets/css/style.css` (`:root`). Change tokens there, then update this file.

## Colors

- **Ink `#181818`** — text, primary buttons, dark sections. Never pure black except button hover.
- **Paper `#fff`** — page background. `bg-soft #f4f4f5` alternates sections.
- **Lilac `#af98f5`** — the main accent: hero panel, focus dots, featured price card.
- **Lime `#d9f879`** and **Pink `#f3bde8`** — secondary card fills and highlights.
- Text on any accent is always ink. Muted text (`#6b6963`) only on white/soft backgrounds.

## Typography

Display font for h1–h3, Noto Sans Georgian for everything else. Headlines use negative
tracking and tight line-height. Body is 17px; avoid going below ~.8rem anywhere (labels, eyebrows,
small print). Buttons are uppercase with slight tracking.

## Components

- **Button** (`.btn`): pill, 1px ink border, 16×30 padding. Hover: `translate(-2px,-4px)` +
  hard offset shadow; active presses back. Variants: `--primary` (ink fill), `--ghost`/`--white`
  (white fill), `--light` (transparent), `--sm`, `--block`.
- **Card** (`.card`): 24px radius, 30px padding, hairline border. `--lilac|--lime|--pink`
  fill the card and drop the border. `--link` lifts with `shadow-lift` on hover.
- **Eyebrow** (`.eyebrow`): small pill label above section titles with a lilac dot.
- **Price card** (`.price`): setup fee line, big monthly amount, item list, CTA. Featured
  package uses the lilac fill. Month/year toggle (`.bill-toggle`) is a pill segmented control.
- **Forms**: rounded inputs with hairline borders; radio "cards" for choices in the configurator.

## Do's and Don'ts

- Do use solid pastel blocks; don't add gradients or glassmorphism.
- Do keep corners round (min 16px on containers); don't mix in sharp-cornered boxes.
- Do keep copy short and conversational Georgian; don't write long em-dash-heavy sentences.
- Do keep one primary (ink) button per block; pair it with a ghost button if needed.
- Don't put muted grey text on lilac/lime/pink — use ink.

## Responsive Behavior

Mobile-first at 16px gutters; no horizontal scroll. Header collapses to a burger below ~1040px
and hides the phone text below 1320px. Grids drop to one column on phones; price cards stack
with the featured one first in reading order.
