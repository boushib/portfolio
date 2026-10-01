"use client";

import { useSmilPlayback } from "@/lib/useSmilPlayback";
import type { Project } from "@/lib/data";

/*
 * One animated SVG scene per project, drawn in the project's accent colour.
 * Everything animates with SMIL so each scene is a single self-contained <svg>:
 * the whole timeline pauses off screen and freezes on a finished frame for reduced motion.
 */

type P = { c: string };
const mono = { fontFamily: "var(--font-geist-mono), monospace" } as const;
const faint = { stroke: "currentColor", strokeOpacity: 0.14 } as const;

// Deterministic pseudo-random so server and client render the same scene.
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/** Lightens (amt > 0) or darkens (amt < 0) a #rrggbb colour toward white or black. */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const to = amt > 0 ? 255 : 0;
  const ch = (v: number) => Math.round(v + (to - v) * Math.abs(amt));
  const [r, g, b] = [ch(n >> 16), ch((n >> 8) & 255), ch(n & 255)];
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** Opacity timeline for something that appears at `at` (0..1 of the cycle) and clears near the end. */
const appear = (at: number, end = 0.93) => ({
  values: "0;0;1;1;0",
  keyTimes: `0;${at.toFixed(3)};${Math.min(at + 0.03, end - 0.01).toFixed(3)};${end};1`,
});

/* ─────────────────────────── Trading Journal: candles + PnL curve ─────────────────────────── */

const candles = (() => {
  const r = rng(7);
  let p = 120;
  return Array.from({ length: 22 }, (_, i) => {
    const o = p;
    p = Math.max(40, Math.min(185, p - 4 - (r() - 0.45) * 26));
    const hi = Math.min(o, p) - r() * 12;
    const lo = Math.max(o, p) + r() * 12;
    return { x: 36 + i * 15.5, o, c: p, hi, lo };
  });
})();
const curve = candles.map((k, i) => `${i ? "L" : "M"}${k.x} ${k.c}`).join(" ");

function Chart({ c }: P) {
  const dur = "7s";
  const drawn = 0.62;
  const last = candles[candles.length - 1];
  return (
    <>
      <defs>
        <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.35" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[50, 90, 130, 170].map((y) => (
        <line key={y} x1="24" x2="376" y1={y} y2={y} {...faint} strokeDasharray="2 4" />
      ))}
      {candles.map((k, i) => {
        const up = k.c < k.o;
        const col = up ? c : "currentColor";
        return (
          <g key={i} opacity="0">
            <animate attributeName="opacity" dur={dur} repeatCount="indefinite" {...appear((i / candles.length) * drawn)} />
            <line x1={k.x} x2={k.x} y1={k.hi} y2={k.lo} stroke={col} strokeOpacity={up ? 0.8 : 0.3} />
            <rect
              x={k.x - 4}
              y={Math.min(k.o, k.c)}
              width="8"
              height={Math.max(2, Math.abs(k.o - k.c))}
              rx="1"
              fill={col}
              fillOpacity={up ? 0.85 : 0.25}
            />
          </g>
        );
      })}
      <path d={`${curve} L${last.x} 200 L${candles[0].x} 200 Z`} fill="url(#chart-area)" opacity="0">
        <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={`0;${drawn - 0.1};${drawn};0.93;1`} />
      </path>
      <path d={curve} fill="none" stroke={c} strokeWidth="1" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <animate attributeName="stroke-dashoffset" dur={dur} repeatCount="indefinite" values="1;0;0;1" keyTimes={`0;${drawn};0.93;1`} />
      </path>
      <circle r="4" fill={c}>
        <animateMotion dur={dur} repeatCount="indefinite" path={curve} keyPoints="0;1;1;0" keyTimes={`0;${drawn};0.93;1`} calcMode="linear" />
      </circle>
      <circle cx={last.x} cy={last.c} r="4" fill="none" stroke={c} opacity="0">
        <animate attributeName="r" dur="1.4s" repeatCount="indefinite" values="4;14" />
        <animate attributeName="opacity" dur="1.4s" repeatCount="indefinite" values="0.8;0" />
      </circle>
      <g opacity="0">
        <animate attributeName="opacity" dur={dur} repeatCount="indefinite" {...appear(drawn)} />
        <line x1="24" x2={last.x} y1={last.c} y2={last.c} stroke={c} strokeOpacity="0.5" strokeDasharray="3 3" />
        <rect x="300" y={last.c - 30} width="72" height="20" rx="10" fill={c} />
        <text x="336" y={last.c - 16.5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#fff" style={mono}>
          +18.4%
        </text>
      </g>
      <text x="26" y="30" fontSize="9" fill="currentColor" fillOpacity="0.45" style={mono}>
        BTC-USD · REALIZED PNL
      </text>
    </>
  );
}

/* ─────────────────────────── Redis: clients → event loop → keyspace ─────────────────────────── */

const keys = ["user:42", "sess:9f", "rate:ip", "feed:7", "cart:3"];

function Redis({ c }: P) {
  const clients = [60, 110, 160];
  const routes = [
    { from: 0, to: 0, cmd: "SET" },
    { from: 1, to: 2, cmd: "INCR" },
    { from: 2, to: 4, cmd: "GET" },
    { from: 0, to: 3, cmd: "EXPIRE" },
    { from: 1, to: 1, cmd: "GET" },
  ];
  const dur = 5;
  return (
    <>
      {clients.map((y, i) => (
        <g key={i}>
          <rect x="22" y={y - 13} width="52" height="26" rx="6" fill="none" {...faint} strokeOpacity="0.3" />
          <text x="48" y={y + 3.5} textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.55" style={mono}>
            cli:{i + 1}
          </text>
        </g>
      ))}

      <circle cx="190" cy="110" r="44" fill="none" {...faint} strokeOpacity="0.25" />
      <circle cx="190" cy="110" r="44" fill="none" stroke={c} strokeWidth="2.5" strokeDasharray="40 236" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 190 110" to="360 190 110" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="190" cy="110" r="30" fill={c} fillOpacity="0.08" />
      <text x="190" y="107" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.5" style={mono}>
        EVENT
      </text>
      <text x="190" y="118" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.5" style={mono}>
        LOOP
      </text>

      {keys.map((k, i) => {
        const y = 42 + i * 34;
        return (
          <g key={k}>
            <rect x="282" y={y - 12} width="96" height="24" rx="5" fill={c} fillOpacity="0">
              {routes.map((r, j) =>
                r.to === i ? (
                  <animate
                    key={j}
                    attributeName="fill-opacity"
                    dur={`${dur}s`}
                    begin={`${j + 0.9}s`}
                    repeatCount="indefinite"
                    values="0;0.35;0;0"
                    keyTimes="0;0.04;0.2;1"
                  />
                ) : null,
              )}
            </rect>
            <rect x="282" y={y - 12} width="96" height="24" rx="5" fill="none" {...faint} strokeOpacity="0.3" />
            <text x="292" y={y + 3.5} fontSize="9" fill="currentColor" fillOpacity="0.7" style={mono}>
              {k}
            </text>
          </g>
        );
      })}

      {routes.map((r, j) => {
        const cy = clients[r.from];
        const ky = 42 + r.to * 34;
        const inbound = `M74 ${cy} C 115 ${cy}, 120 110, 146 110`;
        const outbound = `M234 110 C 258 110, 258 ${ky}, 282 ${ky}`;
        return (
          <g key={j}>
            <path d={inbound} fill="none" {...faint} />
            <path d={outbound} fill="none" {...faint} />
            <g opacity="0">
              <animate attributeName="opacity" dur={`${dur}s`} begin={`${j}s`} repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.02;0.1;0.12;1" />
              <animateMotion dur={`${dur}s`} begin={`${j}s`} repeatCount="indefinite" path={inbound} keyPoints="0;1;1" keyTimes="0;0.11;1" calcMode="linear" />
              <circle r="3.5" fill={c} />
              <text y="-7" textAnchor="middle" fontSize="7.5" fill={c} style={mono}>
                {r.cmd}
              </text>
            </g>
            <circle r="3" fill={c} opacity="0">
              <animate attributeName="opacity" dur={`${dur}s`} begin={`${j}s`} repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.13;0.14;0.18;0.19;1" />
              <animateMotion dur={`${dur}s`} begin={`${j}s`} repeatCount="indefinite" path={outbound} keyPoints="0;0;1;1" keyTimes="0;0.13;0.18;1" calcMode="linear" />
            </circle>
          </g>
        );
      })}
    </>
  );
}

/* ─────────────────────────── Eternal: mempool → block → chain ─────────────────────────── */

const txs = [
  { y: 62, id: "tx·3f2a", at: 0.04 },
  { y: 86, id: "tx·9c1e", at: 0.16 },
  { y: 110, id: "tx·b704", at: 0.28 },
];
const hashes = ["9f3c…e1a7", "5b20…c3d9", "e81a…07fb", "31dd…9a42", "a6c4…58e0"];
const peers = [
  [292, 132],
  [334, 122],
  [368, 146],
];
const kt = (...t: number[]) => t.map((v) => v.toFixed(3)).join(";");

function Market({ c }: P) {
  const light = shade(c, 0.45);
  const dur = "6s";
  const seal = 0.62;
  const blocks = [40, 110, 180, 250, 320];
  const chain = `M${blocks[0] + 20} 188 H${blocks[blocks.length - 1] + 20}`;
  // Isometric block: top, left and right faces.
  const top = "200,44 236,64 200,84 164,64";
  const left = "164,64 200,84 200,126 164,106";
  const right = "236,64 200,84 200,126 236,106";
  return (
    <>
      <defs>
        <pattern id="hex" width="24" height="20.8" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
          <path d="M6 0h12l6 10.4-6 10.4H6L0 10.4z" fill="none" stroke="currentColor" strokeOpacity="0.07" />
        </pattern>
        <clipPath id="block-sides">
          <polygon points={left} />
          <polygon points={right} />
        </clipPath>
      </defs>
      <rect width="400" height="220" fill="url(#hex)" />
      <text x="22" y="30" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        MEMPOOL
      </text>

      {/* Pending transactions: each dims as it leaves for the block */}
      {txs.map((t) => (
        <g key={t.id}>
          <g>
            <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="1;1;0.25;0.25;1" keyTimes={kt(0, t.at, t.at + 0.02, 0.95, 1)} />
            <rect x="22" y={t.y - 9} width="80" height="18" rx="9" fill={c} fillOpacity="0.12" stroke={c} strokeOpacity="0.45" />
            <circle cx="33" cy={t.y} r="3" fill={c} />
            <text x="41" y={t.y + 3} fontSize="8" fill="currentColor" fillOpacity="0.7" style={mono}>
              {t.id}
            </text>
          </g>
          <path d={`M102 ${t.y} C 130 ${t.y}, 140 96, 168 96`} fill="none" {...faint} strokeDasharray="2 3" />
          <circle r="3.2" fill={light} opacity="0">
            <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes={kt(0, t.at, t.at + 0.01, t.at + 0.1, t.at + 0.11, 1)} />
            <animateMotion
              dur={dur}
              repeatCount="indefinite"
              path={`M102 ${t.y} C 130 ${t.y}, 140 96, 168 96`}
              keyPoints="0;0;1;1"
              keyTimes={kt(0, t.at, t.at + 0.1, 1)}
              calcMode="linear"
            />
          </circle>
        </g>
      ))}

      {/* The block: sides fill up as transactions land, top lights up when sealed */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="3s" repeatCount="indefinite" />
        <circle cx="200" cy="85" r="30" fill="none" stroke={c} strokeWidth="1" opacity="0">
          <animate attributeName="r" dur={dur} repeatCount="indefinite" values="30;30;64;64" keyTimes={kt(0, seal, seal + 0.14, 1)} />
          <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0;0;0.45;0;0" keyTimes={kt(0, seal, seal + 0.01, seal + 0.14, 1)} />
        </circle>
        <polygon points={left} fill={c} fillOpacity="0.06" />
        <polygon points={right} fill={c} fillOpacity="0.1" />
        <g clipPath="url(#block-sides)">
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              dur={dur}
              repeatCount="indefinite"
              values="0 44;0 44;0 30;0 30;0 16;0 16;0 0;0 0;0 44"
              keyTimes={kt(0, 0.14, 0.15, 0.26, 0.27, 0.38, 0.39, 0.95, 1)}
            />
            <rect x="164" y="64" width="36" height="64" fill={c} fillOpacity="0.28" />
            <rect x="200" y="64" width="36" height="64" fill={c} fillOpacity="0.4" />
          </g>
        </g>
        <polygon points={top} fill={c} fillOpacity="0.08">
          <animate attributeName="fill-opacity" dur={dur} repeatCount="indefinite" values="0.08;0.08;0.3;0.3;0.08" keyTimes={kt(0, seal, seal + 0.03, 0.95, 1)} />
        </polygon>
        <g fill="none" stroke={c} strokeOpacity="0.75" strokeWidth="1.2" strokeLinejoin="round">
          <polygon points={top} />
          <polygon points={left} />
          <polygon points={right} />
        </g>
      </g>

      {/* Hash search: candidates flicker until one starts with 0000 */}
      <g style={mono}>
        <text x="262" y="30" fontSize="8.5" fill="currentColor" fillOpacity="0.45">
          SHA-256
        </text>
        <rect x="262" y="40" width="112" height="24" rx="6" fill="none" {...faint} strokeOpacity="0.3" />
        {hashes.map((h, i) => {
          const a = 0.42 + i * 0.04;
          return (
            <text key={h} x="272" y="55.5" fontSize="9" fill="currentColor" fillOpacity="0.55" opacity="0">
              <animate attributeName="opacity" dur={dur} repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes={kt(0, a, a + 0.04)} />
              0x{h}
            </text>
          );
        })}
        <text x="272" y="55.5" fontSize="9" fontWeight="600" fill={c} opacity="0">
          <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, seal, seal + 0.01, 0.94, 1)} />
          0x0000c8…e1 ✓
        </text>
        <text x="262" y="80" fontSize="8" fill="currentColor" fillOpacity="0.4">
          nonce · 48,213
        </text>
      </g>

      {/* Peers receive the new block */}
      {peers.map(([x, y], i) => (
        <g key={i}>
          <line x1="236" y1="96" x2={x} y2={y} {...faint} strokeDasharray="2 3" />
          <circle cx={x} cy={y} r="5" fill="var(--bg-elev, #111)" stroke={light} strokeOpacity="0.7" />
          <circle cx={x} cy={y} r="2" fill={c} />
          <circle cx={x} cy={y} r="5" fill="none" stroke={c} opacity="0">
            <animate attributeName="r" dur={dur} repeatCount="indefinite" values="5;5;14;14" keyTimes={kt(0, seal + 0.06 + i * 0.04, seal + 0.18 + i * 0.04, 1)} />
            <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0;0;0.8;0;0" keyTimes={kt(0, seal + 0.06 + i * 0.04, seal + 0.07 + i * 0.04, seal + 0.18 + i * 0.04, 1)} />
          </circle>
        </g>
      ))}

      {/* The chain: the sealed block travels down and lands as the newest link */}
      <path d={chain} {...faint} strokeOpacity="0.3" />
      {blocks.map((x, i) => {
        const newest = i === blocks.length - 1;
        return (
          <g key={x}>
            <rect x={x} y="176" width="40" height="24" rx="5" fill="var(--bg-elev, #111)" stroke={newest ? c : "currentColor"} strokeOpacity={newest ? 0.8 : 0.25} />
            {newest && (
              <rect x={x} y="176" width="40" height="24" rx="5" fill={c} fillOpacity="0">
                <animate attributeName="fill-opacity" dur={dur} repeatCount="indefinite" values="0;0;0.45;0.15;0" keyTimes={kt(0, 0.86, 0.88, 0.95, 1)} />
              </rect>
            )}
            <text x={x + 20} y="191.5" textAnchor="middle" fontSize="7.5" fill="currentColor" fillOpacity="0.55" style={mono}>
              0x{(0xa3 + i * 37).toString(16)}
            </text>
          </g>
        );
      })}
      <circle r="3.2" fill={c} opacity="0">
        <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes={kt(0, seal + 0.04, seal + 0.05, 0.86, 0.87, 1)} />
        <animateMotion
          dur={dur}
          repeatCount="indefinite"
          path={`M200 126 V160 Q200 188 228 188 H${blocks[blocks.length - 1]}`}
          keyPoints="0;0;1;1"
          keyTimes={kt(0, seal + 0.04, 0.86, 1)}
          calcMode="linear"
        />
      </circle>
    </>
  );
}

/* ─────────────────────────── gzify: LZ77 back-references ─────────────────────────── */

const input = "ABRACADABRA_ABRA".split("");
const matches = [
  { at: 7, len: 4, dist: 7 },
  { at: 12, len: 4, dist: 12 },
];
const tokens = ["A", "B", "R", "A", "C", "A", "D", "↩7·4", "_", "↩12·4"];
// Output tokens: literals are one cell, back-references are wider.
const out = tokens.reduce<{ t: string; x: number; w: number }[]>((acc, t) => {
  const prev = acc[acc.length - 1];
  const x = prev ? prev.x + prev.w + 3 : 200 - 118;
  return [...acc, { t, x, w: t.startsWith("↩") ? 40 : 19 }];
}, []);

function Compress({ c }: P) {
  const cw = 21;
  const x0 = 200 - (input.length * cw) / 2;
  const dur = "7s";
  const scan = 0.55;
  const tx = (i: number) => x0 + i * cw;
  return (
    <>
      <text x={x0} y="30" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        INPUT · 16 B
      </text>
      {input.map((ch, i) => {
        const hit = matches.some((m) => i >= m.at && i < m.at + m.len);
        const src = matches.some((m) => i >= m.at - m.dist && i < m.at - m.dist + m.len);
        return (
          <g key={i}>
            <rect x={tx(i) + 1} y="80" width={cw - 2} height="26" rx="4" fill={hit || src ? c : "currentColor"} fillOpacity={hit ? 0.28 : src ? 0.12 : 0.05} stroke="currentColor" strokeOpacity="0.15" />
            <text x={tx(i) + cw / 2} y="97" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.8" style={mono}>
              {ch}
            </text>
          </g>
        );
      })}
      <rect y="76" width={cw} height="34" rx="5" fill="none" stroke={c} strokeWidth="1.5">
        <animate attributeName="x" dur={dur} repeatCount="indefinite" values={`${x0};${tx(input.length - 1)};${tx(input.length - 1)}`} keyTimes={`0;${scan};1`} />
        <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="1;1;0;0" keyTimes={`0;${scan};${scan + 0.02};1`} />
      </rect>
      {matches.map((m, i) => {
        const a = tx(m.at - m.dist) + (m.len * cw) / 2;
        const b = tx(m.at) + (m.len * cw) / 2;
        const t = ((m.at + m.len) / input.length) * scan;
        return (
          <path key={i} d={`M${b} 76 C ${b} ${40 - i * 12}, ${a} ${40 - i * 12}, ${a} 76`} fill="none" stroke={c} strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
            <animate attributeName="stroke-dashoffset" dur={dur} repeatCount="indefinite" values="1;1;0;0;1" keyTimes={`0;${t.toFixed(3)};${(t + 0.08).toFixed(3)};0.93;1`} />
          </path>
        );
      })}
      <text x={200 - 118} y="140" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        DEFLATE · 10 TOKENS
      </text>
      {out.map((o, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" dur={dur} repeatCount="indefinite" {...appear((i / out.length) * scan + 0.04)} />
          <rect x={o.x} y="150" width={o.w} height="24" rx="4" fill={o.w > 19 ? c : "currentColor"} fillOpacity={o.w > 19 ? 0.85 : 0.07} stroke="currentColor" strokeOpacity="0.15" />
          <text x={o.x + o.w / 2} y="166" textAnchor="middle" fontSize={o.w > 19 ? 8.5 : 10} fill={o.w > 19 ? "#fff" : "currentColor"} fillOpacity={o.w > 19 ? 1 : 0.8} style={mono}>
            {o.t}
          </text>
        </g>
      ))}
      <g opacity="0">
        <animate attributeName="opacity" dur={dur} repeatCount="indefinite" {...appear(scan + 0.04)} />
        <text x="318" y="200" textAnchor="end" fontSize="10" fontWeight="600" fill={c} style={mono}>
          −37.5%
        </text>
      </g>
    </>
  );
}

/* ─────────────────────────── sysmon: live terminal dashboard ─────────────────────────── */

const cores = (() => {
  const r = rng(11);
  return Array.from({ length: 8 }, () => Array.from({ length: 6 }, () => 12 + r() * 70));
})();
const spark = (() => {
  const r = rng(3);
  let y = 30;
  const pts = Array.from({ length: 41 }, (_, i) => {
    y = Math.max(8, Math.min(52, y + (r() - 0.5) * 18));
    return `${i ? "L" : "M"}${i * 7.5} ${y.toFixed(1)}`;
  });
  return pts.join(" ");
})();

function Monitor({ c }: P) {
  return (
    <>
      <rect x="20" y="16" width="360" height="190" rx="10" fill="none" {...faint} strokeOpacity="0.3" />
      <line x1="20" x2="380" y1="38" y2="38" {...faint} strokeOpacity="0.2" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={34 + i * 12} cy="27" r="3.5" fill="currentColor" fillOpacity="0.2" />
      ))}
      <text x="200" y="30.5" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.5" style={mono}>
        sysmon — 8 cores · 2s
      </text>

      <text x="36" y="58" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        CPU
      </text>
      {cores.map((vals, i) => {
        const hs = vals.map((v) => v.toFixed(1));
        const ys = vals.map((v) => (186 - v).toFixed(1));
        const loop = (a: string[]) => [...a, a[0]].join(";");
        return (
          <g key={i}>
            <rect x={36 + i * 17} y="104" width="11" height="82" rx="2" fill="currentColor" fillOpacity="0.05" />
            <rect x={36 + i * 17} width="11" rx="2" fill={c} fillOpacity={0.55 + (i % 3) * 0.15}>
              <animate attributeName="height" dur={`${3 + (i % 4) * 0.4}s`} repeatCount="indefinite" values={loop(hs)} calcMode="spline" keySplines={Array(hs.length).fill(".4 0 .2 1").join(";")} />
              <animate attributeName="y" dur={`${3 + (i % 4) * 0.4}s`} repeatCount="indefinite" values={loop(ys)} calcMode="spline" keySplines={Array(ys.length).fill(".4 0 .2 1").join(";")} />
            </rect>
          </g>
        );
      })}

      <text x="200" y="58" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        NET ↓ 42.1 MB/s
      </text>
      <svg x="200" y="64" width="160" height="60" overflow="hidden">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;-150 0" dur="6s" repeatCount="indefinite" />
          <path d={`${spark} L300 60 L0 60 Z`} fill={c} fillOpacity="0.12" />
          <path d={spark} fill="none" stroke={c} strokeWidth="0.75" />
        </g>
      </svg>

      <circle cx="240" cy="163" r="22" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="5" />
      <circle cx="240" cy="163" r="22" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray="61 100" transform="rotate(-90 240 163)">
        <animate attributeName="stroke-dasharray" dur="5s" repeatCount="indefinite" values="58 100;67 100;61 100;58 100" />
      </circle>
      <text x="240" y="166.5" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75" style={mono}>
        MEM
      </text>
      <g style={mono} fontSize="8.5" fill="currentColor" fillOpacity="0.55">
        <text x="280" y="152">chrome 12.4%</text>
        <text x="280" y="166">node   7.9%</text>
        <text x="280" y="180">python 3.1%</text>
      </g>
      <rect x="276" y="143" width="98" height="12" rx="2" fill={c} fillOpacity="0.12">
        <animate attributeName="y" dur="4.5s" repeatCount="indefinite" values="143;157;171;143" calcMode="discrete" />
      </rect>
    </>
  );
}

/* ─────────────────────────── Shoppo: phone, product grid, add-to-cart ─────────────────────────── */

function Mobile({ c }: P) {
  // One product per row: thumbnail, title and price, and an add-to-cart button.
  const rows = [48, 94, 140];
  const fly = "M230 124 C 240 98, 240 56, 236 34";
  return (
    <>
      <defs>
        <linearGradient id="shimmer" x1="-1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
          <animate attributeName="x1" values="-1;1" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0;2" dur="1.6s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <rect x="148" y="10" width="104" height="200" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="182" y="16" width="36" height="7" rx="3.5" fill="currentColor" fillOpacity="0.25" />
      <text x="160" y="40" fontSize="9" fontWeight="600" fill="currentColor" fillOpacity="0.8" style={mono}>
        shoppo
      </text>
      <path d="M228 29h3l2 8h8l2-6h-11" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="244" cy="28" r="5" fill={c}>
        <animate attributeName="r" dur="3s" repeatCount="indefinite" values="5;5;7.5;5;5" keyTimes="0;0.5;0.56;0.64;1" />
      </circle>
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="157" y={y} width="86" height="40" rx="7" fill="url(#shimmer)" />
          <rect x="161" y={y + 4} width="32" height="32" rx="5" fill={c} fillOpacity="0">
            <animate attributeName="fill-opacity" dur="6s" repeatCount="indefinite" values="0;0;0.35;0.35;0" keyTimes={`0;${0.1 + i * 0.08};${0.14 + i * 0.08};0.95;1`} />
          </rect>
          <rect x="199" y={y + 9} width={[34, 26, 30][i]} height="4" rx="2" fill="currentColor" fillOpacity="0.3" />
          <rect x="199" y={y + 18} width="18" height="4" rx="2" fill={c} fillOpacity="0.8" />
          <circle cx="230" cy={y + 30} r="5" fill={c} fillOpacity={i === 1 ? 0.9 : 0.25} />
          <path d={`M228 ${y + 30}h4M230 ${y + 28}v4`} stroke={i === 1 ? "#fff" : c} strokeWidth="1.1" strokeLinecap="round" />
        </g>
      ))}
      <circle r="4" fill={c} opacity="0">
        <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.05;0.48;0.52;1" />
        <animateMotion dur="3s" repeatCount="indefinite" path={fly} keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="spline" keySplines=".5 0 .3 1;0 0 1 1" />
      </circle>
      <rect x="160" y="196" width="80" height="5" rx="2.5" fill="currentColor" fillOpacity="0.2" />

      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="3.6s" repeatCount="indefinite" />
        <rect x="46" y="70" width="86" height="42" rx="10" fill="var(--bg-elev, #111)" stroke="currentColor" strokeOpacity="0.2" />
        <text x="58" y="88" fontSize="8" fill="currentColor" fillOpacity="0.5" style={mono}>
          Air Runner
        </text>
        <text x="58" y="103" fontSize="11" fontWeight="600" fill="currentColor" style={mono}>
          $129.00
        </text>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 -4;0 3;0 -4" dur="4.2s" repeatCount="indefinite" />
        <rect x="268" y="134" width="84" height="30" rx="15" fill={c} fillOpacity="0.15" stroke={c} strokeOpacity="0.5" />
        <text x="310" y="153" textAnchor="middle" fontSize="9" fill={c} style={mono}>
          ✓ Paid
        </text>
      </g>
    </>
  );
}

/* ─────────────────────────── Scrumify: a story moving across the board ─────────────────────────── */

function KanbanCard({ c, x, y, accent = false }: P & { x: number; y: number; accent?: boolean }) {
  return (
    <g>
      <rect x={x + 8} y={y} width="92" height="36" rx="6" fill="var(--bg-elev, #111)" stroke={accent ? c : "currentColor"} strokeOpacity={accent ? 0.9 : 0.2} />
      <rect x={x + 16} y={y + 9} width={accent ? 56 : 48} height="4" rx="2" fill="currentColor" fillOpacity="0.4" />
      <rect x={x + 16} y={y + 19} width="30" height="4" rx="2" fill="currentColor" fillOpacity="0.18" />
      <rect x={x + 16} y={y + 27} width="16" height="3" rx="1.5" fill={c} fillOpacity={accent ? 0.9 : 0.4} />
      <circle cx={x + 88} cy={y + 24} r="5" fill={c} fillOpacity={accent ? 0.8 : 0.3} />
    </g>
  );
}

function Kanban({ c }: P) {
  const cols = [
    { x: 28, label: "TODO", cards: [60, 104] },
    { x: 146, label: "IN PROGRESS", cards: [104] },
    { x: 264, label: "DONE", cards: [104, 148] },
  ];
  return (
    <>
      {cols.map((col) => (
        <g key={col.label}>
          <rect x={col.x} y="18" width="108" height="186" rx="10" fill="currentColor" fillOpacity="0.03" {...faint} />
          <text x={col.x + 12} y="38" fontSize="8.5" fill="currentColor" fillOpacity="0.55" style={mono}>
            {col.label}
          </text>
          <circle cx={col.x + 94} cy="35" r="3" fill={c} fillOpacity="0.6" />
          {col.cards.map((y) => (
            <KanbanCard key={y} c={c} x={col.x} y={y} />
          ))}
        </g>
      ))}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="6s"
          repeatCount="indefinite"
          values="0 0;0 0;118 0;118 0;236 0;236 0;236 0"
          keyTimes="0;0.2;0.35;0.55;0.7;0.92;1"
          calcMode="spline"
          keySplines="0 0 1 1;.6 0 .2 1;0 0 1 1;.6 0 .2 1;0 0 1 1;0 0 1 1"
        />
        <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.05;0.92;1" />
        <KanbanCard c={c} x={28} y={148} accent />
      </g>
    </>
  );
}

/* ─────────────────────────── Discord: servers, channels, live chat ─────────────────────────── */

function Chat({ c }: P) {
  const msgs = [
    { y: 50, w: 130 },
    { y: 86, w: 96 },
    { y: 122, w: 150 },
  ];
  const dur = "6s";
  return (
    <>
      {[34, 70, 106, 142].map((y, i) => (
        <g key={y}>
          <circle cx="36" cy={y} r="13" fill={i === 0 ? c : "currentColor"} fillOpacity={i === 0 ? 0.85 : 0.1} />
          {i === 0 && <rect x="18" y={y - 9} width="3" height="18" rx="1.5" fill="currentColor" fillOpacity="0.8" />}
        </g>
      ))}
      <line x1="62" x2="62" y1="14" y2="206" {...faint} />
      {["general", "ship-it", "random", "voice"].map((ch, i) => (
        <text key={ch} x="72" y={38 + i * 20} fontSize="9" fill="currentColor" fillOpacity={i === 0 ? 0.85 : 0.4} style={mono}>
          # {ch}
        </text>
      ))}
      <rect x="68" y="27" width="72" height="16" rx="4" fill="currentColor" fillOpacity="0.07" />
      <line x1="150" x2="150" y1="14" y2="206" {...faint} />

      {msgs.map((m, i) => (
        <g key={i} opacity="0">
          <animate attributeName="opacity" dur={dur} repeatCount="indefinite" {...appear(0.08 + i * 0.22)} />
          <animateTransform attributeName="transform" type="translate" dur={dur} repeatCount="indefinite" values="0 8;0 8;0 0;0 0" keyTimes={`0;${(0.08 + i * 0.22).toFixed(2)};${(0.13 + i * 0.22).toFixed(2)};1`} />
          <circle cx="172" cy={m.y + 10} r="10" fill={i === 1 ? c : "currentColor"} fillOpacity={i === 1 ? 0.8 : 0.2} />
          <rect x="190" y={m.y} width="44" height="5" rx="2.5" fill={i === 1 ? c : "currentColor"} fillOpacity="0.7" />
          <rect x="190" y={m.y + 11} width={m.w} height="5" rx="2.5" fill="currentColor" fillOpacity="0.25" />
          <rect x="190" y={m.y + 20} width={m.w * 0.6} height="5" rx="2.5" fill="currentColor" fillOpacity="0.15" />
        </g>
      ))}
      <rect x="160" y="174" width="220" height="28" rx="8" fill="currentColor" fillOpacity="0.06" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={178 + i * 9} cy="188" r="3" fill={c}>
          <animate attributeName="cy" dur="1s" begin={`${i * 0.15}s`} repeatCount="indefinite" values="188;184;188;188" keyTimes="0;0.25;0.5;1" />
        </circle>
      ))}
      <text x="208" y="191" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        elhassane is typing…
      </text>
      <circle cx="46" cy="44" r="4.5" fill="#22c55e" stroke="var(--bg-elev, #111)" strokeWidth="2" />
    </>
  );
}

/* ─────────────────────────── Hero: post-training loop (data → model → evals) ─────────────────────────── */

const trainData = [
  { x: 80, label: "sft·data" },
  { x: 200, label: "rlhf·pref" },
  { x: 320, label: "red-team" },
];
const evalBars = [
  { label: "MMLU", from: 52, to: 70 },
  { label: "CODE", from: 38, to: 62 },
  { label: "MATH", from: 32, to: 56 },
  { label: "SAFETY", from: 58, to: 78 },
];

/** A tall scene (400×420) that fills the hero: data chips → spinning model loop → eval chart. */
function Training({ c }: P) {
  const dur = 6;
  const ring = { x: 200, y: 180, r: 56 };
  return (
    <>
      <text x="24" y="30" fontSize="9" fill="currentColor" fillOpacity="0.45" style={mono}>
        POST-TRAINING LOOP
      </text>
      <circle cx="372" cy="27" r="3.5" fill="#22c55e">
        <animate attributeName="opacity" dur="1.6s" repeatCount="indefinite" values="1;0.3;1" />
      </circle>
      <text x="362" y="30" textAnchor="end" fontSize="8.5" fill="currentColor" fillOpacity="0.45" style={mono}>
        step 48,213
      </text>

      {/* data sources and their flows into the model */}
      {trainData.map((d, j) => {
        const path = `M${d.x} 76 C ${d.x} 104, ${ring.x + (d.x - ring.x) * 0.3} 100, ${ring.x + (d.x - ring.x) * 0.3} ${ring.y - ring.r + 4}`;
        return (
          <g key={d.label}>
            <rect x={d.x - 48} y="48" width="96" height="28" rx="7" fill="none" {...faint} strokeOpacity="0.3" />
            <circle cx={d.x - 34} cy="62" r="3" fill={c} fillOpacity="0.8" />
            <text x={d.x + 6} y="65.5" textAnchor="middle" fontSize="9.5" fill="currentColor" fillOpacity="0.65" style={mono}>
              {d.label}
            </text>
            <path d={path} fill="none" {...faint} />
            <circle r="3.5" fill={c} opacity="0">
              <animate attributeName="opacity" dur={`${dur / 3}s`} begin={`${j * 0.6}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.05;0.45;0.5" />
              <animateMotion dur={`${dur / 3}s`} begin={`${j * 0.6}s`} repeatCount="indefinite" path={path} keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear" />
            </circle>
          </g>
        );
      })}

      {/* the model: an event-loop style ring */}
      <circle cx={ring.x} cy={ring.y} r={ring.r} fill="none" {...faint} strokeOpacity="0.25" />
      <circle cx={ring.x} cy={ring.y} r={ring.r} fill="none" stroke={c} strokeWidth="3" strokeDasharray="56 296" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${ring.x} ${ring.y}`} to={`360 ${ring.x} ${ring.y}`} dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={ring.x} cy={ring.y} r={ring.r - 16} fill={c} fillOpacity="0.08">
        <animate attributeName="fill-opacity" dur={`${dur / 3}s`} repeatCount="indefinite" values="0.06;0.2;0.06" />
      </circle>
      <text x={ring.x} y={ring.y - 3} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.6" style={mono}>
        MODEL
      </text>
      <text x={ring.x} y={ring.y + 12} textAnchor="middle" fontSize="10" fill={c} style={mono}>
        post-train
      </text>

      {/* model → evals */}
      <path d={`M${ring.x} ${ring.y + ring.r} V272`} fill="none" {...faint} />
      <circle r="3.5" fill={c}>
        <animateMotion dur="1.1s" repeatCount="indefinite" path={`M${ring.x} ${ring.y + ring.r} V272`} />
      </circle>

      <rect x="24" y="272" width="352" height="134" rx="12" fill="none" {...faint} strokeOpacity="0.3" />
      <text x="40" y="294" fontSize="9" fill="currentColor" fillOpacity="0.45" style={mono}>
        EVALS
      </text>
      {evalBars.map((b, i) => {
        const x = 52 + i * 80;
        const h = (v: number) => v * 1.0;
        const mid = (b.from + b.to) / 2;
        const vals = [b.from, b.from, mid, mid, b.to, b.to, b.from];
        const kts = kt(0, 0.15, 0.25, 0.5, 0.6, 0.92, 1);
        const splines = Array(6).fill(".4 0 .2 1").join(";");
        return (
          <g key={b.label}>
            <rect x={x} y="304" width="56" height="80" rx="5" fill="currentColor" fillOpacity="0.05" />
            <rect x={x} width="56" rx="5" fill={c} fillOpacity={0.5 + i * 0.13}>
              <animate attributeName="height" dur={`${dur}s`} repeatCount="indefinite" values={vals.map(h).join(";")} keyTimes={kts} calcMode="spline" keySplines={splines} />
              <animate attributeName="y" dur={`${dur}s`} repeatCount="indefinite" values={vals.map((v) => 384 - h(v)).join(";")} keyTimes={kts} calcMode="spline" keySplines={splines} />
            </rect>
            <text x={x + 28} y="397" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.5" style={mono}>
              {b.label}
            </text>
          </g>
        );
      })}
      <g opacity="0">
        <animate attributeName="opacity" dur={`${dur}s`} repeatCount="indefinite" values="0;0;1;1;0" keyTimes={kt(0, 0.6, 0.65, 0.92, 1)} />
        <rect x="302" y="281" width="62" height="20" rx="10" fill={c} />
        <text x="333" y="294.5" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fff" style={mono}>
          +4.2%
        </text>
      </g>
    </>
  );
}

/** The hero illustration: same drawing language as the project cards, in a tall frame. */
export function TrainingVisual({ className = "" }: { className?: string }) {
  const ref = useSmilPlayback(5.2);
  return (
    <svg ref={ref} viewBox="0 0 400 420" preserveAspectRatio="xMidYMid meet" className={`text-fg ${className}`} aria-hidden>
      <Training c="#7c74ff" />
    </svg>
  );
}

const scenes = { chart: Chart, redis: Redis, market: Market, compress: Compress, monitor: Monitor, mobile: Mobile, kanban: Kanban, chat: Chat };

export function ProjectVisual({ project }: { project: Project }) {
  const ref = useSmilPlayback();
  const Scene = scenes[project.visual];

  return (
    <svg ref={ref} viewBox="0 0 400 220" className="size-full text-fg" role="img" aria-label={`${project.title} illustration`}>
      <Scene c={project.accent} />
    </svg>
  );
}
