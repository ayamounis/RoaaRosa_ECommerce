import forgetImage from '@images/password.jpg'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import ForgetForm from './forgetForm'
const inter = Inter({
    weight: ['500'],
    subsets: ['latin']
})

export default function forgetPassword() {
    return (
        <div className='forgetPassword  text-text2 '>
            <div className='flex items-center justify-center gap-x-15'>
                <div className="image-container hidden md:block md:w-1/2">
                    <Image className=" object-cover h-140" alt='forget password image' src={forgetImage} />
                </div>
                <div className='w-100 md:w-1/2'>
                    <div className='form-title mb-12'>
                        <h1 className={`${inter.className} text-4xl`}>Forget Password</h1>
                        <p className='mt-4 text-text1'>Enter your Email to receive a reset code</p>
                    </div>
                    <ForgetForm />
                </div>
            </div>
        </div>
    )
}
