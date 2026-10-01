"use client";

import { ContactForm } from "./ContactForm";
import { Reveal, SectionLabel } from "./ui";
import { profile } from "@/lib/data";

const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Freelancer.com", href: profile.freelancer },
  { label: "Email", href: `mailto:${profile.email}` },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 pb-10 pt-24 md:px-10 md:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[60vmax] -translate-x-1/2 rounded-full bg-[conic-gradient(from_90deg,var(--accent),var(--accent-3),var(--accent-2),var(--accent))] opacity-[0.12] blur-[100px] motion-safe:animate-[spin_30s_linear_infinite]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col">
          <SectionLabel index="06">Contact</SectionLabel>
          <div>
            <Reveal>
              <h2 className="text-[clamp(2rem,4.2vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                Let&apos;s build
                <br />
                <span className="font-serif font-normal italic text-gradient">something good.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
                Have a product to ship, a system that needs to scale, or an idea you want a second pair of eyes on? I love hearing about
                ambitious projects — tell me what you&apos;re working on and let&apos;s see how I can help. I usually reply within 48 hours.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-14 w-full">
            <ContactForm />
          </Reveal>
        </div>

        <footer className="mt-20 flex flex-col gap-6 border-t md:mt-32 border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-6">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group relative inline-block hover:text-fg"
                >
                  {s.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-1 font-mono text-xs md:text-right">
            <p>
              © 2026 {profile.name} · {profile.location}
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
