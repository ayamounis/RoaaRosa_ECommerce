import z from "zod";

export const addAddressSchema = z.object({
    name: z.string().min(3, "Name is required"),
    details: z.string().min(3, "Details is required"),
    phone: z.string().trim().regex(/^01[1|2|5|0][0-9]{8}$/, "Phone number must be Egyptian"),
    city: z.string().min(3, "City is required"),
})