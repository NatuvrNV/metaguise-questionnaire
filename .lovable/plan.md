## Metaguise Interactive Questionnaire — Build Plan

### Visual System
- **Palette** (tokens in `src/styles.css`, oklch):
  - `--background` deep charcoal `#0B0B0C`
  - `--card` `#121214`
  - `--foreground` crisp white
  - `--accent` safety orange `#FF5A1F` (active/selected states, progress fill)
  - `--accent-secondary` champagne gold `#C9A961` (hairlines, metallic highlights)
  - `--border` subtle warm gray
- **Typography**: Display serif (Instrument Serif) for headlines + clean sans (Inter) for UI/body — luxury editorial pairing.
- **Motion**: Framer Motion for page transitions (fade + subtle slide), image cross-fades on option hover, progress bar fill animation.

### Architecture
- Single route `/` (the funnel is one app shell, not separate URLs — preserves state, smooth transitions). Completion screen and welcome are screens within same flow.
- Global state via React Context (`QuestionnaireContext`): `currentStep`, `answers` object, `setAnswer`, `next`, `prev`. Persisted to `localStorage` so refresh doesn't lose progress.
- Components:
  - `QuestionnaireLayout` — persistent header (logo · progress bar · step counter · Help/Exit), wraps all screens
  - `SplitScreen` — left content / right image pane with motion image swap
  - `OptionCard`, `FloatingInput`, `FacadeStyleTile`, `FileDropzone`
  - `screens/` folder with one file per step (Welcome, ProjectType, Contact, RoleAesthetic, Scale, Timeline, Engagement, Upload, Vision, Complete)

### Screen Behaviors
1. **Welcome** — full-bleed hero left, cinematic facade image right, scrolling monochrome logo strip below subhead.
2. **Project Type** — 8 option pills left; right pane image swaps per typology on hover, locks on select.
3. **Contact** — 3 floating-label inputs, zod validation, Continue disabled until valid.
4. **Role + Aesthetic** — role pills on top; 2×3 facade-style grid below with hover preview + click select.
5. **Scale** — 4 large option cards with sqft ranges, subtle icon per tier.
6. **Timeline** — 5 stacked options.
7. **Engagement** — multi-select with checkbox affordance, selected state in accent orange.
8. **Upload** — drag-and-drop zone (HTML5 DnD, no backend — files held in state), "Skip" link.
9. **Vision** — large textarea, character counter, "Submit Project Brief" CTA.
10. **Completion** — full-screen, looping cinematic background video (placeholder mp4 or animated gradient fallback), headline + WhatsApp + Portfolio CTAs.

### Imagery
- Generate ~10 architectural facade images (one per project typology + 6 facade styles + hero + completion) using premium image gen, save to `src/assets/`.

### Header & Progress
- Slim sticky header. Progress bar: thin track with orange fill animating to `(currentStep)/10`. "Step X of 10" right-aligned. Back chevron when step > 1.

### Mobile
- Split-screen collapses to stacked: content first, image becomes a 16:9 banner above. Header compresses, progress bar remains full-width.

### Out of Scope (not requested)
- No backend submission (form data logged to console on submit; no Lovable Cloud, no email). Can be added later.
- No auth, no analytics.

### Tech Notes
- TanStack Start route `src/routes/index.tsx` renders `<QuestionnaireApp />`.
- Update `__root.tsx` head meta (title: "Metaguise — Begin Your Facade Journey").
- Install: `framer-motion`, `zod`, `react-hook-form`, `@hookform/resolvers`.
