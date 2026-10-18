'use server'

import { ForgetFormType } from "./forget.types";
import { API_BASE_URL } from "@/utils/apiConfig";

export const handleForgetPassword = async (values: ForgetFormType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgotPasswords`,
            {
                method: 'POST',
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