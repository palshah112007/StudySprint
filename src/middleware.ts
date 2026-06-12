import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isClerkEnabled } from "@/lib/auth-config";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/ai/(.*)",
  "/opengraph-image(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

function redirectAdmin(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return null;
}

const protectedMiddleware = clerkMiddleware(async (auth, req) => {
  const adminRedirect = redirectAdmin(req);
  if (adminRedirect) return adminRedirect;

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

function publicOnlyMiddleware(req: NextRequest) {
  return redirectAdmin(req) ?? NextResponse.next();
}

export default isClerkEnabled() ? protectedMiddleware : publicOnlyMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
