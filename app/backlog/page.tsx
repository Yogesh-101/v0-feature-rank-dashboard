import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SharedFeaturesTable } from "@/components/dashboard/shared-features-table";

export default function BacklogPage() {
  return (
    <DashboardLayout
      title="Feature Backlog"
      subtitle="Manage features waiting to be prioritized and developed"
    >
      <SharedFeaturesTable
        filterStatus="backlog"
        title="Backlog Items"
        description="Features waiting to be picked up for development"
      />
    </DashboardLayout>
  );
}
