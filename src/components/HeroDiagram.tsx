"use client";

import { useSmilPlayback } from "@/lib/useSmilPlayback";

/*
 * Hero illustration: a post-training loop, drawn in the same SMIL style as the project cards.
 * Data flows from three sources into a network, a forward pass sweeps left→right, gradients
 * flow back right→left, and the loss curve / eval score update — on an 8s loop.
 */

const mono = { fontFamily: "var(--font-geist-mono), monospace" } as const;
const faint = { className: "stroke-fg", strokeOpacity: 0.12 } as const;
const kt = (...t: number[]) => t.map((v) => Math.min(1, Math.max(0, v)).toFixed(3)).join(";");
const DUR = "8s";

// Network layout: four layers inside the model panel.
const layers = [4, 6, 6, 3].map((n, li) =>
  Array.from({ length: n }, (_, i) => ({ x: 232 + li * 62, y: 250 + (i - (n - 1) / 2) * 34 })),
);
const edges = layers.slice(0, -1).flatMap((layer, li) => layer.flatMap((a) => layers[li + 1].map((b) => ({ a, b, li }))));

const sources = [
  { y: 150, label: "CODE", icon: "M-7-3l-4 3 4 3M7-3l4 3-4 3M2-5l-4 10" },
  { y: 250, label: "PROMPTS", icon: "M-9-6h18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H-2l-4 3v-3h-3a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" },
  { y: 350, label: "WEARABLES", icon: "M-12-2a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4-2a4 4 0 1 0 8 0a4 4 0 1 0-8 0M-4-2h8M-12-3l-2-3M12-3l2-3" },
];

const loss = "M0 8 C 20 14, 30 40, 55 52 S 90 70, 120 74 S 150 78, 170 79";

export function HeroDiagram({ className = "" }: { className?: string }) {
  const ref = useSmilPlayback(5.6);
  return (
    <svg ref={ref} viewBox="0 0 640 500" className={className} aria-hidden>
      <defs>
        <linearGradient id="hd-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="[stop-color:var(--accent)]" stopOpacity="0.1" />
          <stop offset="1" className="[stop-color:var(--accent)]" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* ── sources ── */}
      {sources.map((s, i) => {
        const path = `M126 ${s.y} C 170 ${s.y}, 180 ${layers[0][Math.min(i + (i ? 1 : 0), 3)].y}, 222 ${layers[0][Math.min(i + (i ? 1 : 0), 3)].y}`;
        return (
          <g key={s.label}>
            <rect x="24" y={s.y - 30} width="102" height="60" rx="12" fill="url(#hd-panel)" {...faint} strokeOpacity="0.2" />
            <path d={s.icon} transform={`translate(52 ${s.y})`} fill="none" className="stroke-accent" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="72" y={s.y + 3.5} fontSize="9" className="fill-muted" style={mono}>
              {s.label}
            </text>
            <path d={path} fill="none" {...faint} strokeDasharray="3 4" />
            {[0, 0.33, 0.66].map((off) => (
              <circle key={off} r="3" className="fill-accent-3" opacity="0">
                <animateMotion dur="2.4s" begin={`${off * 2.4 + i * 0.3}s`} repeatCount="indefinite" path={path} />
                <animate attributeName="opacity" dur="2.4s" begin={`${off * 2.4 + i * 0.3}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.1;0.85;1" />
              </circle>
            ))}
          </g>
        );
      })}

      {/* ── model panel ── */}
      <rect x="200" y="96" width="232" height="310" rx="20" fill="url(#hd-panel)" {...faint} strokeOpacity="0.22" />
      <text x="218" y="124" fontSize="9" className="fill-muted" style={mono}>
        MODEL · POST-TRAINING
      </text>
      <circle cx="414" cy="121" r="3" className="fill-emerald-500">
        <animate attributeName="opacity" dur="1.6s" repeatCount="indefinite" values="1;0.3;1" />
      </circle>

      {edges.map(({ a, b, li }, i) => (
        <g key={i}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} {...faint} />
          {/* forward pass: accent sweep */}
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-accent" strokeOpacity="0" strokeWidth="1.2">
            <animate attributeName="stroke-opacity" dur={DUR} repeatCount="indefinite" values="0;0;0.55;0;0" keyTimes={kt(0, 0.05 + li * 0.09, 0.1 + li * 0.09, 0.2 + li * 0.09, 1)} />
          </line>
          {/* backward pass: gradients flow back */}
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-accent-2" strokeOpacity="0" strokeWidth="1.2">
            <animate attributeName="stroke-opacity" dur={DUR} repeatCount="indefinite" values="0;0;0.5;0;0" keyTimes={kt(0, 0.62 - li * 0.08, 0.66 - li * 0.08, 0.75 - li * 0.08, 1)} />
          </line>
        </g>
      ))}
      {layers.map((layer, li) =>
        layer.map((n, i) => (
          <g key={`${li}-${i}`}>
            <circle cx={n.x} cy={n.y} r="7" className="fill-bg stroke-accent" strokeOpacity="0.5" strokeWidth="1.4" />
            <circle cx={n.x} cy={n.y} r="3.5" className="fill-accent" fillOpacity="0.25">
              <animate attributeName="fill-opacity" dur={DUR} repeatCount="indefinite" values="0.25;0.25;1;0.25;0.25" keyTimes={kt(0, 0.08 + li * 0.09, 0.12 + li * 0.09, 0.24 + li * 0.09, 1)} />
              <animate attributeName="r" dur={DUR} repeatCount="indefinite" values="3.5;3.5;4.8;3.5;3.5" keyTimes={kt(0, 0.08 + li * 0.09, 0.12 + li * 0.09, 0.24 + li * 0.09, 1)} />
            </circle>
          </g>
        )),
      )}
      <g style={mono} fontSize="8" className="fill-faint">
        <text x="218" y="392">forward</text>
        <text x="414" y="392" textAnchor="end" className="fill-accent-2" fillOpacity="0.8">
          ← gradients
        </text>
      </g>

      {/* ── outputs: loss curve + eval ── */}
      <path d={`M432 ${layers[3][1].y} H470`} fill="none" {...faint} strokeDasharray="3 4" />
      <g transform="translate(470 120)">
        <rect width="146" height="138" rx="14" fill="url(#hd-panel)" {...faint} strokeOpacity="0.2" />
        <text x="14" y="24" fontSize="9" className="fill-muted" style={mono}>
          LOSS
        </text>
        <g transform="translate(14 36) scale(0.69 1)">
          {[20, 50, 80].map((y) => (
            <line key={y} x1="0" x2="170" y1={y} y2={y} {...faint} strokeDasharray="2 4" />
          ))}
          <path d={loss} fill="none" className="stroke-accent" strokeWidth="1.1" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" vectorEffect="non-scaling-stroke">
            <animate attributeName="stroke-dashoffset" dur={DUR} repeatCount="indefinite" values="1;1;0;0;1" keyTimes={kt(0, 0.3, 0.8, 0.95, 1)} />
          </path>
        </g>
        <text x="14" y="128" fontSize="8" className="fill-faint" style={mono}>
          step 48,213
        </text>
      </g>
      <g transform="translate(470 276)">
        <rect width="146" height="96" rx="14" fill="url(#hd-panel)" {...faint} strokeOpacity="0.2" />
        <text x="14" y="24" fontSize="9" className="fill-muted" style={mono}>
          EVAL
        </text>
        {["71.4", "73.9", "75.6"].map((v, i) => (
          <text key={v} x="14" y="62" fontSize="26" fontWeight="600" className="fill-fg" opacity="0" style={mono}>
            <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" calcMode="discrete" values={i === 2 ? "0;1;0" : "0;1;0"} keyTimes={kt(0, [0, 0.45, 0.75][i], [0.45, 0.75, 1][i])} />
            {v}
          </text>
        ))}
        <text x="96" y="62" fontSize="11" className="fill-emerald-500" style={mono} opacity="0">
          <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, 0.75, 0.78, 0.97, 1)} />
          ▲ 4.2
        </text>
        <rect x="14" y="74" width="118" height="5" rx="2.5" className="fill-fg" fillOpacity="0.08" />
        <rect x="14" y="74" height="5" rx="2.5" className="fill-accent" width="84">
          <animate attributeName="width" dur={DUR} repeatCount="indefinite" values="84;84;92;92;100;100;84" keyTimes={kt(0, 0.45, 0.48, 0.75, 0.78, 0.97, 1)} />
        </rect>
      </g>

      {/* ── terminal ── */}
      <g transform="translate(24 430)">
        <rect width="592" height="44" rx="12" className="fill-fg stroke-fg" fillOpacity="0.03" strokeOpacity="0.2" />
        <clipPath id="hd-type">
          <rect x="30" y="0" height="44" width="0">
            <animate attributeName="width" dur={DUR} repeatCount="indefinite" values="0;0;400;400;0" keyTimes={kt(0, 0.02, 0.28, 0.95, 1)} />
          </rect>
        </clipPath>
        <text x="16" y="26" fontSize="11" className="fill-accent" style={mono}>
          $
        </text>
        <text x="30" y="26" fontSize="11" className="fill-muted" style={mono} clipPath="url(#hd-type)">
          train --pod applied-ai --stage post-train --eval
        </text>
        <rect x="438" y="17" width="7" height="12" rx="1" className="fill-accent">
          <animate attributeName="opacity" dur="1s" repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes="0;0.5" />
        </rect>
      </g>
    </svg>
  );
}
