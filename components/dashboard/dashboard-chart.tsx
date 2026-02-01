"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFeatures } from "@/lib/features-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

function getRiceScoreColor(score: number): string {
  if (score > 500) return "#34d399";
  if (score >= 200) return "#fbbf24";
  return "#94a3b8";
}

export function DashboardChart() {
  const { features, isLoaded } = useFeatures();

  if (!isLoaded) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const sortedFeatures = [...features]
    .sort((a, b) => b.riceScore - a.riceScore)
    .slice(0, 5);

  const chartData = sortedFeatures.map((f) => ({
    name: f.name.length > 15 ? f.name.substring(0, 15) + "..." : f.name,
    score: f.riceScore,
    fullName: f.name,
  }));

  const statusData = [
    {
      name: "Backlog",
      value: features.filter((f) => f.status === "backlog").length,
      color: "#94a3b8",
    },
    {
      name: "In Progress",
      value: features.filter((f) => f.status === "in-progress").length,
      color: "#fbbf24",
    },
    {
      name: "Completed",
      value: features.filter((f) => f.status === "completed").length,
      color: "#34d399",
    },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border bg-card lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-card-foreground">
            Top Features by RICE Score
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Highest priority features based on RICE scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                  formatter={(value: number, _name: string, props: { payload: { fullName: string } }) => [
                    value.toLocaleString(),
                    props.payload.fullName,
                  ]}
                  labelFormatter={() => "RICE Score"}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiceScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-card-foreground">
            Status Distribution
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Features by current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
