import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { jwtDecode } from 'jwt-decode'

export const nextAuthConfig: NextAuthOptions = {
    providers: [
        Credentials({
            name: 'Exclusive',
            authorize: async (credentials) => {
                try {
                    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password
                        })
                    })
                    const finalResult = await res.json()
                    if (finalResult.message === 'success') {
                        const decodedObject = jwtDecode(finalResult.token) as { id: string }
                        return {
                            id: decodedObject.id,
                            email: finalResult.user.email,
                            name: finalResult.user.name,
                            credentialToken: finalResult.token,
                        }
                    } else {
                        return null
                    }
                } catch (error) {
                    console.log(error);
                    return null
                }
            },
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Enter your password'
                },
            },
        }

        )
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        jwt({user,token,trigger,session}) {
            if (user) {
                token.id = user.id
                token.name=user.name
                token.email = user.email
                token.credentialToken = user.credentialToken
            }
            if (trigger ==='update') {
                if (session?.name) token.name = session.name
                if (session?.email) token.email = session.email
                if (session?.credentialToken) token.credentialToken = session.credentialToken

            }
            return token
        },
        session({session,token}) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.credentialToken = token.credentialToken as string
            }
            return session
        },
    }
}