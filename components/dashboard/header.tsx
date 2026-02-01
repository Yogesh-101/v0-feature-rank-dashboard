"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Presentation, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCEOMode } from "@/lib/ceo-mode-context";
import { useFeatures } from "@/lib/features-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { isCEOMode, toggleCEOMode } = useCEOMode();
  const { features, velocity, loadedFromShare, clearShareState } = useFeatures();
  const { toast } = useToast();

  // Show toast when loaded from shared link
  React.useEffect(() => {
    if (loadedFromShare) {
      toast({
        title: "Shared Roadmap Loaded",
        description: `Loaded ${features.length} features from shared link.`,
      });
      clearShareState();
    }
  }, [loadedFromShare, features.length, toast, clearShareState]);

  const handleShare = async () => {
    try {
      // Create shareable state object
      const shareableState = {
        features,
        velocity,
      };
      
      // Encode to Base64 (handle Unicode properly)
      const jsonString = JSON.stringify(shareableState);
      const encoded = btoa(unescape(encodeURIComponent(jsonString)));
      
      // Update URL without the pathname to keep it clean
      const url = new URL(window.location.origin + "/dashboard");
      url.searchParams.set("state", encoded);
      window.history.replaceState({}, "", url.toString());
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url.toString());
      
      toast({
        title: "Link Copied!",
        description: `Sharing ${features.length} features. Send this link to your team.`,
      });
    } catch (error) {
      // Fallback: try to copy using older method
      try {
        const jsonString = JSON.stringify({ features, velocity });
        const encoded = btoa(unescape(encodeURIComponent(jsonString)));
        const url = new URL(window.location.origin + "/dashboard");
        url.searchParams.set("state", encoded);
        
        const textArea = document.createElement("textarea");
        textArea.value = url.toString();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        
        toast({
          title: "Link Copied!",
          description: `Sharing ${features.length} features. Send this link to your team.`,
        });
      } catch {
        toast({
          title: "Failed to copy",
          description: "Please try again or manually copy the URL from the address bar.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-border px-4 lg:px-6",
        isCEOMode ? "bg-background" : "bg-card"
      )}
    >
      <div className={cn(isCEOMode ? "ml-0" : "ml-10 lg:ml-0")}>
        <h1
          className={cn(
            "font-semibold text-foreground",
            isCEOMode ? "text-xl lg:text-2xl" : "text-base lg:text-lg"
          )}
        >
          {title}
        </h1>
        {subtitle && !isCEOMode && (
          <p className="hidden text-sm text-muted-foreground sm:block">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2 bg-transparent"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        {/* CEO Mode Toggle */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5">
          <Presentation
            className={cn(
              "h-4 w-4 transition-colors",
              isCEOMode ? "text-primary" : "text-muted-foreground"
            )}
          />
          <Label
            htmlFor="ceo-mode"
            className={cn(
              "hidden cursor-pointer text-sm font-medium transition-colors sm:block",
              isCEOMode ? "text-primary" : "text-muted-foreground"
            )}
          >
            CEO Mode
          </Label>
          <Switch
            id="ceo-mode"
            checked={isCEOMode}
            onCheckedChange={toggleCEOMode}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {!isCEOMode && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>

            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">Alex Chen</p>
                <p className="text-xs text-muted-foreground">Product Manager</p>
              </div>
              <Avatar className="h-8 w-8 border border-border lg:h-9 lg:w-9">
                <AvatarImage src="/avatar.png" alt="User avatar" />
                <AvatarFallback className="bg-secondary text-xs text-secondary-foreground lg:text-sm">
                  AC
                </AvatarFallback>
              </Avatar>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
