"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSmilPlayback } from "@/lib/useSmilPlayback";

/*
 * Hero illustrations about building modern software, drawn in the same SMIL style as the
 * project cards. Each is a tall 400×420 scene on a 6s loop; pick one in Hero.tsx.
 */

const OK = "#22c55e";
const mono = { fontFamily: "var(--font-geist-mono), monospace" } as const;
const faint = { stroke: "currentColor", strokeOpacity: 0.14 } as const;
const kt = (...t: number[]) => t.map((v) => Math.min(1, Math.max(0, v)).toFixed(3)).join(";");
const LOOP_MS = 6000;
const DUR = `${LOOP_MS / 1000}s`;

/** Visible between t0 and t1 (fractions of the loop), otherwise hidden. */
const visibleBetween = (t0: number, t1: number) => ({ values: "0;0;1;1;0;0", keyTimes: kt(0, t0, t0 + 0.01, t1 - 0.01, t1, 1) });

/** A dot that travels `path` between t0 and t1 of the loop. */
function Packet({ c, path, t0, t1, color, r = 3.5 }: { c: string; path: string; t0: number; t1: number; color?: string; r?: number }) {
  return (
    <circle r={r} fill={color ?? c} opacity="0">
      <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" {...visibleBetween(t0, t1)} />
      <animateMotion dur={DUR} repeatCount="indefinite" path={path} keyPoints="0;0;1;1" keyTimes={kt(0, t0, t1, 1)} calcMode="linear" />
    </circle>
  );
}

function Box({ x, y, w, h, label, sub }: { x: number; y: number; w: number; h: number; label: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill="var(--bg-elev, #111)" {...faint} strokeOpacity="0.3" />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -1 : 3.5)} textAnchor="middle" fontSize="9.5" fill="currentColor" fillOpacity="0.7" style={mono}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.4" style={mono}>
          {sub}
        </text>
      )}
    </g>
  );
}

/* ─────────────────────────── 1 · Request journey ─────────────────────────── */

function RequestJourney({ c }: { c: string }) {
  const services = [
    { x: 30, label: "auth" },
    { x: 150, label: "feed" },
    { x: 270, label: "pay" },
  ];
  const down = "M200 126 V160";
  const up = "M270 290 C 270 250, 200 250, 200 190 V126";
  return (
    <>
      {/* browser */}
      <rect x="30" y="30" width="340" height="96" rx="12" fill="none" {...faint} strokeOpacity="0.3" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={46 + i * 10} cy="45" r="3" fill="currentColor" fillOpacity="0.2" />
      ))}
      <rect x="140" y="38" width="120" height="14" rx="7" fill="currentColor" fillOpacity="0.06" />
      <text x="200" y="48" textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.5" style={mono}>
        boushib.com
      </text>
      <line x1="30" x2="370" y1="60" y2="60" {...faint} />
      {[
        { x: 46, y: 72, w: 90, h: 40 },
        { x: 148, y: 72, w: 150, h: 8 },
        { x: 148, y: 88, w: 110, h: 8 },
        { x: 148, y: 104, w: 70, h: 8 },
      ].map((b, i) => (
        <g key={i}>
          <rect {...b} rx="4" fill="currentColor" fillOpacity="0.06" />
          <rect {...b} rx="4" fill={c} opacity="0">
            <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values={`0;0;${i ? 0.5 : 0.35};${i ? 0.5 : 0.35};0`} keyTimes={kt(0, 0.8 + i * 0.03, 0.83 + i * 0.03, 0.95, 1)} />
          </rect>
        </g>
      ))}

      {/* gateway + services */}
      <path d={down} fill="none" {...faint} />
      <Box x={130} y={160} w={140} h={30} label="API GATEWAY" />
      {services.map((s) => (
        <g key={s.label}>
          <path d={`M200 190 C 200 206, ${s.x + 50} 204, ${s.x + 50} 220`} fill="none" {...faint} />
          <Box x={s.x} y={220} w={100} h={28} label={s.label} />
        </g>
      ))}

      {/* data layer */}
      <path d="M200 248 V290" fill="none" {...faint} />
      <path d="M200 248 C 200 270, 270 270, 270 290" fill="none" {...faint} />
      <Box x={70} y={290} w={120} h={30} label="postgres" />
      <rect x="210" y="290" width="120" height="30" rx="7" fill={OK} opacity="0">
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;0.35;0;0" keyTimes={kt(0, 0.44, 0.47, 0.6, 1)} />
      </rect>
      <Box x={210} y={290} w={120} h={30} label="cache" />
      <text x="318" y="309" textAnchor="end" fontSize="7.5" fontWeight="700" fill={OK} opacity="0" style={mono}>
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;0;0" keyTimes={kt(0, 0.44, 0.47, 0.6, 1)} />
        HIT
      </text>

      {/* the request down, fan out, hit cache, and back up */}
      <Packet c={c} path={down} t0={0.02} t1={0.12} />
      {services.map((s) => (
        <Packet c={c} key={s.label} path={`M200 190 C 200 206, ${s.x + 50} 204, ${s.x + 50} 220`} t0={0.14} t1={0.26} />
      ))}
      <Packet c={c} path="M200 248 C 200 270, 270 270, 270 290" t0={0.3} t1={0.44} />
      <Packet c={c} path={up} t0={0.5} t1={0.8} color={OK} />

      {/* latency readout */}
      <rect x="30" y="346" width="340" height="52" rx="10" fill="none" {...faint} strokeOpacity="0.3" />
      <text x="46" y="368" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        p50 LATENCY
      </text>
      {["42ms", "19ms", "8ms"].map((v, i) => (
        <text key={v} x="46" y="387" fontSize="11" fill={i === 2 ? OK : "currentColor"} opacity="0" style={mono}>
          <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes={kt(0, [0, 0.4, 0.8][i], [0.4, 0.8, 1][i])} />
          {v}
        </text>
      ))}
      <path d="M170 386 L200 362 L230 372 L260 380 L290 384 L320 386 L354 387" fill="none" stroke={c} strokeWidth="0.9" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <animate attributeName="stroke-dashoffset" dur={DUR} repeatCount="indefinite" values="1;0;0;1" keyTimes={kt(0, 0.8, 0.95, 1)} />
      </path>
    </>
  );
}

/* ─────────────────────────── 2 · Code → ship pipeline ─────────────────────────── */

function Pipeline({ c }: { c: string }) {
  const code = [
    { x: 58, w: 150, col: "currentColor", o: 0.4 },
    { x: 74, w: 190, col: c, o: 0.8 },
    { x: 74, w: 120, col: "currentColor", o: 0.4 },
    { x: 58, w: 40, col: "currentColor", o: 0.4 },
  ];
  const stages = ["build", "test", "deploy"];
  const regions = [
    { x: 168, y: 318, label: "NYC" },
    { x: 214, y: 306, label: "LON" },
    { x: 246, y: 344, label: "SIN" },
  ];
  return (
    <>
      {/* editor */}
      <rect x="30" y="30" width="340" height="100" rx="12" fill="none" {...faint} strokeOpacity="0.3" />
      <text x="46" y="48" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        app/ship.ts
      </text>
      {code.map((l, i) => (
        <g key={i}>
          <text x="42" y={67 + i * 16} fontSize="7" fill="currentColor" fillOpacity="0.3" style={mono}>
            {i + 1}
          </text>
          <rect x={l.x} y={61 + i * 16} height="6" rx="3" fill={l.col} fillOpacity={l.o} width="0">
            <animate attributeName="width" dur={DUR} repeatCount="indefinite" values={`0;0;${l.w};${l.w};0`} keyTimes={kt(0, i * 0.06, i * 0.06 + 0.07, 0.95, 1)} />
          </rect>
        </g>
      ))}

      {/* git: feature branch merges into main */}
      <text x="30" y="160" fontSize="8" fill="currentColor" fillOpacity="0.45" style={mono}>
        feat
      </text>
      <text x="30" y="192" fontSize="8" fill="currentColor" fillOpacity="0.45" style={mono}>
        main
      </text>
      <line x1="64" x2="370" y1="188" y2="188" {...faint} strokeOpacity="0.35" strokeWidth="2" />
      <path d="M100 188 C 120 188, 120 156, 140 156 H240 C 260 156, 260 188, 280 188" fill="none" stroke={c} strokeOpacity="0.5" strokeWidth="2" />
      {[80, 330].map((x) => (
        <circle key={x} cx={x} cy="188" r="5" fill="var(--bg-elev, #111)" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
      ))}
      {[160, 200, 240].map((x, i) => (
        <circle key={x} cx={x} cy="156" r="5" fill={c} opacity="0">
          <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, 0.12 + i * 0.07, 0.14 + i * 0.07, 0.95, 1)} />
        </circle>
      ))}
      <circle cx="280" cy="188" r="6" fill={c} opacity="0">
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, 0.36, 0.38, 0.95, 1)} />
        <animate attributeName="r" dur={DUR} repeatCount="indefinite" values="6;6;9;6;6" keyTimes={kt(0, 0.36, 0.39, 0.43, 1)} />
      </circle>

      {/* CI stages */}
      {stages.map((s, i) => {
        const at = 0.44 + i * 0.1;
        return (
          <g key={s}>
            <rect x={30 + i * 116} y="214" width="108" height="30" rx="15" fill="none" {...faint} strokeOpacity="0.3" />
            <rect x={30 + i * 116} y="214" width="108" height="30" rx="15" fill={OK} opacity="0">
              <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;0.22;0.22;0" keyTimes={kt(0, at, at + 0.03, 0.95, 1)} />
            </rect>
            <text x={84 + i * 116} y="233" textAnchor="middle" fontSize="9.5" fill="currentColor" fillOpacity="0.7" style={mono}>
              {s}
            </text>
            <text x={122 + i * 116} y="233" textAnchor="middle" fontSize="10" fontWeight="700" fill={OK} opacity="0">
              <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, at + 0.02, at + 0.04, 0.95, 1)} />✓
            </text>
          </g>
        );
      })}

      {/* edge regions going live */}
      <circle cx="200" cy="330" r="62" fill={c} fillOpacity="0.05" {...faint} strokeOpacity="0.3" />
      <ellipse cx="200" cy="330" rx="62" ry="20" fill="none" {...faint} />
      <ellipse cx="200" cy="330" rx="62" ry="44" fill="none" {...faint} />
      <ellipse cx="200" cy="330" ry="62" rx="30" fill="none" {...faint}>
        <animate attributeName="rx" dur="4s" repeatCount="indefinite" values="0;62;0" />
      </ellipse>
      {regions.map((r, i) => {
        const at = 0.72 + i * 0.05;
        return (
          <g key={r.label} opacity="0">
            <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, at, at + 0.02, 0.95, 1)} />
            <circle cx={r.x} cy={r.y} r="4" fill={OK} />
            <circle cx={r.x} cy={r.y} r="4" fill="none" stroke={OK}>
              <animate attributeName="r" dur="1.4s" repeatCount="indefinite" values="4;12" />
              <animate attributeName="opacity" dur="1.4s" repeatCount="indefinite" values="0.8;0" />
            </circle>
            <text x={r.x + 8} y={r.y - 6} fontSize="7.5" fill="currentColor" fillOpacity="0.6" style={mono}>
              {r.label}
            </text>
          </g>
        );
      })}
      <g opacity="0">
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, 0.86, 0.88, 0.95, 1)} />
        <rect x="290" y="274" width="62" height="20" rx="10" fill={OK} />
        <text x="321" y="287.5" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#fff" style={mono}>
          ● live
        </text>
      </g>
    </>
  );
}

/* ─────────────────────────── 3 · Systems at scale ─────────────────────────── */

const cpu = [
  [30, 70, 55, 85, 40],
  [60, 35, 80, 50, 65],
  [45, 90, 60, 30, 75],
  [20, 40, 30, 45, 25],
];

function Scale({ c }: { c: string }) {
  const nodes = [30, 116, 202, 288];
  return (
    <>
      {/* incoming traffic */}
      <text x="30" y="30" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        TRAFFIC
      </text>
      <text x="370" y="30" textAnchor="end" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        12.4k rps
      </text>
      {Array.from({ length: 9 }, (_, i) => {
        const x = 120 + i * 20;
        return (
          <circle key={i} cx={x} r="2.5" fill={c}>
            <animate attributeName="cy" dur="1.2s" begin={`${(i * 0.37) % 1.2}s`} repeatCount="indefinite" values="40;84" />
            <animate attributeName="opacity" dur="1.2s" begin={`${(i * 0.37) % 1.2}s`} repeatCount="indefinite" values="0;1;0" />
          </circle>
        );
      })}

      <Box x={110} y={86} w={180} h={32} label="LOAD BALANCER" />

      {nodes.map((x, i) => {
        const scaled = i === 3;
        const path = `M200 118 C 200 140, ${x + 41} 136, ${x + 41} 160`;
        return (
          <g key={x}>
            <path d={path} fill="none" {...faint} strokeDasharray={scaled ? "3 3" : undefined} />
            <g opacity={scaled ? 0.35 : 1}>
              {scaled && (
                <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0.35;0.35;1;1;0.35" keyTimes={kt(0, 0.42, 0.48, 0.93, 1)} />
              )}
              <rect x={x} y="160" width="82" height="104" rx="10" fill="var(--bg-elev, #111)" stroke={scaled ? c : "currentColor"} strokeOpacity={scaled ? 0.8 : 0.3} strokeDasharray={scaled ? "4 3" : undefined} />
              <text x={x + 12} y="178" fontSize="8" fill="currentColor" fillOpacity="0.55" style={mono}>
                node·{i + 1}
              </text>
              {[0, 1].map((b) => {
                const vals = cpu[(i + b) % 4].map((v) => (scaled ? v : b ? v * 0.8 : v));
                const loop = [...vals, vals[0]];
                return (
                  <g key={b}>
                    <rect x={x + 16 + b * 28} y="188" width="18" height="64" rx="3" fill="currentColor" fillOpacity="0.06" />
                    <rect x={x + 16 + b * 28} width="18" rx="3" fill={c} fillOpacity={0.55 + b * 0.25}>
                      <animate attributeName="height" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" values={loop.map((v) => (v * 0.64).toFixed(1)).join(";")} calcMode="spline" keySplines={Array(loop.length - 1).fill(".4 0 .2 1").join(";")} />
                      <animate attributeName="y" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" values={loop.map((v) => (252 - v * 0.64).toFixed(1)).join(";")} calcMode="spline" keySplines={Array(loop.length - 1).fill(".4 0 .2 1").join(";")} />
                    </rect>
                  </g>
                );
              })}
            </g>
            {!scaled && <Packet c={c} path={path} t0={0.05 + i * 0.1} t1={0.2 + i * 0.1} r={3} />}
            {scaled && <Packet c={c} path={path} t0={0.5} t1={0.62} r={3} />}
          </g>
        );
      })}
      <text x="329" y="278" textAnchor="middle" fontSize="7.5" fill={c} style={mono}>
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, 0.36, 0.4, 0.93, 1)} />
        autoscaled
      </text>

      {/* p99 latency: spike, then flattens once the new node joins */}
      <rect x="30" y="296" width="340" height="102" rx="10" fill="none" {...faint} strokeOpacity="0.3" />
      <text x="46" y="316" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        p99 LATENCY
      </text>
      <circle cx="354" cy="313" r="3.5" fill={OK}>
        <animate attributeName="opacity" dur="1.6s" repeatCount="indefinite" values="1;0.3;1" />
      </circle>
      {[340, 360, 380].map((y) => (
        <line key={y} x1="46" x2="354" y1={y} y2={y} {...faint} strokeDasharray="2 4" />
      ))}
      <path
        d="M46 378 L80 376 L110 372 L140 352 L165 334 L185 344 L205 366 L235 374 L270 377 L310 378 L354 377"
        fill="none"
        stroke={c}
        strokeWidth="1"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
      >
        <animate attributeName="stroke-dashoffset" dur={DUR} repeatCount="indefinite" values="1;0;0;1" keyTimes={kt(0, 0.85, 0.95, 1)} />
      </path>
    </>
  );
}

const scenes = { request: RequestJourney, pipeline: Pipeline, scale: Scale };
// Same accents as the project cards: Trading Journal blue, Redis red, gzify orange.
const colors: Record<keyof typeof scenes, string> = { request: "#2196f3", pipeline: "#ef4444", scale: "#f97316" };
export type HeroSceneName = keyof typeof scenes;

export function HeroScene({ scene, className = "" }: { scene: HeroSceneName; className?: string }) {
  const ref = useSmilPlayback(5.4);
  const Scene = scenes[scene];
  return (
    <svg ref={ref} viewBox="0 0 400 420" preserveAspectRatio="xMidYMid meet" className={`text-fg ${className}`} aria-hidden>
      <Scene c={colors[scene]} />
    </svg>
  );
}

const order: HeroSceneName[] = ["request", "pipeline", "scale"];

/** Plays each scene for one full loop, then crossfades to the next. */
export function HeroSceneCycle({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % order.length), LOOP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={order[i]}
          className="absolute inset-0"
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.6 }}
        >
          <HeroScene scene={order[i]} className="size-full" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
