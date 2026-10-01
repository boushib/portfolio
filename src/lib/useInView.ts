"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks whether an element is on screen — used to pause WebGL render loops. */
export function useInView<T extends Element>(rootMargin = "100px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}
