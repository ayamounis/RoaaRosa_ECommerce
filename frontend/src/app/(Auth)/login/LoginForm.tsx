'use client'
import PasswordInput from '@/_Components/shared/PasswordInput/PasswordInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../../_Components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../_Components/ui/form'
import { Input } from '../../../_Components/ui/input'
import { schema } from './login.schema'
import { LoginFormType } from './login.types'


export default function LoginForm() {
    const RhfObj = useForm(
        {
            resolver: zodResolver(schema),
        }
    )
    const { control, handleSubmit } = RhfObj
    const LoginSubmit = async (values: LoginFormType) => {
        const res = await signIn('credentials', { ...values, redirect: false })
        if (res?.ok) {
            window.location.href = '/'
            toast.success('Login Successful')
        } else {
            toast.error('Incorrect Email or Password')
        }

    }
    return (
        <Form {...RhfObj}>
            <form onSubmit={handleSubmit(LoginSubmit)}>
                <div className='flex flex-col gap-10 '>
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className='input-Auth' type='email' placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <PasswordInput className='input-Auth' type='password' placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Link href='/forgetPassword' className='block text-end mt-2 text-text2/70 cursor-pointer hover:text-text2 duration-200 hover:underline'>Forget Password</Link>
                <div className='action-btn mt-6'>
                    <Button disabled={RhfObj.formState.isSubmitting} className='rounded-none w-full button-primary py-6' type='submit'>
                        Login
                    </Button>
                </div>
                <div className='Google-btn mt-4 text-center'>
                    <p className='mt-8'>Dont have account? <Link href='/register' className='ml-2 font-medium text-text2/70 underline underline-offset-6 cursor-pointer'> Register</Link></p>
                </div>
            </form>
        </Form>
    )
}
