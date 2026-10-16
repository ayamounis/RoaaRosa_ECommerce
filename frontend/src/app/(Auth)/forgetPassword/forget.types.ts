import z from 'zod'
import { schema } from './forget.schema'

export type ForgetFormType = z.infer<typeof schema>
