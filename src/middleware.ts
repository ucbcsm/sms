import { checkInstitutionExistence } from "@/lib/api";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "./lib/api/auth";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isOnLoginPage = pathname.startsWith("/auth/login");

  // 🔥 Ne pas rediriger vers /config si on est déjà dessus
  const exists = await checkInstitutionExistence();
  if (!exists && !pathname.startsWith("/config")) {
    return NextResponse.redirect(new URL("/config", request.url));
  }

  // JWT check
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 🔥 Ne pas rediriger vers /auth/login si on est déjà dessus
  if ((!accessToken || !refreshToken) && !isOnLoginPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const userIsAuthenticated = await isAuthenticated(accessToken);

  // 🔁 Si pas authentifié et pas déjà sur /auth/login → redirection vers /auth/login
  if (!userIsAuthenticated && !isOnLoginPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ✅ Si authentifié mais il est SUR /auth/login → on le bloque là et on le redirige vers /
  if (userIsAuthenticated && isOnLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
};
