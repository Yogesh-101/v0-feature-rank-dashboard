"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, Center, Text3D } from "@react-three/drei";
import { useRef, useState, Suspense, useEffect } from "react";
import type * as THREE from "three";

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#5eead4" transparent opacity={0.5} />
    </mesh>
  );
}

function FloatingCube({
  position,
  scale = 1,
  color,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.1 : scale}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({
  position,
  scale = 1,
  color,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.1 : scale}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.8}
          roughness={0.05}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({
  position,
  scale = 1,
  color,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.1 : scale}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.75}
          roughness={0.08}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </Float>
  );
}

function Logo3D() {
  return (
    <Center position={[0, 0, -2]}>
      <Text3D
        font="/fonts/Geist_Bold.json"
        size={0.8}
        height={0.15}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={5}
      >
        FR
        <meshStandardMaterial color="#5eead4" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Center>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#5eead4" />

      <Environment preset="night" />

      <Logo3D />

      {/* Floating elements */}
      <FloatingCube position={[-3, 1.5, 0]} scale={0.7} color="#5eead4" />
      <FloatingCube position={[3.5, -1, 1]} scale={0.5} color="#38bdf8" />
      <FloatingSphere position={[2.5, 2, -1]} scale={0.8} color="#a78bfa" />
      <FloatingSphere position={[-2.5, -1.5, 0.5]} scale={0.6} color="#5eead4" />
      <FloatingTorus position={[-1.5, 2.5, 1]} scale={0.7} color="#f472b6" />
      <FloatingTorus position={[1.5, -2, -0.5]} scale={0.5} color="#5eead4" />

      {/* Additional ambient shapes */}
      <FloatingCube position={[4, 0.5, -2]} scale={0.3} color="#94a3b8" />
      <FloatingSphere position={[-4, 0, -1]} scale={0.4} color="#94a3b8" />
    </>
  );
}

// Handle WebGL context loss
function ContextHandler() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
    };

    const handleContextRestored = () => {
      // Context restored, renderer will automatically reinitialize
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl]);

  return null;
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ContextHandler />
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
