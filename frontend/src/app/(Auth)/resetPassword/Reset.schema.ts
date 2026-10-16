import * as z from 'zod'

export const ResetPasswordSchema = z.object({
        newPassword: z.string().nonempty('Password is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 'Password must contain between 8 to 20 characters, one uppercase letter, one lowercase letter, one number and one special character'),
})