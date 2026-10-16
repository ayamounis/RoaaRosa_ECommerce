import z from "zod";

export const schemaUpdatePassword = z.object({
    currentPassword: z.string().min(3, "Current Password is required"),
    password: z.string().nonempty('Password is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/, 'Password must contain between 8 to 20 characters, one uppercase letter, one lowercase letter, one number and one special character'),
    rePassword: z.string().nonempty('Password is required'),
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
})