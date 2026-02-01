"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeatures } from "@/lib/features-context";
import { TrendingUp, Target, Users, Clock } from "lucide-react";

function AnalyticsContent() {
  const { features, isLoaded, velocity } = useFeatures();

  if (!isLoaded) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  const totalRiceScore = features.reduce((sum, f) => sum + f.riceScore, 0);
  const avgRiceScore = features.length > 0 ? Math.round(totalRiceScore / features.length) : 0;
  const totalEffort = features.reduce((sum, f) => sum + f.effort, 0);
  const estimatedWeeks = Math.ceil(totalEffort / velocity);
  const highImpactFeatures = features.filter((f) => f.impact >= 2).length;

  const stats = [
    {
      title: "Total RICE Score",
      value: totalRiceScore.toLocaleString(),
      description: "Combined prioritization score",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      title: "Average Score",
      value: avgRiceScore.toLocaleString(),
      description: "Per feature average",
      icon: Target,
      color: "text-amber-400",
    },
    {
      title: "High Impact Features",
      value: highImpactFeatures,
      description: "Impact >= High",
      icon: Users,
      color: "text-sky-400",
    },
    {
      title: "Est. Delivery",
      value: `${estimatedWeeks} weeks`,
      description: `At ${velocity} pts/week velocity`,
      icon: Clock,
      color: "text-violet-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardChart />

      {/* Category Breakdown */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Features grouped by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {["Feature", "Enhancement", "Bug Fix", "Infrastructure", "Refactor"].map((category) => {
              const count = features.filter((f) => f.category === category).length;
              const percentage = features.length > 0 ? Math.round((count / features.length) * 100) : 0;
              return (
                <div key={category} className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm font-medium text-foreground">{category}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Insights and metrics for your product roadmap"
    >
      <AnalyticsContent />
    </DashboardLayout>
  );
}
