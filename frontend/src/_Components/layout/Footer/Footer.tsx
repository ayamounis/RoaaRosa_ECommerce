import { Copyright, Facebook, Instagram, LinkedinIcon, Twitter } from 'lucide-react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import FooterInput from './FooterInput'
import qr from '@images/footerQR.png'

const inter = Inter({
    weight: '700',
    subsets: ['latin']
})
export default function Footer() {
    return (
        <footer className="bg-black text-white z-50">
            <div className="container px-5 py-15 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
                <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
                    <Link href={'/'} className="flex title-font font-medium items-center md:justify-start justify-center">
                        <span className={`font-bold text-2xl ${inter.className}`}>Exclusive</span>
                    </Link>
                    <p className="mt-6 font-medium text-lg ">Subscribe</p>
                    <p className="mt-6 ">Get 10% off your first order</p>
                    <FooterInput />
                </div>
                <div className="flex-grow md:flex flex-wrap grid grid-cols-2  md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
                    <div className="lg:w-2/6  md:w-1/2 w-full px-4">
                        <h2 className="title-font font-medium text-xl mb-6">Support</h2>
                        <nav className="list-none mb-10 flex flex-col gap-4">
                            <li>
                                <address className='not-italic'>
                                    111 Bijoy sarani, Dhaka,  DH 1515, Bangladesh.
                                </address>
                            </li>
                            <li>
                                <Link href={'mailto:fareselabasery@outlook.com'} className=" navbarLink cursor-pointer">exclusive@gmail.com</Link>
                            </li>
                            <li>
                                <Link href={`tel:+201207286573`} className=" navbarLink cursor-pointer">+20 120 728 6573</Link>
                            </li>
                        </nav>
                    </div>
                    <div className="lg:w-1/6  md:w-1/2 w-full px-4">
                        <h2 className="title-font font-medium text-xl mb-6">Account</h2>
                        <nav className="list-none mb-10 flex flex-col gap-4">
                            <li>
                                <Link href={'/profile'} className=" navbarLink cursor-pointer">My Account</Link>
                            </li>
                            <li>
                                <Link href={'/login'} className=" navbarLink text-sm cursor-pointer">Login / Register</Link>
                            </li>
                            <li>
                                <Link href={'/cart'} className=" navbarLink cursor-pointer">Cart</Link>
                            </li>
                            <li>
                                <Link href={'/wishlist'} className=" navbarLink cursor-pointer">Wishlist</Link>
                            </li>
                            <li>
                                <Link href={'/products'} className=" navbarLink cursor-pointer">Shop</Link>
                            </li>
                        </nav>
                    </div>
                    <div className="lg:w-1/6  md:w-1/2 w-full px-4">
                        <h2 className="title-font font-medium text-xl mb-6">Quick Link</h2>
                        <nav className="list-none mb-10 flex flex-col gap-4">
                            <li>
                                <Link href={'/'} className=" navbarLink cursor-pointer">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href={'/'} className=" navbarLink cursor-pointer">Terms Of Use</Link>
                            </li>
                            <li>
                                <Link href={'/'} className=" navbarLink cursor-pointer">FAQ</Link>
                            </li>
                            <li>
                                <Link href={'/'} className=" navbarLink cursor-pointer">Contact</Link>
                            </li>
                        </nav>
                    </div>
                    <div className="lg:w-2/6  md:w-1/2 w-full ps-4">
                        <h2 className="title-font font-medium  text-xl mb-6">Download App</h2>
                        <p className='text-text/70 font-medium text-xs/[18px] '>Save $3 with App New User Only</p>
                        <div className='mb-6'>
                            <Image className='mx-auto md:mx-0 object-cover' src={qr} alt='footerApp' width={198} height={150}></Image>
                        </div>
                        <nav className="list-none flex items-center justify-center md:justify-start gap-5 ">
                            <li className='flex-center text-center rounded-full size-8 hover:bg-white hover:text-black duration-200'>
                                <Link href={'https://www.facebook.com/fares.elabasery.9'}><Facebook size={24} /></Link>
                            </li>
                            <li className='flex-center text-center rounded-full size-8 hover:bg-white hover:text-black duration-200'>
                                <Link href={'https://www.facebook.com/fares.elabasery.9'}><Twitter size={24} /></Link>
                            </li>
                            <li className='flex-center text-center rounded-full size-8 hover:bg-white hover:text-black duration-200'>
                                <Link href={'https://www.instagram.com/fares_elabasery/'}><Instagram size={24} /></Link>
                            </li>
                            <li className='flex-center text-center rounded-full size-8 hover:bg-white hover:text-black duration-200'>
                                <Link href={'https://www.linkedin.com/in/fares-elabasery/'}><LinkedinIcon size={24} /></Link>
                            </li>
                        </nav>
                    </div>
                </div>
            </div>
            <p className=" py-4 text-center text-text/20 text sm:flex-row">
                <Copyright width={20} className='inline' /> Copyright Fares elabasery 2025. All right reserved
            </p>
        </footer>
    )
}
