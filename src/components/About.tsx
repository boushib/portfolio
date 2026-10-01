"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { StatVisual } from "./about/StatVisuals";
import { Counter, Reveal, SectionLabel } from "./ui";
import { stats } from "@/lib/data";

// Segments marked `hi` are the key phrases, picked out in the accent colour.
export const statement: { t: string; hi?: boolean }[] = [
  { t: "I'm a software engineer on" },
  { t: "Meta's Applied AI team", hi: true },
  { t: "in New York, leading a pod that" },
  { t: "post-trains Meta's AI models.", hi: true },
  { t: "Before that I built Meta AI for wearables at" },
  { t: "Reality Labs", hi: true },
  { t: "— and spent" },
  { t: "a decade", hi: true },
  { t: "as a staff engineer for startups and clients on four continents." },
];
const words = statement.flatMap((seg) => seg.t.split(" ").map((w) => ({ w, hi: !!seg.hi })));

export function Word({
  children,
  hi,
  progress,
  range,
}: {
  children: string;
  hi: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const blur = useTransform(progress, range, [4, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.span style={{ opacity, filter }} className={`mr-[0.28em] inline-block ${hi ? "font-medium text-fg" : "text-muted"}`}>
      {children}
    </motion.span>
  );
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">
      <SectionLabel index="01">About</SectionLabel>

      <p
        ref={ref}
        className="max-w-2xl text-balance text-[clamp(1.05rem,1.45vw,1.25rem)] leading-[1.65] tracking-[-0.01em]"
      >
        {words.map(({ w, hi }, i) => (
          <Word key={i} hi={hi} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:mt-16 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="group relative bg-bg p-4 sm:p-5 md:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 transition-colors duration-500 group-hover:from-accent/10 group-hover:to-accent-3/5" />
            <Reveal delay={i * 0.08} className="relative flex items-center gap-4">
              <StatVisual index={i} className="size-12 shrink-0 md:size-14" />
              <div className="min-w-0">
                <div className="text-2xl font-semibold leading-none tracking-tight md:text-3xl">
                  <Counter to={s.value} suffix={s.suffix} from={s.value > 1000 ? 1990 : 0} />
                </div>
                <div className="mt-1.5 text-xs leading-snug text-muted md:text-sm">{s.label}</div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
