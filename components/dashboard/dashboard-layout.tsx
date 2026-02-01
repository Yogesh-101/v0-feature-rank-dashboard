"use client";

import React from "react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { FeaturesProvider } from "@/lib/features-context";
import { CEOModeProvider, useCEOMode } from "@/lib/ceo-mode-context";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

function DashboardContent({ children, title, subtitle }: DashboardLayoutProps) {
  const { isCEOMode } = useCEOMode();

  return (
    <div className={cn("flex min-h-screen", isCEOMode ? "bg-slate-950" : "bg-background")}>
      {!isCEOMode && <Sidebar />}
      <div className="flex flex-1 flex-col">
        <Header title={title} subtitle={subtitle} />
        <main
          className={cn(
            "flex-1 overflow-auto",
            isCEOMode ? "p-8 lg:p-12" : "p-4 pt-16 lg:p-6 lg:pt-6"
          )}
        >
          <div
            className={cn(
              "mx-auto space-y-6",
              isCEOMode ? "max-w-6xl" : "max-w-7xl"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <CEOModeProvider>
      <FeaturesProvider>
        <DashboardContent title={title} subtitle={subtitle}>
          {children}
        </DashboardContent>
        <Toaster />
      </FeaturesProvider>
    </CEOModeProvider>
  );
}
