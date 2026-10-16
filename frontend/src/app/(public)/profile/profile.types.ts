import z from "zod";
import { schema } from "./profile.schema";

export type profileSchema = z.infer<typeof schema>;
