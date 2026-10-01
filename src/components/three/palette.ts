import { Color } from "three";
import type { Theme } from "@/lib/useTheme";

// Mirrors the CSS tokens in globals.css so the WebGL scenes match the page.
export const palettes = {
  light: { a: "#4f46e5", b: "#0ea5b7", c: "#f0613a", base: "#f5f4ef", ink: "#0c0c0e" },
  dark: { a: "#8b85ff", b: "#34d8e8", c: "#ff7a55", base: "#07070a", ink: "#f2f2f4" },
} as const;

export const colorsFor = (theme: Theme) => {
  const p = palettes[theme];
  return {
    a: new Color(p.a),
    b: new Color(p.b),
    c: new Color(p.c),
    base: new Color(p.base),
    ink: new Color(p.ink),
  };
};
