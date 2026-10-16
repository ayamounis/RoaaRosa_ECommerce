import forgetImage from '@images/password.jpg'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import ForgetForm from './ResetForm'
const inter = Inter({
    weight: ['500'],
    subsets: ['latin']
})

export default function ResetPassword() {
    return (
        <div className='ResetPassword text-text2 '>
            <div className='flex items-center justify-center gap-x-15'>
                <div className="image-container hidden md:block md:w-1/2">
                    <Image className=" object-cover h-140" alt='Reset password image' src={forgetImage} />
                </div>
                <div className='w-100 md:w-1/2'>
                    <div className='form-title mb-12'>
                        <h1 className={`${inter.className} text-4xl`}>Reset Password</h1>
                        <p className='mt-4 text-text1'>Enter your Email and New Password</p>
                    </div>
                    <ForgetForm />
                </div>
            </div>
        </div>
    )
}
