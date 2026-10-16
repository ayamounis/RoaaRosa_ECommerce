import z from "zod";
import { paymentSchema } from "./payment.schema";

export type paymentTypes = z.infer<typeof paymentSchema>