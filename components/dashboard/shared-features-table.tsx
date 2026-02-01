"use client";

import React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, MoreHorizontal, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useFeatures, type Feature, type FeatureCategory } from "@/lib/features-context";

type ViewMode = "standard" | "sales" | "engineering";

interface FormData {
  name: string;
  reach: string;
  impact: string;
  confidence: number;
  effort: string;
  category: FeatureCategory;
}

const initialFormData: FormData = {
  name: "",
  reach: "",
  impact: "",
  confidence: 80,
  effort: "",
  category: "Feature",
};

const CATEGORIES: FeatureCategory[] = ["Feature", "Infrastructure", "Refactor", "Bug Fix", "Enhancement"];

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

function getImpactVariant(impact: number): "default" | "secondary" | "outline" {
  switch (impact) {
    case 3:
      return "default";
    case 2:
      return "secondary";
    case 1:
      return "secondary";
    default:
      return "outline";
  }
}

function getEffortLabel(effort: number): string {
  if (effort <= 2) return "Small";
  if (effort <= 4) return "Medium";
  if (effort <= 6) return "Large";
  return "XL";
}

function getRiceScoreColor(score: number): string {
  if (score > 500)
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (score >= 200) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-slate-500/15 text-slate-400 border-slate-500/30";
}

function formatDeliveryEstimate(weeks: number): string {
  if (weeks < 1) {
    const days = Math.ceil(weeks * 7);
    return `In ${days} day${days === 1 ? "" : "s"}`;
  }
  const roundedWeeks = Math.ceil(weeks);
  if (roundedWeeks === 1) {
    return "In 1 week";
  }
  if (roundedWeeks <= 8) {
    return `In ${roundedWeeks} weeks`;
  }
  const months = Math.ceil(roundedWeeks / 4);
  return `In ${months} month${months === 1 ? "" : "s"}`;
}

function getRiskLevel(feature: Feature): { level: string; className: string } | null {
  if (feature.effort > 4 && feature.confidence < 80) {
    return {
      level: "High Risk",
      className: "bg-red-500/15 text-red-400 border-red-500/30",
    };
  }
  if (feature.effort > 3 && feature.confidence < 70) {
    return {
      level: "Medium Risk",
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    };
  }
  return {
    level: "Low Risk",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
}

function getStatusBadge(status: Feature["status"]) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
          In Progress
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 hover:bg-slate-500/20">
          Backlog
        </Badge>
      );
  }
}

interface InsightResult {
  label: string;
  tooltip: string;
  className: string;
}

function getInsight(feature: Feature): InsightResult {
  const { impact, effort, confidence, reach } = feature;

  // Quick Win: High impact with low effort
  if (impact > 2 && effort < 2) {
    return {
      label: "Quick Win",
      tooltip: "High impact (>2) with low effort (<2). Prioritize this feature!",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    };
  }

  // Verify Effort: 100% confidence but low effort - might be underestimated
  if (confidence === 100 && effort < 2) {
    return {
      label: "Verify Effort",
      tooltip: "100% confidence with low effort (<2). Double-check if effort estimate is accurate.",
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    };
  }

  // Low Impact / High Reach: Reaches many users but low impact per user
  if (reach > 1000 && impact < 1) {
    return {
      label: "Low Impact / High Reach",
      tooltip: "Reaches many users (>1000) but low impact (<1). Consider if effort is justified.",
      className: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    };
  }

  // Standard: No special conditions met
  return {
    label: "Standard",
    tooltip: "No special conditions detected. Evaluate based on RICE score.",
    className: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  };
}

interface SharedFeaturesTableProps {
  filterStatus?: Feature["status"];
  showStatus?: boolean;
  title?: string;
  description?: string;
  defaultViewMode?: ViewMode;
}

export function SharedFeaturesTable({
  filterStatus,
  showStatus = false,
  title = "Feature Backlog",
  description,
  defaultViewMode = "standard",
}: SharedFeaturesTableProps) {
  const { features, addFeature, deleteFeature, updateFeature, isLoaded, velocity } =
    useFeatures();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reach = Number.parseInt(formData.reach, 10);
    const impact = Number.parseFloat(formData.impact);
    const effort = Number.parseInt(formData.effort, 10);
    const confidence = formData.confidence;

    if (!formData.name || !reach || !impact || !effort) {
      return;
    }

    addFeature({
      name: formData.name,
      reach,
      impact,
      confidence,
      effort,
      status: filterStatus || "backlog",
      category: formData.category,
    });

    setFormData(initialFormData);
    setIsDialogOpen(false);
  };

  const sortByRice = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Apply status filter first
  let filteredFeatures = filterStatus
    ? features.filter((f) => f.status === filterStatus)
    : features;

  // Apply view mode filters
  if (viewMode === "sales") {
    // Filter out Infrastructure and Refactor categories for sales team
    filteredFeatures = filteredFeatures.filter(
      (f) => f.category !== "Infrastructure" && f.category !== "Refactor"
    );
  }

  // Apply sorting based on view mode
  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    if (viewMode === "engineering") {
      // Engineering sorts by effort (high to low)
      return b.effort - a.effort;
    }
    // Standard and Sales sort by RICE score
    return sortDirection === "desc"
      ? b.riceScore - a.riceScore
      : a.riceScore - b.riceScore;
  });

  const featureCount = filteredFeatures.length;

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-muted-foreground">Loading features...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {description || `${featureCount} features prioritized by RICE score`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View As Dropdown */}
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-[160px] bg-secondary">
              <Users className="mr-2 h-4 w-4" />
              <SelectValue placeholder="View As..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="sales">Sales Team</SelectItem>
              <SelectItem value="engineering">Engineering Team</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add New Feature</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add New Feature</DialogTitle>
                <DialogDescription>
                  Enter the feature details to calculate its RICE score and add it
                  to the backlog.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Feature Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., User Authentication"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="bg-input"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reach">
                      Reach{" "}
                      <span className="font-normal text-muted-foreground">
                        (users per quarter)
                      </span>
                    </Label>
                    <Input
                      id="reach"
                      type="number"
                      placeholder="e.g., 5000"
                      min={1}
                      value={formData.reach}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reach: e.target.value,
                        }))
                      }
                      className="bg-input"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="impact">Impact</Label>
                    <Select
                      value={formData.impact}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, impact: value }))
                      }
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select impact level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Massive (3x)</SelectItem>
                        <SelectItem value="2">High (2x)</SelectItem>
                        <SelectItem value="1">Medium (1x)</SelectItem>
                        <SelectItem value="0.5">Low (0.5x)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="confidence">Confidence</Label>
                      <span className="text-sm font-medium text-primary">
                        {formData.confidence}%
                      </span>
                    </div>
                    <Slider
                      id="confidence"
                      min={0}
                      max={100}
                      step={5}
                      value={[formData.confidence]}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, confidence: value[0] }))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="effort">
                      Effort{" "}
                      <span className="font-normal text-muted-foreground">
                        (person-months, 1-5)
                      </span>
                    </Label>
                    <Input
                      id="effort"
                      type="number"
                      placeholder="e.g., 3"
                      min={1}
                      max={5}
                      value={formData.effort}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          effort: e.target.value,
                        }))
                      }
                      className="bg-input"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: FeatureCategory) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Feature</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[250px] text-muted-foreground">
              Feature Name
            </TableHead>
            {showStatus && (
              <TableHead className="text-muted-foreground">Status</TableHead>
            )}
            <TableHead className="text-muted-foreground">Reach</TableHead>
            <TableHead className="text-muted-foreground">Impact</TableHead>
            <TableHead className="text-muted-foreground">
              Confidence (%)
            </TableHead>
            {viewMode !== "sales" && (
              <TableHead className="text-muted-foreground">Effort</TableHead>
            )}
            <TableHead className="text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={sortByRice}
                className="-ml-3 h-8 gap-1 text-muted-foreground hover:text-foreground"
              >
                {viewMode === "engineering" ? "Effort Sort" : "RICE Score"}
                <ArrowUpDown className="h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead className="text-muted-foreground">Insight</TableHead>
            {viewMode === "engineering" && (
              <TableHead className="text-muted-foreground">Risk Level</TableHead>
            )}
            <TableHead className="text-muted-foreground">Est. Delivery</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFeatures.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  (showStatus ? 10 : 9) +
                  (viewMode === "engineering" ? 1 : 0) -
                  (viewMode === "sales" ? 1 : 0)
                }
                className="h-24 text-center text-muted-foreground"
              >
                No features found. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            sortedFeatures.map((feature, index) => (
              <TableRow
                key={feature.id}
                className={cn(
                  "border-border transition-colors group",
                  index === 0 && sortDirection === "desc" && viewMode === "standard"
                    ? "bg-primary/5"
                    : "hover:bg-muted/50",
                  // Sales view: gold border for high reach
                  viewMode === "sales" && feature.reach > 5000 && "ring-2 ring-amber-400/50 ring-inset",
                  // Engineering view: red background for high effort
                  viewMode === "engineering" && feature.effort === 5 && "bg-red-500/10"
                )}
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        index === 0 && sortDirection === "desc"
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                    {feature.name}
                  </div>
                </TableCell>
                {showStatus && <TableCell>{getStatusBadge(feature.status)}</TableCell>}
                <TableCell className="text-foreground">
                  {feature.reach.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getImpactVariant(feature.impact)}
                    className="font-medium"
                  >
                    {getImpactLabel(feature.impact)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${feature.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm text-foreground">
                      {feature.confidence}%
                    </span>
                  </div>
                </TableCell>
                {viewMode !== "sales" && (
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {getEffortLabel(feature.effort)} ({feature.effort})
                    </span>
                  </TableCell>
                )}
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold tabular-nums",
                      getRiceScoreColor(feature.riceScore)
                    )}
                  >
                    {feature.riceScore.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  {(() => {
                    const insight = getInsight(feature);
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              className={cn(
                                "cursor-help border font-medium",
                                insight.className
                              )}
                            >
                              {insight.label === "Quick Win" && "🚀 "}
                              {insight.label === "Verify Effort" && "⚠️ "}
                              {insight.label === "Low Impact / High Reach" && "📢 "}
                              {insight.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[250px]">
                            <p className="text-sm">{insight.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })()}
                </TableCell>
                {viewMode === "engineering" && (
                  <TableCell>
                    {(() => {
                      const risk = getRiskLevel(feature);
                      return (
                        <Badge className={cn("border font-medium", risk?.className)}>
                          {risk?.level}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                )}
                <TableCell>
                  {(() => {
                    // Calculate cumulative effort up to and including this feature
                    const cumulativeEffort = sortedFeatures
                      .slice(0, index + 1)
                      .reduce((sum, f) => sum + f.effort, 0);
                    const weeksToDelivery = cumulativeEffort / velocity;
                    const deliveryText = formatDeliveryEstimate(weeksToDelivery);
                    
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground cursor-help">
                              {deliveryText}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <p className="text-sm">
                              Cumulative effort: {cumulativeEffort} points
                              <br />
                              Team velocity: {velocity} pts/week
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            updateFeature(feature.id, { status: "backlog" })
                          }
                        >
                          Move to Backlog
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateFeature(feature.id, { status: "in-progress" })
                          }
                        >
                          Start Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateFeature(feature.id, { status: "completed" })
                          }
                        >
                          Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFeature(feature.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFeature(feature.id)}
                      className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete feature</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
