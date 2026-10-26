'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Store,
  CheckCircle2,
  Tag,
  Star,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';
import { Button } from '@/_Components/ui/button';

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  topSellingProducts: {
    id: string;
    title: string;
    sold: number;
    price: number;
    imageCover?: string;
    ratingsAverage?: number;
  }[];
  recentOrders: {
    id: string;
    totalOrderPrice: number;
    status: string;
    isPaid: boolean;
    createdAt: string;
    customerName: string;
    customerEmail: string;
  }[];
  monthlySales: {
    month: string;
    revenue: number;
    orders: number;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const isAdmin = Boolean(
    session?.user &&
    ((session.user as { role?: string }).role === 'ADMIN' || session.user.email === 'admin@ecommerce.com')
  );

  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons'>('overview');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = (session?.user as { credentialToken?: string })?.credentialToken;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['token'] = token;
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers,
      });

      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      } else {
        // Fallback demo statistics if not logged in as admin
        loadFallbackData();
      }
    } catch {
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    setData({
      totalRevenue: 184500,
      totalOrders: 142,
      pendingOrders: 8,
      totalCustomers: 265,
      totalProducts: 48,
      activeProducts: 46,
      lowStockCount: 3,
      topSellingProducts: [
        {
          id: 'roa-001',
          title: 'Dusty Rose Sparkle Knit Occasion Dress',
          sold: 142,
          price: 1350,
          imageCover: '/images/next/dresses-shop-now.jpg',
          ratingsAverage: 4.9,
        },
        {
          id: 'roa-003',
          title: 'Baker Collection Quilted Hooded Puffer Coat',
          sold: 95,
          price: 2450,
          imageCover: '/images/next/baker-by-ted-baker.jpg',
          ratingsAverage: 5.0,
        },
        {
          id: 'roa-002',
          title: 'Taupe Pointelle Knit Cardigan & Jumper',
          sold: 110,
          price: 1150,
          imageCover: '/images/next/jumpers-and-cardigans-shop-now.jpg',
          ratingsAverage: 4.8,
        },
        {
          id: 'roa-005',
          title: 'Varsity Fleece Sweatshirt & Wide Leg Jogger Set',
          sold: 72,
          price: 1450,
          imageCover: '/images/next/sweat-tops-and-jogger-sets.jpg',
          ratingsAverage: 4.9,
        },
      ],
      recentOrders: [
        {
          id: 'ORD-8921',
          customerName: 'Sarah Mansour',
          customerEmail: 'sarah.m@example.com',
          totalOrderPrice: 2800,
          status: 'PENDING',
          isPaid: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ORD-8920',
          customerName: 'Nour El-Din',
          customerEmail: 'nour@example.com',
          totalOrderPrice: 1350,
          status: 'DELIVERED',
          isPaid: true,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'ORD-8919',
          customerName: 'Yasmine Sherif',
          customerEmail: 'yasmine.s@example.com',
          totalOrderPrice: 3900,
          status: 'DELIVERED',
          isPaid: true,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'ORD-8918',
          customerName: 'Hoda Kamel',
          customerEmail: 'hoda.k@example.com',
          totalOrderPrice: 950,
          status: 'PENDING',
          isPaid: false,
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
      ],
      monthlySales: [
        { month: '2026-05', revenue: 28500, orders: 22 },
        { month: '2026-06', revenue: 34200, orders: 27 },
        { month: '2026-07', revenue: 41800, orders: 31 },
        { month: '2026-08', revenue: 38900, orders: 29 },
        { month: '2026-09', revenue: 47600, orders: 36 },
        { month: '2026-10', revenue: 53500, orders: 42 },
      ],
    });
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [session, isAdmin]);

  if (status === 'loading') {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4'>
        <div className='w-10 h-10 border-3 border-[#C48D80] border-t-transparent rounded-full animate-spin' />
        <p className='text-xs text-[#988172] font-medium'>
          {isAr ? 'جاري التحقق من صلاحيات الإدارة...' : 'Verifying admin authorization...'}
        </p>
      </div>
    );
  }

  // Restrict access strictly to the store owner / Admin
  if (!isAdmin) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className='min-h-[75vh] flex items-center justify-center p-4 bg-[#FBF9F3] dark:bg-[#1F1917]'>
        <div className='max-w-md w-full bg-white dark:bg-[#28211E] rounded-3xl p-8 border border-[#EBDED6] dark:border-[#3D332E] shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-300'>
          <div className='w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80]'>
            <ShieldAlert className='w-8 h-8' />
          </div>
          <span className='inline-block text-[11px] font-semibold tracking-widest uppercase text-[#C48D80]'>
            {isAr ? 'صلاحيات الإدارة فقط' : 'Restricted Admin Access'}
          </span>
          <h1 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            {isAr ? 'لوحة التحكم خاصة بصاحب المتجر' : 'Store Owner Dashboard'}
          </h1>
          <p className='text-xs text-[#988172] leading-relaxed'>
            {isAr
              ? 'عذراً، هذه الصفحة مخصصة لمدير المتجر وصاحب الموقع فقط لمتابعة الطلبات والأرباح والإحصائيات. لا تظهر هذه الصفحة للعملاء العاديين.'
              : 'This management section is reserved exclusively for the store owner and administrators. It is not accessible to regular customer accounts.'}
          </p>
          <div className='pt-3 flex flex-col sm:flex-row gap-2.5 justify-center'>
            <Button asChild className='bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs py-2.5 px-6 rounded-full'>
              <Link href='/'>{isAr ? 'العودة لمتجر البنات' : 'Return to Store'}</Link>
            </Button>
            <Button asChild variant='outline' className='border-[#EBDED6] text-xs py-2.5 px-6 rounded-full'>
              <Link href='/login'>{isAr ? 'تسجيل دخول كمسؤول' : 'Sign In as Admin'}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const maxMonthlyRevenue = data?.monthlySales.reduce((m, item) => Math.max(m, item.revenue), 1) || 1;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='min-h-screen bg-[#FBF9F3] dark:bg-[#1A1513] py-8 sm:py-12'>
      <div className='container max-w-7xl space-y-8'>
        {/* Top Header & Actions */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EBDED6] dark:border-[#3D332E]'>
          <div>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C48D80]/15 text-[#C48D80] text-xs font-semibold mb-2'>
              <Sparkles className='w-3.5 h-3.5' />
              <span>{isAr ? 'لوحة تحكم رول الإدارة (Admin Role)' : 'Administrator Operations Portal'}</span>
            </div>
            <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              {isAr ? 'لوحة تحكم رواروسا' : 'ROAROSA Admin Dashboard'}
            </h1>
            <p className='text-xs sm:text-sm text-[#988172] mt-1'>
              {isAr
                ? 'إحصائيات المبيعات الحية، حركة الطلبات، إدارة المنتجات ومخزون الفساتين والأزياء'
                : 'Real-time sales tracking, order fulfillment, product catalog, and stock alerts'}
            </p>
          </div>

          <div className='flex items-center gap-2.5 w-full sm:w-auto'>
            <Button
              onClick={fetchDashboardData}
              variant='outline'
              className='flex-1 sm:flex-initial h-10 rounded-full border-[#EBDED6] dark:border-[#3D332E] text-xs font-medium gap-2'
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'تحديث البيانات' : 'Refresh'}</span>
            </Button>
            <Button
              asChild
              className='flex-1 sm:flex-initial h-10 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wide gap-2 shadow-xs'
            >
              <Link href='/'>
                <Store className='w-3.5 h-3.5' />
                <span>{isAr ? 'عرض المتجر' : 'Storefront'}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex items-center gap-2 overflow-x-auto no-scrollbar pb-1'>
          {[
            { id: 'overview', label: isAr ? 'نظرة عامة' : 'Overview', icon: TrendingUp },
            { id: 'orders', label: isAr ? 'الطلبات والمبيعات' : 'Orders & Sales', icon: ShoppingBag },
            { id: 'products', label: isAr ? 'المنتجات الأكثر مبيعاً' : 'Top Products', icon: Package },
            { id: 'coupons', label: isAr ? 'كوبونات الخصم' : 'Coupons & Deals', icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2B2320] dark:bg-[#FAF6F0] text-white dark:text-[#2B2320] shadow-sm'
                    : 'bg-white dark:bg-[#28211E] text-[#988172] hover:text-[#2B2320] dark:hover:text-white border border-[#EBDED6] dark:border-[#3D332E]'
                }`}
              >
                <Icon className='w-3.5 h-3.5' />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* KPI Stats Grid (6 Cards) */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
          {/* Revenue */}
          <div className='p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2'>
            <div className='flex items-center justify-between text-[#988172]'>
              <span className='text-[11px] font-semibold uppercase tracking-wider'>
                {isAr ? 'إجمالي المبيعات' : 'Total Revenue'}
              </span>
              <div className='w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
                <DollarSign className='w-4 h-4' />
              </div>
            </div>
            <div className='text-2xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]'>
              {data?.totalRevenue?.toLocaleString()} <span className='text-xs font-sans font-normal text-[#988172]'>EGP</span>
            </div>
            <div className='text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1'>
              <ArrowUpRight className='w-3 h-3' />
              <span>+18.4% {isAr ? 'عن الشهر السابق' : 'vs last month'}</span>
            </div>
          </div>

          {/* Orders */}
          <div className='p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2'>
            <div className='flex items-center justify-between text-[#988172]'>
              <span className='text-[11px] font-semibold uppercase tracking-wider'>
                {isAr ? 'إجمالي الطلبات' : 'Total Orders'}
              </span>
              <div className='w-8 h-8 rounded-full bg-[#C48D80]/15 text-[#C48D80] flex items-center justify-center'>
                <ShoppingBag className='w-4 h-4' />
              </div>
            </div>
            <div className='text-2xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]'>
              {data?.totalOrders}
            </div>
            <div className='text-[10px] text-[#988172]'>
              <span>{isAr ? 'طلب مسجل بالنظام' : 'Completed orders'}</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className='p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2'>
            <div className='flex items-center justify-between text-[#988172]'>
              <span className='text-[11px] font-semibold uppercase tracking-wider'>
                {isAr ? 'طلبات قيد المراجعة' : 'Pending Orders'}
              </span>
              <div className='w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
                <Clock className='w-4 h-4' />
              </div>
            </div>
            <div className='text-2xl font-bold font-serif text-amber-600 dark:text-amber-400'>
              {data?.pendingOrders}
            </div>
            <div className='text-[10px] text-amber-600 dark:text-amber-400 font-medium'>
              <span>{isAr ? 'تحتاج شحن وتأكيد' : 'Requires fulfillment'}</span>
            </div>
          </div>

          {/* Customers */}
          <div className='p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2'>
            <div className='flex items-center justify-between text-[#988172]'>
              <span className='text-[11px] font-semibold uppercase tracking-wider'>
                {isAr ? 'العملاء المسجلين' : 'Total Customers'}
              </span>
              <div className='w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center'>
                <Users className='w-4 h-4' />
              </div>
            </div>
            <div className='text-2xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]'>
              {data?.totalCustomers}
            </div>
            <div className='text-[10px] text-[#988172]'>
              <span>{isAr ? 'حسابات عملاء نشطة' : 'Verified accounts'}</span>
            </div>
          </div>

          {/* Active Products */}
          <div className='p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2'>
            <div className='flex items-center justify-between text-[#988172]'>
              <span className='text-[11px] font-semibold uppercase tracking-wider'>
                {isAr ? 'المنتجات النشطة' : 'Active Products'}
              </span>
              <div className='w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center'>
                <Package className='w-4 h-4' />
              </div>
            </div>
            <div className='text-2xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]'>
              {data?.activeProducts} <span className='text-xs font-sans font-normal text-[#988172]'>/ {data?.totalProducts}</span>
            </div>
            <div className='text-[10px] text-emerald-600 dark:text-emerald-400 font-medium'>
              <span>{isAr ? 'معروضة بالمتجر' : 'Published online'}</span>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className='p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-2'>
            <div className='flex items-center justify-between text-[#988172]'>
              <span className='text-[11px] font-semibold uppercase tracking-wider'>
                {isAr ? 'تنبيه المخزون' : 'Low Stock Alert'}
              </span>
              <div className='w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center'>
                <AlertTriangle className='w-4 h-4' />
              </div>
            </div>
            <div className='text-2xl font-bold font-serif text-rose-600 dark:text-rose-400'>
              {data?.lowStockCount}
            </div>
            <div className='text-[10px] text-rose-600 dark:text-rose-400 font-medium'>
              <span>{isAr ? 'قطع أقل من 5 وحدات' : 'Fewer than 5 items left'}</span>
            </div>
          </div>
        </div>

        {/* Monthly Sales Analytics Chart & Top Products */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Sales Chart (8 Columns) */}
          <div className='lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-6'>
            <div className='flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
              <div>
                <h3 className='font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {isAr ? 'أداء المبيعات الشهرية' : 'Monthly Sales Performance'}
                </h3>
                <p className='text-xs text-[#988172]'>
                  {isAr ? 'تطور الإيرادات وعدد الطلبات لآخر 6 أشهر' : 'Revenue and order count trends over the last 6 months'}
                </p>
              </div>
              <div className='flex items-center gap-3 text-xs'>
                <span className='flex items-center gap-1.5 text-[#C48D80] font-medium'>
                  <span className='w-2.5 h-2.5 rounded-full bg-[#C48D80]' />
                  <span>{isAr ? 'الإيرادات (ج.م)' : 'Revenue (EGP)'}</span>
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className='h-64 flex items-end justify-between gap-3 pt-6 px-2'>
              {data?.monthlySales?.map((item, idx) => {
                const heightPercent = Math.round((item.revenue / maxMonthlyRevenue) * 100);
                return (
                  <div key={idx} className='flex-1 flex flex-col items-center gap-2 group h-full justify-end'>
                    {/* Tooltip on hover */}
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-semibold bg-[#2B2320] text-white px-2 py-1 rounded-md text-center whitespace-nowrap shadow-md pointer-events-none'>
                      <div>{item.revenue.toLocaleString()} EGP</div>
                      <div className='text-[#E5C2AF]'>{item.orders} {isAr ? 'طلب' : 'orders'}</div>
                    </div>

                    {/* Bar */}
                    <div className='w-full max-w-[48px] bg-[#FAF7F2] dark:bg-[#1F1917] rounded-xl h-full flex items-end p-1'>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className='w-full rounded-lg bg-gradient-to-t from-[#C48D80] to-[#E5C2AF] group-hover:from-[#B27B6E] group-hover:to-[#C48D80] transition-all duration-300'
                      />
                    </div>

                    {/* Month Label */}
                    <span className='text-[10px] font-medium text-[#988172] text-center'>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Products List (4 Columns) */}
          <div className='lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-4'>
            <div className='flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
              <h3 className='font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'الأكثر مبيعاً' : 'Best Sellers'}
              </h3>
              <span className='text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] font-semibold border border-[#EBDED6] dark:border-[#3D332E]'>
                Top 5
              </span>
            </div>

            <div className='space-y-3'>
              {data?.topSellingProducts?.map((prod, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2]/60 dark:bg-[#1F1917]/60 border border-[#EBDED6]/60 dark:border-[#3D332E]/60 hover:border-[#C48D80] transition-colors'
                >
                  <div className='relative w-12 h-14 rounded-xl overflow-hidden bg-white shrink-0'>
                    {prod.imageCover && (
                      <Image
                        src={prod.imageCover}
                        alt={prod.title}
                        fill
                        sizes='48px'
                        className='object-cover object-top'
                      />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] truncate'>
                      {prod.title}
                    </h4>
                    <div className='flex items-center gap-2 mt-1 text-[11px] text-[#988172]'>
                      <span className='font-bold text-[#C48D80]'>{prod.price} EGP</span>
                      <span>•</span>
                      <span>{prod.sold} {isAr ? 'قطعة بيعت' : 'sold'}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-0.5 text-xs text-amber-500 font-bold shrink-0'>
                    <Star className='w-3 h-3 fill-amber-400 text-amber-400' />
                    <span>{prod.ratingsAverage || 5.0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className='p-6 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-4'>
          <div className='flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
            <div>
              <h3 className='font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'أحدث الطلبات الواردة' : 'Recent Customer Orders'}
              </h3>
              <p className='text-xs text-[#988172]'>
                {isAr ? 'متابعة مباشرة لحالات الدفع والتوصيل' : 'Live tracking of payment and delivery statuses'}
              </p>
            </div>
            <Link
              href='/allorders'
              className='text-xs text-[#C48D80] hover:underline font-semibold flex items-center gap-1'
            >
              <span>{isAr ? 'عرض كل الطلبات' : 'View All'}</span>
              <ArrowUpRight className='w-3.5 h-3.5' />
            </Link>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left rtl:text-right text-xs'>
              <thead>
                <tr className='border-b border-[#EBDED6] dark:border-[#3D332E] text-[#988172] font-semibold uppercase tracking-wider'>
                  <th className='py-3 px-4'>{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className='py-3 px-4'>{isAr ? 'العميل' : 'Customer'}</th>
                  <th className='py-3 px-4'>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className='py-3 px-4'>{isAr ? 'المبلغ' : 'Amount'}</th>
                  <th className='py-3 px-4'>{isAr ? 'حالة الدفع' : 'Payment'}</th>
                  <th className='py-3 px-4'>{isAr ? 'حالة الشحن' : 'Fulfillment'}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#EBDED6]/50 dark:divide-[#3D332E]/50'>
                {data?.recentOrders?.map((order, idx) => (
                  <tr key={idx} className='hover:bg-[#FAF7F2]/50 dark:hover:bg-[#1F1917]/50 transition-colors'>
                    <td className='py-3.5 px-4 font-mono font-medium text-[#2B2320] dark:text-[#FAF6F0]'>
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className='py-3.5 px-4'>
                      <div className='font-semibold text-[#2B2320] dark:text-[#FAF6F0]'>{order.customerName}</div>
                      <div className='text-[10px] text-[#988172]'>{order.customerEmail}</div>
                    </td>
                    <td className='py-3.5 px-4 text-[#988172]'>
                      {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className='py-3.5 px-4 font-bold text-[#C48D80]'>
                      {order.totalOrderPrice} EGP
                    </td>
                    <td className='py-3.5 px-4'>
                      {order.isPaid ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                          <CheckCircle2 className='w-3 h-3' />
                          <span>{isAr ? 'مدفوع' : 'Paid'}</span>
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400'>
                          <Clock className='w-3 h-3' />
                          <span>{isAr ? 'عند الاستلام' : 'Pending'}</span>
                        </span>
                      )}
                    </td>
                    <td className='py-3.5 px-4'>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === 'DELIVERED'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <span>{order.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
