import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Strict role check for Dashboard (Admin/Owner only)
    if (pathname.startsWith('/dashboard')) {
        if (!jwt) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
        if (jwt.role !== 'ADMIN' && jwt.email !== 'admin@ecommerce.com') {
            // Customer attempted to access dashboard -> redirect to home
            const homeUrl = new URL('/', req.url);
            return NextResponse.redirect(homeUrl);
        }
        return NextResponse.next();
    }

    if (jwt) {
        return NextResponse.next();
    }

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/cart/:path*', '/checkout', '/profile', '/wishlist:path*', '/allorders', '/dashboard/:path*']
}
