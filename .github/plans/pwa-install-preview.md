# Plan: PWA install and splash screen preview

Status: planned, not yet implemented.

## Why

The WordPress.org review flagged that there is no preview for `theme_color` or
`bg_color`. The earlier round added previews for browser tab, Google search,
and the generated icon shape (which now reflects corner roundness and tile
background). What is still missing is the surface where `theme_color` and
`bg_color` actually show up at runtime: the PWA install prompt and the launch
splash screen on Android.

This plan covers two related preview cards:

1. **Install prompt** — small mock of the Chrome on Android "Add to Home
   screen" sheet. Shows the 192px icon, site name, host, and the install
   button on a sheet that uses `theme_color` for the system bar.
2. **Splash screen** — full-bleed mock of the Android PWA launch screen.
   `bg_color` fills the background, the 512px icon sits centered, and the
   status bar uses `theme_color`.

Both surfaces exist in the real manifest spec (`background_color`,
`theme_color`) so the preview maps 1:1 to the JSON we already write.

## Scope

In scope:

- Two new preview components rendered alongside `BrowserTabPreview` and
  `GoogleSearchPreview` in `AdminFaviconApp.tsx`.
- Reuse of the existing live canvas preview (`useFaviconPreview`) for the
  icon, so changes to padding, corner roundness, and tile background update
  the install prompt and splash in real time.
- Light / dark toggle support via the existing `previewDark` state. Only the
  surrounding chrome changes; `theme_color` and `bg_color` are user-defined
  and used as-is.
- Optional secondary text fields are pulled from `getBloginfo('name')` and
  `window.location.host`. We already have `name` in the manifest writer; the
  preview can reuse `document.title` or read site name from `window` data
  injected by the admin bootstrap.

Out of scope:

- iOS install / splash. iOS uses a different mechanism (separate
  `apple-touch-startup-image` per device size) and is intentionally deferred.
- Editing the manifest fields. Plan only covers preview, not new settings.
- Animation of the splash transition.

## UX layout

Both cards live in the same preview column as the existing previews. Suggested
ordering top to bottom:

1. Browser tab
2. Google search
3. **Install prompt** (new)
4. **Splash screen** (new)

Sizes:

- Install prompt card: roughly 320×220 visual box. Sheet rounded at top, 48px
  icon, two lines of text (site name, host), an "Install" pill button.
- Splash card: roughly 320×420 (phone-ish aspect). Full bg fill, centered
  192px icon, status bar strip at top in `theme_color`.

Both follow the same border / shadow style already used by
`BrowserTabPreview` so the column reads as a coherent set.

## Data inputs

From existing state:

- `themeColor` — fills the install sheet header strip and the splash status
  bar.
- `bgColor` — fills the splash background and the install sheet body.
- `livePreviewUrl` from `useFaviconPreview` — the rendered icon. Use it
  directly so corner roundness, padding, and tile background carry over.
- `sourceUrl` — fallback when `livePreviewUrl` is not yet ready (first
  render).

From the page:

- Site name: read from `window` bootstrap data. `getWindowData()` already
  exposes admin context; extend it to surface `siteName` if not present, or
  fall back to `document.title`.
- Host: `window.location.host` is fine for preview purposes.

No new REST calls. No new options. No backend changes.

## Components

New files:

- `src/components/PwaInstallPreview.tsx`
- `src/components/PwaSplashPreview.tsx`

Each takes:

```ts
interface Props {
    iconUrl: string;     // livePreviewUrl
    themeColor: string;
    bgColor: string;
    siteName: string;
    host: string;
    dark: boolean;       // for the surrounding phone chrome only
}
```

Implementation notes:

- Pure presentational components. No hooks beyond what's needed for layout.
- Use UnoCSS classes consistent with the other preview components.
- Read the icon as an `<img src={iconUrl}>` so it updates when
  `useFaviconPreview` returns a new data URL.
- Provide reasonable contrast on the "Install" button: white on `theme_color`
  if `theme_color` is dark, black on `theme_color` if it is light. A small
  helper `getReadableTextColor(hex)` based on relative luminance is enough.
  Keep the helper local; do not promote until a third surface needs it.

## Wiring in AdminFaviconApp

In `src/components/AdminFaviconApp.tsx`, after `<GoogleSearchPreview />`:

```tsx
<PwaInstallPreview
    iconUrl={livePreviewUrl || sourceUrl}
    themeColor={themeColor}
    bgColor={bgColor}
    siteName={siteName}
    host={window.location.host}
    dark={previewDark}
/>
<PwaSplashPreview
    iconUrl={livePreviewUrl || sourceUrl}
    themeColor={themeColor}
    bgColor={bgColor}
    dark={previewDark}
/>
```

`siteName` source: if `getWindowData()` already returns it (it serializes the
plugin's bootstrap), reuse. Otherwise add `siteName` to the localized data
emitted in `inc/admin.php` via `wp_localize_script`, defaulting to
`get_bloginfo('name')`.

## Acceptance criteria

- Changing the theme color updates both the install sheet header and the
  splash status bar live, with no regenerate required.
- Changing the background color updates both the install sheet body and the
  splash background live.
- Changing padding, corner roundness, or tile background updates the icon in
  both new previews live (because they share `livePreviewUrl`).
- Toggling preview dark mode only changes the surrounding phone chrome, not
  `theme_color` or `bg_color`.
- No new REST calls. No new options. No build size regression beyond the new
  components.
- Manual smoke: pick a vivid theme color (e.g. `#7c3aed`) and a contrasting
  bg color (e.g. `#fff7ed`); the install button text stays readable.

## Risks and unknowns

- Real Android install sheets and splash screens vary by OS version. The
  preview is illustrative, not pixel-perfect. Document this in the section
  helper text under each preview to avoid bug reports about the chrome shape.
- `theme_color` interpretation differs across browsers. Use it for the strip
  exactly as authored; do not try to compute a "darker variant" since that
  hides the user's actual choice.
- `useFaviconPreview` already throttles. Verify two more `<img>` consumers do
  not cause flicker; if they do, memoize the URL once per change instead of
  passing the same data URL through twice.

## Estimate of touched files

- `src/components/PwaInstallPreview.tsx` (new)
- `src/components/PwaSplashPreview.tsx` (new)
- `src/components/AdminFaviconApp.tsx` (wire-up, ~10 lines)
- `src/utils/get-data.ts` and `inc/admin.php` (only if `siteName` is not
  already exposed)

No PHP image processing changes. No manifest schema changes.

## Follow-ups deferred

- iOS startup image preview (`apple-touch-startup-image`). Separate plan.
- Maskable icon safe-zone overlay on the install sheet icon. Roadmap already
  tracks "Maskable icon" as Advanced.
- Configurable `display`, `orientation`, and `start_url` fields. Roadmap
  already tracks "PWA manifest editor" as Advanced.
