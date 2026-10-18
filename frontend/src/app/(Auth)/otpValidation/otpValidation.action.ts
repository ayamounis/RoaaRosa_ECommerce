'use server'

import { OtpValidationFormType } from "./otpValidation.types";
import { API_BASE_URL } from "@/utils/apiConfig";

export const handleOtpValidation = async (values: OtpValidationFormType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verifyResetCode`,
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