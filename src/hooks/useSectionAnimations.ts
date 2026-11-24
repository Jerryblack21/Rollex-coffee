import { RefObject, useLayoutEffect } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Declarative scroll animations for a section. Opt in with data attributes:
 *   data-words              heading split by <SplitHeading/>: staggered word reveal
 *   data-reveal             fade/slide up once
 *   data-stagger            children fade/slide up in sequence
 *   data-parallax="0.12"    vertical drift scrubbed to scroll
 *   data-tilt               subtle scrubbed rotation + scale (images)
 * Everything lives in a gsap.context and is reverted on unmount.
 */
export function useSectionAnimations(scope: RefObject<HTMLElement>): void {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-words]').forEach((h) => {
        gsap.from(h.querySelectorAll('.word-inner'), {
          yPercent: 115,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: h, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((parent) => {
        gsap.from(parent.children, {
          y: 46,
          opacity: 0,
          scale: 0.97,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { each: 0.05, from: 'start' },
          scrollTrigger: { trigger: parent, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax ?? '0.1');
        gsap.fromTo(
          el,
          { yPercent: amount * 100 },
          {
            yPercent: -amount * 100,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        gsap.fromTo(
          el,
          { rotate: -3, scale: 1.05 },
          {
            rotate: 3,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [scope]);
}
