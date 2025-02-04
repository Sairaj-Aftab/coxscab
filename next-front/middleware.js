import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  // const token = req.cookies.get("user_refresh_token");
  // const { pathname } = req.nextUrl;
  // // Helper function to verify the token using jose
  // const verifyToken = async (token) => {
  //   try {
  //     const secret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
  //     const { payload } = await jwtVerify(token, secret);
  //     return payload; // Return the decoded token
  //   } catch (err) {
  //     return null;
  //   }
  // };
  // // If a token is present, verify it
  // const decodedToken = token?.value ? await verifyToken(token.value) : null;
  // // Handle the case where token is invalid or expired
  // if (!decodedToken && token?.value) {
  //   return NextResponse.redirect(new URL("/auth-login", req.url));
  // }
  // // Redirect authenticated users away from login
  // if (decodedToken && pathname === "/auth-login") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  // // Redirect unauthenticated users to login
  // if (!decodedToken && (pathname === "/" || pathname === "/profile")) {
  //   return NextResponse.redirect(new URL("/auth-login", req.url));
  // }
  // // Continue processing if no issues
  // return NextResponse.next();
}

// Apply middleware only for the `/profile`, `/auth-login`, and `/` pages
export const config = {
  // matcher: ["/profile", "/auth-login", "/"],
};
