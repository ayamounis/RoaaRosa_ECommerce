'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';
import { Button } from '@/_Components/ui/button';
import { toast } from 'sonner';

import DashboardSidebar, { DashboardTab } from '@/_Components/dashboard/DashboardSidebar';
import DashboardHeader from '@/_Components/dashboard/DashboardHeader';
import DashboardOverview, { DashboardOverviewData } from '@/_Components/dashboard/DashboardOverview';
import ProductsCRUD from '@/_Components/dashboard/ProductsCRUD';
import CategoriesCRUD from '@/_Components/dashboard/CategoriesCRUD';
import UsersCRUD from '@/_Components/dashboard/UsersCRUD';
import MailboxView from '@/_Components/dashboard/MailboxView';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const isAdmin = Boolean(
    session?.user &&
    ((session.user as { role?: string }).role === 'ADMIN' || session.user.email === 'admin@ecommerce.com')
  );

  const sessionToken = (session?.user as { credentialToken?: string })?.credentialToken;

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        headers: {
          token: sessionToken,
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        const unread = (json.data || []).filter((m: { status: string }) => m.status === 'UNREAD').length;
        setUnreadCount(unread);
      }
    } catch {
      // ignore
    }
  }, [sessionToken]);

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

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (sessionToken) {
        headers['token'] = sessionToken;
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers,
      });

      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      } else {
        loadFallbackData();
      }
    } catch {
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  }, [sessionToken]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
      fetchUnreadCount();
    }
  }, [isAdmin, fetchDashboardData, fetchUnreadCount]);

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

  // Restrict access strictly to Admin role
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
              ? 'عذراً، هذه الصفحة مخصصة لمدير المتجر وصاحب الموقع فقط لمتابعة الطلبات، إدارة المنتجات، التصنيفات، وصندوق الرسائل الواردة.'
              : 'This management section is reserved exclusively for the store administrator. It provides direct control over products, categories, orders, and inquiries.'}
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

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: isAr ? 'لوحة القيادة والمؤشرات الحية' : 'Executive Overview & Live KPI',
          subtitle: isAr
            ? 'مخططات الإيرادات وحجم المبيعات والمؤشرات الرئيسية'
            : 'Interactive Shadcn Charts, monthly growth, and recent performance',
        };
      case 'products':
        return {
          title: isAr ? 'إدارة كتالوج المنتجات والفساتين' : 'Products & Dresses Catalog',
          subtitle: isAr
            ? 'إضافة وتعديل وحذف المنتجات وضبط المخزون والأسعار'
            : 'Add, edit, and organize girls apparel, stock, and pricing',
        };
      case 'categories':
        return {
          title: isAr ? 'إدارة التصنيفات وتشكيلات المتجر' : 'Categories & Collections',
          subtitle: isAr
            ? 'إدارة أقسام البنات (فساتين، مناسبات، تريكو، حديثي الولادة)'
            : 'Create, update, and manage catalog categories and departments',
        };
      case 'mailbox':
        return {
          title: isAr ? 'صندوق الوارد واستفسارات العملاء' : 'Customer Inquiries & Mailbox',
          subtitle: isAr
            ? 'متابعة رسائل نموذج اتصل بنا والرد المباشر على الأمهات'
            : 'Manage contact form messages and reply directly to customers',
        };
      case 'orders':
        return {
          title: isAr ? 'إدارة الطلبات والشحن' : 'Orders & Shipping Management',
          subtitle: isAr
            ? 'متابعة حالات الفواتير والتوصيل لجميع محافظات مصر'
            : 'Track fulfillment, customer details, and invoice statuses',
        };
      case 'users':
        return {
          title: isAr ? 'إدارة العملاء والمستخدمين' : 'Users & Customers Directory',
          subtitle: isAr
            ? 'إدارة حسابات عملاء المتجر، الصلاحيات، وحالات التفعيل'
            : 'View customer accounts, toggle access, manage roles, and track orders',
        };
      case 'coupons':
        return {
          title: isAr ? 'كوبونات الخصم والعروض الترويجية' : 'Discount Coupons & Deals',
          subtitle: isAr
            ? 'أكواد الخصم الترويجية الخاصة بالنادي والمواسم'
            : 'Active promotion vouchers and seasonal campaign codes',
        };
    }
  };

  const headerMeta = getHeaderMeta();

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    toast.success(isAr ? `تم نسخ الكود ${code} بنجاح` : `Coupon ${code} copied!`);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='min-h-screen bg-[#FBF9F3] dark:bg-[#1A1513] text-[#2B2320] dark:text-[#FAF6F0] py-4 sm:py-6'>
      <div className='w-full max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8'>
        <div className='flex flex-col lg:flex-row gap-6 items-start'>
          {/* Desktop Persistent Sidebar (and Mobile Drawer) */}
          <DashboardSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setMobileSidebarOpen(false);
            }}
            unreadMessagesCount={unreadCount}
            lowStockCount={data?.lowStockCount || 0}
            isOpenMobile={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Dashboard Workspace (Right on LTR / Left on RTL) */}
          <main className='flex-1 w-full min-w-0 space-y-6'>
            {/* Top Workspace Header */}
            <DashboardHeader
              title={headerMeta.title}
              subtitle={headerMeta.subtitle}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />

            {/* Dynamic View Content */}
            {activeTab === 'overview' && (
              <div className='animate-in fade-in duration-300'>
                {loading && !data ? (
                  <div className='min-h-[400px] flex items-center justify-center bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E]'>
                    <div className='w-8 h-8 border-3 border-[#C48D80] border-t-transparent rounded-full animate-spin' />
                  </div>
                ) : (
                  <DashboardOverview
                    data={
                      data || {
                        totalRevenue: 0,
                        totalOrders: 0,
                        pendingOrders: 0,
                        totalCustomers: 0,
                        totalProducts: 0,
                        activeProducts: 0,
                        lowStockCount: 0,
                        topSellingProducts: [],
                        recentOrders: [],
                        monthlySales: [],
                      }
                    }
                    onNavigateToTab={(t) => setActiveTab(t as DashboardTab)}
                  />
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className='animate-in fade-in duration-300'>
                <ProductsCRUD token={sessionToken} />
              </div>
            )}

            {activeTab === 'categories' && (
              <div className='animate-in fade-in duration-300'>
                <CategoriesCRUD token={sessionToken} />
              </div>
            )}

            {activeTab === 'mailbox' && (
              <div className='animate-in fade-in duration-300'>
                <MailboxView
                  token={sessionToken}
                  onUpdateUnreadCount={(cnt) => setUnreadCount(cnt)}
                />
              </div>
            )}

                        {activeTab === 'users' && (
              <div className='animate-in fade-in duration-300'>
                <UsersCRUD token={sessionToken} />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className='p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-6 animate-in fade-in duration-300'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
                  <div>
                    <h3 className='font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                      {isAr ? 'سجل الطلبات الواردة' : 'Recent Inbound Orders'}
                    </h3>
                    <p className='text-xs text-[#988172]'>
                      {isAr ? 'متابعة شاملة لمدفوعات العملاء وحالات الشحن والتوصيل' : 'Full tracking of customer payments and delivery fulfillments'}
                    </p>
                  </div>
                  <Button asChild variant='outline' className='rounded-full text-xs gap-1.5 border-[#EBDED6]'>
                    <Link href='/allorders'>
                      <span>{isAr ? 'عرض جدول كل الطلبات الكامل' : 'Open Full Orders Register'}</span>
                      <ArrowUpRight className='w-3.5 h-3.5' />
                    </Link>
                  </Button>
                </div>

                <div className='overflow-x-auto'>
                  <table className='w-full text-left rtl:text-right text-xs'>
                    <thead>
                      <tr className='border-b border-[#EBDED6] dark:border-[#3D332E] text-[#988172] font-semibold uppercase tracking-wider'>
                        <th className='py-3 px-4'>{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                        <th className='py-3 px-4'>{isAr ? 'اسم العميل' : 'Customer'}</th>
                        <th className='py-3 px-4'>{isAr ? 'التاريخ' : 'Date'}</th>
                        <th className='py-3 px-4'>{isAr ? 'إجمالي الفاتورة' : 'Amount'}</th>
                        <th className='py-3 px-4'>{isAr ? 'حالة الدفع' : 'Payment'}</th>
                        <th className='py-3 px-4'>{isAr ? 'حالة التوصيل' : 'Fulfillment'}</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#EBDED6]/50 dark:divide-[#3D332E]/50'>
                      {(data?.recentOrders || []).map((order, idx) => (
                        <tr key={idx} className='hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1F1917]/60 transition-colors'>
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
                                <span>{isAr ? 'مدفوع إلكترونياً' : 'Paid'}</span>
                              </span>
                            ) : (
                              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400'>
                                <Clock className='w-3 h-3' />
                                <span>{isAr ? 'عند الاستلام' : 'Pending COD'}</span>
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
            )}

            {activeTab === 'coupons' && (
              <div className='p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-6 animate-in fade-in duration-300'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
                  <div>
                    <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C48D80]/15 text-[#C48D80] text-xs font-semibold mb-2'>
                      <Tag className='w-3.5 h-3.5' />
                      <span>{isAr ? 'حملات الخصم الترويجية' : 'Promotional Campaigns'}</span>
                    </div>
                    <h3 className='font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                      {isAr ? 'كوبونات الخصم النشطة' : 'Active Store Coupons'}
                    </h3>
                  </div>
                  <span className='text-xs text-[#988172]'>
                    {isAr ? '3 كوبونات نشطة بالمتجر' : '3 active voucher codes'}
                  </span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6'>
                  {[
                    {
                      code: 'ROAROSA10',
                      discount: '10%',
                      title: isAr ? 'خصم الترحيب لنادي رواروسا' : 'Welcome ROAROSA Club',
                      desc: isAr ? 'متاح لجميع العملاء الجدد عند الطلب الأول للبنات' : 'Available for all first-time orders',
                      badge: isAr ? 'نشط دائماً' : 'Always Active',
                    },
                    {
                      code: 'SPRING25',
                      discount: '25%',
                      title: isAr ? 'تخفيضات أزياء الربيع' : 'Spring Fashion Sale',
                      desc: isAr ? 'على تشكيلة فساتين البنات والتريكو الخفيف' : 'On all girls dresses & cardigans',
                      badge: isAr ? 'موسمي' : 'Seasonal',
                    },
                    {
                      code: 'VIPGIRLS',
                      discount: '15%',
                      title: isAr ? 'عرض العائلات المميزة' : 'VIP Family Offer',
                      desc: isAr ? 'للطلبات التي تتجاوز قيمتها 3,000 ج.م' : 'For orders exceeding 3,000 EGP',
                      badge: isAr ? 'خاص' : 'Special',
                    },
                  ].map((coupon, idx) => (
                    <div
                      key={idx}
                      className='p-5 rounded-2xl bg-[#FAF9F5] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] space-y-3 relative overflow-hidden'
                    >
                      <div className='flex items-center justify-between'>
                        <span className='px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                          {coupon.badge}
                        </span>
                        <span className='font-serif text-2xl font-bold text-[#C48D80]'>
                          {coupon.discount}
                        </span>
                      </div>

                      <div>
                        <h4 className='text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                          {coupon.title}
                        </h4>
                        <p className='text-xs text-[#988172] mt-0.5 leading-relaxed'>
                          {coupon.desc}
                        </p>
                      </div>

                      <div className='pt-2 flex items-center justify-between bg-white dark:bg-[#28211E] p-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E]'>
                        <span className='font-mono font-bold text-xs text-[#2B2320] dark:text-[#FAF6F0] tracking-wider'>
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopyCouponCode(coupon.code)}
                          className='p-1.5 rounded-lg hover:bg-[#FAF7F2] dark:hover:bg-[#1F1917] text-[#C48D80] transition-colors cursor-pointer'
                          title={isAr ? 'نسخ الكود' : 'Copy Code'}
                        >
                          {copiedCoupon === coupon.code ? (
                            <Check className='w-4 h-4 text-emerald-500' />
                          ) : (
                            <Copy className='w-4 h-4' />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
