"use client";

import React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type FeatureCategory = "Feature" | "Infrastructure" | "Refactor" | "Bug Fix" | "Enhancement";

export interface Feature {
  id: string;
  name: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  riceScore: number;
  status?: "backlog" | "in-progress" | "completed";
  createdAt?: string;
  category?: FeatureCategory;
}

interface FeaturesContextType {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  addFeature: (feature: Omit<Feature, "id" | "riceScore">) => void;
  deleteFeature: (id: string) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
  isLoaded: boolean;
  velocity: number;
  setVelocity: (velocity: number) => void;
  loadedFromShare: boolean;
  clearShareState: () => void;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

const STORAGE_KEY = "featurerank-features";
const VELOCITY_STORAGE_KEY = "featurerank-velocity";
const DEFAULT_VELOCITY = 5;

const initialFeatures: Feature[] = [
  {
    id: "1",
    name: "AI-Powered Search",
    reach: 5000,
    impact: 3,
    confidence: 80,
    effort: 4,
    riceScore: 3000,
    status: "in-progress",
    createdAt: "2026-01-15",
    category: "Feature",
  },
  {
    id: "2",
    name: "Dark Mode Support",
    reach: 8000,
    impact: 2,
    confidence: 95,
    effort: 2,
    riceScore: 7600,
    status: "completed",
    createdAt: "2026-01-10",
    category: "Enhancement",
  },
  {
    id: "3",
    name: "Export to CSV",
    reach: 2000,
    impact: 2,
    confidence: 90,
    effort: 1,
    riceScore: 3600,
    status: "backlog",
    createdAt: "2026-01-20",
    category: "Feature",
  },
  {
    id: "4",
    name: "Team Collaboration",
    reach: 3500,
    impact: 3,
    confidence: 70,
    effort: 5,
    riceScore: 1470,
    status: "in-progress",
    createdAt: "2026-01-18",
    category: "Feature",
  },
  {
    id: "5",
    name: "Mobile App",
    reach: 6000,
    impact: 3,
    confidence: 60,
    effort: 8,
    riceScore: 1350,
    status: "backlog",
    createdAt: "2026-01-22",
    category: "Feature",
  },
  {
    id: "6",
    name: "Database Migration",
    reach: 1000,
    impact: 2,
    confidence: 90,
    effort: 5,
    riceScore: 360,
    status: "backlog",
    createdAt: "2026-01-25",
    category: "Infrastructure",
  },
  {
    id: "7",
    name: "Code Refactor - Auth Module",
    reach: 500,
    impact: 1,
    confidence: 75,
    effort: 3,
    riceScore: 125,
    status: "backlog",
    createdAt: "2026-01-26",
    category: "Refactor",
  },
];

export function FeaturesProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [velocity, setVelocityState] = useState<number>(DEFAULT_VELOCITY);
  const [loadedFromShare, setLoadedFromShare] = useState(false);

  // Load features and velocity from URL state or localStorage on mount
  useEffect(() => {
    // Check if URL has shared state
    const urlParams = new URLSearchParams(window.location.search);
    const encodedState = urlParams.get("state");
    
    if (encodedState) {
      try {
        // Validate base64 string before decoding
        if (!/^[A-Za-z0-9+/=]+$/.test(encodedState)) {
          throw new Error("Invalid base64 string");
        }
        // Decode and parse URL state (handle Unicode properly)
        const jsonString = decodeURIComponent(escape(atob(encodedState)));
        const sharedState = JSON.parse(jsonString);
        
        if (sharedState.features && Array.isArray(sharedState.features)) {
          setFeatures(sharedState.features);
          // Also save to localStorage so it persists
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedState.features));
          setLoadedFromShare(true);
        }
        
        if (sharedState.velocity && typeof sharedState.velocity === "number" && sharedState.velocity > 0) {
          setVelocityState(sharedState.velocity);
          localStorage.setItem(VELOCITY_STORAGE_KEY, sharedState.velocity.toString());
        }
        
        // Clean up URL after loading (remove state param)
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("state");
        window.history.replaceState({}, "", cleanUrl.toString());
        
        setIsLoaded(true);
        return;
      } catch {
        // If URL state is invalid, fall back to localStorage
        console.warn("Failed to parse shared state from URL, falling back to localStorage");
      }
    }
    
    // Load from localStorage if no URL state
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
    
    const storedVelocity = localStorage.getItem(VELOCITY_STORAGE_KEY);
    if (storedVelocity) {
      const parsed = Number.parseInt(storedVelocity, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setVelocityState(parsed);
      }
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

  const addFeature = (feature: Omit<Feature, "id" | "riceScore">) => {
    const riceScore = calculateRiceScore(
      feature.reach,
      feature.impact,
      feature.confidence,
      feature.effort
    );
    const newFeature: Feature = {
      ...feature,
      id: Date.now().toString(),
      riceScore,
      status: feature.status || "backlog",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFeatures((prev) => [...prev, newFeature]);
  };

  const deleteFeature = (id: string) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  };

  const setVelocity = (newVelocity: number) => {
    if (newVelocity > 0) {
      setVelocityState(newVelocity);
      localStorage.setItem(VELOCITY_STORAGE_KEY, newVelocity.toString());
    }
  };

  const clearShareState = () => {
    setLoadedFromShare(false);
  };

  const updateFeature = (id: string, updates: Partial<Feature>) => {
    setFeatures((prev) =>
      prev.map((feature) => {
        if (feature.id === id) {
          const updated = { ...feature, ...updates };
          // Recalculate RICE score if any scoring fields changed
          if (
            updates.reach !== undefined ||
            updates.impact !== undefined ||
            updates.confidence !== undefined ||
            updates.effort !== undefined
          ) {
            updated.riceScore = calculateRiceScore(
              updated.reach,
              updated.impact,
              updated.confidence,
              updated.effort
            );
          }
          return updated;
        }
        return feature;
      })
    );
  };

  return (
    <FeaturesContext.Provider
      value={{ features, setFeatures, addFeature, deleteFeature, updateFeature, isLoaded, velocity, setVelocity, loadedFromShare, clearShareState }}
    >
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return context;
}
