"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CEOModeContextType {
  isCEOMode: boolean;
  toggleCEOMode: () => void;
  setCEOMode: (value: boolean) => void;
}

const CEOModeContext = createContext<CEOModeContextType | undefined>(undefined);

const CEO_MODE_STORAGE_KEY = "featurerank-ceo-mode";

export function CEOModeProvider({ children }: { children: React.ReactNode }) {
  const [isCEOMode, setIsCEOMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CEO_MODE_STORAGE_KEY);
    if (stored) {
      setIsCEOMode(stored === "true");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CEO_MODE_STORAGE_KEY, String(isCEOMode));
    }
  }, [isCEOMode, isLoaded]);

  const toggleCEOMode = () => setIsCEOMode((prev) => !prev);
  const setCEOMode = (value: boolean) => setIsCEOMode(value);

  return (
    <CEOModeContext.Provider value={{ isCEOMode, toggleCEOMode, setCEOMode }}>
      {children}
    </CEOModeContext.Provider>
  );
}

export function useCEOMode() {
  const context = useContext(CEOModeContext);
  if (context === undefined) {
    throw new Error("useCEOMode must be used within a CEOModeProvider");
  }
  return context;
}
