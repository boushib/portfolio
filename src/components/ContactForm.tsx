"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowIcon, ease } from "./ui";
import { contactTopics, submitContact, type ContactTopic } from "@/lib/contact";
import { profile } from "@/lib/data";
import { useNycTime } from "@/lib/useNycTime";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-2xl border border-line bg-transparent px-4 py-3 text-sm text-fg placeholder:text-faint outline-none transition-colors focus:border-accent";
const label = "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted";
const mono = { fontFamily: "var(--font-geist-mono), monospace" } as const;

const links = [
  { label: "LinkedIn", value: "in/boushib", href: profile.linkedin, icon: "linkedin" },
  { label: "GitHub", value: "@boushib", href: profile.github, icon: "github" },
  { label: "Freelancer.com", value: "Hire me", href: profile.freelancer, icon: "freelancer" },
];

const rowShell = "flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left";
const rowLabel = "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors";

/** Rounded-square badge that every panel row uses for its icon. */
function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-accent/20 bg-accent/10 text-accent">{children}</span>
  );
}

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

/** A single-colour brand mark from /public/logos/mono, tinted by the text colour. */
function BrandMark({ name }: { name: string }) {
  const mask = `url(/logos/mono/${name}.svg) center / contain no-repeat`;
  return <span aria-hidden className="size-4 shrink-0 bg-current" style={{ mask, WebkitMask: mask }} />;
}

/** Email row: copies the address instead of opening a mail client, with a note that fades out. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className={`group/link ${rowShell} transition-colors hover:bg-fg/[0.05]`}
      aria-label={`Copy ${profile.email}`}
    >
      <span className={`${rowLabel} group-hover/link:text-fg`}>
        <IconTile>
          <Glyph>
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m4 7 8 6 8-6" />
          </Glyph>
        </IconTile>
        Email
      </span>
      <span className="relative flex min-w-0 items-center gap-2 text-sm text-muted transition-colors group-hover/link:text-fg">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "email"}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`truncate ${copied ? "text-emerald-500" : ""}`}
          >
            {copied ? "Copied to clipboard" : profile.email}
          </motion.span>
        </AnimatePresence>
        <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {copied ? (
            <path d="M5 12.5l4.5 4.5L19 7.5" className="stroke-emerald-500" />
          ) : (
            <>
              <rect x="8" y="8" width="12" height="12" rx="2.5" />
              <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
            </>
          )}
        </svg>
      </span>
    </button>
  );
}

/** Left side of the card: who you're writing to, local time, reply time and direct links. */
function Availability() {
  const time = useNycTime();
  return (
    <div className="relative flex flex-col border-b border-line p-6 md:border-b-0 md:border-r md:p-8">
      <div className="flex items-center gap-4">
        <div className="relative size-14 shrink-0">
          <Image src="/me.webp" alt="" fill sizes="56px" className="rounded-2xl object-cover object-[50%_30%]" />
          <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-elev">
            <span className="absolute size-2.5 animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative size-2.5 rounded-full bg-emerald-500" />
          </span>
        </div>
        <div>
          <div className="font-semibold tracking-tight">{profile.name}</div>
          <div className="text-xs text-emerald-500">Open to good conversations</div>
        </div>
      </div>

      <dl className="mt-8 space-y-1">
        <div className={rowShell}>
          <dt className={rowLabel}>
            <IconTile>
              <Glyph>
                {/* clock whose minute hand sweeps round */}
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 12V7.5">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="6s" repeatCount="indefinite" />
                </path>
                <path d="M12 12h3" />
              </Glyph>
            </IconTile>
            New York
          </dt>
          <dd className="text-sm tabular-nums text-fg" suppressHydrationWarning>
            {time || "—"} <span className="text-faint">ET</span>
          </dd>
        </div>
        <div className={rowShell}>
          <dt className={rowLabel}>
            <IconTile>
              <Glyph>
                <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12L13 3Z" />
              </Glyph>
            </IconTile>
            Replies
          </dt>
          <dd className="text-sm text-fg">within 48 h</dd>
        </div>
      </dl>

      <hr className="my-5 border-line" />

      <ul className="space-y-1">
        <li>
          <CopyEmail />
        </li>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`group/link ${rowShell} transition-colors hover:bg-fg/[0.05]`}
            >
              <span className={`${rowLabel} group-hover/link:text-fg`}>
                <IconTile>
                  <BrandMark name={l.icon} />
                </IconTile>
                {l.label}
              </span>
              <span className="flex min-w-0 items-center gap-2 text-sm text-muted transition-colors group-hover/link:text-fg">
                <span className="truncate">{l.value}</span>
                <ArrowIcon className="size-3.5 shrink-0 transition-transform duration-300 group-hover/link:rotate-45" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const flight = "M20 110 C 90 110, 110 40, 190 60 S 300 120, 380 50";

/** Paper plane flying along a dotted route while the message is sending. */
function Sending() {
  return (
    <svg viewBox="0 0 400 160" className="w-full max-w-sm text-fg" aria-hidden>
      <path d={flight} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="2 6" strokeLinecap="round" />
      <path d={flight} fill="none" className="stroke-accent" strokeWidth="1.2" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <animate attributeName="stroke-dashoffset" dur="1.4s" repeatCount="indefinite" values="1;0" />
      </path>
      <g>
        <animateMotion dur="1.4s" repeatCount="indefinite" path={flight} rotate="auto" />
        <path d="M-10 -7 12 0-10 7-6 0Z" className="fill-accent" />
      </g>
      <circle cx="380" cy="50" r="5" className="fill-none stroke-accent" strokeOpacity="0.6" />
    </svg>
  );
}

/** Delivered: the route ends in an inbox node that pulses. */
function Delivered() {
  return (
    <svg viewBox="0 0 400 160" className="w-full max-w-sm text-fg" aria-hidden>
      <path d={flight} fill="none" className="stroke-accent" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="2 6" strokeLinecap="round" />
      {[0, 1].map((i) => (
        <circle key={i} cx="380" cy="50" r="10" fill="none" className="stroke-accent">
          <animate attributeName="r" dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite" values="10;34" />
          <animate attributeName="opacity" dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite" values="0.6;0" />
        </circle>
      ))}
      <circle cx="380" cy="50" r="12" className="fill-accent" fillOpacity="0.15" />
      <circle cx="380" cy="50" r="12" fill="none" className="stroke-accent" />
      <path d="M374 50.5l4 4 8-9" fill="none" className="stroke-accent" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="110" r="4" className="fill-accent" fillOpacity="0.6" />
      <text x="20" y="134" fontSize="9" className="fill-faint" style={mono} textAnchor="middle">
        you
      </text>
      <text x="380" y="82" fontSize="9" className="fill-faint" style={mono} textAnchor="middle">
        inbox
      </text>
    </svg>
  );
}

export function ContactForm() {
  const [topic, setTopic] = useState<ContactTopic>("Project");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      // Let the paper-plane animation play at least once, even on a fast response.
      await Promise.all([
        submitContact({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          topic,
        }),
        new Promise((r) => setTimeout(r, 1800)),
      ]);
      form.reset();
      setTopic("Project");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please email me directly.");
      setStatus("error");
    }
  }

  const busy = status === "sending" || status === "sent";

  return (
    // Same cursor-following glow as the project cards.
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="group relative grid overflow-hidden rounded-3xl border border-line bg-elev transition-colors duration-500 hover:border-accent/40 md:grid-cols-[0.8fr_1.2fr]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 60%)" }}
      />

      <Availability />

      <div className="relative p-6 md:p-8">
        <AnimatePresence mode="wait" initial={false}>
          {busy ? (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="flex min-h-[400px] flex-col items-center justify-center text-center"
            >
              {status === "sending" ? <Sending /> : <Delivered />}
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{status === "sending" ? "Sending…" : "Message sent"}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">
                {status === "sending" ? "On its way to my inbox." : "Thanks for reaching out — I'll get back to you within a couple of days."}
              </p>
              {status === "sent" && (
                <button type="button" onClick={() => setStatus("idle")} className="mt-6 font-mono text-xs text-muted hover:text-fg">
                  Send another →
                </button>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="space-y-4"
            >
              <div className="grid gap-4">
                <label className="block">
                  <span className={label}>Name</span>
                  <input name="name" required autoComplete="name" placeholder="Ada Lovelace" className={field} />
                </label>
                <label className="block">
                  <span className={label}>Email</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="ada@company.com" className={field} />
                </label>
              </div>

              <label className="block">
                <span className={label}>Subject</span>
                <span className="relative block">
                  <select
                    name="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as ContactTopic)}
                    className={`${field} cursor-pointer appearance-none pr-10`}
                  >
                    {contactTopics.map((t) => (
                      <option key={t} value={t} className="bg-elev text-fg">
                        {t}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </label>

              <label className="block">
                <span className={label}>Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me a bit about what you're building…"
                  className={`${field} resize-none`}
                />
              </label>

              <div className="flex flex-col items-start gap-3 pt-1">
                <p className="text-xs text-accent-2 empty:hidden" aria-live="polite">
                  {status === "error" ? error : ""}
                </p>
                <button type="submit" className="group/send inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg">
                  Send message
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 transition-transform duration-300 group-hover/send:-translate-y-0.5 group-hover/send:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z" />
                    <path d="M10 13 21 3" />
                  </svg>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
