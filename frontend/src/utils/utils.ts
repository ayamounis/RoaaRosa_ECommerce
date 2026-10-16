import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getMyUserToken() {
    const cookie = await cookies()
    const tokenSession =
        cookie.get('__Secure-next-auth.session-token')?.value || // Production
        cookie.get('next-auth.session-token')?.value;            // Dev
    const decodedToken =await decode({ token: tokenSession, secret: process.env.NEXTAUTH_SECRET! })    
    return decodedToken?.credentialToken
}
export async function getUserId() {
    const cookie = await cookies()
    const tokenSession =
        cookie.get('__Secure-next-auth.session-token')?.value || // Production
        cookie.get('next-auth.session-token')?.value;            // Dev
    const decodedToken =await decode({ token: tokenSession, secret: process.env.NEXTAUTH_SECRET! })    
    return decodedToken?.id as string
}

