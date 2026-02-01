"use client";

import { useEffect, useState } from "react";
import LiquidEther from "./liquid-ether";

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback CSS background
  const FallbackBackground = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );

  if (!mounted || hasError) {
    return <FallbackBackground />;
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Liquid Ether Effect */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        onError={() => setHasError(true)}
      >
        <LiquidEther
          colors={["#14b8a6", "#5eead4", "#22d3ee"]}
          mouseForce={15}
          cursorSize={120}
          resolution={0.4}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={1.8}
          autoResumeDelay={2000}
          className="w-full h-full"
        />
      </div>

      {/* Subtle glow overlays */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
    </div>
  );
}
