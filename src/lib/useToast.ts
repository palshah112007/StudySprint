"use client";

import { useCallback } from "react";
import { toast } from "@/components/ui/Toaster";

export function useToast() {
  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      toast(message, type);
    },
    []
  );

  return { toast: showToast };
}
