'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ChevronDown, Heart, ShoppingBag, User, Menu, Sparkles } from 'lucide-react';

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

const DEPARTMENT_LINKS = [
  { slug: 'all', title: 'All Girls', href: '/?category=all' },
  { slug: 'new-in', title: 'New In', href: '/?category=new-in', highlight: true },
  { slug: 'baby', title: 'Baby (0-2 Yrs)', href: '/?category=baby' },
  { slug: 'younger', title: 'Younger Girls (3-7 Yrs)', href: '/?category=younger' },
  { slug: 'older', title: 'Older Girls (8-16 Yrs)', href: '/?category=older' },
  { slug: 'dresses', title: 'Dresses', href: '/?category=dresses' },
  { slug: 'tops', title: 'Tops & T-Shirts', href: '/?category=tops' },
  { slug: 'knitwear', title: 'Knitwear', href: '/?category=knitwear' },
  { slug: 'coats', title: 'Coats & Jackets', href: '/?category=coats' },
  { slug: 'sets', title: 'Sets & Outfits', href: '/?category=sets' },
  { slug: 'shoes', title: 'Shoes & Boots', href: '/?category=shoes' },
  { slug: 'nightwear', title: 'Nightwear', href: '/?category=nightwear' },
  { slug: 'occasions', title: 'Occasions', href: '/?category=occasions' },
  { slug: 'sale', title: 'Sale', href: '/?category=sale', isSale: true },
];

function NavbarInner({ currentCategory }: { currentCategory: string }) {
  const { data: isAuth } = useSession();
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

                  {/* Age Categories */}
                  <div>
                    <p className='text-xs font-semibold tracking-wider text-[#988172] uppercase mb-2'>
                      Shop By Age
                    </p>
                    <div className='grid grid-cols-2 gap-2'>
                      <Link
                        href='/?category=baby'
                        onClick={handleCloseMenu}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-colors ${
                          pathname === '/' && currentCategory === 'baby'
                            ? 'bg-[#C48D80] text-white border-[#C48D80]'
                            : 'bg-white dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                        }`}
                      >
                        Baby (0-2 Yrs)
                      </Link>
                      <Link
                        href='/?category=younger'
                        onClick={handleCloseMenu}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-colors ${
                          pathname === '/' && currentCategory === 'younger'
                            ? 'bg-[#C48D80] text-white border-[#C48D80]'
                            : 'bg-white dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                        }`}
                      >
                        Younger (3-7 Yrs)
                      </Link>
                      <Link
                        href='/?category=older'
                        onClick={handleCloseMenu}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-colors ${
                          pathname === '/' && currentCategory === 'older'
                            ? 'bg-[#C48D80] text-white border-[#C48D80]'
                            : 'bg-white dark:bg-[#28211E] border-[#EBDED6] dark:border-[#3D332E]'
                        }`}
                      >
                        Older (8-16 Yrs)
                      </Link>
                      <Link
                        href='/products'
                        onClick={handleCloseMenu}
                        className='p-2.5 rounded-lg bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs font-medium text-center'
                      >
                        All Products
                      </Link>
                    </div>
                  </div>

                  {/* Department Links */}
                  <div>
                    <p className='text-xs font-semibold tracking-wider text-[#988172] uppercase mb-2'>
                      Departments
                    </p>
                    <div className='space-y-1.5'>
                      {DEPARTMENT_LINKS.map((link, idx) => {
                        const isCurrent = pathname === '/' && link.slug === currentCategory;
                        return (
                          <Link
                            key={idx}
                            href={link.href}
                            onClick={handleCloseMenu}
                            className={`block px-3 py-2 rounded text-sm transition-colors ${
                              isCurrent
                                ? 'bg-[#C48D80] text-white font-semibold'
                                : link.isSale
                                ? 'text-[#C48D80] font-semibold'
                                : 'text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#FAF7F2] dark:hover:bg-[#28211E]'
                            }`}
                          >
                            {link.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <SheetFooter className='p-5 border-t border-[#EBDED6] dark:border-[#3D332E] bg-white/50 dark:bg-black/20'>
                  {isAuth ? (
                    <Button
                      onClick={() => {
                        handleLogout();
                        handleCloseMenu();
                      }}
                      variant='outline'
                      className='w-full border-[#C48D80] text-[#C48D80]'
                    >
                      Logout
                    </Button>
                  ) : (
                    <div className='grid grid-cols-2 gap-2 w-full'>
                      <Button
                        asChild
                        onClick={handleCloseMenu}
                        variant='outline'
                        className='text-xs border-[#EBDED6]'
                      >
                        <Link href='/register'>Register</Link>
                      </Button>
                      <Button
                        asChild
                        onClick={handleCloseMenu}
                        className='text-xs bg-[#C48D80] hover:bg-[#B27B6E] text-white'
                      >
                        <Link href='/login'>Sign In</Link>
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

          {/* Right Utilities (Account, Favourites, Bag) */}
          <div className='flex items-center gap-2 sm:gap-4 flex-shrink-0'>
            {/* Account */}
            {isAuth ? (
              <div className='relative'>
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex items-center gap-1.5 p-2 rounded-full hover:bg-[#F5EFEB] dark:hover:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] transition-colors cursor-pointer outline-none'>
                    <User className='w-5 h-5 text-[#988172]' />
                    <span className='hidden xl:inline text-xs font-medium'>My Account</span>
                    <ChevronDown className='w-3.5 h-3.5 text-[#988172]' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-48 bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-lg'
                  >
                    <DropdownMenuLabel className='text-xs text-[#988172]'>
                      ROAROSA Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className='cursor-pointer text-xs'>
                      <Link href='/profile'>Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className='cursor-pointer text-xs'>
                      <Link href='/allorders'>My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='cursor-pointer text-xs text-[#C48D80] font-medium'
                    >
                      Sign Out
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
                <span className='text-xs font-medium'>Sign In</span>
              </Link>
            )}

            {/* Favourites (Wishlist) */}
            <Link
              href='/wishlist'
              className={`flex items-center gap-1.5 p-2 rounded-full hover:bg-[#F5EFEB] dark:hover:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] relative transition-colors ${
                pathname === '/wishlist' ? 'text-[#C48D80]' : ''
              }`}
              title='Favourites'
            >
              <Heart
                className={`w-5 h-5 ${
                  pathname === '/wishlist'
                    ? 'fill-[#C48D80] text-[#C48D80]'
                    : 'text-[#988172]'
                }`}
              />
              <span className='hidden xl:inline text-xs font-medium'>Favourites</span>
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
              title='Shopping Bag'
            >
              <ShoppingBag
                className={`w-5 h-5 ${
                  pathname === '/cart'
                    ? 'fill-[#C48D80]/20 text-[#C48D80]'
                    : 'text-[#988172]'
                }`}
              />
              <span className='hidden xl:inline text-xs font-medium'>Bag</span>
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

      {/* Next Direct Secondary Department Subnav Bar */}
      <div className='border-t border-[#EBDED6] dark:border-[#3D332E] bg-[#F5EFEB]/90 dark:bg-[#28211E]/90 backdrop-blur-xs w-full'>
        <div className='container px-4'>
          <nav className='flex items-center justify-start overflow-x-auto no-scrollbar py-2.5 gap-2 sm:gap-3 text-xs font-medium whitespace-nowrap scroll-smooth'>
            {DEPARTMENT_LINKS.map((item, idx) => {
              const isCurrent = pathname === '/' && item.slug === currentCategory;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`relative py-1.5 px-3 rounded-full transition-all flex items-center gap-1 shrink-0 ${
                    isCurrent
                      ? 'bg-[#C48D80] text-white font-semibold shadow-xs'
                      : item.isSale
                      ? 'text-[#C48D80] font-bold hover:text-[#B27B6E] hover:bg-[#C48D80]/10'
                      : item.highlight
                      ? 'text-[#2B2320] dark:text-[#FAF6F0] font-semibold hover:text-[#C48D80] hover:bg-white/60 dark:hover:bg-[#3D332E]'
                      : 'text-[#5A4F4A] dark:text-[#D1C5BD] hover:text-[#2B2320] dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#3D332E]/50'
                  }`}
                >
                  {item.highlight && (
                    <Sparkles
                      className={`w-3 h-3 ${isCurrent ? 'text-white' : 'text-[#C48D80]'}`}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavbarWithParams() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  return <NavbarInner currentCategory={currentCategory} />;
}

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarInner currentCategory='all' />}>
      <NavbarWithParams />
    </Suspense>
  );
}
