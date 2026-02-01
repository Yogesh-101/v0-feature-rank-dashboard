"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import type * as THREE from "three";

// Simple animated cube
function AnimatedCube({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

// Simple animated sphere
function AnimatedSphere({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

// Minimal scene with few objects
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#5eead4" />

      {/* Just 3 simple objects */}
      <AnimatedCube position={[-2.5, 1, -1]} color="#5eead4" scale={0.8} />
      <AnimatedSphere position={[2.5, -0.5, -1]} color="#2dd4bf" scale={0.9} />
      <AnimatedCube position={[0, -1.5, -2]} color="#14b8a6" scale={0.6} />
    </>
  );
}

// Fallback gradient background (CSS-only, no WebGL)
function GradientFallback() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>
  );
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldRender3D, setShouldRender3D] = useState(true);

  useEffect(() => {
    // Check if we should even try to render 3D
    // Skip on low-end devices or if WebGL is not available
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setShouldRender3D(false);
      }
    } catch {
      setShouldRender3D(false);
    }
    setMounted(true);
  }, []);

  // Show fallback if not mounted, has error, or can't render 3D
  if (!mounted || hasError || !shouldRender3D) {
    return <GradientFallback />;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: true,
          preserveDrawingBuffer: false,
        }}
        dpr={1}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          
          // Handle context loss
          const canvas = gl.domElement;
          canvas.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setHasError(true);
          });
        }}
        onError={() => setHasError(true)}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
