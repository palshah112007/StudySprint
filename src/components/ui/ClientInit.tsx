"use client";

import { useEffect } from "react";
import { initSoundOnInteraction, setSoundEnabled, setSoundVolume } from "@/lib/useSound";
import { loadSoundPreferences } from "@/lib/persistence";

export function ClientInit() {
  useEffect(() => {
    // Initialize sound system on first user interaction
    initSoundOnInteraction();

    // Load saved sound preferences
    const prefs = loadSoundPreferences();
    setSoundEnabled(prefs.enabled);
    setSoundVolume(prefs.volume);

    // Dispatch app ready event
    window.dispatchEvent(new Event("studysprint-ready"));
  }, []);

  return null;
}
