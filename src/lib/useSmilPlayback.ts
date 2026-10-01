"use client";

import { useEffect, useRef } from "react";

/**
 * Runs an SVG's SMIL timeline only while it's on screen.
 * With reduced motion it freezes on a finished frame at `stillAt` seconds instead.
 */
export function useSmilPlayback(stillAt = 4.2) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svg.setCurrentTime(stillAt);
      svg.pauseAnimations();
      return;
    }
    svg.pauseAnimations();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
    io.observe(svg);
    return () => io.disconnect();
  }, [stillAt]);

  return ref;
}
