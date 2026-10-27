'use client';

import React from 'react';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/_Components/ui/chart';
import { useLanguage } from '@/context/LanguageContext';

export interface DashboardOverviewData {
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

interface DashboardOverviewProps {
  data: DashboardOverviewData;
  onNavigateToTab?: (tab: string) => void;
}

const revenueChartConfig = {
  revenue: {
    label: 'الإيرادات (ج.م)',
    color: '#C48D80',
  },
} satisfies ChartConfig;

const ordersChartConfig = {
  orders: {
    label: 'عدد الطلبات',
    color: '#B27B6E',
  },
} satisfies ChartConfig;

export default function DashboardOverview({ data, onNavigateToTab }: DashboardOverviewProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-[#28211E] rounded-2xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-2 relative overflow-hidden group hover:border-[#C48D80] transition-colors">
          <div className="flex items-center justify-between text-[#988172]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isAr ? 'إجمالي المبيعات' : 'Total Revenue'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]">
            {data.totalRevenue.toLocaleString()} <span className="text-xs font-normal text-[#988172]">{isAr ? 'ج.م' : 'EGP'}</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{isAr ? '+18.4% نمو هذا الشهر' : '+18.4% from last month'}</span>
          </p>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigateToTab?.('orders')}
          className="bg-white dark:bg-[#28211E] rounded-2xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-2 relative overflow-hidden group hover:border-[#C48D80] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#988172]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isAr ? 'إجمالي الطلبات' : 'Total Orders'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]">
            {data.totalOrders}
          </div>
          <p className="text-[10px] text-[#988172] flex items-center gap-1">
            <span>{isAr ? 'كافة طلبات الزبائن' : 'Across all collections'}</span>
          </p>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateToTab?.('orders')}
          className="bg-white dark:bg-[#28211E] rounded-2xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-2 relative overflow-hidden group hover:border-[#C48D80] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#988172]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isAr ? 'طلبات قيد المراجعة' : 'Pending Orders'}
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-amber-600 dark:text-amber-400">
            {data.pendingOrders}
          </div>
          <p className="text-[10px] text-[#988172]">
            {isAr ? 'تتطلب تجهيزاً وشحناً' : 'Awaiting fulfillment'}
          </p>
        </div>

        {/* Customers */}
        <div className="bg-white dark:bg-[#28211E] rounded-2xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-2 relative overflow-hidden group hover:border-[#C48D80] transition-colors">
          <div className="flex items-center justify-between text-[#988172]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isAr ? 'عميلات المتجر' : 'Customers'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]">
            {data.totalCustomers}
          </div>
          <p className="text-[10px] text-[#988172]">
            {isAr ? 'حسابات نشطة مسجلة' : 'Registered client accounts'}
          </p>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onNavigateToTab?.('products')}
          className="bg-white dark:bg-[#28211E] rounded-2xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-2 relative overflow-hidden group hover:border-[#C48D80] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#988172]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isAr ? 'قطع معروضة' : 'Live Products'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]">
            {data.activeProducts} <span className="text-xs font-normal text-[#988172]">/ {data.totalProducts}</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            {isAr ? 'متوفرة للطلب الفوري' : 'Live on catalog'}
          </p>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => onNavigateToTab?.('products')}
          className="bg-white dark:bg-[#28211E] rounded-2xl p-5 border border-rose-200 dark:border-rose-950/60 shadow-xs space-y-2 relative overflow-hidden group hover:border-rose-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isAr ? 'تنبيه مخزون' : 'Low Stock'}
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-serif text-rose-600 dark:text-rose-400">
            {data.lowStockCount}
          </div>
          <p className="text-[10px] text-rose-500 font-medium">
            {isAr ? 'أقل من 5 قطع بالمخزن' : 'Items under 5 units'}
          </p>
        </div>
      </div>

      {/* 2. Shadcn Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Area Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-[#28211E] rounded-3xl p-6 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C48D80]" />
                <span>{isAr ? 'تحليل الإيرادات ونمو المبيعات' : 'Revenue Growth & Sales Trend'}</span>
              </h3>
              <p className="text-xs text-[#988172]">
                {isAr ? 'تطور الإيرادات الشهرية لآخر 6 أشهر بنظام Shadcn Charts' : 'Monthly revenue trend over the last 6 months via Shadcn Charts'}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-[11px] font-mono text-[#C48D80] font-semibold">
              {data.totalRevenue.toLocaleString()} EGP
            </div>
          </div>

          <div dir="ltr" className="pt-4">
            <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
              <AreaChart data={data.monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C48D80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#C48D80" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(val) => String(val).slice(-2) + 'm'}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#fillRevenue)"
                  fillOpacity={0.4}
                  stroke="#C48D80"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Monthly Orders Bar Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-[#28211E] rounded-3xl p-6 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'توزيع الطلبات الشهرية' : 'Monthly Orders Volume'}
              </h3>
              <p className="text-xs text-[#988172]">
                {isAr ? 'عدد الشحنات المنفذة شهرياً' : 'Total shipments dispatched per month'}
              </p>
            </div>
          </div>

          <div dir="ltr" className="pt-4">
            <ChartContainer config={ordersChartConfig} className="h-[280px] w-full">
              <BarChart data={data.monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(val) => String(val).slice(-2) + 'm'}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="orders" fill="#B27B6E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* 3. Top Selling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-6 bg-white dark:bg-[#28211E] rounded-3xl p-6 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'الأكثر طلباً ومبيعاً' : 'Top Selling Pieces'}
            </h3>
            <span className="text-xs text-[#C48D80] font-medium flex items-center gap-1">
              <span>{isAr ? 'إقبال العميلات' : 'Best Performers'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-3">
            {data.topSellingProducts.map((p, idx) => (
              <div
                key={p.id || idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6]/60 dark:border-[#3D332E]/60 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-14 rounded-xl overflow-hidden relative bg-white shrink-0 border border-[#EBDED6]">
                    <Image
                      src={p.imageCover || '/images/next/dresses-shop-now.jpg'}
                      alt={p.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] truncate">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-[#988172]">
                      {p.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </p>
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <span className="inline-block text-xs font-bold text-[#C48D80] bg-white dark:bg-[#28211E] px-2.5 py-1 rounded-lg border border-[#EBDED6]">
                    {p.sold} {isAr ? 'قطعة' : 'sold'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-6 bg-white dark:bg-[#28211E] rounded-3xl p-6 border border-[#EBDED6] dark:border-[#3D332E] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'أحدث طلبات المتجر' : 'Recent Client Orders'}
            </h3>
            <button
              onClick={() => onNavigateToTab?.('orders')}
              className="text-xs text-[#C48D80] hover:underline font-medium"
            >
              {isAr ? 'عرض كل الطلبات' : 'View all orders'}
            </button>
          </div>

          <div className="space-y-3">
            {data.recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6]/60 dark:border-[#3D332E]/60 gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                      #{ord.id.slice(0, 8)}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#988172] truncate mt-0.5">
                    {ord.customerName} ({ord.customerEmail})
                  </p>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-xs font-bold font-serif text-[#2B2320] dark:text-[#FAF6F0]">
                    {ord.totalOrderPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </p>
                  <p className="text-[9px] text-[#988172]">
                    {new Date(ord.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
