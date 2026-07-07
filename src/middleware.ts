import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  if (!nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;

  if (nextUrl.pathname.startsWith("/dashboard/teacher") && role !== ROLES.TEACHER) {
    return NextResponse.redirect(new URL("/dashboard/student", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/dashboard/student") && role !== ROLES.STUDENT) {
    return NextResponse.redirect(new URL("/dashboard/teacher", nextUrl));
  }

  if (nextUrl.pathname === "/dashboard") {
    const target = role === ROLES.TEACHER ? "/dashboard/teacher" : "/dashboard/student";
    return NextResponse.redirect(new URL(target, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
