import * as z from 'zod'

export const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().nonempty('Password is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 'Password must contain between 8 to 20 characters, one uppercase letter, one lowercase letter, one number and one special character'),
})