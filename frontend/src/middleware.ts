import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const jwt = await getToken({ req })
    if (jwt) {
        return NextResponse.next()
    }
    return NextResponse.redirect(`${process.env.BASE_URL}/login`)
}
export const config = {
    matcher: ['/cart/:path*', '/checkout', '/profile', '/wishlist:path*','/allorders']
}
