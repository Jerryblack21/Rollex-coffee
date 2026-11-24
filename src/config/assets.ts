/**
 * Central asset configuration. Replace files in /public (same names) or edit paths here.
 * All paths are resolved against Vite's BASE_URL so the site works on any sub-path.
 */
const base = import.meta.env.BASE_URL;
export const asset = (path: string): string => `${base}${path.replace(/^\//, '')}`;

export const ASSETS = {
  video: {
    desktop: asset('videos/rollex-coffee.mp4'),
    mobile: asset('videos/rollex-coffee-mobile.mp4'),
  },
  poster: asset('images/hero-poster.webp'),
  images: {
    coffeeGlass: asset('images/coffee-glass.webp'),
    bun: asset('images/bun.webp'),
    burger: asset('images/burger.webp'),
    milkshake: asset('images/milkshake.webp'),
    sandwich: asset('images/sandwich.webp'),
    cafe: asset('images/cafe.webp'),
  },
} as const;

/**
 * Portion of the video that scrolling plays, in seconds. `end: null` = until the last frame.
 * Use this to skip any part of the film you don't want shown (e.g. segments that contain baked-in
 * menu cards or prices). Example: { start: 0, end: 2.4 }.
 */
export const VIDEO_CLIP: { start: number; end: number | null } = { start: 0, end: null };
