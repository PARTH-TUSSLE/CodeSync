import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "codesync_token";

const authRoutes = [
  "/repos",
  "/user",
  "/profile",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/repos", request.url));
  }

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/repos", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|s?item-prop|logo\\.svg).*)",
  ],
};
