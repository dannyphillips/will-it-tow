import { NextResponse, type NextRequest } from "next/server";
import { familySessionFromRequest, verifyFamilySession } from "./lib/family-session";
import { isPublicPwaPath } from "./lib/pwa-public-paths";

const AUTH_URL = (process.env.AUTH_URL || "https://auth.thephillips.family").replace(/\/$/, "");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPwaPath(pathname)) {
    return NextResponse.next();
  }
  if (pathname === "/health" || pathname === "/robots.txt") {
    if (pathname === "/health") {
      return NextResponse.json({ ok: true, service: "tow" });
    }
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const secret = process.env.SESSION_SECRET || "";
  const token = familySessionFromRequest(request.headers.get("cookie"));
  if (token && (await verifyFamilySession(token, secret))) {
    return NextResponse.next();
  }

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const proto = (request.headers.get("x-forwarded-proto") || "https").split(",")[0].trim();
  const dest = `${proto}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (!host || dest.length > 2000) {
    return new NextResponse("Sign in required", { status: 401 });
  }
  return NextResponse.redirect(`${AUTH_URL}/?next=${encodeURIComponent(dest)}`);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
