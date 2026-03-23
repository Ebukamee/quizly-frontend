import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude /public/* routes — they don't require auth
  if (pathname.startsWith("/public")) return NextResponse.next();

  // Dashboard routes — require auth cookie
  const token = request.cookies.get("better-auth.session_token");
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quiz/:path*",
    "/subjects/:path*",
    "/attempts/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
