import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function tryRefresh(request: NextRequest) {
  try {
    const refreshResponse = await fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!refreshResponse.ok) {
      return { ok: false as const, setCookies: [] as string[] };
    }

    const setCookies =
      (refreshResponse.headers as any).getSetCookie?.() ??
      (refreshResponse.headers.get("set-cookie")
        ? [refreshResponse.headers.get("set-cookie") as string]
        : []);

    return { ok: true as const, setCookies };
  } catch {
    return { ok: false as const, setCookies: [] as string[] };
  }
}

function applySetCookies(response: NextResponse, setCookies: string[]) {
  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}

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
      const res = NextResponse.redirect(new URL("/auth/login", request.url));
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }

    const refreshed = await tryRefresh(request);
    if (!refreshed.ok) {
      const res = NextResponse.redirect(new URL("/auth/login", request.url));
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
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
