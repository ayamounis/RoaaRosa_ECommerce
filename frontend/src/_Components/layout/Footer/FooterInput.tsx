'use client'
import { Icons } from "@/_Components/icons/icons"
import { Input } from "@/_Components/ui/input"
export default function FooterInput() {
    return (
        <form action="https://formsubmit.co/fareselabasery@outlook.com" method="POST" className='relative mt-6 group'>
            <Input name="email" type='email' className='rounded-xs autofill:bg-gray-800 pe-8' placeholder='Enter your email'></Input>
            <button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer group-focus-within:animate-pulse'><Icons.sendIcon /></button>
        </form>
    )
}
