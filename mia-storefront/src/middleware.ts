import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Extract the current host (removing any port if testing locally)
  const currentHost = hostname.replace(`:${url.port}`, "");

  // Define our base domains (include local variants for testing)
  const isLocal = currentHost.includes("localhost") || currentHost.includes("127.0.0.1");
  const baseDomain = isLocal ? "localhost" : "bloume.shop";

  // Check if we are on a custom subdomain
  // e.g., currentHost = "storename.bloume.shop" -> subdomain = "storename"
  // e.g., currentHost = "www.bloume.shop" -> ignore (it's the marketing site)
  const isSubdomain = currentHost.endsWith(`.${baseDomain}`) && currentHost !== `www.${baseDomain}`;

  if (isSubdomain) {
    // Extract the exact store name
    const subdomain = currentHost.replace(`.${baseDomain}`, "");

    // Prevent routing API calls, static assets, or images through the store builder route
    if (!url.pathname.startsWith("/api") && !url.pathname.startsWith("/_next")) {
      // Secretly rewrite the URL to /app/[domain]/...
      // e.g. storename.bloume.shop/checkout -> /[domain]/checkout
      return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}${url.search}`, req.url));
    }
  }

  // If it's the main domain, or an API call, just let Auth and Next.js handle it normally
  return NextResponse.next();
});

export const config = {
  // Add matcher so we only run middleware on relevant routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

