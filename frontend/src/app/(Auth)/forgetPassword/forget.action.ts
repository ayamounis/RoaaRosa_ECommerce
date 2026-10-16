'use server'

import { ForgetFormType } from "./forget.types";

export const handleForgetPassword = async (values: ForgetFormType) => {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords',
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