'use client';

import React, { useEffect, useState } from 'react';
import { X, User, Mail, Phone, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/_Components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt?: string;
  _count?: {
    orders?: number;
  };
}

export interface UserFormData {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}

interface UserFormDialogProps {
  isOpen: boolean;
  user?: UserItem | null;
  onClose: () => void;
  onSave: (data: UserFormData) => Promise<boolean>;
}

export default function UserFormDialog({
  isOpen,
  user,
  onClose,
  onSave,
}: UserFormDialogProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(user?.id);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setRole(user.role || 'USER');
      setIsActive(user.isActive ?? true);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setRole('USER');
      setIsActive(true);
    }
    setError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(isAr ? 'يرجى كتابة اسم المستخدم الكامل' : 'User name is required');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(isAr ? 'يرجى إدخال بريد إلكتروني صالح' : 'Valid email is required');
      return;
    }
    if (!isEdit && (!password || password.length < 6)) {
      setError(
        isAr
          ? 'كلمة المرور مطلوبة ويجب أن تتكون من 6 أحرف على الأقل'
          : 'Password is required and must be at least 6 characters'
      );
      return;
    }
    if (isEdit && password && password.length < 6) {
      setError(
        isAr
          ? 'كلمة المرور الجديدة يجب أن تتكون من 6 أحرف على الأقل'
          : 'New password must be at least 6 characters'
      );
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const payload: UserFormData = {
        id: user?.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        role,
        isActive,
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const ok = await onSave(payload);
      if (ok) {
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80] border border-[#EBDED6] dark:border-[#3D332E]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {isEdit
                  ? isAr
                    ? 'تعديل بيانات المستخدم'
                    : 'Edit User Account'
                  : isAr
                  ? 'إضافة مستخدم أو عميل جديد'
                  : 'Create New User Account'}
              </h2>
              <p className="text-[11px] text-[#988172]">
                {isAr
                  ? 'إدارة معلومات الحساب، البريد، الدور والحالة'
                  : 'Manage account profile, role permissions, and access status'}
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

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
              {isAr ? 'الاسم الكامل *' : 'Full Name *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'مثال: سارة محمد الشريف' : 'e.g. Sarah Sherif'}
                className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
              {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAr ? 'customer@example.com' : 'customer@example.com'}
                className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
              {isAr ? 'رقم الهاتف (مصر)' : 'Phone Number (Egypt)'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 10 1234 5678"
                className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isEdit
                  ? isAr
                    ? 'تغيير كلمة المرور (اختياري)'
                    : 'Change Password (Optional)'
                  : isAr
                  ? 'كلمة المرور *'
                  : 'Password *'}
              </label>
              {isEdit && (
                <span className="text-[10px] text-[#988172]">
                  {isAr ? 'اتركه فارغاً للإبقاء على الحالية' : 'Leave blank to keep unchanged'}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEdit ? '••••••••' : isAr ? '6 أحرف كحد أدنى' : 'Minimum 6 characters'}
                className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              />
            </div>
          </div>

          {/* Role and Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
                {isAr ? 'الدور والصلاحيات' : 'Role & Permissions'}
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                  className="w-full ps-10 pe-8 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80] appearance-none"
                >
                  <option value="USER">{isAr ? 'عميل متجر (Customer)' : 'Customer (USER)'}</option>
                  <option value="ADMIN">{isAr ? 'مدير نظام (Admin)' : 'Administrator (ADMIN)'}</option>
                </select>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] mb-1.5">
                {isAr ? 'حالة الحساب' : 'Account Status'}
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  isActive
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>
                    {isActive
                      ? isAr
                        ? 'حساب نشط ومفعل'
                        : 'Active Account'
                      : isAr
                      ? 'حساب معطل وموقوف'
                      : 'Deactivated'}
                  </span>
                </div>
                <span className="text-[10px] underline font-semibold">
                  {isAr ? 'تبديل' : 'Toggle'}
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EBDED6] dark:border-[#3D332E]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border-[#EBDED6] text-xs py-2 px-5"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs py-2 px-6 flex items-center gap-2 font-semibold shadow-xs"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>
                {isEdit
                  ? isAr
                    ? 'حفظ التعديلات'
                    : 'Update User'
                  : isAr
                  ? 'إنشاء الحساب'
                  : 'Create User'}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
