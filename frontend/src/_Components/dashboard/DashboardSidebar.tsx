'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Mail,
  Tag,
  ArrowRight,
  ArrowLeft,
  Store,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { signOut } from 'next-auth/react';

export type DashboardTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'users'
  | 'mailbox'
  | 'coupons';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  unreadMessagesCount?: number;
  lowStockCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function DashboardSidebar({
  activeTab,
  onSelectTab,
  unreadMessagesCount = 0,
  lowStockCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const navItems: {
    id: DashboardTab;
    labelAr: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      labelAr: 'المؤشرات والتحليلات',
      labelEn: 'Overview & Analytics',
      icon: LayoutDashboard,
    },
    {
      id: 'products',
      labelAr: 'إدارة المنتجات',
      labelEn: 'Products Management',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'categories',
      labelAr: 'الأقسام والتصنيفات',
      labelEn: 'Categories & Taxonomy',
      icon: Layers,
    },
    {
      id: 'orders',
      labelAr: 'إدارة الطلبات',
      labelEn: 'Client Orders',
      icon: ShoppingBag,
    },
    {
      id: 'users',
      labelAr: 'سجل العملاء والمستخدمين',
      labelEn: 'Users & Customers',
      icon: Users,
    },
    {
      id: 'mailbox',
      labelAr: 'صندوق البريد والاستفسارات',
      labelEn: 'Inquiries & Mailbox',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-[#C48D80] text-white',
    },
    {
      id: 'coupons',
      labelAr: 'الكوبونات والخصومات',
      labelEn: 'Discount Coupons',
      icon: Tag,
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 bg-white dark:bg-[#28211E] border-e border-[#EBDED6] dark:border-[#3D332E]">
      {/* Brand & Title */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
          <Link href="/" className="group block">
            <h1 className="font-serif text-xl font-bold tracking-[0.2em] text-[#2B2320] dark:text-[#FAF6F0] group-hover:text-[#C48D80] transition-colors">
              ROAROSA
            </h1>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#C48D80] font-semibold">
              {isAr ? 'لوحة تحكم المتجر' : 'Store Admin'}
            </p>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#988172]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#FAF7F2] dark:bg-[#1F1917] text-[#C48D80] font-bold shadow-2xs border border-[#EBDED6] dark:border-[#3D332E]'
                    : 'text-[#988172] hover:text-[#2B2320] dark:hover:text-[#FAF6F0] hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1F1917]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#C48D80] text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-[#988172]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      item.badgeColor || 'bg-[#C48D80] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-[#EBDED6] dark:border-[#3D332E] space-y-2">
        <ButtonLink
          href="/"
          icon={Store}
          label={isAr ? 'معاينة المتجر' : 'Live Storefront'}
        />
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 min-h-[calc(100vh-5rem)] sticky top-20">
        <div className="h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-[#EBDED6] dark:border-[#3D332E] shadow-sm">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-start duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

function ButtonLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#FAF7F2] dark:hover:bg-[#1F1917] border border-transparent hover:border-[#EBDED6] font-medium transition-colors"
    >
      <Icon className="w-4 h-4 text-[#C48D80]" />
      <span>{label}</span>
    </Link>
  );
}
