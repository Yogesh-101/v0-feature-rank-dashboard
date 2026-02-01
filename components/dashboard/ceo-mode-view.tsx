"use client";

import React from "react";
import { useFeatures, type Feature } from "@/lib/features-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, Users, Zap, Target } from "lucide-react";

function getImpactLabel(impact: number): string {
  switch (impact) {
    case 3:
      return "Massive";
    case 2:
      return "High";
    case 1:
      return "Medium";
    case 0.5:
      return "Low";
    default:
      return "Unknown";
  }
}

function getRiceScoreColor(score: number): {
  stroke: string;
  bg: string;
  text: string;
} {
  if (score > 500) {
    return {
      stroke: "stroke-emerald-400",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
    };
  }
  if (score >= 200) {
    return {
      stroke: "stroke-amber-400",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
    };
  }
  return {
    stroke: "stroke-slate-400",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
  };
}

interface CircularProgressProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({
  score,
  maxScore = 2000,
  size = 140,
  strokeWidth = 10,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(score / maxScore, 1);
  const offset = circumference - percent * circumference;
  const colors = getRiceScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-1000 ease-out", colors.stroke)}
        />
      </svg>
      {/* Score in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-bold tabular-nums", colors.text)}>
          {score.toLocaleString()}
        </span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          RICE Score
        </span>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  feature: Feature;
  rank: number;
}

function FeatureCard({ feature, rank }: FeatureCardProps) {
  const colors = getRiceScoreColor(feature.riceScore);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-800 p-8 transition-all duration-300 hover:border-slate-700 hover:shadow-2xl",
        colors.bg
      )}
    >
      {/* Rank Badge */}
      <div className="absolute right-6 top-6">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
            rank === 1
              ? "bg-amber-500/20 text-amber-400"
              : rank === 2
                ? "bg-slate-400/20 text-slate-300"
                : "bg-orange-500/20 text-orange-400"
          )}
        >
          #{rank}
        </div>
      </div>

      {/* Feature Name */}
      <h3 className="mb-6 pr-12 text-2xl font-bold text-white lg:text-3xl">
        {feature.name}
      </h3>

      {/* Circular Progress */}
      <div className="mb-8 flex justify-center">
        <CircularProgress score={feature.riceScore} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-900/50 p-4">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Reach</span>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">
            {feature.reach.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/50 p-4">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <Zap className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Impact</span>
          </div>
          <Badge
            className={cn(
              "mt-1 border font-semibold",
              feature.impact >= 2
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                : "border-slate-500/30 bg-slate-500/15 text-slate-400"
            )}
          >
            {getImpactLabel(feature.impact)}
          </Badge>
        </div>

        <div className="rounded-xl bg-slate-900/50 p-4">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <Target className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Confidence</span>
          </div>
          <p className="text-xl font-semibold text-white">{feature.confidence}%</p>
        </div>

        <div className="rounded-xl bg-slate-900/50 p-4">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Effort</span>
          </div>
          <p className="text-xl font-semibold text-white">
            {feature.effort} {feature.effort === 1 ? "month" : "months"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CEOModeView() {
  const { features, isLoaded } = useFeatures();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xl text-slate-500">Loading...</p>
      </div>
    );
  }

  // Get top 3 highest scoring features
  const topFeatures = [...features]
    .sort((a, b) => b.riceScore - a.riceScore)
    .slice(0, 3);

  if (topFeatures.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50">
        <p className="text-xl text-slate-500">
          No features to display. Add some features to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white lg:text-4xl">
          Top Priority Features
        </h2>
        <p className="mt-2 text-lg text-slate-400">
          Ranked by RICE Score - Higher is better
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topFeatures.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} rank={index + 1} />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 flex flex-wrap justify-center gap-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-white tabular-nums">
            {features.length}
          </p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">
            Total Features
          </p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-emerald-400 tabular-nums">
            {topFeatures[0]?.riceScore.toLocaleString() || 0}
          </p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">
            Highest Score
          </p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-white tabular-nums">
            {Math.round(
              features.reduce((acc, f) => acc + f.riceScore, 0) / features.length || 0
            ).toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">
            Average Score
          </p>
        </div>
      </div>
    </div>
  );
}
