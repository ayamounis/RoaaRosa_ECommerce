'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../../_Components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form'
import { Input } from '../../../_Components/ui/input'
import { handleResetPassword } from './Reset.action'
import { ResetPasswordSchema } from './Reset.schema'
import { ResetPasswordFormType } from './Reset.types'
import PasswordInput from '@/_Components/shared/PasswordInput/PasswordInput'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'


export default function ResetPasswordForm() {
    const { email } = useSelector((state: RootState) => state.emailForget)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const RhfObj = useForm(
        {
            resolver: zodResolver(ResetPasswordSchema),
        }
    )
    const { control, handleSubmit } = RhfObj
    const ResetPasswordSubmit = async (values: ResetPasswordFormType) => {
        setLoading(true)
        const res = await handleResetPassword({ ...values, email })
        if (res.token) {
            toast.success('Password reset successfully')
            router.push('/login')
        }
        else {
            toast.error(res.message)
            if (res.message == 'reset code not verified') {
                router.push('/forgetPassword')
            }
        }
        setLoading(false)
    }
    return (
        <Form {...RhfObj}>
            <form onSubmit={handleSubmit(ResetPasswordSubmit)}>
                <div className='form-inputs flex flex-col gap-10 '>
                    <Input className='input-Auth' type='email' disabled value={email} placeholder="Email" />
                    <FormField
                        control={control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <PasswordInput className='input-Auth' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='action-btn mt-6'>
                    <Button disabled={loading} className='rounded-none w-full button-primary py-6 active:scale-105' type='submit'>
                        {loading ? 'Resetting ...' : 'Reset Password'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
