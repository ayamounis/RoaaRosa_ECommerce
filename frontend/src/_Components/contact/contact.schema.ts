import * as z from 'zod';

export const createQuickInquirySchema = (isAr: boolean) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'يرجى كتابة الاسم' : 'Please enter your name')
      .max(80, isAr ? 'الاسم لا يزيد عن 80 حرف' : 'Name must not exceed 80 characters'),
    phone: z
      .string()
      .trim()
      .min(8, isAr ? 'يرجى كتابة رقم الهاتف للتواصل' : 'Please enter a valid phone number')
      .max(25, isAr ? 'رقم الهاتف غير صحيح' : 'Invalid phone number'),
    whatsapp: z
      .string()
      .trim()
      .min(8, isAr ? 'يرجى كتابة رقم الواتساب' : 'Please enter your WhatsApp number')
      .max(25, isAr ? 'رقم الواتساب غير صحيح' : 'Invalid WhatsApp number'),
    pieces: z
      .string()
      .trim()
      .min(1, isAr ? 'يرجى تحديد عدد القطع' : 'Please specify number of pieces'),
    notes: z
      .string()
      .trim()
      .max(1000, isAr ? 'الملحوظات يجب ألا تتجاوز 1000 حرف' : 'Notes must not exceed 1000 characters')
      .optional()
      .or(z.literal('')),
  });

export type QuickInquiryFormData = {
  name: string;
  phone: string;
  whatsapp: string;
  pieces: string;
  notes?: string;
};

// Legacy schemas kept for backward-compatibility if imported elsewhere
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
      .max(25, isAr ? 'رقم الهاتف لا يزيد عن 25 رقم' : 'Phone must not exceed 25 characters')
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

export const createB2BContactSchema = (isAr: boolean) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'يرجى إدخال اسم المسؤول أو المشتري' : 'Please enter contact person name')
      .max(100, isAr ? 'الاسم لا يزيد عن 100 حرف' : 'Name must not exceed 100 characters'),
    companyName: z
      .string()
      .trim()
      .min(2, isAr ? 'يرجى إدخال اسم الشركة أو المتجر / البوتيك' : 'Please enter company or boutique name')
      .max(120, isAr ? 'اسم الشركة لا يزيد عن 120 حرف' : 'Company name must not exceed 120 characters'),
    workEmail: z
      .string()
      .trim()
      .email(isAr ? 'يرجى إدخال بريد إلكتروني تجاري صحيح' : 'Please enter a valid business email address'),
    phone: z
      .string()
      .trim()
      .min(6, isAr ? 'يرجى إدخال رقم هاتف / واتساب للتواصل السريع' : 'Please provide a valid direct phone / WhatsApp')
      .max(25, isAr ? 'رقم الهاتف لا يزيد عن 25 رقم' : 'Phone must not exceed 25 characters'),
    country: z
      .string()
      .trim()
      .min(2, isAr ? 'يرجى تحديد الدولة والمدينة' : 'Please specify country & city')
      .max(80, isAr ? 'اسم الدولة لا يزيد عن 80 حرف' : 'Country must not exceed 80 characters'),
    businessType: z
      .string()
      .trim()
      .min(2, isAr ? 'يرجى اختيار نوع النشاط التجاري' : 'Please select business type'),
    orderVolume: z
      .string()
      .trim()
      .min(1, isAr ? 'يرجى تحديد حجم الطلب التقديري' : 'Please select estimated order volume'),
    collections: z
      .array(z.string())
      .min(1, isAr ? 'يرجى اختيار مجموعة واحدة على الأقل' : 'Please select at least one collection of interest'),
    notes: z
      .string()
      .trim()
      .max(3000, isAr ? 'الملاحظات لا تزيد عن 3000 حرف' : 'Notes must not exceed 3000 characters')
      .optional()
      .or(z.literal('')),
  });

export type B2BContactFormData = {
  name: string;
  companyName: string;
  workEmail: string;
  phone: string;
  country: string;
  businessType: string;
  orderVolume: string;
  collections: string[];
  notes?: string;
};
