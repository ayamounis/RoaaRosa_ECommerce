'use server'

import { cookies } from "next/headers";
import { LoginFormType} from "./login.types";
import { API_BASE_URL } from "@/utils/apiConfig";

export const handleLogin = async (values: LoginFormType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`,
            {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        const finalRes = await response.json()


        if (finalRes.message === 'success') {
            const cookie = await cookies();
            cookie.set('user-token', finalRes.token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            })
            return true
        }
        else {
            return finalRes.message
        }
    } catch (error) {
        console.log(error);
    }

}