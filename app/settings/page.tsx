"use client";

import React from "react";
import { Globe } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useFeatures } from "@/lib/features-context";
import { Download, Upload, Trash2, Bell, Moon, Save, RefreshCw, Gauge } from "lucide-react";
import { useState, useEffect } from "react";

const SETTINGS_STORAGE_KEY = "featurerank-settings";
const PROFILE_STORAGE_KEY = "featurerank-profile";

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoSave: boolean;
}

interface Profile {
  name: string;
  email: string;
  role: string;
}

const defaultSettings: Settings = {
  notifications: true,
  darkMode: true,
  autoSave: true,
};

const defaultProfile: Profile = {
  name: "Alex Chen",
  email: "alex@company.com",
  role: "Product Manager",
};

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your application preferences and data"
    >
      <SettingsContent />
    </DashboardLayout>
  );
}

function SettingsContent() {
  const { features, setFeatures, velocity, setVelocity } = useFeatures();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);

  const { notifications, darkMode, autoSave } = settings;
  
  const updateSetting = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    toast({
      title: "Settings updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const setNotifications = (value: boolean) => {
    updateSetting("notifications", value);
  };

  const setDarkMode = (value: boolean) => {
    updateSetting("darkMode", value);
  };

  const setAutoSave = (value: boolean) => {
    updateSetting("autoSave", value);
  };

  // Load settings and profile from localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch {
        // Keep defaults
      }
    }
    
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch {
        // Keep defaults
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile saved",
        description: "Your profile information has been updated successfully.",
      });
    }, 500);
  };

  const handleExport = () => {
    const data = JSON.stringify(features, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "featurerank-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Data exported",
      description: `Successfully exported ${features.length} features to JSON.`,
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setFeatures(imported);
          toast({
            title: "Data imported",
            description: `Successfully imported ${imported.length} features.`,
          });
        }
      } catch {
        toast({
          title: "Import failed",
          description: "The file could not be parsed. Please ensure it's a valid JSON file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be imported again
    e.target.value = "";
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all features? This cannot be undone.")) {
      setFeatures([]);
      toast({
        title: "Data cleared",
        description: "All features have been removed.",
      });
    }
  };

  return (
    <div className="grid gap-6">
      {/* Profile Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Profile</CardTitle>
          <CardDescription>
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="bg-input"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Preferences</CardTitle>
          <CardDescription>
            Customize your application experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive alerts for score changes
                </p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <Separator className="bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Dark Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Use dark theme throughout the app
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <Separator className="bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary p-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Auto-save
                </p>
                <p className="text-xs text-muted-foreground">
                  Automatically save changes to local storage
                </p>
              </div>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
        </CardContent>
      </Card>

      {/* Team Velocity */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Team Velocity
          </CardTitle>
          <CardDescription>
            Configure your team's delivery capacity for estimated timelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-secondary p-2">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="velocity">Points per Week</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="velocity"
                  type="number"
                  min={1}
                  max={100}
                  value={velocity}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value, 10);
                    if (!Number.isNaN(val) && val > 0) {
                      setVelocity(val);
                    }
                  }}
                  className="w-24 bg-input"
                />
                <span className="text-sm text-muted-foreground">
                  effort points per week
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            This value is used to calculate estimated delivery dates in the feature table.
            Higher velocity means faster estimated delivery times.
          </p>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Data Management
          </CardTitle>
          <CardDescription>
            Export, import, or clear your feature data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                asChild
              >
                <label>
                  <Upload className="h-4 w-4" />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>
              </Button>
            </div>

            <Button
              variant="outline"
              className="gap-2 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Currently storing {features.length} features locally.
          </p>
        </CardContent>
      </Card>

      {/* RICE Formula Reference */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            RICE Score Formula
          </CardTitle>
          <CardDescription>
            Understanding how features are prioritized
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-center font-mono text-lg text-foreground">
              RICE = (Reach × Impact × Confidence) ÷ Effort
            </p>
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border p-3">
              <p className="font-medium text-foreground">Reach</p>
              <p className="text-xs text-muted-foreground">
                Number of users affected per quarter
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="font-medium text-foreground">Impact</p>
              <p className="text-xs text-muted-foreground">
                0.5 (Low) to 3 (Massive) multiplier
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="font-medium text-foreground">Confidence</p>
              <p className="text-xs text-muted-foreground">
                How sure you are about estimates (0-100%)
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="font-medium text-foreground">Effort</p>
              <p className="text-xs text-muted-foreground">
                Person-months required (1-5 scale)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
