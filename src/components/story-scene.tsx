"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { DoubleSide, MathUtils, Vector3 } from "three";
import { damp, pageScroll } from "@/lib/page-scroll";

function clamp(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}

function range(p: number, start: number, end: number) {
  return clamp((p - start) / (end - start));
}

function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

const stone = {
  color: "#e6dcc8",
  roughness: 0.78,
  metalness: 0.04,
} as const;

const gold = {
  color: "#c9a44a",
  roughness: 0.3,
  metalness: 0.72,
  emissive: "#3a2808",
  emissiveIntensity: 0.2,
} as const;

/** Camera chapters — approach → courtyard → arch → hall → dome → exit */
const shots = [
  { p: 0, pos: [9.5, 3.4, 14], look: [0, 1.8, 0] },
  { p: 0.12, pos: [3.2, 2.0, 8.5], look: [0, 1.5, 0.5] },
  { p: 0.24, pos: [0.2, 1.65, 5.2], look: [0, 1.55, 1.2] },
  { p: 0.38, pos: [0, 1.55, 2.55], look: [0, 1.6, 0] },
  { p: 0.52, pos: [0, 1.5, 0.35], look: [0, 2.8, -0.8] },
  { p: 0.66, pos: [-1.6, 1.55, -0.6], look: [1.2, 2.0, -0.4] },
  { p: 0.8, pos: [0.4, 2.6, -0.2], look: [0, 3.8, 0] },
  { p: 1, pos: [7.5, 5.2, 9], look: [0, 2.2, 0] },
];

function samplePath(progress: number) {
  const t = clamp(progress);
  let i = 0;
  while (i < shots.length - 1 && shots[i + 1].p < t) i += 1;
  const a = shots[i];
  const b = shots[Math.min(i + 1, shots.length - 1)];
  const e = smoothstep((t - a.p) / (b.p - a.p || 1));
  return {
    pos: a.pos.map((v, idx) => v + (b.pos[idx]! - v) * e) as [number, number, number],
    look: a.look.map((v, idx) => v + (b.look[idx]! - v) * e) as [number, number, number],
  };
}

function ScrollDamp() {
  useFrame((_, delta) => {
    pageScroll.p = damp(pageScroll.p, pageScroll.target, 5.5, delta);
  });
  return null;
}

function ArchWay({
  position,
  width = 1.3,
  height = 2.2,
  depth = 0.55,
}: {
  position: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
}) {
  const pillarW = 0.32;
  const opening = width - pillarW * 2;
  return (
    <group position={position}>
      <mesh position={[-(opening / 2 + pillarW / 2), height / 2, 0]} castShadow>
        <boxGeometry args={[pillarW, height, depth]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[opening / 2 + pillarW / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[pillarW, height, depth]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[0, height - 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[opening / 2 + 0.08, opening / 2 + 0.08, depth, 28, 1, false, 0, Math.PI]} />
        <meshStandardMaterial {...stone} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function Minaret({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.52, 4.4, 24]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[0, 4.45, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.16, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.52, 4.45, Math.sin(a) * 0.52]} castShadow>
            <boxGeometry args={[0.08, 0.42, 0.08]} />
            <meshStandardMaterial {...gold} />
          </mesh>
        );
      })}
      <mesh position={[0, 5.1, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.4, 0.9, 18]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[0, 5.8, 0]} castShadow>
        <coneGeometry args={[0.48, 0.85, 18]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0.12, 6.35, 0]} rotation={[0, 0, -0.4]} castShadow>
        <torusGeometry args={[0.14, 0.025, 10, 28, Math.PI * 1.45]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}

function Dome({
  position,
  radius,
}: {
  position: [number, number, number];
  radius: number;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[radius * 0.94, radius, 0.45, 48]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[radius, 56, 36, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d2c3a0" roughness={0.38} metalness={0.22} />
      </mesh>
      <mesh position={[0.14, radius + 0.35, 0]} rotation={[0, 0, -0.35]} castShadow>
        <torusGeometry args={[0.16, 0.028, 10, 28, Math.PI * 1.45]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}

function MasjidWorld() {
  const doorGlow = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const glow = range(pageScroll.p, 0.2, 0.55);
    if (doorGlow.current) {
      const mat = doorGlow.current.material as { emissiveIntensity?: number };
      if (mat.emissiveIntensity != null) {
        mat.emissiveIntensity = damp(mat.emissiveIntensity, 0.2 + glow * 1.4, 4, delta);
      }
    }
  });

  return (
    <group>
      {/* Ground / plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
        <circleGeometry args={[28, 64]} />
        <meshStandardMaterial color="#1a241c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.06, 0.5]} receiveShadow>
        <boxGeometry args={[14, 0.12, 12]} />
        <meshStandardMaterial color="#cfc3ab" roughness={0.88} />
      </mesh>

      {/* Outer courtyard walls */}
      <mesh position={[0, 1.2, -5.2]} castShadow receiveShadow>
        <boxGeometry args={[12, 2.4, 0.4]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[-6, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2, 10]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[6, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2, 10]} />
        <meshStandardMaterial {...stone} />
      </mesh>

      {/* Hollow hall — walls only so the camera can walk inside */}
      <mesh position={[-3.5, 2.1, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 4.0, 5.6]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[3.5, 2.1, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 4.0, 5.6]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[0, 2.1, -3.05]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 4.0, 0.35]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      {/* Roof slab under the dome */}
      <mesh position={[0, 4.05, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 0.28, 5.6]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      {/* Front facade with open center doorway */}
      <mesh position={[-2.35, 2.1, 2.25]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 4.0, 0.35]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[2.35, 2.1, 2.25]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 4.0, 0.35]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[0, 3.55, 2.25]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.1, 0.35]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      {/* Floor carpet */}
      <mesh position={[0, 0.14, -0.4]} receiveShadow>
        <boxGeometry args={[6.0, 0.06, 4.4]} />
        <meshStandardMaterial color="#4a2e18" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.18, -0.4]} receiveShadow>
        <boxGeometry args={[5.2, 0.02, 3.6]} />
        <meshStandardMaterial color="#6b3f22" roughness={0.85} />
      </mesh>

      {/* Interior columns */}
      {[-2.1, -0.7, 0.7, 2.1].map((x) =>
        [-1.4, 0.6].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.6, z]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 2.8, 16]} />
            <meshStandardMaterial {...stone} />
          </mesh>
        )),
      )}

      {/* Mihrab niche */}
      <mesh position={[0, 1.8, -2.55]} castShadow>
        <boxGeometry args={[1.6, 2.6, 0.35]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 1.7, -2.35]}>
        <planeGeometry args={[1.1, 2.0]} />
        <meshStandardMaterial color="#0d1a14" emissive="#c9a44a" emissiveIntensity={0.35} />
      </mesh>

      <Dome position={[0, 4.15, -0.4]} radius={2.15} />
      <Dome position={[-3.3, 3.3, -0.4]} radius={0.85} />
      <Dome position={[3.3, 3.3, -0.4]} radius={0.85} />

      <Minaret position={[-4.6, 0.1, -2.6]} />
      <Minaret position={[4.6, 0.1, -2.6]} />

      {/* Facade arches — entry sequence */}
      <ArchWay position={[0, 0.1, 3.6]} width={2.6} height={3.2} depth={0.7} />
      <ArchWay position={[-2.4, 0.15, 3.6]} width={1.5} height={2.4} depth={0.55} />
      <ArchWay position={[2.4, 0.15, 3.6]} width={1.5} height={2.4} depth={0.55} />

      {/* Portico */}
      {[-3, -1.5, 0, 1.5, 3].map((x) => (
        <mesh key={x} position={[x, 1.5, 4.3]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, 2.8, 14]} />
          <meshStandardMaterial {...stone} />
        </mesh>
      ))}
      <mesh position={[0, 3.0, 4.3]} castShadow>
        <boxGeometry args={[6.8, 0.22, 0.7]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      {/* Warm doorway light the camera walks through */}
      <mesh ref={doorGlow} position={[0, 1.7, 2.35]}>
        <planeGeometry args={[1.5, 2.6]} />
        <meshStandardMaterial
          color="#1a1208"
          emissive="#e0b45a"
          emissiveIntensity={0.25}
          transparent
          opacity={0.85}
          side={DoubleSide}
        />
      </mesh>

      {/* Steps */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.12 + i * 0.1, 5.0 + i * 0.28]} castShadow receiveShadow>
          <boxGeometry args={[5.5 - i * 0.4, 0.12, 0.45]} />
          <meshStandardMaterial color="#d7cdb8" roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function Atmosphere() {
  const group = useRef<Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        x: ((i * 47) % 100) / 100 * 16 - 8,
        y: 0.8 + ((i * 13) % 40) / 10,
        z: ((i * 29) % 100) / 100 * 14 - 4,
        s: 0.02 + (i % 4) * 0.01,
        sp: 0.08 + (i % 5) * 0.03,
      })),
    [],
  );

  useFrame((state) => {
    const children = group.current?.children ?? [];
    children.forEach((child, i) => {
      const s = seeds[i];
      if (!s) return;
      const t = state.clock.elapsedTime * s.sp;
      child.position.set(s.x + Math.sin(t + i) * 0.4, s.y + Math.sin(t * 0.6) * 0.25, s.z);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} scale={s.s} frustumCulled={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#e6d39a" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function CameraPath() {
  const { camera } = useThree();
  const look = useRef(new Vector3(0, 1.5, 0));
  const pos = useRef(new Vector3(9.5, 3.4, 14));

  useFrame((_, delta) => {
    const shot = samplePath(pageScroll.p);
    pos.current.x = damp(pos.current.x, shot.pos[0], 3.0, delta);
    pos.current.y = damp(pos.current.y, shot.pos[1], 3.0, delta);
    pos.current.z = damp(pos.current.z, shot.pos[2], 3.0, delta);
    look.current.x = damp(look.current.x, shot.look[0], 3.0, delta);
    look.current.y = damp(look.current.y, shot.look[1], 3.0, delta);
    look.current.z = damp(look.current.z, shot.look[2], 3.0, delta);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}

function World() {
  return (
    <>
      <ScrollDamp />
      <CameraPath />
      <fog attach="fog" args={["#0c0a07", 8, 32]} />
      <color attach="background" args={["#0c0a07"]} />
      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#f2e4c4", "#0f1a14", 0.55]} />
      <directionalLight
        castShadow
        position={[8, 12, 6]}
        intensity={1.55}
        color="#fff0d2"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#5f9a7c" />
      <pointLight position={[0, 2.2, 0]} intensity={0.7} color="#ffd27a" distance={10} />
      <MasjidWorld />
      <Atmosphere />
      <ContactShadows position={[0, 0.02, 0.5]} opacity={0.5} scale={24} blur={2.8} far={12} color="#050403" />
    </>
  );
}

export function StoryScene() {
  const [active, setActive] = useState(true);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    if (reduced) setActive(false);
    const onVis = () => setActive(!reduced && document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!webgl) {
    return <div className="h-full w-full bg-[#0c0a07]" />;
  }

  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        frameloop={active ? "always" : "demand"}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ position: [9.5, 3.4, 14], fov: 42, near: 0.1, far: 80 }}
      >
        <World />
      </Canvas>
    </div>
  );
}
