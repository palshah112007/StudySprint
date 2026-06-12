const CLERK_KEY_PATTERN = /^(pk|sk)_(test|live)_[A-Za-z0-9_-]+$/;
const PLACEHOLDER_PATTERN = /replace|your_key|placeholder/i;

export function hasValidClerkPublishableKey(
  key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
): boolean {
  return Boolean(key && CLERK_KEY_PATTERN.test(key) && !PLACEHOLDER_PATTERN.test(key));
}

export function hasValidClerkSecretKey(key = process.env.CLERK_SECRET_KEY): boolean {
  return Boolean(key && CLERK_KEY_PATTERN.test(key) && !PLACEHOLDER_PATTERN.test(key));
}

export function isClerkEnabled(): boolean {
  return hasValidClerkPublishableKey() && hasValidClerkSecretKey();
}
