import z from "zod";

export const paymentSchema = z.object({
    phone: z.string().nonempty('Phone number is required').regex(/^01[1250][0-9]{8}$/, 'Phone number is not correct'),
    city: z.string().nonempty('City is required'),
    details: z.string().nonempty('Address is required').max(200, 'Address is too long')
})