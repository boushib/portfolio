export const profile = {
  name: "El Hassane Boushib",
  firstName: "El Hassane",
  role: "Software Engineer, Applied AI",
  company: "Meta",
  location: "New York, USA",
  email: "hello@boushib.com",
  github: "https://github.com/boushib",
  linkedin: "https://www.linkedin.com/in/boushib",
  freelancer: "https://www.freelancer.com/hireme/boushib",
  tagline:
    "10+ years building software — now post-training Meta's AI models. From distributed systems to AI and AR.",
};

export const stats = [
  { value: 10, label: "Years building software", suffix: "+" },
  { value: 12, label: "Programming languages", suffix: "" },
  { value: 3, label: "Languages spoken", suffix: "" },
  { value: 14, label: "Five-star client reviews", suffix: "" },
];

export const experience = [
  {
    company: "Meta",
    role: "Software Engineer, Applied AI",
    period: "May 2026 — Now",
    location: "New York, NY",
    summary:
      "Leading a pod of engineers working on post-training Meta's AI models to improve overall model performance and efficiency.",
    tags: ["AI", "Post-training", "LLMs", "Tech lead"],
  },
  {
    company: "Meta",
    role: "Software Engineer, Reality Labs",
    period: "May 2025 — May 2026",
    location: "New York, NY",
    summary:
      "Worked on Meta AI and wearables — Ray-Ban Meta, Meta Ray-Ban Display, Oakley Meta HSTN and Oakley Meta Vanguard.",
    tags: ["Meta AI", "Wearables", "AR"],
  },
  {
    company: "Furniture.com",
    role: "Staff Software Engineer",
    period: "Oct 2022 — May 2025",
    location: "New York, NY",
    summary:
      "Staff engineer across the platform — backend microservices, edge Lambdas, product-data ETL pipelines and a gen-AI-powered search experience.",
    tags: ["AWS", "Microservices", "ETL", "Gen AI"],
  },
  {
    company: "Toptal",
    role: "Staff Software Engineer",
    period: "Oct 2022 — Now",
    location: "Remote",
    summary: "Staff engineer in Toptal's network, matched with companies for senior, high-impact engagements.",
    tags: ["Freelance", "Architecture"],
  },
  {
    company: "Eternal",
    role: "Senior Software Engineer",
    period: "Jul 2019 — Aug 2022",
    location: "Remote",
    summary:
      "Three years building a marketplace for collectible moments — listings, trading flows and wallet-aware UI for a fast-moving startup team.",
    tags: ["React", "TypeScript", "Web3"],
  },
  {
    company: "Self-employed",
    role: "Staff / Principal Software Engineer",
    period: "Mar 2016 — Now",
    location: "Remote · 12 countries",
    summary:
      "A decade of partnering with founders and teams across the US, Europe, Australia and the Middle East — SaaS products, dashboards, APIs and landing pages, consistently rated five stars.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
  },
];

export const education = [
  { school: "Ecole High-Tech", degree: "Engineer's degree, Computer Software Engineering" },
  { school: "IUT Lyon 1", degree: "Master's degree, Computer Software Engineering" },
];

export type Project = {
  title: string;
  kind: string;
  year: string;
  description: string;
  stack: string[];
  href?: string;
  accent: string;
  visual: "chart" | "redis" | "market" | "compress" | "monitor" | "mobile" | "kanban" | "chat";
};

export const projects: Project[] = [
  {
    title: "Trading Journal",
    kind: "Product · Fintech",
    year: "2026",
    description:
      "A local-first journal for Coinbase Advanced. Pulls fills over the API, reconstructs round-trip trades with cost basis, realized/unrealized PnL, win rate and fees — then lets you write down what you were actually thinking.",
    stack: ["Next.js 16", "React 19", "Coinbase API", "Tailwind 4"],
    accent: "#2196f3",
    visual: "chart",
  },
  {
    title: "Redis, from scratch",
    kind: "Systems · C++",
    year: "2024",
    description:
      "A Redis-compatible server written in modern C++ — a RESP protocol parser, a concurrent TCP server and the core command set, built stage by stage.",
    stack: ["C++", "CMake", "Sockets", "RESP"],
    href: "https://github.com/boushib",
    accent: "#ef4444",
    visual: "redis",
  },
  {
    title: "Eternal",
    kind: "Work · Web3",
    year: "2019–22",
    description:
      "Three years as a senior engineer on a marketplace for collectible moments — listings, trading flows and wallet-aware UI for a fast-moving startup team.",
    stack: ["React", "TypeScript", "Web3"],
    href: "https://eternal.gg",
    accent: "#a855f7",
    visual: "market",
  },
  {
    title: "gzify",
    kind: "Systems · Rust",
    year: "2025",
    description:
      "A gzip-compatible file compressor and decompressor CLI in Rust, built to get fluent with ownership, lifetimes and streaming I/O.",
    stack: ["Rust", "CLI", "Compression"],
    href: "https://github.com/boushib/gzify",
    accent: "#f97316",
    visual: "compress",
  },
  {
    title: "sysmon",
    kind: "Tooling · Python",
    year: "2026",
    description:
      "A live terminal dashboard for macOS — CPU per core, memory, disks, network throughput, GPU and top processes, redrawn in place with Rich.",
    stack: ["Python", "psutil", "Rich", "Typer"],
    accent: "#22c55e",
    visual: "monitor",
  },
  {
    title: "Shoppo",
    kind: "Mobile · Flutter",
    year: "2024",
    description:
      "A cross-platform e-commerce app template with a companion Node API — catalog, cart, checkout and auth, one codebase for iOS and Android.",
    stack: ["Flutter", "Dart", "Express", "MongoDB"],
    href: "https://github.com/boushib/shoppo",
    accent: "#06b6d4",
    visual: "mobile",
  },
  {
    title: "Scrumify",
    kind: "Product · SaaS",
    year: "2023",
    description:
      "A JIRA-style scrum board with drag-and-drop stories, sprints and statuses — originally built for an interview, kept because it was fun.",
    stack: ["React", "TypeScript", "Sass"],
    href: "https://github.com/boushib/scrumify",
    accent: "#eab308",
    visual: "kanban",
  },
  {
    title: "Discord 3.0",
    kind: "Clone · Realtime",
    year: "2022",
    description:
      "A Discord UI clone with servers, channels and chat — part of a series of Discord, Medium, OpenSea and Amazon rebuilds.",
    stack: ["Next.js", "Redux Toolkit", "Sass"],
    accent: "#6366f1",
    visual: "chat",
  },
];

export const stack = [
  {
    group: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Three.js", "Tailwind", "Motion", "GraphQL"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Go", "Python", "PostgreSQL", "Redis", "Kafka", "gRPC"],
  },
  {
    group: "Systems",
    items: ["C++", "Rust", "Linux", "Docker", "AWS", "CMake"],
  },
  {
    group: "Mobile & AI",
    items: ["Flutter", "Swift", "LLM engineering", "Agents", "Stable Diffusion"],
  },
];

export const now = [
  "Post-training Meta's AI models with my pod",
  "Running image models locally, poking at diffusion",
  "Rebuilding infrastructure classics to learn them deeply",
  "Keeping a trading journal honest with real data",
];

export const testimonials = [
  {
    name: "Jeffrey Tong",
    role: "CEO & co-founder, Eternal",
    country: "USA",
    quote:
      "El is a great communicator and went out of his way to join our preferred communication channel to talk with our team.",
  },
  {
    name: "Saddaf D.",
    role: "Software Engineer",
    country: "Sweden",
    quote:
      "He did everything according to specifications, made very good suggestions for changes in the specs, and added nice things that weren't in the initial work. Highly recommended.",
  },
  {
    name: "Eliott Anthonioz",
    role: "Founder & CEO, Lazyfi",
    country: "France",
    quote: "Very pleasant working with Boushib. Great communication and very professional.",
  },
  {
    name: "Claus R.",
    avatar: "/testimonials/claus.jpg",
    role: "Software Engineer",
    country: "Germany",
    quote: "My third project with him and again satisfied. Should I say more?",
  },
  {
    name: "Sergio R.",
    role: "Client",
    country: "USA",
    quote:
      "Best freelancer I have ever worked with — very professional and very fast turnaround time.",
  },
  {
    name: "Matteo Minolim",
    avatar: "/testimonials/matteo.jpg",
    role: "UI/UX Designer",
    country: "Australia",
    quote: "Just overall an incredible, kind, professional developer!",
  },
  {
    name: "Rui C.",
    avatar: "/testimonials/rui.jpg",
    role: "Founder, netgocio",
    country: "Portugal",
    quote: "Really professional in communication and work. Will hire in the future for sure.",
  },
  {
    name: "Filip F.",
    role: "Founder, Advertica",
    country: "Slovakia",
    quote: "100% seamless cooperation. Everything went really quickly.",
  },
  {
    name: "Michael Downsie",
    avatar: "/testimonials/michael.jpg",
    role: "Founder, K-9",
    country: "USA",
    quote:
      "I know very little about coding. El Hassane helped me step by step and was always polite about making changes.",
  },
  {
    name: "Fabian F.",
    avatar: "/testimonials/fabian.jpg",
    role: "Software Engineer",
    country: "Serbia",
    quote: "Very professional freelancer, we will work again — for sure!",
  },
];
