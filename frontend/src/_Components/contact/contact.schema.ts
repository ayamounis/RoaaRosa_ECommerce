import * as z from 'zod';

export const createContactSchema = (isAr: boolean) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'الاسم يجب ألا يقل عن حرفين' : 'Name must be at least 2 characters')
      .max(100, isAr ? 'الاسم لا يزيد عن 100 حرف' : 'Name must not exceed 100 characters'),
    email: z
      .string()
      .trim()
      .email(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address'),
    phone: z
      .string()
      .trim()
      .max(20, isAr ? 'رقم الهاتف لا يزيد عن 20 رقم' : 'Phone must not exceed 20 characters')
      .optional()
      .or(z.literal('')),
    subject: z
      .string()
      .trim()
      .min(3, isAr ? 'موضوع الرسالة يجب ألا يقل عن 3 أحرف' : 'Subject must be at least 3 characters')
      .max(200, isAr ? 'الموضوع لا يزيد عن 200 حرف' : 'Subject must not exceed 200 characters'),
    message: z
      .string()
      .trim()
      .min(5, isAr ? 'نص الرسالة يجب ألا يقل عن 5 أحرف' : 'Message must be at least 5 characters')
      .max(3000, isAr ? 'نص الرسالة لا يزيد عن 3000 حرف' : 'Message must not exceed 3000 characters'),
  });

export type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};
