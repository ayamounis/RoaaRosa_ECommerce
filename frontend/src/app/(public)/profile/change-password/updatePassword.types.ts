import z from "zod";
import { schemaUpdatePassword } from "./updatePassword.schema";

export type UpdatePasswordType = z.infer<typeof schemaUpdatePassword>;
