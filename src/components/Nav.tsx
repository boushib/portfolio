"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { ThemeToggle } from "./ThemeToggle";
import { ease } from "./ui";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  // Freeze page scroll behind the open mobile menu; close it on Escape or when widening past sm.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = matchMedia("(min-width: 640px)");
    const onMq = () => mq.matches && setOpen(false);
    addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, lenis]);

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-accent via-accent-3 to-accent-2"
      />
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease, delay: 0.6 }}
        className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      >
        <nav className="flex items-center gap-1 rounded-full border border-line bg-bg/70 p-1.5 pl-4 shadow-[0_8px_30px_-12px_var(--glow)] backdrop-blur-xl">
          <a href="#top" className="mr-2 font-serif text-xl italic leading-none">
            EB<span className="text-accent">.</span>
          </a>
          <ul className="hidden items-center sm:flex">
            {links.map((l) => (
              <li key={l.href} className="relative">
                {active === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-fg/[0.07]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <a
                  href={l.href}
                  className={`relative block px-3.5 py-2 text-sm transition-colors ${
                    active === l.href ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-1">
            <ThemeToggle />
          </div>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="ml-1 grid size-9 place-items-center rounded-full bg-fg text-bg sm:hidden"
          >
            <span className="relative block h-3 w-4">
              <motion.span
                className="absolute left-0 top-0 h-[1.5px] w-full rounded bg-current"
                animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-current"
                animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-bg px-6 pb-10 pt-28 sm:hidden"
          >
            <div className="hairline-grid pointer-events-none absolute inset-0 opacity-60" />
            <ul className="relative space-y-2">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={(e) => {
                      // Lenis is paused while the menu is open, so drive the scroll ourselves.
                      e.preventDefault();
                      setOpen(false);
                      lenis?.start();
                      lenis?.scrollTo(l.href, { offset: -40 });
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.05 }}
                    className="flex items-baseline gap-4 py-1 text-5xl font-semibold tracking-[-0.03em]"
                  >
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="relative font-mono text-xs text-muted"
            >
              New York, USA · Applied AI at Meta
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
