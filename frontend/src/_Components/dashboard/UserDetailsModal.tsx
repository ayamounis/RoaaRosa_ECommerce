'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/_Components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';

interface Address {
  id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

interface OrderSummary {
  id: string;
  totalOrderPrice: number;
  status: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

interface UserDetailData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  addresses?: Address[];
  orders?: OrderSummary[];
}

interface UserDetailsModalProps {
  isOpen: boolean;
  userId: string | null;
  token?: string;
  onClose: () => void;
}

export default function UserDetailsModal({
  isOpen,
  userId,
  token,
  onClose,
}: UserDetailsModalProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !userId) {
      setUserData(null);
      setError('');
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          headers['token'] = token;
        }

        const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers,
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(isAr ? 'فشل تحميل بيانات المستخدم' : 'Failed to fetch customer profile');
        }

        const json = await res.json();
        setUserData(json.data || json);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, userId, token, isAr]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80] border border-[#EBDED6] dark:border-[#3D332E] font-serif text-lg font-bold">
              {userData?.name
                ? userData.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : <User className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {userData?.name || (isAr ? 'ملف العميل' : 'Customer Profile')}
              </h2>
              <p className="text-[11px] text-[#988172]">
                {userData?.email || (isAr ? 'جاري التحميل...' : 'Loading...')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#988172] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#C48D80] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#988172]">{isAr ? 'جاري تحميل تفاصيل العميل...' : 'Loading customer details...'}</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          </div>
        ) : userData ? (
          <div className="mt-6 space-y-6">
            {/* Quick Badges & Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
                <span className="text-[10px] text-[#988172] block">{isAr ? 'الدور' : 'Role'}</span>
                <span className="text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0] inline-flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C48D80]" />
                  {userData.role}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
                <span className="text-[10px] text-[#988172] block">{isAr ? 'حالة الحساب' : 'Status'}</span>
                <span
                  className={`text-xs font-bold inline-flex items-center gap-1 mt-0.5 ${
                    userData.isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      userData.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  {userData.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
                <span className="text-[10px] text-[#988172] block">{isAr ? 'الهاتف' : 'Phone'}</span>
                <span className="text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0] block mt-0.5 truncate">
                  {userData.phone || (isAr ? 'غير مسجل' : 'N/A')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
                <span className="text-[10px] text-[#988172] block">{isAr ? 'تاريخ الانضمام' : 'Registered'}</span>
                <span className="text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0] block mt-0.5">
                  {new Date(userData.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Saved Shipping Addresses */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C48D80]" />
                <h3 className="font-serif text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                  {isAr ? 'عناوين التوصيل المسجلة' : 'Saved Delivery Addresses'}
                </h3>
              </div>

              {userData.addresses && userData.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userData.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2]/60 dark:bg-[#1F1917]/60 border border-[#EBDED6] dark:border-[#3D332E] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                        <span>{addr.alias}</span>
                        <span className="text-[10px] text-[#C48D80]">{addr.city}</span>
                      </div>
                      <p className="text-[#988172] leading-relaxed text-[11px]">{addr.details}</p>
                      <div className="text-[10px] text-[#988172] pt-1">
                        {isAr ? 'رقم للتواصل: ' : 'Contact: '}
                        <span className="font-mono">{addr.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF7F2]/40 dark:bg-[#1F1917]/40 border border-[#EBDED6]/60 dark:border-[#3D332E]/60 text-center text-xs text-[#988172]">
                  {isAr ? 'لا توجد عناوين شحن مسجلة لهذا الحساب حتى الآن' : 'No shipping addresses registered yet'}
                </div>
              )}
            </div>

            {/* Orders History */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C48D80]" />
                <h3 className="font-serif text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                  {isAr ? 'سجل الطلبات الأخير' : 'Recent Customer Orders'}
                </h3>
              </div>

              {userData.orders && userData.orders.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-[#EBDED6] dark:border-[#3D332E]">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] border-b border-[#EBDED6] dark:border-[#3D332E] uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'التاريخ' : 'Date'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'القيمة' : 'Total'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'الدفع' : 'Payment'}</th>
                        <th className="py-2.5 px-3 font-semibold">{isAr ? 'التوصيل' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBDED6]/60 dark:divide-[#3D332E]/60 text-[#2B2320] dark:text-[#FAF6F0]">
                      {userData.orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF7F2]/40 dark:hover:bg-[#1F1917]/40">
                          <td className="py-2.5 px-3 font-mono font-medium">#{ord.id.slice(-6).toUpperCase()}</td>
                          <td className="py-2.5 px-3 text-[#988172]">
                            {new Date(ord.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#C48D80]">{ord.totalOrderPrice} EGP</td>
                          <td className="py-2.5 px-3">
                            {ord.isPaid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                {isAr ? 'مدفوع' : 'Paid'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                                <Clock className="w-3 h-3" />
                                {isAr ? 'عند الاستلام' : 'Pending'}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF7F2]/40 dark:bg-[#1F1917]/40 border border-[#EBDED6]/60 dark:border-[#3D332E]/60 text-center text-xs text-[#988172]">
                  {isAr ? 'لا توجد طلبات سابقة لهذا العميل' : 'No past orders recorded'}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 flex justify-end border-t border-[#EBDED6] dark:border-[#3D332E]">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-2xl border-[#EBDED6] text-xs py-2 px-5"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
