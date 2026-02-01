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
import { ArrowUpDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState, useEffect } from "react";

interface Feature {
  id: string;
  name: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  riceScore: number;
}

// Dummy data for 5 features
const initialFeatures: Feature[] = [
  {
    id: "1",
    name: "AI-Powered Search",
    reach: 5000,
    impact: 3,
    confidence: 80,
    effort: 4,
    riceScore: 3000,
  },
  {
    id: "2",
    name: "Dark Mode Support",
    reach: 8000,
    impact: 2,
    confidence: 95,
    effort: 2,
    riceScore: 7600,
  },
  {
    id: "3",
    name: "Export to CSV",
    reach: 2000,
    impact: 2,
    confidence: 90,
    effort: 1,
    riceScore: 3600,
  },
  {
    id: "4",
    name: "Team Collaboration",
    reach: 3500,
    impact: 3,
    confidence: 70,
    effort: 5,
    riceScore: 1470,
  },
  {
    id: "5",
    name: "Mobile App",
    reach: 6000,
    impact: 3,
    confidence: 60,
    effort: 8,
    riceScore: 1350,
  },
];

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
  if (score > 500) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (score >= 200) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-slate-500/15 text-slate-400 border-slate-500/30";
}

const STORAGE_KEY = "featurerank-features";

interface FormData {
  name: string;
  reach: string;
  impact: string;
  confidence: number;
  effort: string;
}

const initialFormData: FormData = {
  name: "",
  reach: "",
  impact: "",
  confidence: 80,
  effort: "",
};

export function FeaturesTable() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load features from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFeatures(parsed);
      } catch {
        setFeatures(initialFeatures);
      }
    } else {
      setFeatures(initialFeatures);
    }
    setIsLoaded(true);
  }, []);

  // Save features to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
    }
  }, [features, isLoaded]);

  const calculateRiceScore = (
    reach: number,
    impact: number,
    confidence: number,
    effort: number
  ): number => {
    return Math.round((reach * impact * (confidence / 100)) / effort);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reach = Number.parseInt(formData.reach, 10);
    const impact = Number.parseFloat(formData.impact);
    const effort = Number.parseInt(formData.effort, 10);
    const confidence = formData.confidence;

    if (!formData.name || !reach || !impact || !effort) {
      return;
    }

    const riceScore = calculateRiceScore(reach, impact, confidence, effort);

    const newFeature: Feature = {
      id: Date.now().toString(),
      name: formData.name,
      reach,
      impact,
      confidence,
      effort,
      riceScore,
    };

    setFeatures((prev) => [...prev, newFeature]);
    setFormData(initialFormData);
    setIsDialogOpen(false);
  };

  const sortByRice = () => {
    const newDirection = sortDirection === "desc" ? "asc" : "desc";
    setSortDirection(newDirection);
    const sorted = [...features].sort((a, b) =>
      newDirection === "desc"
        ? b.riceScore - a.riceScore
        : a.riceScore - b.riceScore
    );
    setFeatures(sorted);
  };

  const deleteFeature = (id: string) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  };

  // Sort features for display
  const sortedFeatures = [...features].sort((a, b) =>
    sortDirection === "desc"
      ? b.riceScore - a.riceScore
      : a.riceScore - b.riceScore
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">
            Feature Backlog
          </h2>
          <p className="text-sm text-muted-foreground">
            {features.length} features prioritized by RICE score
          </p>
        </div>
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
                Enter the feature details to calculate its RICE score and add it to the backlog.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 py-4">
                {/* Feature Name */}
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

                {/* Reach */}
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
                      setFormData((prev) => ({ ...prev, reach: e.target.value }))
                    }
                    className="bg-input"
                  />
                </div>

                {/* Impact */}
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

                {/* Confidence */}
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

                {/* Effort */}
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
                      setFormData((prev) => ({ ...prev, effort: e.target.value }))
                    }
                    className="bg-input"
                  />
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

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[280px] text-muted-foreground">
              Feature Name
            </TableHead>
            <TableHead className="text-muted-foreground">Reach</TableHead>
            <TableHead className="text-muted-foreground">Impact</TableHead>
            <TableHead className="text-muted-foreground">
              Confidence (%)
            </TableHead>
            <TableHead className="text-muted-foreground">Effort</TableHead>
            <TableHead className="text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={sortByRice}
                className="-ml-3 h-8 gap-1 text-muted-foreground hover:text-foreground"
              >
                RICE Score
                <ArrowUpDown className="h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFeatures.map((feature, index) => (
            <TableRow
              key={feature.id}
              className={cn(
                "border-border transition-colors group",
                index === 0 && sortDirection === "desc"
                  ? "bg-primary/5"
                  : "hover:bg-muted/50"
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
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {getEffortLabel(feature.effort)} ({feature.effort})
                </span>
              </TableCell>
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
