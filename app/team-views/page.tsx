"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SharedFeaturesTable } from "@/components/dashboard/shared-features-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Code, Briefcase, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TeamView = "sales" | "engineering" | "standard";

interface TeamOption {
  id: TeamView;
  name: string;
  description: string;
  icon: typeof Users;
  color: string;
  features: string[];
}

const teamOptions: TeamOption[] = [
  {
    id: "standard",
    name: "Standard View",
    description: "Full feature list with all columns and metrics",
    icon: Users,
    color: "bg-primary/10 text-primary border-primary/30",
    features: [
      "All features visible",
      "Full RICE scoring",
      "All columns displayed",
      "Default sorting by score",
    ],
  },
  {
    id: "sales",
    name: "Sales Team",
    description: "Focused on customer-facing features and reach metrics",
    icon: Briefcase,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    features: [
      "Hides Infrastructure & Refactor",
      "Effort column hidden",
      "High reach features highlighted",
      "Customer-focused priorities",
    ],
  },
  {
    id: "engineering",
    name: "Engineering Team",
    description: "Technical view with effort-based sorting and risk analysis",
    icon: Code,
    color: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    features: [
      "Sorted by effort (high to low)",
      "Risk level column added",
      "High effort features highlighted",
      "Technical complexity focus",
    ],
  },
];

function TeamViewsContent() {
  const [selectedView, setSelectedView] = useState<TeamView>("standard");

  return (
    <div className="space-y-6">
      {/* Team Selection Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {teamOptions.map((team) => {
          const isSelected = selectedView === team.id;
          return (
            <Card
              key={team.id}
              className={cn(
                "cursor-pointer border-2 transition-all hover:shadow-lg",
                isSelected ? team.color : "border-border bg-card hover:border-muted-foreground/30"
              )}
              onClick={() => setSelectedView(team.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={cn("rounded-lg p-2", isSelected ? team.color : "bg-secondary")}>
                    <team.icon className="h-5 w-5" />
                  </div>
                  {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
                <CardTitle className="mt-3 text-lg">{team.name}</CardTitle>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {team.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Table with Selected View */}
      <SharedFeaturesTable
        showStatus
        title={`Features - ${teamOptions.find((t) => t.id === selectedView)?.name}`}
        description={teamOptions.find((t) => t.id === selectedView)?.description}
        defaultViewMode={selectedView}
      />
    </div>
  );
}

export default function TeamViewsPage() {
  return (
    <DashboardLayout
      title="Team Views"
      subtitle="Customized feature views for different teams"
    >
      <TeamViewsContent />
    </DashboardLayout>
  );
}
