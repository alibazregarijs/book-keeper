import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // NextAuth JWT helper to check session
import type { NextRequest } from "next/server";

// Middleware to protect the "/" route
export async function middleware(req: NextRequest) {
  // Get the token from the request using next-auth's getToken function
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the token is not found (user is not authenticated), redirect them to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // If the token is valid (user is authenticated), allow the request to continue
  return NextResponse.next();
}

// Specify the route(s) you want to protect
export const config = {
  matcher: ["/"], // Protect the home route ("/") or any other route
};
