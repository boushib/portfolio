"use client";

import { useSmilPlayback } from "@/lib/useSmilPlayback";

/*
 * Matching stat badges: the same glowing rounded tile and 2px two-tone line style for every
 * icon, each with a couple of small looping motions (SMIL, like the project illustrations).
 */

const line = {
  fill: "none",
  className: "stroke-accent",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const tint = { className: "fill-accent", fillOpacity: 0.16 } as const;

/** 10+ years: a clock face whose outer ring fills while the minute hand sweeps. */
function Years() {
  return (
    <>
      <circle cx="32" cy="32" r="17" {...tint} />
      <circle cx="32" cy="32" r="17" {...line} strokeOpacity="0.25" />
      <circle cx="32" cy="32" r="17" {...line} pathLength="100" strokeDasharray="0 100" transform="rotate(-90 32 32)">
        <animate attributeName="stroke-dasharray" dur="4s" repeatCount="indefinite" values="0 100;100 0;100 0" keyTimes="0;0.85;1" />
      </circle>
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M32 19.5v2" {...line} strokeWidth="1.4" strokeOpacity={i % 3 ? 0.35 : 0.8} transform={`rotate(${i * 30} 32 32)`} />
      ))}
      <path d="M32 32l-5-3" {...line} />
      <path d="M32 32V22.5" {...line}>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="4s" repeatCount="indefinite" />
      </path>
      <circle cx="32" cy="32" r="2" className="fill-accent" />
    </>
  );
}

/** 12 languages: an editor window with breathing code brackets and a blinking cursor. */
function Code() {
  return (
    <>
      <rect x="13" y="16" width="38" height="32" rx="6" {...tint} />
      <rect x="13" y="16" width="38" height="32" rx="6" {...line} />
      <path d="M13 23h38" {...line} strokeOpacity="0.35" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={18 + i * 4} cy="19.5" r="1" className="fill-accent" fillOpacity="0.7" />
      ))}
      <path d="M26 30l-4.5 5 4.5 5" {...line}>
        <animateTransform attributeName="transform" type="translate" values="0 0;-1.5 0;0 0" dur="2.2s" repeatCount="indefinite" />
      </path>
      <path d="M36 30l4.5 5-4.5 5" {...line}>
        <animateTransform attributeName="transform" type="translate" values="0 0;1.5 0;0 0" dur="2.2s" repeatCount="indefinite" />
      </path>
      <path d="M33.2 28.5l-2.4 13" {...line} />
      <rect x="44" y="37.5" width="2" height="6" rx="1" className="fill-accent">
        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes="0;0.5" />
      </rect>
    </>
  );
}

/** 3 spoken languages: two overlapping speech bubbles, one typing. */
function Speech() {
  return (
    <>
      <path d="M22 14h16a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-2v4l-5-4h-9a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5Z" {...tint} />
      <path d="M22 14h16a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-2v4l-5-4h-9a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5Z" {...line} strokeOpacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -1;0 0" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M27 26h17a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-8l-6 5v-5h-3a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5Z" className="fill-bg" />
      <path d="M27 26h17a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-8l-6 5v-5h-3a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5Z" {...line} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={29.5 + i * 6} cy="34.5" r="1.8" className="fill-accent">
          <animate attributeName="cy" dur="1.2s" begin={`${i * 0.15}s`} repeatCount="indefinite" values="34.5;32;34.5;34.5" keyTimes="0;0.2;0.4;1" />
        </circle>
      ))}
    </>
  );
}

/** 14 five-star reviews: a star with a pulsing fill and twinkling sparkles. */
function Stars() {
  const star = "M30 17l4.1 8.4 9.3 1.35-6.7 6.55 1.6 9.2L30 38.1l-8.3 4.4 1.6-9.2-6.7-6.55 9.3-1.35Z";
  const sparkle = (x: number, y: number, s: number, begin: string) => (
    <path
      d={`M${x} ${y - s}q.6 ${s - 0.6} ${s} ${s}q-${s - 0.6} .6-${s} ${s}q-.6-${s - 0.6}-${s}-${s}q${s - 0.6}-.6 ${s}-${s}Z`}
      className="fill-accent"
      opacity="0"
    >
      <animate attributeName="opacity" dur="2.4s" begin={begin} repeatCount="indefinite" values="0;1;0;0" keyTimes="0;0.2;0.45;1" />
    </path>
  );
  return (
    <>
      <path d={star} className="fill-accent" fillOpacity="0.16">
        <animate attributeName="fill-opacity" dur="2.4s" repeatCount="indefinite" values="0.16;0.75;0.16" />
      </path>
      <path d={star} {...line} />
      {sparkle(46, 18, 4, "0s")}
      {sparkle(48, 44, 3, "0.8s")}
      {sparkle(15, 43, 2.5, "1.5s")}
    </>
  );
}

const visuals = [Years, Code, Speech, Stars];

export function StatVisual({ index, className = "" }: { index: number; className?: string }) {
  const ref = useSmilPlayback(1.4);
  const Scene = visuals[index % visuals.length];
  const glow = `stat-glow-${index}`;
  return (
    <svg ref={ref} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <radialGradient id={glow} cx="50%" cy="35%" r="70%">
          <stop offset="0" className="[stop-color:var(--accent)]" stopOpacity="0.22" />
          <stop offset="1" className="[stop-color:var(--accent)]" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="16" fill={`url(#${glow})`} />
      <rect x="1" y="1" width="62" height="62" rx="16" fill="none" className="stroke-accent" strokeOpacity="0.28" />
      <Scene />
    </svg>
  );
}
