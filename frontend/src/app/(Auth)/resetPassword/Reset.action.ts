'use server'

import { ResetPasswordFormType } from "./Reset.types";
import { API_BASE_URL } from "@/utils/apiConfig";

export const handleResetPassword = async (values: ResetPasswordFormType & { email: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/resetPassword`,
            {
                method: 'PUT',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        const finalRes = await response.json()
        return finalRes
    } catch (error) {
        console.log(error);
    }

}