import Image from "next/image";
import { Reveal, SectionLabel } from "./ui";
import { profile, testimonials } from "@/lib/data";

type T = (typeof testimonials)[number];

// ISO codes for the flag SVGs in /public/flags (flag-icons, MIT).
const flags: Record<string, string> = {
  USA: "us",
  Sweden: "se",
  France: "fr",
  Germany: "de",
  Australia: "au",
  Portugal: "pt",
  Slovakia: "sk",
  Serbia: "rs",
};

/** Simple "99"-style closing quote mark, drawn in the text colour at low opacity. */
function QuoteMark() {
  return (
    <svg
      viewBox="0 0 24 20"
      aria-hidden
      className="size-9 shrink-0 text-fg opacity-10 transition-opacity duration-500 group-hover:opacity-20"
      fill="currentColor"
    >
      <path d="M1 5.5a4.5 4.5 0 1 1 9 0c0 5.2-3.1 9.2-7.4 10.7a1.2 1.2 0 0 1-.8-2.2c1.7-.7 3-2.2 3.4-3.7C2.6 10.4 1 8.2 1 5.5Z" />
      <path d="M13 5.5a4.5 4.5 0 1 1 9 0c0 5.2-3.1 9.2-7.4 10.7a1.2 1.2 0 0 1-.8-2.2c1.7-.7 3-2.2 3.4-3.7-2.6.1-4.2-2.1-4.2-4.8Z" />
    </svg>
  );
}

// Individual Freelancer.com project pages are mostly private, so badges open the public reviews tab.
const reviewsUrl = `${profile.freelancer.replace("/hireme/", "/u/")}#reviews`;

/** Green check badge for reviews left on a completed, paid project; opens the reviews on Freelancer.com. */
function Verified() {
  return (
    <a
      href={reviewsUrl}
      target="_blank"
      rel="noreferrer"
      title="See this review on Freelancer.com"
      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500 transition-colors hover:bg-emerald-500/20"
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
        <path d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1Z" />
        <path d="m8 12.3 2.6 2.6L16.2 9.3" fill="none" stroke="var(--bg-elev)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Verified client
      <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}

function Quote({ t }: { t: T }) {
  return (
    <figure className="group relative w-[min(22rem,82vw)] shrink-0 rounded-3xl border border-line bg-elev p-6 md:w-[26rem] md:p-7">
      <div className="flex items-center justify-between">
        <div className="tracking-[0.1em] text-[#f5b83d]" aria-label="5 out of 5 stars">
          ★★★★★
        </div>
        <QuoteMark />
      </div>
      <blockquote className="mt-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {"avatar" in t && t.avatar ? (
          // Reviewer's own Freelancer.com profile picture.
          <Image src={t.avatar} alt="" width={36} height={36} className="size-9 rounded-full object-cover ring-1 ring-line" />
        ) : (
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-3 text-sm font-semibold text-white">
            {t.name[0]}
          </span>
        )}
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-medium">{t.name}</span>
            <Verified />
          </span>
          <span className="mt-0.5 block text-xs text-faint">
            {t.role} ·{" "}
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap align-middle">
              {t.country}
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG flag */}
              <img src={`/flags/${flags[t.country]}.svg`} alt="" width={16} height={12} className="h-3 w-4 rounded-[2px] object-cover ring-1 ring-line" />
            </span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: T[]; reverse?: boolean }) {
  return (
    <div className="marquee-wrap flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className={`marquee flex w-max gap-6 pr-6 ${reverse ? "marquee-reverse" : ""}`} style={{ ["--duration" as string]: "60s" }}>
        {[...items, ...items].map((t, i) => (
          <Quote key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel index="05">Kind words</SectionLabel>
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
            From founders <span className="font-serif font-normal italic text-muted">&amp; teams I&apos;ve shipped with.</span>
          </h2>
        </Reveal>
      </div>
      <Reveal className="mt-16 space-y-6">
        <Row items={testimonials.slice(0, half)} />
        <Row items={testimonials.slice(half)} reverse />
      </Reveal>
    </section>
  );
}
