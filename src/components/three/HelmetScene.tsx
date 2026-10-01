"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial, type Object3D, type PointLight } from "three";
import { useTheme, type Theme } from "@/lib/useTheme";
import { useInView } from "@/lib/useInView";
import { palettes } from "./palette";

// "Battle Damaged Sci-fi Helmet" by theblueturtle_ (CC BY-NC 4.0), glTF rebuild by ctxwing —
// the model from the three.js glTF loader example, meshopt + WebP compressed.
// const MODEL = "/models/helmet.glb"; // original, battle-damaged textures
const MODEL = "/models/helmet-clean.glb"; // scratches, burns and stains cleaned out of the textures
const HDR = "/hdr/royal_esplanade_1k.hdr";

/** Sets the glow of every emissive (visor / panel light) material in the model. */
function setEmissive(root: Object3D, intensity: number) {
  root.traverse((o) => {
    const m = (o as Mesh).material as MeshStandardMaterial | undefined;
    if ((o as Mesh).isMesh && m?.emissiveMap) m.emissiveIntensity = intensity;
  });
}

function Helmet({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF(MODEL);
  const group = useRef<Group>(null);

  useEffect(onReady, [onReady]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;

    // Entrance: spin in from the side and grow into place.
    const intro = Math.min(t / 2.2, 1);
    const eased = 1 - Math.pow(1 - intro, 4);

    // Look toward the cursor with a slow idle sway on top.
    const targetY = -0.45 + x * 0.55 + Math.sin(t * 0.35) * 0.12 + (1 - eased) * 2.4;
    const targetX = -y * 0.3 + Math.sin(t * 0.5) * 0.05;
    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.rotation.z = MathUtils.damp(g.rotation.z, x * -0.08, 3, delta);

    // Portrait screens: smaller and lifted above the headline.
    const portrait = state.size.width < state.size.height;
    const baseScale = portrait ? 0.55 : 0.88;
    const baseY = portrait ? 0.62 : 0.12;
    // Float, then drift up and shrink as the hero scrolls away.
    const p = Math.min(window.scrollY / window.innerHeight, 1.2);
    g.position.y = MathUtils.damp(g.position.y, baseY + Math.sin(t * 0.9) * 0.06 + p * 1.6, 5, delta);
    g.scale.setScalar(MathUtils.damp(g.scale.x, baseScale * eased * (1 - p * 0.35), 6, delta));

    // Pulse the visor and panel lights.
    setEmissive(g, 1.6 + Math.sin(t * 2.2) * 0.6);
  });

  return (
    <group ref={group} scale={0}>
      <primitive object={scene} />
    </group>
  );
}

function RimLights({ theme }: { theme: Theme }) {
  const a = useRef<PointLight>(null);
  const b = useRef<PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Two accent lights orbit behind the helmet for a coloured rim.
    a.current?.position.set(Math.cos(t * 0.4) * 3, 1.2, -1.5 + Math.sin(t * 0.4));
    b.current?.position.set(Math.cos(t * 0.4 + Math.PI) * 3, -1, -1.5 + Math.sin(t * 0.4 + Math.PI));
  });

  const p = palettes[theme];
  return (
    <>
      <pointLight ref={a} color={p.a} intensity={theme === "dark" ? 25 : 12} distance={8} />
      <pointLight ref={b} color={p.b} intensity={theme === "dark" ? 25 : 12} distance={8} />
    </>
  );
}

export default function HelmetScene({ onReady }: { onReady?: () => void }) {
  const theme = useTheme();
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <Environment files={HDR} environmentIntensity={theme === "dark" ? 0.9 : 1.1} />
          <Helmet onReady={onReady ?? noop} />
        </Suspense>
        <RimLights theme={theme} />
      </Canvas>
    </div>
  );
}

const noop = () => {};

useGLTF.preload(MODEL);
