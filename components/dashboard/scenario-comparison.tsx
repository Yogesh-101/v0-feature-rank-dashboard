"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFeatures, type Feature } from "@/lib/features-context";
import { cn } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown, Equal, DollarSign, Zap } from "lucide-react";

interface ScenarioFeature extends Feature {
  scenarioImpact?: number;
  scenarioEffort?: number;
}

interface ScenarioComparisonProps {
  onClose: () => void;
  showBackButton?: boolean;
}

function calculateRiceScore(reach: number, impact: number, confidence: number, effort: number): number {
  return Math.round((reach * impact * (confidence / 100)) / effort);
}

function SummaryCard({
  title,
  totalImpact,
  totalCost,
  isHighlighted,
  comparisonImpact,
  comparisonCost,
}: {
  title: string;
  totalImpact: number;
  totalCost: number;
  isHighlighted?: boolean;
  comparisonImpact?: number;
  comparisonCost?: number;
}) {
  const impactDiff = comparisonImpact !== undefined ? totalImpact - comparisonImpact : 0;
  const costDiff = comparisonCost !== undefined ? totalCost - comparisonCost : 0;

  return (
    <Card className={cn(
      "border-border bg-card",
      isHighlighted && "ring-2 ring-primary/50"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-muted-foreground">Total Impact Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-2xl font-bold tabular-nums",
              comparisonImpact !== undefined && impactDiff > 0 && "text-emerald-400",
              comparisonImpact !== undefined && impactDiff < 0 && "text-red-400"
            )}>
              {totalImpact.toLocaleString()}
            </span>
            {comparisonImpact !== undefined && impactDiff !== 0 && (
              <Badge className={cn(
                "text-xs",
                impactDiff > 0 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              )}>
                {impactDiff > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {impactDiff > 0 ? "+" : ""}{impactDiff.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-sky-400" />
            <span className="text-sm text-muted-foreground">Total Cost (Effort)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-2xl font-bold tabular-nums",
              comparisonCost !== undefined && costDiff < 0 && "text-emerald-400",
              comparisonCost !== undefined && costDiff > 0 && "text-red-400"
            )}>
              {totalCost} pts
            </span>
            {comparisonCost !== undefined && costDiff !== 0 && (
              <Badge className={cn(
                "text-xs",
                costDiff < 0 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              )}>
                {costDiff < 0 ? (
                  <TrendingDown className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingUp className="mr-1 h-3 w-3" />
                )}
                {costDiff > 0 ? "+" : ""}{costDiff}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScenarioColumn({
  title,
  description,
  features,
  isEditable,
  onUpdateFeature,
  totalImpact,
  totalCost,
  comparisonImpact,
  comparisonCost,
  isWinner,
}: {
  title: string;
  description: string;
  features: ScenarioFeature[];
  isEditable: boolean;
  onUpdateFeature?: (id: string, field: "impact" | "effort", value: number) => void;
  totalImpact: number;
  totalCost: number;
  comparisonImpact?: number;
  comparisonCost?: number;
  isWinner?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card className={cn(
        "border-border bg-card flex-1",
        isWinner && "ring-2 ring-emerald-500/50"
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {isWinner && (
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                Better Impact
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-muted-foreground">Feature</TableHead>
                  <TableHead className="text-muted-foreground w-[100px]">Impact</TableHead>
                  <TableHead className="text-muted-foreground w-[100px]">Effort</TableHead>
                  <TableHead className="text-muted-foreground w-[100px]">RICE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => {
                  const currentImpact = feature.scenarioImpact ?? feature.impact;
                  const currentEffort = feature.scenarioEffort ?? feature.effort;
                  const riceScore = calculateRiceScore(
                    feature.reach,
                    currentImpact,
                    feature.confidence,
                    currentEffort
                  );

                  return (
                    <TableRow key={feature.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {feature.name}
                      </TableCell>
                      <TableCell>
                        {isEditable ? (
                          <Input
                            type="number"
                            min={0.5}
                            max={3}
                            step={0.5}
                            value={currentImpact}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0.5 && val <= 3) {
                                onUpdateFeature?.(feature.id, "impact", val);
                              }
                            }}
                            className="h-8 w-16 bg-input text-center"
                          />
                        ) : (
                          <span className="text-foreground">{currentImpact}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditable ? (
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={currentEffort}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val >= 1 && val <= 10) {
                                onUpdateFeature?.(feature.id, "effort", val);
                              }
                            }}
                            className="h-8 w-16 bg-input text-center"
                          />
                        ) : (
                          <span className="text-foreground">{currentEffort}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold tabular-nums text-foreground">
                          {riceScore.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SummaryCard
        title={`${title} Summary`}
        totalImpact={totalImpact}
        totalCost={totalCost}
        comparisonImpact={comparisonImpact}
        comparisonCost={comparisonCost}
        isHighlighted={isWinner}
      />
    </div>
  );
}

export function ScenarioComparison({ onClose, showBackButton = true }: ScenarioComparisonProps) {
  const { features, isLoaded } = useFeatures();

  // Scenario B modifications stored as a map of id -> { impact, effort }
  const [scenarioBModifications, setScenarioBModifications] = useState<
    Record<string, { impact?: number; effort?: number }>
  >({});

  // Calculate totals for Scenario A (live data)
  const scenarioATotals = useMemo(() => {
    const totalImpact = features.reduce((sum, f) => {
      const riceScore = calculateRiceScore(f.reach, f.impact, f.confidence, f.effort);
      return sum + riceScore;
    }, 0);
    const totalCost = features.reduce((sum, f) => sum + f.effort, 0);
    return { totalImpact, totalCost };
  }, [features]);

  // Calculate totals for Scenario B (modified data)
  const scenarioBTotals = useMemo(() => {
    const totalImpact = features.reduce((sum, f) => {
      const mod = scenarioBModifications[f.id];
      const impact = mod?.impact ?? f.impact;
      const effort = mod?.effort ?? f.effort;
      const riceScore = calculateRiceScore(f.reach, impact, f.confidence, effort);
      return sum + riceScore;
    }, 0);
    const totalCost = features.reduce((sum, f) => {
      const mod = scenarioBModifications[f.id];
      return sum + (mod?.effort ?? f.effort);
    }, 0);
    return { totalImpact, totalCost };
  }, [features, scenarioBModifications]);

  const handleUpdateScenarioB = (id: string, field: "impact" | "effort", value: number) => {
    setScenarioBModifications((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const scenarioBFeatures: ScenarioFeature[] = features.map((f) => ({
    ...f,
    scenarioImpact: scenarioBModifications[f.id]?.impact,
    scenarioEffort: scenarioBModifications[f.id]?.effort,
  }));

  const scenarioBWins = scenarioBTotals.totalImpact > scenarioATotals.totalImpact;

  if (!isLoaded) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Compare Scenarios</h2>
          <p className="text-sm text-muted-foreground">
            Modify Scenario B to compare different prioritization strategies
          </p>
        </div>
        {showBackButton && (
          <Button variant="outline" onClick={onClose} className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Comparison Summary */}
      <Card className="border-border bg-card">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Scenario A Impact</p>
              <p className="text-2xl font-bold text-foreground">{scenarioATotals.totalImpact.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {scenarioBTotals.totalImpact > scenarioATotals.totalImpact ? (
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              ) : scenarioBTotals.totalImpact < scenarioATotals.totalImpact ? (
                <TrendingDown className="h-6 w-6 text-red-400" />
              ) : (
                <Equal className="h-6 w-6 text-muted-foreground" />
              )}
              <span className={cn(
                "text-lg font-semibold",
                scenarioBTotals.totalImpact > scenarioATotals.totalImpact && "text-emerald-400",
                scenarioBTotals.totalImpact < scenarioATotals.totalImpact && "text-red-400",
                scenarioBTotals.totalImpact === scenarioATotals.totalImpact && "text-muted-foreground"
              )}>
                {Math.abs(scenarioBTotals.totalImpact - scenarioATotals.totalImpact).toLocaleString()} pts
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Scenario B Impact</p>
              <p className={cn(
                "text-2xl font-bold",
                scenarioBWins ? "text-emerald-400" : "text-foreground"
              )}>
                {scenarioBTotals.totalImpact.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Split Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScenarioColumn
          title="Scenario A"
          description="Current live data (read-only)"
          features={features}
          isEditable={false}
          totalImpact={scenarioATotals.totalImpact}
          totalCost={scenarioATotals.totalCost}
        />
        <ScenarioColumn
          title="Scenario B"
          description="Modify values to compare strategies"
          features={scenarioBFeatures}
          isEditable={true}
          onUpdateFeature={handleUpdateScenarioB}
          totalImpact={scenarioBTotals.totalImpact}
          totalCost={scenarioBTotals.totalCost}
          comparisonImpact={scenarioATotals.totalImpact}
          comparisonCost={scenarioATotals.totalCost}
          isWinner={scenarioBWins}
        />
      </div>
    </div>
  );
}
