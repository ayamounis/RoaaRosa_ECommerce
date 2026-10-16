'use server'

import { OtpValidationFormType } from "./otpValidation.types";

export const handleOtpValidation = async (values: OtpValidationFormType) => {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode',
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