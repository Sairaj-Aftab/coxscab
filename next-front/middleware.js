import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("user_refresh_token");
  const { pathname } = req.nextUrl;
  console.log(token);
  console.log(pathname);

  // Redirect authenticated users away from login
  if (token && pathname === "/auth-login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users to login
  if (!token && (pathname === "/" || pathname === "/profile")) {
    return NextResponse.redirect(new URL("/auth-login", req.url));
  }

  // Continue processing
  return NextResponse.next();
}

// Apply middleware only for the `/profile` page
export const config = {
  matcher: ["/profile", "/auth-login", "/"],
};
