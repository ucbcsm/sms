import { checkInstitutionExistence } from "@/lib/api";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  runtime: "nodejs",
};

export async function proxy(request: NextRequest) {
  console.log("Proxy middleware triggered for:", request.url);
  const exists = await checkInstitutionExistence();
  if (!exists) {
    return NextResponse.redirect(new URL("/config", request.url));
  }



  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // return NextResponse.next();
}
