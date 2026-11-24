# ROLLEX COFFEE — scroll-controlled cinematic website

React 18 · TypeScript · Vite 5 · Tailwind 3 · GSAP ScrollTrigger · React Three Fiber · Framer Motion · Lucide

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to ./dist
npm run preview    # serve the production build
```

Requires Node 18+.

## How the scroll-controlled video works

`src/components/ScrollVideoHero.tsx` renders a 520svh-tall track with a `position: sticky` full-viewport stage
(no pin-spacer, so it never conflicts with other ScrollTriggers). `src/hooks/useScrollVideo.ts` maps the track's
scroll progress to `video.currentTime`:

* scroll down → plays forward, scroll up → plays backward
* seeks are throttled (never while `video.seeking`, never for < ½ frame) and eased, so there are no seek storms
* the rAF loop only runs while the hero is on screen
* poster image sits under the video and is the fallback if the video fails, times out (10 s) or is blocked
* `prefers-reduced-motion`: the video is not downloaded; a static hero is shown
* mobile (≤ 768 px) loads `rollex-coffee-mobile.mp4`; desktop loads `rollex-coffee.mp4` (only one is ever requested)

### Replace the video

Put your file in `public/videos/`. **Scrubbing needs a video where every frame is a keyframe**, otherwise seeking is slow
and choppy. Re-encode any source with:

```bash
ffmpeg -i source.mp4 -an -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 24 -g 1 -keyint_min 1 \
  -pix_fmt yuv420p -movflags +faststart public/videos/rollex-coffee.mp4
ffmpeg -i source.mp4 -an -vf "scale=720:-2"  -c:v libx264 -preset slow -crf 26 -g 1 -keyint_min 1 \
  -pix_fmt yuv420p -movflags +faststart public/videos/rollex-coffee-mobile.mp4
ffmpeg -i source.mp4 -frames:v 1 -vf scale=1280:-2 -c:v libwebp -quality 80 public/images/hero-poster.webp
```

Paths live in `src/config/assets.ts`. To play only part of the film set `VIDEO_CLIP` there (seconds), e.g. `{ start: 0, end: 2.4 }`.
The chapter captions in `ScrollVideoHero.tsx` (`CHAPTERS`, keyed by scroll progress) should be adjusted if you trim or replace the clip.

> **Heads-up about the supplied video:** it is a website *concept* and has a mock-up menu UI baked into the pixels from about
> 2 s to 13 s (garbled text and placeholder prices such as ₹139/₹390 that do not match your real menu). Pixels cannot be edited from code.
> Before launch either (a) use `VIDEO_CLIP` to show only the clean parts (0–≈1.8 s and ≈13.5–14.9 s), or (b) re-export the film
> without the UI cards.

## Edit content

| What | Where |
| --- | --- |
| Every product, price, category | `src/data/menu.ts` (single source; all sections + the tabbed menu read from it) |
| Address, phone, hours, Maps link/embed, socials | `src/config/site.ts` (empty values show clear placeholders) |
| Images | `public/images/*.webp`, referenced in `src/config/assets.ts` |
| Colours / fonts | `tailwind.config.js` |

Images: `bun`, `burger`, `milkshake`, `sandwich`, `coffee-glass`, `cafe` were cropped from the supplied video so they match your brand.
Replace them with real photographs of your food and café (same file names, ~720 px wide WebP). Momos and juice use vector illustrations until you add photos.

## Animation system

* `useSectionAnimations` — declarative `data-words`, `data-reveal`, `data-stagger`, `data-parallax`, `data-tilt` attributes, all inside `gsap.context` and reverted on unmount.
* `CoffeeExperience` — scrubbed pour (tumbler lifts, stream draws, steam rises) + lazy WebGL bean field (Three.js, instanced meshes). WebGL mounts only near the viewport, pauses off-screen, is skipped without WebGL or with reduced motion, and is wrapped in an error boundary.
* `BurgerAssembly` — seven separate SVG layers (bun, patty, cheese, extra cheese, tomato, lettuce, top bun) scrubbed into place; reversible. "Add Cheese +₹10" toggles the extra layer and updates the listed prices.
* All pinned-style stages use CSS `sticky` tracks, not `pin: true`, so there are no pin-spacer conflicts.

## Structure

```
src/
  components/  Navbar, ScrollVideoHero, CoffeeExperience, BeanField, ProductSection, BurgerAssembly,
               MenuGrid, Favourites, AboutSection, VisitSection, Footer, ItemCard, ProductArt, Particles, SplitHeading, ErrorBoundary
  data/menu.ts   config/assets.ts, site.ts   hooks/useScrollVideo.ts, useSectionAnimations.ts, useReducedMotion.ts   lib/motion.ts, scroll.ts
public/videos/  public/images/
```

## Deploy

`npm run build` → upload `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3). `base: './'` keeps paths relative.
Serve videos with HTTP range support (all of the above do).
