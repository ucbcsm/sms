import { checkInstitutionExistence } from "@/lib/api";
import { NextResponse, type NextRequest } from "next/server";

// export const config = {
//   runtime: "nodejs",
// };

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // console.log("Proxy middleware triggered for:", request.url);
  const exists = await checkInstitutionExistence();
  if (!exists) {
    return NextResponse.redirect(new URL("/config", request.nextUrl));
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  if ((!accessToken || !refreshToken) && !pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  return NextResponse.next();
}
