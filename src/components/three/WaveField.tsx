"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, NormalBlending, type ShaderMaterial, Vector2 } from "three";
import { useTheme, type Theme } from "@/lib/useTheme";
import { useInView } from "@/lib/useInView";
import { snoise } from "./noise";
import { colorsFor } from "./palette";

const vertex = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
varying float vH;
varying float vFade;
${snoise}
void main(){
  vec3 p = position;
  float t = uTime * 0.25;
  float h = snoise(vec3(p.x * 0.12, p.z * 0.16, t)) * 1.1
          + sin(p.x * 0.35 + uTime * 0.9) * 0.25;
  // A soft bulge that follows the pointer across the field.
  float d = distance(p.xz, uPointer * vec2(18.0, 8.0));
  h += exp(-d * d * 0.02) * 1.6;
  p.y += h;
  vH = h;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vFade = smoothstep(-40.0, -8.0, mv.z);
  gl_PointSize = (2.2 + h * 1.2) * (22.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const fragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uAlpha;
varying float vH;
varying float vFade;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 col = mix(uA, uB, smoothstep(-0.8, 0.8, vH));
  col = mix(col, uC, smoothstep(1.0, 2.2, vH));
  gl_FragColor = vec4(col, smoothstep(0.5, 0.1, d) * vFade * uAlpha);
}`;

function buildField() {
  const cols = 180;
  const rows = 70;
  const pos = new Float32Array(cols * rows * 3);
  let i = 0;
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < rows; z++) {
      pos[i++] = (x - cols / 2) * 0.32;
      pos[i++] = 0;
      pos[i++] = (z - rows / 2) * 0.32;
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  return g;
}

function Field({ theme }: { theme: Theme }) {
  const mat = useRef<ShaderMaterial>(null);
  const [geometry] = useState(buildField);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uPointer: { value: new Vector2() },
    uA: { value: null as unknown },
    uB: { value: null as unknown },
    uC: { value: null as unknown },
    uAlpha: { value: 1 },
  }));

  useEffect(() => {
    const material = mat.current!;
    const c = colorsFor(theme);
    material.uniforms.uA.value = c.a;
    material.uniforms.uB.value = c.b;
    material.uniforms.uC.value = c.c;
    material.uniforms.uAlpha.value = theme === "dark" ? 0.95 : 0.8;
    material.blending = theme === "dark" ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
  }, [theme]);

  useFrame((state, delta) => {
    const material = mat.current;
    if (!material) return;
    material.uniforms.uTime.value += delta;
    (material.uniforms.uPointer.value as Vector2).lerp(state.pointer, 1 - Math.exp(-delta * 3));
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function WaveField() {
  const theme = useTheme();
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 5.5, 15], fov: 50, rotation: [-0.32, 0, 0] }}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: false, alpha: true }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <Field theme={theme} />
      </Canvas>
    </div>
  );
}
