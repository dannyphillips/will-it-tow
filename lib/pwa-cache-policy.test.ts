const policy = require("../public/pwa-cache-policy.js");

const ORIGIN = "https://tow.thephillips.family";

function request(
  url: string,
  init: {
    method?: string;
    mode?: string;
    destination?: string;
    headers?: Record<string, string>;
  } = {}
) {
  return {
    request: {
      method: init.method || "GET",
      mode: init.mode || "same-origin",
      destination: init.destination || "",
      headers: {
        get(name: string) {
          const found = Object.keys(init.headers || {}).find(
            (key) => key.toLowerCase() === name.toLowerCase()
          );
          return found ? init.headers?.[found] : null;
        },
      },
    },
    url: new URL(url),
  };
}

function response(init: {
  status?: number;
  redirected?: boolean;
  type?: string;
  headers?: Record<string, string>;
}) {
  return {
    status: init.status ?? 200,
    redirected: init.redirected ?? false,
    type: init.type ?? "basic",
    headers: {
      get(name: string) {
        const found = Object.keys(init.headers || {}).find(
          (key) => key.toLowerCase() === name.toLowerCase()
        );
        return found ? init.headers?.[found] : null;
      },
    },
  };
}

function allowed(url: string, init?: Parameters<typeof request>[1]) {
  const built = request(url, init);
  return policy.isStaticAssetRequest(built.request, built.url, ORIGIN);
}

describe("pwa cache policy", () => {
  test("caches hashed static files, icons, and vehicle art", () => {
    expect(allowed(`${ORIGIN}/_next/static/chunks/main-abc.js`, { destination: "script" })).toBe(
      true
    );
    expect(allowed(`${ORIGIN}/_next/static/css/app.css`, { destination: "style" })).toBe(true);
    expect(allowed(`${ORIGIN}/_next/static/media/inter.woff2`, { destination: "font" })).toBe(true);
    expect(allowed(`${ORIGIN}/icons/icon-192.png`, { destination: "image" })).toBe(true);
    expect(allowed(`${ORIGIN}/icons/icon-maskable-512.png`)).toBe(true);
    expect(allowed(`${ORIGIN}/apple-touch-icon.png`)).toBe(true);
    expect(allowed(`${ORIGIN}/apple-icon.png?364cf1c92c9bd8c1`)).toBe(true);
    expect(allowed(`${ORIGIN}/favicon.ico`)).toBe(true);
    expect(allowed(`${ORIGIN}/vehicles/tow_truck.svg`)).toBe(true);
  });

  test("never caches auth navigations, login routes, or the auth host", () => {
    expect(
      allowed(`${ORIGIN}/`, { mode: "navigate", destination: "document" })
    ).toBe(false);
    expect(
      allowed(`${ORIGIN}/?next=https%3A%2F%2Fauth.thephillips.family`, {
        mode: "navigate",
        destination: "document",
      })
    ).toBe(false);
    expect(
      allowed("https://auth.thephillips.family/?next=https%3A%2F%2Ftow.thephillips.family%2F", {
        mode: "navigate",
        destination: "document",
      })
    ).toBe(false);
    expect(allowed("https://auth.thephillips.family/styles.css")).toBe(false);
    expect(allowed(`${ORIGIN}/login`)).toBe(false);
    expect(allowed(`${ORIGIN}/login/callback`)).toBe(false);
    expect(allowed(`${ORIGIN}/signin`)).toBe(false);
    expect(allowed(`${ORIGIN}/sign-in`)).toBe(false);
    expect(allowed(`${ORIGIN}/auth`)).toBe(false);
    expect(allowed(`${ORIGIN}/auth/callback`)).toBe(false);
    expect(allowed(`${ORIGIN}/logout`)).toBe(false);
    expect(allowed(`${ORIGIN}/signout`)).toBe(false);
  });

  test("never caches API, JSON, or app-router data requests", () => {
    expect(allowed(`${ORIGIN}/api/session`)).toBe(false);
    expect(allowed(`${ORIGIN}/api/health`)).toBe(false);
    expect(allowed(`${ORIGIN}/health`)).toBe(false);
    expect(allowed(`${ORIGIN}/manifest.webmanifest`)).toBe(false);
    expect(allowed(`${ORIGIN}/_next/static/chunks/data.json`)).toBe(false);
    expect(
      allowed(`${ORIGIN}/icons/icon-192.png`, {
        headers: { accept: "application/json" },
      })
    ).toBe(false);
    expect(
      allowed(`${ORIGIN}/_next/static/chunks/main.js`, {
        headers: { RSC: "1" },
      })
    ).toBe(false);
    expect(
      allowed(`${ORIGIN}/_next/static/chunks/main.js`, {
        headers: { "next-router-prefetch": "1" },
      })
    ).toBe(false);
  });

  test("ignores non-GET and other origins", () => {
    expect(allowed(`${ORIGIN}/icons/icon-192.png`, { method: "POST" })).toBe(false);
    expect(allowed("https://example.com/icons/icon-192.png")).toBe(false);
  });

  test("stores only successful basic static responses", () => {
    expect(
      policy.isStorableResponse(
        response({ headers: { "content-type": "image/png" } })
      )
    ).toBe(true);
    expect(
      policy.isStorableResponse(
        response({ headers: { "content-type": "application/javascript; charset=utf-8" } })
      )
    ).toBe(true);
    expect(
      policy.isStorableResponse(
        response({ headers: { "content-type": "image/svg+xml" } })
      )
    ).toBe(true);
  });

  test("never stores redirects, JSON, HTML, or Set-Cookie responses", () => {
    expect(policy.isStorableResponse(response({ status: 302 }))).toBe(false);
    expect(policy.isStorableResponse(response({ status: 301 }))).toBe(false);
    expect(policy.isStorableResponse(response({ redirected: true }))).toBe(false);
    expect(policy.isStorableResponse(response({ type: "opaqueredirect", status: 0 }))).toBe(
      false
    );
    expect(
      policy.isStorableResponse(
        response({ headers: { "content-type": "application/json" } })
      )
    ).toBe(false);
    expect(
      policy.isStorableResponse(
        response({ headers: { "content-type": "application/manifest+json" } })
      )
    ).toBe(false);
    expect(
      policy.isStorableResponse(
        response({ headers: { "content-type": "text/html; charset=utf-8" } })
      )
    ).toBe(false);
    expect(
      policy.isStorableResponse(
        response({ headers: { "set-cookie": "family_session=abc; HttpOnly" } })
      )
    ).toBe(false);
    expect(
      policy.isStorableResponse(
        response({
          headers: {
            "content-type": "image/png",
            "Set-Cookie": "family_session=abc; Path=/",
          },
        })
      )
    ).toBe(false);
    expect(policy.isStorableResponse(response({ status: 401 }))).toBe(false);
    expect(policy.isStorableResponse(response({ status: 500 }))).toBe(false);
  });
});
