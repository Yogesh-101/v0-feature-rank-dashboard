"use client";

import { CEOModeView } from "@/components/dashboard/ceo-mode-view";
import { FeaturesProvider } from "@/lib/features-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

function PresentationContent() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-slate-900/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-semibold text-foreground">Presentation Mode</h1>
        </div>
        <Button variant="outline" size="sm" onClick={toggleFullscreen} className="gap-2 bg-transparent">
          <Maximize2 className="h-4 w-4" />
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>

      {/* Content */}
      <div className="p-8 lg:p-12">
        <div className="mx-auto max-w-6xl">
          <CEOModeView />
        </div>
      </div>
    </div>
  );
}

export default function PresentationPage() {
  return (
    <FeaturesProvider>
      <PresentationContent />
    </FeaturesProvider>
  );
}
