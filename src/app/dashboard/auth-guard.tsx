"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { hasValidClerkPublishableKey } from "@/lib/auth-config";

export function DashboardAuth({ children }: { children: React.ReactNode }) {
  if (!hasValidClerkPublishableKey()) {
    return <>{children}</>;
  }

  return <ProtectedDashboard>{children}</ProtectedDashboard>;
}

function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-surface-950 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="skeleton h-8 w-64 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="skeleton h-48 rounded-2xl" />
              <div className="skeleton h-64 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="skeleton h-56 rounded-2xl" />
              <div className="skeleton h-32 rounded-2xl" />
              <div className="skeleton h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) return null;

  return <>{children}</>;
}
