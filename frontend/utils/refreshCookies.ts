import type { NextRequest, NextResponse } from "next/server";

type HeadersWithGetSetCookie = Headers & {
  getSetCookie?: () => string[];
};

function extractSetCookies(headers: Headers): string[] {
  const maybeHeaders = headers as HeadersWithGetSetCookie;

  if (typeof maybeHeaders.getSetCookie === "function") {
    return maybeHeaders.getSetCookie();
  }

  const setCookie = headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

export async function tryRefresh(request: NextRequest) {
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

    const setCookies = extractSetCookies(refreshResponse.headers);

    return { ok: true as const, setCookies };
  } catch {
    return { ok: false as const, setCookies: [] as string[] };
  }
}

export function applySetCookies(response: NextResponse, setCookies: string[]) {
  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}
