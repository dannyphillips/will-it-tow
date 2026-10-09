const EXACT_PUBLIC_PWA_PATHS = new Set([
  "/sw.js",
  "/pwa-cache-policy.js",
  "/manifest.webmanifest",
  "/apple-touch-icon.png",
  "/apple-icon.png",
]);

/**
 * Files the browser must fetch while installing or updating the PWA.
 * A login redirect makes the manifest invalid and the service worker unregisterable.
 */
export function isPublicPwaPath(pathname: string): boolean {
  if (!pathname || pathname.includes("..") || pathname.includes("\\")) return false;
  if (EXACT_PUBLIC_PWA_PATHS.has(pathname)) return true;
  return /^\/icons\/[^/]+$/.test(pathname);
}
