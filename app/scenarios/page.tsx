"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ScenarioComparison } from "@/components/dashboard/scenario-comparison";

function ScenariosContent() {
  return <ScenarioComparison onClose={() => {}} showBackButton={false} />;
}

export default function ScenariosPage() {
  return (
    <DashboardLayout
      title="Scenario Comparison"
      subtitle="Compare different prioritization scenarios side by side"
    >
      <ScenariosContent />
    </DashboardLayout>
  );
}
