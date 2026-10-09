/*
 * Decides what the production service worker may cache.
 * Static assets and icons only. Auth navigations, /api, JSON, redirects,
 * Set-Cookie responses, and login routes are never stored.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.towPwaPolicy = api;
})(typeof self !== "undefined" ? self : this, function () {
  var LOGIN_PATH =
    /^\/(?:login|log-in|signin|sign-in|signout|sign-out|logout|log-out|auth)(?:\/|$)/i;

  function headerGet(headers, name) {
    if (!headers) return "";
    try {
      if (typeof headers.get === "function") {
        var value = headers.get(name);
        return value == null ? "" : String(value);
      }
    } catch (err) {
      return "";
    }
    var raw = headers[name];
    if (raw == null) raw = headers[String(name).toLowerCase()];
    if (raw == null) return "";
    return Array.isArray(raw) ? raw.join(", ") : String(raw);
  }

  function hasSetCookie(headers) {
    var value = headerGet(headers, "set-cookie");
    return value.length > 0;
  }

  function isStaticAssetPath(pathname) {
    if (!pathname || pathname.slice(-5) === ".json" || pathname.slice(-4) === ".map") {
      return false;
    }
    if (pathname.indexOf("/_next/static/") === 0) return true;
    if (pathname.indexOf("/icons/") === 0) return true;
    if (
      pathname.indexOf("/vehicles/") === 0 &&
      /\.(?:svg|png|jpe?g|webp|gif|ico)$/i.test(pathname)
    ) {
      return true;
    }
    return (
      pathname === "/favicon.ico" ||
      pathname === "/apple-touch-icon.png" ||
      pathname === "/apple-icon.png"
    );
  }

  /**
   * True only when the worker should cache this request.
   * Everything else must hit the network untouched, including SSO redirects.
   */
  function isStaticAssetRequest(request, url, workerOrigin) {
    if (!request || !url || request.method !== "GET") return false;
    if (!workerOrigin || url.origin !== workerOrigin) return false;
    if (url.hostname === "auth.thephillips.family") return false;
    if (request.mode === "navigate" || request.destination === "document") return false;
    if (url.pathname === "/api" || url.pathname.indexOf("/api/") === 0) return false;
    if (LOGIN_PATH.test(url.pathname)) return false;

    var accept = headerGet(request.headers, "accept").toLowerCase();
    if (accept.indexOf("application/json") !== -1 || accept.indexOf("+json") !== -1) {
      return false;
    }
    if (headerGet(request.headers, "rsc") || headerGet(request.headers, "next-router-prefetch")) {
      return false;
    }
    if (headerGet(request.headers, "next-url")) return false;

    return isStaticAssetPath(url.pathname);
  }

  /**
   * True only for a successful same-origin static response with no session side effects.
   */
  function isStorableResponse(response) {
    if (!response || response.redirected) return false;
    if (response.type && response.type !== "basic") return false;
    if (typeof response.status !== "number" || response.status < 200 || response.status >= 300) {
      return false;
    }
    if (hasSetCookie(response.headers)) return false;

    var contentType = headerGet(response.headers, "content-type").toLowerCase();
    if (contentType.indexOf("json") !== -1) return false;
    if (contentType.indexOf("text/html") !== -1) return false;
    if (contentType.indexOf("text/x-component") !== -1) return false;
    return true;
  }

  return {
    isStaticAssetRequest: isStaticAssetRequest,
    isStorableResponse: isStorableResponse,
  };
});
