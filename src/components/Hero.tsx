"use client";

// import { useCallback, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
// import { HeroScene } from "./three/Scenes";
// import { HelmetScene } from "./three/Scenes";
// import { HeroDiagram } from "./HeroDiagram";
// import { TrainingVisual } from "./work/Illustrations";
import { HeroSceneCycle } from "./hero/HeroScenes";
import { ArrowIcon, Magnetic, ease } from "./ui";
import { profile } from "@/lib/data";

function SplitLine({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: "110%", rotate: 8 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease, delay: delay + i * 0.035 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  // Helmet hero (restore with the HelmetScene lines below):
  // const [sceneReady, setSceneReady] = useState(false);
  // const onSceneReady = useCallback(() => setSceneReady(true), []);

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="hairline-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />

      {/* <motion.div
        className="absolute inset-0 md:left-[30%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: sceneReady ? 1 : 0 }}
        transition={{ duration: 1.6, ease, delay: 0.2 }}
      >
        <HeroScene />
        <HelmetScene onReady={onSceneReady} />
      </motion.div> */}

      <motion.div
        className="pointer-events-none absolute inset-x-6 top-24 h-[34svh] md:inset-x-auto md:bottom-24 md:right-10 md:top-28 md:h-auto md:w-[42%] lg:w-[40%]"
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.4, ease, delay: 0.5 }}
      >
        {/* <HeroDiagram className="h-auto w-full max-w-[640px] opacity-60 md:opacity-100" /> */}
        {/* Framed panel version (restore by wrapping the scene in this):
        <div className="relative size-full overflow-hidden rounded-3xl border border-line bg-elev/70 shadow-[0_30px_80px_-30px_var(--glow)] backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_45%,var(--glow),transparent_70%)]" />
          <div className="hairline-grid absolute inset-0 opacity-50 [background-size:24px_24px]" />
        </div>
        Single scenes / earlier heroes:
          <TrainingVisual className="relative size-full p-4 md:p-6" />
          <HeroScene scene="request" className="size-full" />
          <HeroScene scene="pipeline" className="size-full" />
          <HeroScene scene="scale" className="size-full" /> */}
        <HeroSceneCycle className="size-full" />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-16 pt-32 md:justify-center md:px-10 md:py-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="mb-8 inline-flex w-fit items-center gap-2.5 rounded-full border border-line bg-bg/60 px-3 py-1.5 font-mono text-xs text-muted backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {profile.role} at {profile.company} · {profile.location}
        </motion.div>

        <h1 className="text-[clamp(2rem,4.2vw,4.25rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
          <SplitLine text="El Hassane" delay={0.4} />
          <SplitLine text="Boushib" delay={0.7} className="font-serif font-normal italic tracking-[-0.02em] text-gradient" />
        </h1>

        <div className="mt-10 flex max-w-xl flex-col gap-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.3 }}
            className="max-w-md text-sm leading-relaxed text-muted md:text-base"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.45 }}
            className="pointer-events-auto flex items-center gap-3"
          >
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg"
              >
                See my work
                <ArrowIcon className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-line bg-bg/50 px-6 py-3.5 text-sm font-medium backdrop-blur transition-colors hover:border-fg"
              >
                Get in touch
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-faint md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-fg"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
