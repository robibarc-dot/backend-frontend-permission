import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname.startsWith("/login");
    const isProtectedPage =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/super-admin") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/teacher") ||
        pathname.startsWith("/student");

    if (!token && isProtectedPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/dashboard/:path*",
        "/super-admin/:path*",
        "/admin/:path*",
        "/teacher/:path*",
        "/student/:path*",
        "/login",
    ],
};
