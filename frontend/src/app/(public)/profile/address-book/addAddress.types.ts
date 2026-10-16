import z from "zod";
import { addAddressSchema } from "./addAddress.schema";

export type addAddress = z.infer<typeof addAddressSchema>;
