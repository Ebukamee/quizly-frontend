import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Auth is handled client-side in the dashboard layout.
  // Cross-domain cookie (Render backend vs Vercel frontend) means
  // server-side cookie checks don't work here.
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
