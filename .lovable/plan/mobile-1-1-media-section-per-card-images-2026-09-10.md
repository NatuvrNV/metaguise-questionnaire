# Mobile: 1:1 media section + per-card images

## Goal
On mobile only:
1. Increase the media (image/video) section in `SplitLayout` to a 1:1 square aspect ratio.
2. Each option card that has an associated image shows that image as a banner above its label text, inside the card.

Desktop layout stays unchanged.

## Changes

### 1. `src/questionnaire/SplitLayout.tsx` — mobile media to 1:1
- Replace `h-[26vh] max-h-[220px]` on the media container with `aspect-square` (1:1) on mobile, keeping the `lg:h-auto lg:max-h-none` desktop behavior.
- This makes the media block as tall as it is wide (~full viewport width) on phones.

### 2. `src/questionnaire/primitives.tsx` — `OptionRow` mobile image banner
- Add a new optional prop `cardImg` to `OptionRow`.
- On mobile (`md:hidden`), render `cardImg` as a full-width banner image at the top of the card, above the label row.
- Restructure the button to `flex-col` on mobile (image on top, label + checkmark below) and `flex-row md:items-center` on desktop (existing layout preserved).
- The existing `thumb` prop (Role step, desktop-only inline thumbnail) stays as-is — `thumbClassName="hidden md:block"` already hides it on mobile.

### 3. Pass `cardImg` from each image-bearing screen
These screens already have per-option image URLs — pass them as `cardImg` to `OptionRow`:

| Screen | File | Options with images |
|---|---|---|
| Step 2 — ProjectType | `screens/ProjectType.tsx` | 8 options, each has `o.img` |
| Step 4 — Role | `screens/Role.tsx` | 6 roles, each has `r.img` (currently passed as `thumb`; also pass as `cardImg`) |
| Step 5 — Scale | `screens/SimpleChoice.tsx` | 5 options, each has `o.img` |
| Step 6 — Aesthetic | `screens/Aesthetic.tsx` | 12 styles, each has `s.img` |
| Step 7 — Timeline | `screens/SimpleChoice.tsx` | 5 options, each has `o.img` |

Steps without per-option images (Welcome, Contact, Engagement, Upload, Vision, Complete) are unaffected.

## Behavior
- **Mobile:** Each option card shows its image as a top banner; the media section shows the selected/hovered option's image at 1:1. No hover needed — tapping a card selects it and updates the media section.
- **Desktop:** No change — inline thumbnails + hover-to-preview in the media section.
