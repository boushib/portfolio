"use client";

import { motion } from "motion/react";
import { TechLogo } from "./stack/TechLogo";
// import { WaveField } from "./three/Scenes";
import { Reveal, SectionLabel, ease } from "./ui";
import { stack } from "@/lib/data";

export function Stack() {
  return (
    <section id="stack" className="relative overflow-hidden py-24 md:py-32">
      {/* Wave-of-dots background, removed (restore with the WaveField import):
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
        < WaveField />
      </div>
      */}

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel index="04">Toolbox</SectionLabel>
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
            A generalist <span className="font-serif font-normal italic text-muted">with depth.</span>
          </h2>
        </Reveal>
      </div>

      {/* Alternative layout: <ToolboxColumns /> (the four-column list) */}
      <ToolboxSlider />

      {/* "Now · 2026" card, removed for now (restore by uncommenting and re-importing `now`):
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Reveal delay={0.1} className="mt-16 max-w-2xl rounded-3xl border border-line bg-bg/70 p-6 sm:p-7 backdrop-blur-xl md:mt-40 md:p-9">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="size-1.5 animate-pulse rounded-full bg-accent-2" /> Now · 2026
          </div>
          <ul className="mt-6 space-y-4">
            {now.map((n, i) => (
              <li key={n} className="flex gap-4 text-base sm:text-lg">
                <span className="font-mono text-sm leading-7 text-faint">0{i + 1}</span>
                {n}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      */}
    </section>
  );
}

// Card tints match the project accents (Trading Journal blue, Redis red, gzify orange, Eternal purple).
const groupColors: Record<string, string> = {
  Frontend: "#2196f3",
  Backend: "#ef4444",
  Systems: "#f97316",
  "Mobile & AI": "#a855f7",
};

function ToolCard({ group, items }: { group: string; items: string[] }) {
  const c = groupColors[group] ?? "#7c74ff";
  return (
    // Same shell as the project cards: neutral card, accent border + cursor spotlight on hover.
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="group relative w-[82vw] max-w-[380px] shrink-0 overflow-hidden rounded-3xl border border-line bg-elev p-6 transition-colors duration-500 hover:border-[color:var(--c)] sm:w-[380px] md:p-7"
      style={{ ["--c" as string]: `${c}66` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), ${c}26, transparent 60%)` }}
      />

      <div className="relative flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-faint">
        <span>
          {group} <span className="mx-1.5">·</span> {items.length} tools
        </span>
      </div>

      <ul className="relative mt-6 grid grid-cols-2 gap-x-3 gap-y-3">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 items-center gap-2.5 text-sm">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line" style={{ color: c, background: `${c}14` }}>
              <TechLogo name={item} className="size-[18px]" />
            </span>
            <span className="leading-tight text-muted transition-colors group-hover:text-fg">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Category cards drifting in an endless row. */
function ToolboxSlider() {
  return (
    <Reveal className="relative mt-16 flex overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee flex w-max gap-5 pr-5" style={{ ["--duration" as string]: "45s" }}>
        {[...stack, ...stack].map((col, i) => (
          <ToolCard key={i} group={col.group} items={col.items} />
        ))}
      </div>
    </Reveal>
  );
}

/** Previous layout: four labelled columns of logos. */
export function ToolboxColumns() {
  return (
    <div className="mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
      {stack.map((col, ci) => (
        <div key={col.group}>
          <Reveal delay={ci * 0.08}>
            <div className="mb-5 border-b border-line pb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{col.group}</div>
          </Reveal>
          <ul className="flex flex-wrap gap-2 md:flex-col md:items-start">
            {col.items.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, ease, delay: ci * 0.08 + i * 0.05 }}
                whileHover={{ x: 6 }}
                className="flex cursor-default items-center gap-2 rounded-full border border-line bg-bg/60 py-1.5 pl-2.5 pr-3.5 text-sm backdrop-blur transition-colors hover:border-accent hover:text-accent md:gap-3.5 md:border-0 md:bg-transparent md:px-0 md:py-1.5 md:text-lg md:backdrop-blur-none"
              >
                <TechLogo name={item} className="h-4 w-6 opacity-85 md:h-[22px] md:w-8" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
