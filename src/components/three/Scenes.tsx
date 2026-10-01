"use client";

import dynamic from "next/dynamic";

// WebGL only exists in the browser, so the scenes skip prerendering.
// Previous hero: noise-displaced shader orb with particle rings. Swap back in Hero.tsx to restore.
// export const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
export const HelmetScene = dynamic(() => import("./HelmetScene"), { ssr: false });
export const WaveField = dynamic(() => import("./WaveField"), { ssr: false });
