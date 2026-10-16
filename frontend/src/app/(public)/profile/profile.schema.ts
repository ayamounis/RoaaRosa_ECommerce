import z from "zod";

export const schema = z.object({
    name: z.string().min(3, "Name is required"),
    phone: z.string().trim().regex(/^01[1|2|5|0][0-9]{8}$/, "Phone number must be Egyptian"),
})