"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { Modal } from "./Modal";
import { hasValidClerkPublishableKey } from "@/lib/auth-config";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
  preselectedPlan?: string;
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      {hasValidClerkPublishableKey() ? (
        defaultTab === "signin" ? <SignIn /> : <SignUp />
      ) : (
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-bold text-surface-100">Auth is not configured</h2>
          <p className="text-sm text-surface-400">
            Add real Clerk keys in .env.local to enable sign-in.
          </p>
        </div>
      )}
    </Modal>
  );
}
