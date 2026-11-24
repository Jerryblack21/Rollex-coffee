import { RefObject, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '../lib/motion';

export type VideoStatus = 'loading' | 'ready' | 'failed' | 'static';

interface Options {
  /** false → video is not loaded at all (reduced motion). */
  enabled: boolean;
  /** Called on every scroll update with progress 0‥1 of the hero track. */
  onProgress?: (progress: number) => void;
  /** 0‥1 — how aggressively currentTime chases the scroll target. */
  smoothing?: number;
  /** Play only this window of the video (seconds). `end: null` = full length. */
  clip?: { start: number; end: number | null };
  /** Milliseconds to wait for metadata before giving up. */
  timeoutMs?: number;
}

const HALF_FRAME = 1 / 48; // ≈ half a frame at 24 fps — below this we never seek

/**
 * Maps the scroll progress of `trackRef` onto `video.currentTime`.
 *
 * - Seeks are throttled: at most one in flight (`video.seeking`) and only when the
 *   target differs by more than half a frame → no seek storms, no flicker.
 * - The rAF loop only runs while the track is on screen.
 * - Works backwards too (scroll up → currentTime decreases).
 */
export function useScrollVideo(
  videoRef: RefObject<HTMLVideoElement>,
  trackRef: RefObject<HTMLElement>,
  { enabled, onProgress, smoothing = 0.16, timeoutMs = 10000, clip }: Options,
): VideoStatus {
  const [status, setStatus] = useState<VideoStatus>(enabled ? 'loading' : 'static');
  const clipRef = useRef(clip);
  clipRef.current = clip;
  const progressCb = useRef(onProgress);
  progressCb.current = onProgress;

  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!enabled) {
      setStatus('static');
      return;
    }
    if (!video || !track) return;
    setStatus('loading');

    let disposed = false;
    let duration = 0;
    let target = 0;
    let raf = 0;
    let trigger: ScrollTrigger | null = null;
    let timer = 0;

    const fail = () => {
      if (!disposed) setStatus('failed');
    };

    const tick = () => {
      if (disposed) return;
      const diff = target - video.currentTime;
      if (Math.abs(diff) > HALF_FRAME && !video.seeking) {
        const next = video.currentTime + diff * smoothing;
        video.currentTime = Math.abs(target - next) < HALF_FRAME * 2 ? target : next;
      }
      raf = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMeta = () => {
      window.clearTimeout(timer);
      duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return fail();
      setStatus('ready');
      // Safari/iOS only paints seeked frames once the element has been "primed" by a muted play().
      video.play().then(() => video.pause()).catch(() => undefined);
      const start = Math.max(0, clipRef.current?.start ?? 0);
      const end = Math.min(duration - 0.05, clipRef.current?.end ?? duration - 0.05);
      const toTime = (p: number) => start + p * Math.max(0, end - start);
      video.currentTime = start;

      trigger = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          target = toTime(self.progress);
          progressCb.current?.(self.progress);
        },
        onToggle: (self) => (self.isActive ? startLoop() : stopLoop()),
        onRefresh: (self) => {
          target = toTime(self.progress);
          progressCb.current?.(self.progress);
        },
      });
      if (trigger.isActive) startLoop();
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('error', fail);
    timer = window.setTimeout(() => {
      if (video.readyState < 1) fail();
    }, timeoutMs);
    if (video.readyState >= 1) onMeta();

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      stopLoop();
      trigger?.kill();
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('error', fail);
    };
  }, [enabled, smoothing, timeoutMs, trackRef, videoRef]);

  return status;
}
