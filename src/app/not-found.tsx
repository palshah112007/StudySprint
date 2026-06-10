import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <div className="glass-card max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-300">
          <Compass className="h-6 w-6" />
        </div>
        <p className="text-6xl font-black text-primary-400/30 mb-2">404</p>
        <h1 className="text-2xl font-bold text-surface-100">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-surface-400">
          This sprint lane does not exist yet.
        </p>
        <Link href="/dashboard">
          <Button className="mt-6" variant="gradient">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
