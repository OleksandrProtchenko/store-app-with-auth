import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySetCookies, tryRefresh } from "@/utils/refreshCookies";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthRoute = pathname.startsWith("/auth");
  const isHomeRoute = pathname === "/";
  const isPrivateRoute = pathname.startsWith("/dashboard");

  if (isPrivateRoute) {
    if (accessToken) return NextResponse.next();

    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const refreshed = await tryRefresh(request);
    if (!refreshed.ok) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return applySetCookies(NextResponse.next(), refreshed.setCookies);
  }

  if (isAuthRoute || isHomeRoute) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard/orders", request.url));
    }

    if (refreshToken) {
      const refreshed = await tryRefresh(request);
      if (refreshed.ok) {
        const res = NextResponse.redirect(
          new URL("/dashboard/orders", request.url),
        );
        return applySetCookies(res, refreshed.setCookies);
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/"],
};
