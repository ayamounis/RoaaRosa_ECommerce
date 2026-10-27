'use server'

import { cookies } from "next/headers";
import { RegisterFormType } from "./register.types";
import { API_BASE_URL } from "@/utils/apiConfig";

export const handleRegister = async (values: RegisterFormType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`,
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
            });
            return true;
        } else {
            if (finalRes.message?.includes('already in use') || finalRes.message?.includes('already exists')) {
                return 'البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول بدلاً من ذلك';
            }
            if (Array.isArray(finalRes.errors)) {
                return finalRes.errors.join(', ');
            }
            return finalRes.message || 'فشل إنشاء الحساب، يرجى مراجعة البيانات المدخلة';
        }
    } catch (error) {
        console.error('Registration server error:', error);
        return 'تعذر الاتصال بالسيرفر، يرجى المحاولة لاحقاً';
    }
}