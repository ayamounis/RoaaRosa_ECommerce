'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../../_Components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form'
import { otpValidationSchema } from './OtpValidation.schema'
import { handleOtpValidation } from './otpValidation.action'
import { OtpValidationFormType } from './otpValidation.types'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/_Components/ui/input-otp'
import { useRouter } from 'next/navigation'


export default function OtpValidationForm() {
    const [loading, setLoading] = useState(false)
    const route =useRouter()
    const RhfObj = useForm(
        {
            resolver: zodResolver(otpValidationSchema),
        }
    )
    const { control, handleSubmit } = RhfObj
    const OtpValidationSubmit = async (values: OtpValidationFormType) => {
        setLoading(true)
        const res = await handleOtpValidation(values)
        if (res.status === 'Success') {
            toast.success('OTP validated successfully')
            route.push('/resetPassword')
        }
        else {
            toast.error(res.message)
        }
        setLoading(false)
    }
    return (
        <Form {...RhfObj}>
            <form onSubmit={handleSubmit(OtpValidationSubmit)}>
                <div className=' '>
                    <FormField
                        control={control}
                        name="resetCode"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <InputOTP className='border-2' value={field.value} onChange={field.onChange} maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                                        <InputOTPGroup className='w-full'>
                                            <InputOTPSlot className='w-1/6 h-14 font-bold' index={0} />
                                            <InputOTPSlot className='w-1/6 h-14 font-bold' index={1} />
                                            <InputOTPSlot className='w-1/6 h-14 font-bold' index={2} />
                                            <InputOTPSlot className='w-1/6 h-14 font-bold' index={3} />
                                            <InputOTPSlot className='w-1/6 h-14 font-bold' index={4} />
                                            <InputOTPSlot className='w-1/6 h-14 font-bold' index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='action-btn mt-6'>
                    <Button disabled={loading} className='rounded-none w-full button-primary py-6' type='submit'>
                        {loading ? 'Sending ...' : 'Validate OTP'}
                    </Button>
                </div>
                <div className='mt-4 '>
                    <p className='mt-8'>Didn&apos;t receive OTP? <Link href='/forgetPassword' className='ml-2 font-medium text-text2/70 underline underline-offset-6 cursor-pointer'> Resend OTP</Link></p>
                </div>
            </form>
        </Form>
    )
}
