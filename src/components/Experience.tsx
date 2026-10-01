"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal, SectionLabel } from "./ui";
import { experience } from "@/lib/data";

// One hue per role, stepping smoothly through a cool spectrum (violet → emerald) from newest to oldest.
const hues = experience.map((_, i, all) => Math.round(265 - (i / Math.max(all.length - 1, 1)) * 110));
const lineGradient = `linear-gradient(to bottom, ${hues.map((h) => `hsl(${h} var(--role-s) var(--role-l))`).join(", ")})`;

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <SectionLabel index="02">Experience</SectionLabel>
      <Reveal>
        <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
          Where I&apos;ve been <span className="font-serif font-normal italic text-muted">building.</span>
        </h2>
      </Reveal>

      <ol ref={ref} className="relative mt-20 ml-2 md:ml-[15rem]">
        <span className="absolute left-0 top-0 h-full w-px bg-line" />
        <motion.span
          className="absolute left-0 top-0 h-full w-px origin-top"
          style={{ scaleY, backgroundImage: lineGradient }}
        />

        {experience.map((job, i) => (
          <li
            key={`${job.company}-${job.role}`}
            className="role relative pb-20 pl-10 last:pb-0 md:pl-14"
            style={{ ["--h" as string]: hues[i] }}
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-30% 0px" }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="absolute -left-[7px] top-2 size-[15px] rounded-full border-2 border-bg bg-[color:var(--role)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--role)_28%,transparent)]"
            />
            <Reveal delay={0.05 * i}>
              <div className="md:absolute md:-left-[17.5rem] md:top-1 md:w-[12rem] md:text-right">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--role)]">{job.period}</div>
                <div className="mt-1 text-sm text-faint">{job.location}</div>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight md:mt-0 md:text-3xl">{job.company}</h3>
              <div className="mt-1 text-muted">{job.role}</div>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted">{job.summary}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <li key={t} className="rounded-full border border-[color:color-mix(in_oklab,var(--role)_35%,transparent)] px-3 py-1 font-mono text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>

      {/* Education block, removed (restore by uncommenting and importing `education`):
      <div className="mt-24 md:ml-[15rem]">
        <Reveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">Education</div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.08} className="rounded-2xl border border-line p-6">
              <div className="text-lg font-semibold tracking-tight">{e.school}</div>
              <div className="mt-1 text-sm text-muted">{e.degree}</div>
            </Reveal>
          ))}
        </div>
      </div>
      */}
    </section>
  );
}
