import z from 'zod'
import { schema } from './register.schema'

export type RegisterFormType = z.infer<typeof schema>