import z from 'zod'
import { schema } from './login.schema'

export type LoginFormType = z.infer<typeof schema>