import z from 'zod'
import { otpValidationSchema } from './OtpValidation.schema'

export type OtpValidationFormType = z.infer<typeof otpValidationSchema>
