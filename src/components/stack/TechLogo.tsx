// Single-colour marks (Devicon "plain" variants, MIT; Motion from motion.dev), drawn with a CSS
// mask so they take the current text colour and pick up the row's hover accent.
// Tools without an official logo (LLM engineering, Agents, Stable Diffusion) use our own glyphs.
// Full-colour versions live in /public/logos if we ever want them back.
const files: Record<string, string> = {
  TypeScript: "typescript",
  React: "react",
  "Next.js": "nextjs",
  "Three.js": "threejs",
  Tailwind: "tailwindcss",
  Motion: "motion",
  GraphQL: "graphql",
  "Node.js": "nodejs",
  Go: "go",
  Python: "python",
  PostgreSQL: "postgresql",
  Redis: "redis",
  Kafka: "kafka",
  gRPC: "grpc",
  "C++": "cplusplus",
  Rust: "rust",
  Linux: "linux",
  Docker: "docker",
  AWS: "aws",
  CMake: "cmake",
  Flutter: "flutter",
  Swift: "swift",
  "LLM engineering": "llm",
  Agents: "agents",
  "Stable Diffusion": "stable-diffusion",
};

export function TechLogo({ name, className = "" }: { name: string; className?: string }) {
  const file = files[name];
  if (!file) return null;
  const mask = `url(/logos/mono/${file}.svg) center / contain no-repeat`;
  return <span aria-hidden className={`inline-block shrink-0 bg-current ${className}`} style={{ mask, WebkitMask: mask }} />;
}
