'use server'

import { cookies } from "next/headers";
import { RegisterFormType } from "./register.types";

export const handleRegister = async (values: RegisterFormType) => {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup',
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