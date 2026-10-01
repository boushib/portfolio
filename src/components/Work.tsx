"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowIcon, Reveal, SectionLabel } from "./ui";
import { ProjectVisual } from "./work/Illustrations";
import { projects, type Project } from "@/lib/data";

function Card({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 20 });
  const px = useTransform(mx, (v) => `${v * 100}%`);
  const py = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${px} ${py}, ${project.accent}26, transparent 60%)`;

  const Wrapper = project.href ? "a" : "div";

  return (
    <Reveal delay={(index % 2) * 0.12} className="[perspective:1200px]">
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="group relative h-full"
      >
        <Wrapper
          {...(project.href ? { href: project.href, target: "_blank", rel: "noreferrer" } : {})}
          className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-elev p-7 transition-colors duration-500 hover:border-[color:var(--c)] md:p-9"
          style={{ ["--c" as string]: `${project.accent}66` }}
        >
          <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: spotlight }} />

          <div className="relative flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
              {project.kind} <span className="mx-1.5">·</span> {project.year}
            </div>
            {project.href && (
              <span className="grid size-10 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-fg group-hover:text-bg">
                <ArrowIcon className="size-4" />
              </span>
            )}
          </div>

          <div
            className="relative my-7 aspect-[400/220] w-full overflow-hidden rounded-2xl border border-line bg-bg/60 transition-[border-color] duration-500 group-hover:border-[color:var(--c)]"
            style={{ transform: "translateZ(20px)" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: `radial-gradient(60% 70% at 50% 45%, ${project.accent}1f, transparent 70%)` }}
            />
            <div className="hairline-grid pointer-events-none absolute inset-0 opacity-50 [background-size:24px_24px]" />
            <div className="relative size-full p-2 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
              <ProjectVisual project={project} />
            </div>
          </div>

          <div className="relative mt-auto" style={{ transform: "translateZ(30px)" }}>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{project.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full bg-fg/[0.05] px-3 py-1 font-mono text-xs text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Wrapper>
      </motion.div>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <SectionLabel index="03">Selected work</SectionLabel>
      <div className="flex flex-col gap-5">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
            Things I&apos;ve <span className="font-serif font-normal italic text-gradient">made</span>, shipped &amp; broken.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-2xl text-muted">
            Client products, fintech tools and deep-dive rebuilds of the systems I use every day.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Card key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
