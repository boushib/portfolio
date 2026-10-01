"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScroll } from "motion/react";
import { Word, statement } from "../About";
import { Counter, Reveal, SectionLabel } from "../ui";
import { StatVisual } from "./StatVisuals";
import { useSmilPlayback } from "@/lib/useSmilPlayback";
import { useNycTime } from "@/lib/useNycTime";
import { stats } from "@/lib/data";

/*
 * Three alternative About sections to compare. Pick one in app/page.tsx.
 */

const words = statement.flatMap((seg) => seg.t.split(" ").map((w) => ({ w, hi: !!seg.hi })));
const mono = { fontFamily: "var(--font-geist-mono), monospace" } as const;
const kt = (...t: number[]) => t.map((v) => v.toFixed(3)).join(";");

/** The scroll-revealed statement, shared by the variants. */
function Statement({ className }: { className: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  return (
    <p ref={ref} className={className}>
      {words.map(({ w, hi }, i) => (
        <Word key={i} hi={hi} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

/* ─────────────────────────── 1 · Split with profile card ─────────────────────────── */

export function AboutSplit() {
  const time = useNycTime();
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          <SectionLabel index="01">About</SectionLabel>
          <Statement className="text-balance text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.7] tracking-[-0.01em]" />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="rounded-3xl border border-line bg-elev/60 p-4 sm:p-5">
                <div className="text-gradient text-3xl font-semibold tracking-tight md:text-4xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs leading-snug text-muted">{s.label}</div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-3 flex items-center gap-4 rounded-3xl sm:mt-4 border border-line bg-elev/60 p-4 sm:gap-6 sm:p-6">
            <div className="h-24 w-28 shrink-0 sm:h-32 sm:w-48">
              <Globe />
            </div>
            <div>
              <div className="text-2xl font-semibold tracking-tight md:text-3xl">12 countries</div>
              <div className="mt-1 text-sm text-muted">Clients shipped to, from New York to Sydney.</div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="relative mx-auto max-w-sm rounded-3xl border border-line bg-elev p-4 shadow-[0_30px_80px_-30px_var(--glow)]">
            <div className="group/photo relative aspect-[4/5] overflow-hidden rounded-2xl bg-elev">
              <Image
                src="/me.webp"
                alt="El Hassane Boushib"
                fill
                sizes="(min-width: 768px) 384px, 90vw"
                className="object-cover object-[50%_35%] transition-transform duration-700 ease-out group-hover/photo:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white">
                <div>
                  <div className="text-lg font-semibold">El Hassane Boushib</div>
                  <div className="text-xs text-white/70">Software Engineer, Applied AI</div>
                </div>
                <div className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] backdrop-blur">NYC</div>
              </div>
            </div>
            <dl className="mt-4 space-y-3 px-1 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Occupation</dt>
                <dd className="flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Applied AI @ Meta
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Local time</dt>
                <dd className="font-mono tabular-nums" suppressHydrationWarning>
                  {time || "—"} <span className="text-faint">ET</span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Speaks</dt>
                <dd className="flex gap-1.5">
                  {["Arabic", "French", "English"].map((l) => (
                    <span key={l} className="rounded-full border border-line px-2 py-0.5 text-xs">
                      {l}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── 2 · Bento grid ─────────────────────────── */

const career = [
  { y: 2016, label: "Independent" },
  { y: 2019, label: "Eternal" },
  { y: 2022, label: "Furniture.com" },
  { y: 2025, label: "Meta · RL" },
  { y: 2026, label: "Meta · AAI" },
];

function CareerLine() {
  const ref = useSmilPlayback(5);
  return (
    <svg ref={ref} viewBox="0 0 160 300" className="size-full text-fg" aria-hidden>
      <line x1="30" x2="30" y1="20" y2="280" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
      <line
        x1="30"
        x2="30"
        y1="20"
        y2="280"
        className="stroke-accent"
        strokeWidth="2"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
      >
        <animate attributeName="stroke-dashoffset" dur="6s" repeatCount="indefinite" values="1;0;0;1" keyTimes="0;0.7;0.95;1" />
      </line>
      {career.map((c, i) => {
        const y = 20 + (i / (career.length - 1)) * 260;
        const at = (i / (career.length - 1)) * 0.7;
        return (
          <g key={c.y}>
            <circle cx="30" cy={y} r="6" className="fill-bg stroke-accent" strokeWidth="2" strokeOpacity="0.4" />
            <circle cx="30" cy={y} r="3" className="fill-accent" opacity="0.25">
              <animate
                attributeName="opacity"
                dur="6s"
                repeatCount="indefinite"
                values="0.25;0.25;1;1;0.25"
                keyTimes={kt(0, Math.max(0, at - 0.01), at + 0.02, 0.95, 1)}
              />
            </circle>
            <text x="46" y={y - 2} fontSize="11" fontWeight="600" fill="currentColor" style={mono}>
              {c.y}
            </text>
            <text x="46" y={y + 11} fontSize="9" fill="currentColor" fillOpacity="0.5" style={mono}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Approximate positions of client countries projected on the globe face.
const countries = [
  [-52, -30],
  [-46, -8],
  [18, -40],
  [8, -34],
  [24, -44],
  [14, -26],
  [30, -30],
  [36, -18],
  [64, 36],
  [-40, 42],
  [44, -6],
  [2, -38],
];

function Globe() {
  const ref = useSmilPlayback(3);
  return (
    <svg ref={ref} viewBox="-110 -80 220 160" className="size-full text-fg" aria-hidden>
      <circle r="72" className="fill-accent" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.2" />
      {[24, 48].map((ry) => (
        <ellipse key={ry} rx="72" ry={ry} fill="none" stroke="currentColor" strokeOpacity="0.1" />
      ))}
      {[0, 1].map((i) => (
        <ellipse key={i} ry="72" rx="40" fill="none" stroke="currentColor" strokeOpacity="0.12">
          <animate attributeName="rx" dur="6s" begin={`${i * 3}s`} repeatCount="indefinite" values="72;0;72" />
        </ellipse>
      ))}
      <path d="M-58 -40 Q-20 -90 18 -40" fill="none" className="stroke-accent" strokeDasharray="3 3" strokeOpacity="0.6" />
      {countries.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.6" className="fill-accent-3" />
          <circle cx={x} cy={y} r="2.6" fill="none" className="stroke-accent-3">
            <animate attributeName="r" dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" values="2.6;9" />
            <animate attributeName="opacity" dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" values="0.8;0" />
          </circle>
        </g>
      ))}
      <circle cx="-58" cy="-40" r="4" className="fill-accent-2" />
      <text x="-50" y="-44" fontSize="8" fill="currentColor" fillOpacity="0.7" style={mono}>
        NYC
      </text>
    </svg>
  );
}

const tile = "relative overflow-hidden rounded-3xl border border-line bg-elev/60 p-6";

export function AboutBento() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">
      <SectionLabel index="01">About</SectionLabel>
      <div className="grid gap-4 md:grid-cols-4 md:grid-rows-[repeat(3,minmax(150px,auto))]">
        <Reveal className={`${tile} flex items-center md:col-span-2 md:row-span-2 md:p-9`}>
          <Statement className="text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.7] tracking-[-0.01em]" />
        </Reveal>
        <Reveal delay={0.08} className={`${tile} md:row-span-2`}>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Journey</div>
          <div className="mt-3 h-[300px] md:h-[calc(100%-1.5rem)]">
            <CareerLine />
          </div>
        </Reveal>
        {stats.slice(0, 2).map((s, i) => (
          <Reveal key={s.label} delay={0.12 + i * 0.06} className={`${tile} flex flex-col justify-between gap-6`}>
            <StatVisual index={i} className="size-12" />
            <div>
              <div className="text-3xl font-semibold tracking-tight">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.1} className={`${tile} flex items-center gap-6 md:col-span-2`}>
          <div className="h-40 w-56 shrink-0">
            <Globe />
          </div>
          <div>
            <div className="text-3xl font-semibold tracking-tight">12 countries</div>
            <div className="mt-1 text-sm text-muted">Clients shipped to, from New York to Sydney.</div>
          </div>
        </Reveal>
        {stats.slice(2).map((s, i) => (
          <Reveal key={s.label} delay={0.14 + i * 0.06} className={`${tile} flex flex-col justify-between gap-6`}>
            <StatVisual index={i + 2} className="size-12" />
            <div>
              <div className="text-3xl font-semibold tracking-tight">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── 3 · Big statement + marquee ─────────────────────────── */

const pillIcons: Record<string, string> = {
  "Meta's Applied AI team": "M4 12c0-3 1.6-6 3.6-6 2.9 0 4.8 12 8.4 12 2 0 4-3 4-6s-2-6-4-6c-3.6 0-5.5 12-8.4 12C5.6 18 4 15 4 12Z",
  "post-trains Meta's AI models.": "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z",
  "Reality Labs": "M3 10a4 4 0 1 0 8 0 4 4 0 1 0-8 0M13 10a4 4 0 1 0 8 0 4 4 0 1 0-8 0M11 10h2",
  "a decade": "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18",
};

const facts = [
  "10+ years building",
  "12 programming languages",
  "Arabic · French · English",
  "14 five-star reviews",
  "12 countries",
  "Meta · Applied AI",
  "Distributed systems",
  "AI & AR",
];

export function AboutStatement() {
  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
        <div className="flex justify-center">
          <SectionLabel index="01">About</SectionLabel>
        </div>
        <Reveal>
          <p className="text-balance text-[clamp(1.4rem,3vw,2.5rem)] font-medium leading-[1.45] tracking-[-0.02em]">
            {statement.map((seg, i) =>
              seg.hi ? (
                <span key={i}>
                  <span className="mx-1 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 align-middle text-[0.8em] text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-[0.9em]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d={pillIcons[seg.t]} />
                    </svg>
                    {seg.t.replace(/\.$/, "")}
                  </span>
                  {seg.t.endsWith(".") && "."}
                </span>
              ) : (
                <span key={i}>{` ${seg.t} `}</span>
              ),
            )}
          </p>
        </Reveal>
      </div>

      <div className="marquee-wrap mt-16 flex overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:mt-24">
        <div className="marquee flex w-max items-center gap-8 pr-8" style={{ ["--duration" as string]: "40s" }}>
          {[...facts, ...facts].map((f, i) => (
            <span
              key={i}
              className="flex items-center gap-8 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-muted md:text-base"
            >
              {f}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
