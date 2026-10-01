"use client";

import { AnimatePresence, motion } from "motion/react";
import { setTheme, useTheme } from "@/lib/useTheme";

export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(dark ? "light" : "dark", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.svg
          key={theme}
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          suppressHydrationWarning
        >
          {dark ? (
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
