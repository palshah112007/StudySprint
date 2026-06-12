import { SignUp } from "@clerk/nextjs";
import { hasValidClerkPublishableKey } from "@/lib/auth-config";

export default function SignUpPage() {
  if (!hasValidClerkPublishableKey()) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-surface-800 bg-surface-900 p-6 text-center">
          <h1 className="text-xl font-bold text-surface-100">Auth is not configured</h1>
          <p className="mt-2 text-sm text-surface-400">
            Add real Clerk keys in .env.local to enable sign-up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-surface-900 border border-surface-800 shadow-2xl shadow-black/20",
              headerTitle: "text-surface-100 text-2xl font-bold",
              headerSubtitle: "text-surface-400",
              formFieldLabel: "text-surface-300 text-sm font-medium",
              formFieldInput:
                "bg-surface-800 border-surface-700 text-surface-200 rounded-xl px-4 py-2.5 focus:ring-primary-500/30 focus:border-primary-500/30",
              formButtonPrimary:
                "bg-gradient-to-r from-[#7C3AED] to-[#00D9F5] text-white hover:from-[#6D28D9] hover:to-[#00D9F5] rounded-xl py-2.5 font-medium",
              footerActionLink: "text-primary-400 hover:text-primary-300",
              socialButtonsBlockButton:
                "bg-surface-800 border-surface-700 text-surface-300 hover:bg-surface-700 rounded-xl",
              socialButtonsBlockButtonText: "text-surface-300 font-medium",
              dividerLine: "bg-surface-700",
              dividerText: "text-surface-500",
              formFieldError: "text-rose-400",
            },
          }}
        />
      </div>
    </div>
  );
}
