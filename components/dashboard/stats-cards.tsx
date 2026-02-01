import { Card, CardContent } from "@/components/ui/card";
import { Layers, TrendingUp, Clock, Target } from "lucide-react";

const stats = [
  {
    label: "Total Features",
    value: "5",
    icon: Layers,
    change: "+2 this week",
  },
  {
    label: "Avg RICE Score",
    value: "3,404",
    icon: TrendingUp,
    change: "+12% from last month",
  },
  {
    label: "In Progress",
    value: "2",
    icon: Clock,
    change: "On track",
  },
  {
    label: "Completed",
    value: "8",
    icon: Target,
    change: "This quarter",
  },
];

export function StatsCards() {
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
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {stat.change}
                </p>
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
