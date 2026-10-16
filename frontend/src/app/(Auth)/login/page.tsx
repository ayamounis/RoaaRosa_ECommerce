import AuthImage from '@images/Auth.png'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import LoginForm from './LoginForm'
const inter = Inter({
    weight: ['500'],
    subsets: ['latin']
})

export default function login() {
    return (
        <div className='login my-15 text-text2'>
            <div className='flex items-center justify-center gap-x-15'>
                <div className="image-container hidden md:block md:w-2/3">
                    <Image className=" object-contain" alt='login image' src={AuthImage} />
                </div>
                <div className='w-full md:w-1/3'>
                    <div className='form-title mb-12'>
                        <h1 className={`${inter.className} text-4xl`}>Login</h1>
                        <p className='mt-4'>Enter your details below</p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
