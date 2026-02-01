"use client";

import { useEffect, useState } from "react";

// Animated CSS-only background with floating shapes
function AnimatedShape({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute rounded-2xl opacity-20 ${className}`}
      style={{
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated glow effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating shapes */}
      <AnimatedShape
        className="top-[15%] left-[10%] h-16 w-16 rotate-12 bg-gradient-to-br from-teal-400/30 to-cyan-400/20"
        delay={0}
      />
      <AnimatedShape
        className="top-[25%] right-[15%] h-20 w-20 -rotate-6 bg-gradient-to-br from-cyan-400/25 to-teal-400/15"
        delay={1}
      />
      <AnimatedShape
        className="bottom-[30%] left-[20%] h-12 w-12 rotate-45 bg-gradient-to-br from-emerald-400/20 to-teal-400/10"
        delay={2}
      />
      <AnimatedShape
        className="bottom-[20%] right-[25%] h-14 w-14 -rotate-12 bg-gradient-to-br from-teal-400/25 to-emerald-400/15"
        delay={0.5}
      />
      <AnimatedShape
        className="top-[40%] left-[35%] h-10 w-10 rotate-6 bg-gradient-to-br from-cyan-400/20 to-teal-400/10"
        delay={1.5}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(94, 234, 212, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(94, 234, 212, 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* CSS animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
          }
        }
      `}</style>
    </div>
  );
}
