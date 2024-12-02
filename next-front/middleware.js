import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("user_refresh_token");

  if (token && req.nextUrl.pathname === "/auth-login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/auth-login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only for the `/profile` page
export const config = {
  matcher: ["/profile", "/auth-login", "/"],
};
