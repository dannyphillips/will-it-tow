import { isPublicPwaPath } from "./pwa-public-paths";

describe("public pwa paths", () => {
  test("allows the manifest, service worker, and icons without a session", () => {
    expect(isPublicPwaPath("/manifest.webmanifest")).toBe(true);
    expect(isPublicPwaPath("/sw.js")).toBe(true);
    expect(isPublicPwaPath("/pwa-cache-policy.js")).toBe(true);
    expect(isPublicPwaPath("/apple-touch-icon.png")).toBe(true);
    expect(isPublicPwaPath("/apple-icon.png")).toBe(true);
    expect(isPublicPwaPath("/icons/icon-192.png")).toBe(true);
    expect(isPublicPwaPath("/icons/icon-512.png")).toBe(true);
    expect(isPublicPwaPath("/icons/icon-maskable-512.png")).toBe(true);
  });

  test("keeps pages, auth, and API behind the session check", () => {
    expect(isPublicPwaPath("/")).toBe(false);
    expect(isPublicPwaPath("/login")).toBe(false);
    expect(isPublicPwaPath("/auth")).toBe(false);
    expect(isPublicPwaPath("/api/session")).toBe(false);
    expect(isPublicPwaPath("/health")).toBe(false);
    expect(isPublicPwaPath("/icons/../middleware.ts")).toBe(false);
    expect(isPublicPwaPath("/icons/nested/icon.png")).toBe(false);
  });
});
