"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DynamicStats } from "@/components/dashboard/dynamic-stats";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { SharedFeaturesTable } from "@/components/dashboard/shared-features-table";
import { CEOModeView } from "@/components/dashboard/ceo-mode-view";
import { ScenarioComparison } from "@/components/dashboard/scenario-comparison";
import { useCEOMode } from "@/lib/ceo-mode-context";
import { Button } from "@/components/ui/button";
import { GitCompare } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your product roadmap and feature prioritization"
    >
      <DashboardContent />
    </DashboardLayout>
  );
}

function DashboardContent() {
  const { isCEOMode } = useCEOMode();
  const [showScenarioComparison, setShowScenarioComparison] = useState(false);

  if (isCEOMode) {
    return <CEOModeView />;
  }

  if (showScenarioComparison) {
    return <ScenarioComparison onClose={() => setShowScenarioComparison(false)} />;
  }

  return (
    <>
      <DynamicStats />
      
      {/* Analytics Section with Compare Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <Button
          variant="outline"
          onClick={() => setShowScenarioComparison(true)}
          className="gap-2 bg-transparent"
        >
          <GitCompare className="h-4 w-4" />
          Compare Scenarios
        </Button>
      </div>
      
      <DashboardChart />
      <SharedFeaturesTable
        showStatus
        title="All Features"
        description="Complete list of features across all statuses"
      />
    </>
  );
}
