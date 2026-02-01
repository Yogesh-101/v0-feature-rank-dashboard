"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Layers, TrendingUp, Clock, Target } from "lucide-react";
import { useFeatures } from "@/lib/features-context";

export function DynamicStats() {
  const { features, isLoaded } = useFeatures();

  const totalFeatures = features.length;
  const inProgress = features.filter((f) => f.status === "in-progress").length;
  const completed = features.filter((f) => f.status === "completed").length;
  const avgRiceScore =
    features.length > 0
      ? Math.round(features.reduce((acc, f) => acc + f.riceScore, 0) / features.length)
      : 0;

  const stats = [
    {
      label: "Total Features",
      value: isLoaded ? totalFeatures.toString() : "-",
      icon: Layers,
      change: `${features.filter((f) => f.status === "backlog").length} in backlog`,
    },
    {
      label: "Avg RICE Score",
      value: isLoaded ? avgRiceScore.toLocaleString() : "-",
      icon: TrendingUp,
      change: avgRiceScore > 3000 ? "High priority" : "Moderate priority",
    },
    {
      label: "In Progress",
      value: isLoaded ? inProgress.toString() : "-",
      icon: Clock,
      change: inProgress > 0 ? "Active development" : "None active",
    },
    {
      label: "Completed",
      value: isLoaded ? completed.toString() : "-",
      icon: Target,
      change: "This quarter",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-card-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">{stat.change}</p>
              </div>
              <div className="rounded-lg bg-secondary p-2.5">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
