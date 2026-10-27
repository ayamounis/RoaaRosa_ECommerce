import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { jwtDecode } from 'jwt-decode'
import { API_BASE_URL } from '@/utils/apiConfig'

interface DecodedToken {
    id?: string;
    _id?: string;
    role?: string;
    email?: string;
}

export const nextAuthConfig: NextAuthOptions = {
    providers: [
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                  GoogleProvider({
                      clientId: process.env.GOOGLE_CLIENT_ID,
                      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                  }),
              ]
            : []),
        Credentials({
            id: 'google-instant',
            name: 'Google Instant',
            credentials: {
                email: { label: 'Gmail', type: 'email' },
                name: { label: 'Name', type: 'text' },
                googleId: { label: 'Google ID', type: 'text' },
                phone: { label: 'Phone', type: 'text' },
            },
            authorize: async (credentials) => {
                if (!credentials?.email) return null;
                const email = credentials.email.toLowerCase().trim();
                const name = credentials.name || email.split('@')[0];
                const phone = credentials.phone ? credentials.phone.trim() : undefined;

                try {
                    const res = await fetch(`${API_BASE_URL}/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email,
                            name,
                            googleId: credentials.googleId,
                            phone,
                        }),
                    });

                    const data = await res.json();
                    if (data.message === 'success' && data.token) {
                        const decoded = jwtDecode<DecodedToken>(data.token);
                        const assignedRole = data.user?.role || decoded.role || (email === 'admin@ecommerce.com' ? 'ADMIN' : 'USER');
                        return {
                            id: data.user?.id || decoded.id || 'google_user',
                            email: data.user?.email || email,
                            name: data.user?.name || name,
                            role: assignedRole,
                            credentialToken: data.token,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('google-instant authorize error:', error);
                    return null;
                }
            },
        }),
        Credentials({
            id: 'credentials',
            name: 'Exclusive',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('MISSING_CREDENTIALS');
                }
                const email = credentials.email.toLowerCase().trim();
                try {
                    const res = await fetch(`${API_BASE_URL}/auth/signin`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email,
                            password: credentials.password,
                        }),
                    });
                    const finalResult = await res.json();

                    if (res.status === 404 || finalResult.statusCode === 404) {
                        throw new Error('NOT_REGISTERED');
                    }
                    if (res.status === 401 || finalResult.statusCode === 401) {
                        if (finalResult.message?.includes('معطل')) {
                            throw new Error('ACCOUNT_DISABLED');
                        }
                        throw new Error('WRONG_PASSWORD');
                    }

                    if (finalResult.message === 'success' && finalResult.token) {
                        const decodedObject = jwtDecode<DecodedToken>(finalResult.token);
                        const assignedRole = finalResult.user?.role || decodedObject.role || (email === 'admin@ecommerce.com' ? 'ADMIN' : 'USER');
                        return {
                            id: decodedObject.id || finalResult.user?.id,
                            email: finalResult.user?.email,
                            name: finalResult.user?.name,
                            role: assignedRole,
                            credentialToken: finalResult.token,
                        };
                    } else {
                        throw new Error(finalResult.message || 'AUTH_FAILED');
                    }
                } catch (error: unknown) {
                    const err = error as Error;
                    console.error('Credentials authorization error:', err?.message);
                    throw new Error(err?.message || 'AUTH_FAILED');
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' && user.email) {
                try {
                    const profileName = (profile as { name?: string })?.name;
                    const res = await fetch(`${API_BASE_URL}/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name || profileName || user.email.split('@')[0],
                            googleId: account.providerAccountId,
                        }),
                    });
                    const data = await res.json();
                    if (data.token) {
                        user.credentialToken = data.token;
                        user.id = data.user?.id || user.id;
                        (user as { role?: string }).role = data.user?.role || 'USER';
                        return true;
                    }
                } catch (e) {
                    console.error('Google OAuth backend sync error:', e);
                }
            }
            return true;
        },
        jwt({ user, token, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = (user as { role?: string }).role || 'USER';
                token.credentialToken = user.credentialToken;
            }
            if (trigger === 'update') {
                if (session?.name) token.name = session.name;
                if (session?.email) token.email = session.email;
                if (session?.credentialToken) token.credentialToken = session.credentialToken;
                if (session?.role) token.role = session.role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                (session.user as { role?: string }).role = (token.role as string) || 'USER';
                session.user.credentialToken = token.credentialToken as string;
            }
            return session;
        },
    },
}