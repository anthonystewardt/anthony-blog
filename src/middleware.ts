import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["es", "en"];
const defaultLocale = "es";

// Paths that should never get a locale prefix
const SKIP_PREFIXES = ["/api", "/blog", "/dashboard", "/login", "/register", "/unsubscribe", "/_next", "/favicon"];

function pathnameHasLocale(pathname: string) {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip non-page paths
    if (
      SKIP_PREFIXES.some((p) => pathname.startsWith(p)) ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // Already has a valid locale → pass through
    if (pathnameHasLocale(pathname)) return NextResponse.next();

    // Redirect bare path to default locale
    const target = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(new URL(target, req.url));
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Only require auth on dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token && token.role === "ADMIN";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
