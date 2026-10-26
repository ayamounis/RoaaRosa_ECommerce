'use client'
import { store } from "@/redux/store"
import { SessionProvider } from "next-auth/react"
import { Provider } from 'react-redux'
import { LanguageProvider } from "@/context/LanguageContext"

export default function MainProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Provider store={store}>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </Provider>
        </SessionProvider>
    )
}
