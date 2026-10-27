import * as z from 'zod';

export const schema = z
  .object({
    name: z
      .string()
      .min(1, 'الاسم مطلوب / Name is required')
      .min(3, 'الاسم يجب ألا يقل عن 3 أحرف / Name must be at least 3 characters'),
    email: z
      .string()
      .min(1, 'البريد الإلكتروني مطلوب / Email is required')
      .email('البريد الإلكتروني غير صحيح / Invalid email address'),
    phone: z
      .string()
      .min(1, 'رقم الهاتف مطلوب / Phone number is required')
      .regex(
        /^(?:\+?20|0020)?0?1[0125]\d{8}$/,
        'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678) / Must be a valid Egyptian mobile number',
      ),
    password: z
      .string()
      .min(1, 'كلمة المرور مطلوبة / Password is required')
      .min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف / Password must be at least 6 characters'),
    rePassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب / Password confirmation is required'),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'كلمتا المرور غير متطابقتين / Passwords do not match',
    path: ['rePassword'],
  });