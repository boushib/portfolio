<div align="center">

# El Hassane Boushib — Portfolio

**My personal site: animated system diagrams, a 3D hero, project illustrations and a light/dark theme.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-React_Three_Fiber-000000?logo=threedotjs&logoColor=white)](https://r3f.docs.pmnd.rs)
[![Motion](https://img.shields.io/badge/Motion-animations-FFF312?logo=framer&logoColor=black)](https://motion.dev)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-22C55E)](LICENSE)
<br />
[![Last commit](https://img.shields.io/github/last-commit/boushib/portfolio-2026)](https://github.com/boushib/portfolio-2026/commits/main)
[![Top language](https://img.shields.io/github/languages/top/boushib/portfolio-2026)](https://github.com/boushib/portfolio-2026)
[![Repo size](https://img.shields.io/github/repo-size/boushib/portfolio-2026)](https://github.com/boushib/portfolio-2026)

<img src="docs/screenshots/hero.jpg" alt="Hero with an animated system diagram" width="900" />

</div>

## Screenshots

**About:** animated stat badges, a globe of client countries and a profile card with live New York time

<img src="docs/screenshots/about.jpg" alt="About section" width="100%" />

**Experience:** a timeline of roles

<img src="docs/screenshots/experience.jpg" alt="Experience timeline" width="100%" />

**Work:** each project has its own animated illustration

<img src="docs/screenshots/work.jpg" alt="Work section with project illustrations" width="100%" />

## About

A single-page portfolio built with **Next.js 16** (App Router), **React 19**, **TypeScript** and **Tailwind CSS 4**. The hero cycles through animated system diagrams (a request journey, a deploy pipeline, autoscaling under load), and the 3D scenes run on **Three.js** through React Three Fiber.

The diagrams, stat badges and project illustrations are hand-drawn SVG animated with SMIL. They only play while on screen and hold a finished frame when the OS "reduce motion" setting is on.

## Features

- **Hero:** animated architecture scenes that crossfade in a loop, with live-looking metrics
- **About:** animated stat badges, a client globe and a profile card with local time
- **Experience:** a timeline of roles with tags
- **Work:** project cards, each with a custom animated illustration
- **Stack:** the languages and tools I use, with logos
- **Testimonials** from clients
- **Contact:** a form with topics and validation
- **Light and dark themes**, applied before first paint so the page never flashes the wrong one
- Smooth scrolling (Lenis), section-aware navigation and a reading progress bar

## Getting started

Requires Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` | ESLint |

Content (profile, experience, projects, testimonials) lives in `src/lib/data.ts`.

> The contact form validates and shows its sent state, but isn't connected to a backend yet. Wire `submitContact` in `src/lib/contact.ts` to an API route or a form service to receive messages.

## Project structure

```
src/
  app/                 Layout, global styles and the home page
  components/          Sections: Hero, About, Experience, Work, Stack, Testimonials, Contact
  components/hero/     Animated architecture scenes
  components/work/     Project illustrations
  components/about/    Stat badges and About layouts
  components/three/    3D scenes (React Three Fiber)
  lib/                 Site data and hooks (theme, in-view, SMIL playback, local time)
public/                Photos, logos, flags, 3D models and the HDR environment
```

## License

[MIT](LICENSE) © El Hassane Boushib
