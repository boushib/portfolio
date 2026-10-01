"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  MathUtils,
  NormalBlending,
  type ShaderMaterial,
} from "three";
import { useTheme, type Theme } from "@/lib/useTheme";
import { useInView } from "@/lib/useInView";
import { snoise } from "./noise";
import { colorsFor } from "./palette";

const orbVertex = /* glsl */ `
uniform float uTime;
uniform float uHover;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
${snoise}
void main(){
  float t = uTime * 0.35;
  float n = snoise(normal * 1.05 + t) * 0.55 + snoise(normal * 2.3 - t * 1.2) * 0.12;
  n *= 1.0 + uHover * 0.6;
  vNoise = n;
  vec3 pos = position + normal * n * 0.3;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}`;

const orbFragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform vec3 uBase;
uniform float uDark;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
  float band = sin(vNoise * 9.0 + uTime * 0.6) * 0.5 + 0.5;
  vec3 col = mix(uA, uB, smoothstep(-0.35, 0.45, vNoise));
  col = mix(col, uC, smoothstep(0.55, 1.0, band) * 0.55);
  // Iridescent rim, darker core on dark theme and a bright pearly core on light.
  vec3 core = mix(col * 0.75 + 0.3, col * 0.55 + uBase * 0.2, uDark);
  vec3 c = mix(core, col * 1.35 + 0.1, fres);
  c += fres * fres * 0.45 * mix(uBase, vec3(1.0), uDark);
  gl_FragColor = vec4(c, 1.0);
}`;

function Orb({ theme }: { theme: Theme }) {
  const group = useRef<Group>(null);
  const mat = useRef<ShaderMaterial>(null);
  const hover = useRef(0);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uA: { value: null as unknown },
    uB: { value: null as unknown },
    uC: { value: null as unknown },
    uBase: { value: null as unknown },
    uDark: { value: 1 },
  }));

  useEffect(() => {
    const material = mat.current!;
    const c = colorsFor(theme);
    material.uniforms.uA.value = c.a;
    material.uniforms.uB.value = c.b;
    material.uniforms.uC.value = c.c;
    material.uniforms.uBase.value = c.base;
    material.uniforms.uDark.value = theme === "dark" ? 1 : 0;
  }, [theme]);

  useFrame((state, delta) => {
    const g = group.current;
    const material = mat.current;
    if (!g || !material) return;
    material.uniforms.uTime.value += delta;
    material.uniforms.uHover.value = MathUtils.damp(material.uniforms.uHover.value, hover.current, 3, delta);
    const { x, y } = state.pointer;
    g.rotation.y = MathUtils.damp(g.rotation.y, x * 0.6 + state.clock.elapsedTime * 0.08, 2.5, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, -y * 0.4, 2.5, delta);
    // Portrait screens: smaller orb, lifted above the headline.
    const portrait = state.size.width < state.size.height;
    const baseScale = portrait ? 0.62 : 1;
    const baseY = portrait ? 1.35 : 0;
    // Drift the orb up and shrink it as the hero scrolls away.
    const p = Math.min(window.scrollY / window.innerHeight, 1.2);
    g.position.y = MathUtils.damp(g.position.y, baseY + p * 1.6, 6, delta);
    g.scale.setScalar(MathUtils.damp(g.scale.x, baseScale * (1 - p * 0.35), 3, delta));
  });

  return (
    <group ref={group} scale={0.4}>
      <mesh
        onPointerOver={() => (hover.current = 1)}
        onPointerOut={() => (hover.current = 0)}
      >
        <icosahedronGeometry args={[1.25, 128]} />
        <shaderMaterial ref={mat} vertexShader={orbVertex} fragmentShader={orbFragment} uniforms={uniforms} />
      </mesh>
      <Rings theme={theme} />
    </group>
  );
}

const ringVertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
attribute float aSeed;
varying float vSeed;
void main(){
  vSeed = aSeed;
  vec3 p = position;
  float a = uTime * (0.08 + aSeed * 0.12);
  float s = sin(a), c = cos(a);
  p.xz = mat2(c, -s, s, c) * p.xz;
  p.y += sin(uTime * 0.8 + aSeed * 40.0) * 0.05;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.6 + aSeed) * (1.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const ringFragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform float uAlpha;
varying float vSeed;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(mix(uA, uB, vSeed), a * uAlpha);
}`;

function buildRings() {
  const count = 2400;
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Two tilted belts plus a loose halo.
    const belt = i % 3;
    const angle = Math.random() * Math.PI * 2;
    const r = belt === 2 ? 2.2 + Math.random() * 1.8 : 2.0 + belt * 0.45 + (Math.random() - 0.5) * 0.25;
    const spread = belt === 2 ? 1.4 : 0.06;
    pos[i * 3] = Math.cos(angle) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 2] = Math.sin(angle) * r;
    seed[i] = Math.random();
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new BufferAttribute(seed, 1));
  return g;
}

function Rings({ theme }: { theme: Theme }) {
  const mat = useRef<ShaderMaterial>(null);
  const [geometry] = useState(buildRings);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uSize: { value: 38 },
    uAlpha: { value: 0.9 },
    uA: { value: null as unknown },
    uB: { value: null as unknown },
  }));

  useEffect(() => {
    const material = mat.current!;
    const c = colorsFor(theme);
    material.uniforms.uA.value = c.a;
    material.uniforms.uB.value = theme === "dark" ? c.b : c.c;
    material.uniforms.uAlpha.value = theme === "dark" ? 0.9 : 0.75;
    material.blending = theme === "dark" ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
  }, [theme]);

  useFrame((_, delta) => {
    if (mat.current) mat.current.uniforms.uTime.value += delta;
  });

  return (
    <points geometry={geometry} rotation={[0.35, 0, -0.25]}>
      <shaderMaterial
        ref={mat}
        vertexShader={ringVertex}
        fragmentShader={ringFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  const theme = useTheme();
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <Orb theme={theme} />
      </Canvas>
    </div>
  );
}
