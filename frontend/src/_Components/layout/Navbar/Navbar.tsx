'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ChevronDown, Heart, ShoppingBag, User, Menu, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import SearchInput from '@/_Components/shared/SearchInput/SearchInput';
import { Button } from '@/_Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/_Components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/_Components/ui/sheet';
import { updateCartCountAsync } from '@/redux/slices/CartSlice';
import { updateWishlistCountAsync } from '@/redux/slices/WishlistSlice';
import type { AppDispatch, RootState } from '@/redux/store';

function NavbarInner() {
  const { data: isAuth } = useSession();
  const isAdmin = Boolean(
    isAuth?.user &&
    ((isAuth.user as { role?: string }).role === 'ADMIN' || isAuth.user.email === 'admin@ecommerce.com')
  );
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const dispatch = useDispatch<AppDispatch>();
  const [isOpenNav, setIsOpenNav] = useState(false);
  const pathname = usePathname();
  const { count } = useSelector((state: RootState) => state.cartCount);
  const { wishlistCount } = useSelector((state: RootState) => state.wishlist);

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleCloseMenu = () => {
    setIsOpenNav(false);
  };

  async function handleLogout() {
    await signOut({
      redirect: true,
      callbackUrl: '/login',
    });
    toast.success('Logged out successfully');
  }

  useEffect(() => {
    dispatch(updateWishlistCountAsync());
    dispatch(updateCartCountAsync());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if we scrolled past the top threshold
      setIsScrolled(currentScrollY > 60);

      // Ignore tiny jitters
      if (Math.abs(currentScrollY - lastScrollY) < 6) return;

      // Hide when scrolling DOWN, reveal when scrolling UP
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky z-40 top-0 backdrop-blur-md bg-[#FBF9F3]/95 dark:bg-[#1F1917]/95 border-b border-[#EBDED6] dark:border-[#3D332E] w-full transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'shadow-md' : ''}`}
    >
      {/* Main Header Bar */}
      <div className='container py-3 sm:py-4'>
        <div className='flex items-center justify-between gap-3 md:gap-8'>
          {/* Mobile Hamburger */}
          <div className='lg:hidden flex items-center'>
            <Sheet open={isOpenNav} onOpenChange={setIsOpenNav}>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-[#2B2320] dark:text-[#FAF6F0] p-1.5'
                  aria-label='Open Navigation Menu'
                >
                  <Menu className='w-6 h-6' />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='w-80 bg-[#FBF9F3] dark:bg-[#1F1917] p-0 flex flex-col'
              >
                <SheetHeader className='p-5 border-b border-[#EBDED6] dark:border-[#3D332E] text-left'>
                  <Link href='/' onClick={handleCloseMenu} className='inline-block'>
                    <h2 className='font-serif text-2xl font-bold tracking-[0.2em] text-[#2B2320] dark:text-[#FAF6F0]'>
                      ROAROSA
                    </h2>
                    <p className='text-[10px] tracking-[0.2em] uppercase text-[#988172] mt-0.5'>
                      Softness is not weakness
                    </p>
                  </Link>
                </SheetHeader>

                <div className='flex-1 overflow-y-auto p-5 space-y-6'>
                  {/* Mobile Search */}
                  <div>
                    <SearchInput />
                  </div>

                  {/* Navigation Links */}
                  <div className='space-y-1.5'>
                    <Link
                      href='/'
                      onClick={handleCloseMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === '/'
                          ? 'bg-[#C48D80] text-white font-semibold'
                          : 'text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#FAF7F2] dark:hover:bg-[#28211E]'
                      }`}
                    >
                      {isAr ? 'الرئيسية' : 'Home'}
                    </Link>
                    <Link
                      href='/products'
                      onClick={handleCloseMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === '/products'
                          ? 'bg-[#C48D80] text-white font-semibold'
                          : 'text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#FAF7F2] dark:hover:bg-[#28211E]'
                      }`}
                    >
                      {isAr ? 'جميع المنتجات' : 'All Products'}
                    </Link>
                    <Link
                      href='/wishlist'
                      onClick={handleCloseMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === '/wishlist'
                          ? 'bg-[#C48D80] text-white font-semibold'
                          : 'text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#FAF7F2] dark:hover:bg-[#28211E]'
                      }`}
                    >
                      {isAr ? 'المفضلة' : 'Favourites'}
                    </Link>
                    <Link
                      href='/cart'
                      onClick={handleCloseMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === '/cart'
                          ? 'bg-[#C48D80] text-white font-semibold'
                          : 'text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#FAF7F2] dark:hover:bg-[#28211E]'
                      }`}
                    >
                      {isAr ? 'حقيبة التسوق' : 'Shopping Bag'}
                    </Link>
                                        <Link
                      href='/contact'
                      onClick={handleCloseMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === '/contact'
                          ? 'bg-[#C48D80] text-white font-semibold'
                          : 'text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#FAF7F2] dark:hover:bg-[#28211E]'
                      }`}
                    >
                      {isAr ? 'تواصل معنا' : 'Contact Us'}
                    </Link>
                  </div>
                </div>

                <SheetFooter className='p-5 border-t border-[#EBDED6] dark:border-[#3D332E] bg-white/50 dark:bg-black/20'>
                  {/* Quick Dashboard link in mobile (Admin / Owner Only) */}
                  {isAdmin && (
                    <div className='w-full mb-3'>
                      <Button
                        asChild
                        onClick={handleCloseMenu}
                        variant='outline'
                        className='w-full border-[#C48D80] text-[#C48D80] flex items-center justify-center gap-2'
                      >
                        <Link href='/dashboard'>
                          <LayoutDashboard className='w-4 h-4' />
                          <span>{isAr ? 'لوحة التحكم الإدارية' : 'Admin Dashboard'}</span>
                        </Link>
                      </Button>
                    </div>
                  )}

                  {isAuth ? (
                    <Button
                      onClick={() => {
                        handleLogout();
                        handleCloseMenu();
                      }}
                      variant='outline'
                      className='w-full border-[#C48D80] text-[#C48D80]'
                    >
                      {isAr ? 'تسجيل الخروج' : 'Logout'}
                    </Button>
                  ) : (
                    <div className='grid grid-cols-2 gap-2 w-full'>
                      <Button
                        asChild
                        onClick={handleCloseMenu}
                        variant='outline'
                        className='text-xs border-[#EBDED6]'
                      >
                        <Link href='/register'>{isAr ? 'إنشاء حساب' : 'Register'}</Link>
                      </Button>
                      <Button
                        asChild
                        onClick={handleCloseMenu}
                        className='text-xs bg-[#C48D80] hover:bg-[#B27B6E] text-white'
                      >
                        <Link href='/login'>{isAr ? 'تسجيل الدخول' : 'Sign In'}</Link>
                      </Button>
                    </div>
                  )}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Brand Logo & Slogan */}
          <Link href='/' className='flex flex-col items-center sm:items-start group flex-shrink-0'>
            <span className='sr-only'>ROAROSA Girls</span>
            <h1 className='font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#2B2320] dark:text-[#FAF6F0] group-hover:text-[#C48D80] transition-colors'>
              ROAROSA
            </h1>
            <span className='text-[9px] uppercase tracking-[0.28em] text-[#988172] -mt-1 hidden sm:block'>
              Softness is not weakness
            </span>
          </Link>

          {/* Center Search Input (Next Direct style) */}
          <div className='hidden lg:flex flex-1 justify-center max-w-xl mx-4'>
            <SearchInput />
          </div>

          {/* Right Utilities (Dashboard, Account, Favourites, Bag) */}
          <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
            {/* Quick Admin Dashboard Link (Only visible to Website Owner / Admin) */}
            {isAdmin && (
              <Link
                href='/dashboard'
                className='hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] transition-colors'
                title={isAr ? 'لوحة تحكم الإدارة والتحليلات' : 'Admin & Performance Dashboard'}
              >
                <LayoutDashboard className='w-3.5 h-3.5 text-[#C48D80]' />
                <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
              </Link>
            )}

            {/* Account */}
            {isAuth ? (
              <div className='relative'>
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex items-center gap-1.5 p-2 rounded-full hover:bg-[#F5EFEB] dark:hover:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] transition-colors cursor-pointer outline-none'>
                    <User className='w-5 h-5 text-[#988172]' />
                    <span className='hidden xl:inline text-xs font-medium'>
                      {isAr ? 'حسابي' : 'My Account'}
                    </span>
                    <ChevronDown className='w-3.5 h-3.5 text-[#988172]' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-52 bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-lg'
                  >
                    <DropdownMenuLabel className='text-xs text-[#988172]'>
                      {isAr ? 'حساب رواروسا' : 'ROAROSA Account'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild className='cursor-pointer text-xs font-semibold text-[#C48D80]'>
                        <Link href='/dashboard' className='flex items-center gap-2'>
                          <LayoutDashboard className='w-4 h-4 text-[#C48D80]' />
                          <span>{isAr ? 'لوحة التحكم الإدارية' : 'Admin Dashboard'}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className='cursor-pointer text-xs'>
                      <Link href='/profile'>{isAr ? 'إعدادات الحساب' : 'Profile Settings'}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className='cursor-pointer text-xs'>
                      <Link href='/allorders'>{isAr ? 'طلباتي ومشترياتي' : 'My Orders'}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='cursor-pointer text-xs text-[#C48D80] font-medium'
                    >
                      {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                href='/login'
                className='hidden sm:flex items-center gap-1.5 p-2 rounded-full hover:bg-[#F5EFEB] dark:hover:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] transition-colors'
              >
                <User className='w-5 h-5 text-[#988172]' />
                <span className='text-xs font-medium'>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </Link>
            )}

            {/* Favourites (Wishlist) */}
            <Link
              href='/wishlist'
              className={`flex items-center gap-1.5 p-2 rounded-full hover:bg-[#F5EFEB] dark:hover:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] relative transition-colors ${
                pathname === '/wishlist' ? 'text-[#C48D80]' : ''
              }`}
              title={isAr ? 'المفضلة' : 'Favourites'}
            >
              <Heart
                className={`w-5 h-5 ${
                  pathname === '/wishlist'
                    ? 'fill-[#C48D80] text-[#C48D80]'
                    : 'text-[#988172]'
                }`}
              />
              <span className='hidden xl:inline text-xs font-medium'>
                {isAr ? 'المفضلة' : 'Favourites'}
              </span>
              {wishlistCount > 0 && (
                <span className='absolute -top-0.5 -right-0.5 bg-[#C48D80] text-white text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1'>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag (Cart) */}
            <Link
              href='/cart'
              className={`flex items-center gap-1.5 p-2 rounded-full hover:bg-[#F5EFEB] dark:hover:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] relative transition-colors ${
                pathname === '/cart' ? 'text-[#C48D80]' : ''
              }`}
              title={isAr ? 'حقيبة التسوق' : 'Shopping Bag'}
            >
              <ShoppingBag
                className={`w-5 h-5 ${
                  pathname === '/cart'
                    ? 'fill-[#C48D80]/20 text-[#C48D80]'
                    : 'text-[#988172]'
                }`}
              />
              <span className='hidden xl:inline text-xs font-medium'>
                {isAr ? 'الحقيبة' : 'Bag'}
              </span>
              {count > 0 && (
                <span className='absolute -top-0.5 -right-0.5 bg-[#2B2320] dark:bg-[#C48D80] text-white text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1'>
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className='mt-3 lg:hidden'>
          <SearchInput />
        </div>
      </div>

      </header>
  );
}

export default function Navbar() {
  return <NavbarInner />;
}
