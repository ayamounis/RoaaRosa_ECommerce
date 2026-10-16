import z from 'zod'
import { ResetPasswordSchema } from './Reset.schema'

export type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema> 
