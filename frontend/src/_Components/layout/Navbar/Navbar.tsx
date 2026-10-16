'use client'
import { Icons } from '@/_Components/icons/icons';
import SearchInput from '@/_Components/shared/SearchInput/SearchInput';
import { Badge } from '@/_Components/ui/badge';
import { Button } from '@/_Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/_Components/ui/dropdown-menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger
} from "@/_Components/ui/sheet";
import { updateCartCountAsync } from '@/redux/slices/CartSlice';
import { updateWishlistCountAsync } from '@/redux/slices/WishlistSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { ChevronDown } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import ThemeToggle from '../../shared/ThemeToggle/ThemeToggle';
import { accountLinks } from '@/_Components/shared/AsideNav/AsideNav';

export default function Navbar() {
    const { data: isAuth } = useSession()
    const dispatch = useDispatch<AppDispatch>()
    const [isOpenNav, setisOpenNav] = useState(false)
    const pathname = usePathname()
    const { count } = useSelector((state: RootState) => state.cartCount)
    const { wishlistCount } = useSelector((state: RootState) => state.wishlist)
    const handleCloseMenu = () => {
        setisOpenNav(false)
    }

    const publicLinks = [
        { title: 'Home', link: '/' },
        { title: 'Products', link: '/products' },
    ]
    const authLinks = [
        { title: 'Home', link: '/' },
        { title: 'Products', link: '/products' },
        { title: 'All Orders', link: '/allorders' },
        { title: 'Profile', link: '/profile' }
    ]
    async function handleLogout() {
        await signOut({
            redirect: true,
            callbackUrl: '/login',
        })
        toast.success('Logout Successful')
    }

    useEffect(() => {
        dispatch(updateWishlistCountAsync())
        dispatch(updateCartCountAsync())
    }, [dispatch])

    return (
        <header className='sticky z-40 top-0 backdrop-blur-2xl bg-primary text-text2 border-b w-full'>
            <div className='container'>
                <div className='flex items-center justify-between h-23'>
                    {/* Brand */}
                    <Link href={'/'} className='flex items-center gap-2'>
                        <span className='sr-only'>Exclusive</span>
                        <h1 className='text-2xl font-bold '>Exclusive</h1>
                    </Link>
                    {/* nav Links */}
                    <nav className='hidden lg:flex items-center gap-8'>
                        {isAuth ? authLinks.slice(0, 3).map(({ title, link }, i) =>
                            <Link className={`text-sm navbarLink ${pathname === link ? 'active' : ''} decoration-gray-400 dark:decoration-white `} href={link} key={i}>{title}</Link>
                        ) : publicLinks.map(({ title, link }, i) =>
                            <Link className={`text-sm navbarLink ${pathname === link ? 'active' : ''} decoration-gray-400 dark:decoration-white `} href={link} key={i}>{title}</Link>
                        )}
                    </nav>
                    {/* actions btns in mobile */}
                    <div className='flex ms-auto gap-3 me-4 md:hidden'>
                        {isAuth &&
                        <>
                        <Link href={'/wishlist'} className={`relative group navbarIcons ${pathname == '/wishlist' ? 'active' : ''}`}>
                            <Icons.heart />
                            <Badge variant={'destructive'} className={`absolute top-0 group-hover:text-button2 group-hover:bg-text dark:group-hover:bg-text2 end-0 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums dark:bg-secondary2 ${pathname == '/wishlist' ? '!bg-text !text-button2 font-semibold' : ''}`}>
                                {wishlistCount}
                            </Badge>
                        </Link>
                        <Link href={'/cart'} className={`relative group navbarIcons ${pathname == '/cart' ? 'active' : ''}`}>
                            <Icons.cart />
                            <Badge variant={'destructive'} className={`absolute top-0 group-hover:text-button2 group-hover:bg-text dark:group-hover:bg-text2 end-0 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums dark:bg-secondary2 ${pathname == '/cart' ? '!bg-text !text-button2 font-semibold' : ''}`}>
                                {count}
                            </Badge>
                        </Link>
                        </>
                        }
                    </div>
                    {/* actions btns in desktop */}
                    <div className='hidden md:flex items-center  gap-4'>
                        <SearchInput />
                        {isAuth ?
                            <>
                                <div className='flex gap-2'>
                                    <Link href={'/wishlist'} className={`relative group navbarIcons ${pathname == '/wishlist' ? 'active' : ''}`}>
                                        <Icons.heart />
                                        <Badge variant={'destructive'} className={`absolute top-0 group-hover:text-button2 group-hover:bg-text dark:group-hover:bg-text2 end-0 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums dark:bg-secondary2 ${pathname == '/wishlist' ? '!bg-text !text-button2 font-semibold' : ''}`}>
                                            {wishlistCount}
                                        </Badge>
                                    </Link>
                                    <Link href={'/cart'} className={`relative group navbarIcons ${pathname == '/cart' ? 'active' : ''}`}>
                                        <Icons.cart />
                                        <Badge variant={'destructive'} className={`absolute top-0 group-hover:text-button2 group-hover:bg-text dark:group-hover:bg-text2 end-0 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums dark:bg-secondary2 ${pathname == '/cart' ? '!bg-text !text-button2 font-semibold' : ''}`}>
                                            {count}
                                        </Badge>
                                    </Link>

                                    <div className={`relative navbarIcons ${accountLinks.map((link) => link.href).includes(pathname) ? 'active' : ''}`}>
                                        <Link href={'/profile'}>
                                            <Icons.user size={30} strokeWidth={1.2} />
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='absolute top-8 right-0 rounded-full bg-Bg text-button'><ChevronDown size={15} /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className='bg-secondary hover:scale-105 cursor-pointer duration-200'>
                                                    <Link href={'/profile'}>Profile Setting</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={handleLogout} className='font-light  capitalize text-text bg-button2 py-2  cursor-pointer dark:bg-button2 dark:text-Bg  hover:text-button2   hover:bg-text duration-200 '>
                                                    logout
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </> :
                            <>
                                <Link className='font-light capitalize' href="/register">signUp</Link>
                                <Button asChild className='font-light capitalize text-text bg-button dark:bg-white dark:text-Bg ms-2 hover:text-text2 border-1'>
                                    <Link href="/login">signIn</Link>
                                </Button>
                            </>

                        }
                    </div>
                    {/* mobile menu */}
                    <Sheet open={isOpenNav} onOpenChange={setisOpenNav}>
                        <SheetTrigger asChild>
                            <Button variant={'ghost'} className='md:hidden p-2 rounded-md'>
                                <Icons.menu className=' size-7' />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className='sm:hidden' side='left'>
                            <SheetHeader>
                                <Link href={'/'} className='flex items-center gap-2'>
                                    <span className='sr-only'> FreshCart</span>
                                    <Icons.cart className='size-8' />
                                    <h1 className='text-lg font-semibold'> FreshCart</h1>
                                </Link>
                                <span className='flex justify-end'>
                                    <ThemeToggle />
                                </span>
                            </SheetHeader>
                            <nav className='flex flex-col items-center gap-6  '>
                                {isAuth ? authLinks.map(({ title, link }, i) =>
                                    <Link className={`text-md text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium `} href={link} key={i} onClick={handleCloseMenu}>{title}</Link>
                                ) : publicLinks.map(({ title, link }, i) =>
                                    <Link className={`text-md text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium `} href={link} key={i} onClick={handleCloseMenu}>{title}</Link>
                                )}
                            </nav>
                            <SheetFooter>
                                {isAuth ?
                                    <Button asChild onClick={() => {handleLogout(); handleCloseMenu()  }} variant={'outline'}>
                                        <p>Logout</p>
                                    </Button>
                                    :
                                    <>
                                        <Button asChild onClick={handleCloseMenu} className='capitalize' variant={'outline'}>
                                            <Link href="/register">signUp</Link>
                                        </Button>
                                        <Button asChild onClick={handleCloseMenu} className='capitalize' variant={'outline'}>
                                            <Link href="/login">signIn</Link>
                                        </Button>
                                    </>
                                }
                                <SheetClose asChild>
                                    <Button className='text-secondary2' variant="outline">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header >
    )
}

