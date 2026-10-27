'use client';

import React, { useEffect, useState } from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/_Components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export interface CategoryItem {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  image?: string;
  createdAt?: string;
  _count?: {
    products?: number;
  };
}

interface CategoryFormDialogProps {
  isOpen: boolean;
  category?: CategoryItem | null;
  onClose: () => void;
  onSave: (cat: { id?: string; name: string; slug: string; image?: string }) => Promise<boolean>;
}

const PRESET_IMAGES = [
  { label: 'Dresses', url: '/images/next/dresses-shop-now.jpg' },
  { label: 'Knitwear', url: '/images/next/jumpers-and-cardigans-shop-now.jpg' },
  { label: 'Coats', url: '/images/next/baker-by-ted-baker.jpg' },
  { label: 'Jogger Sets', url: '/images/next/sweat-tops-and-jogger-sets.jpg' },
  { label: 'Older Girls', url: '/images/next/older-girls-shop-now.jpg' },
  { label: 'Baby Girls', url: '/images/next/baby-girls-shop-now.jpg' },
];

export default function CategoryFormDialog({
  isOpen,
  category,
  onClose,
  onSave,
}: CategoryFormDialogProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setSlug(category.slug || '');
      setImage(category.image || '');
    } else {
      setName('');
      setSlug('');
      setImage(PRESET_IMAGES[0].url);
    }
    setError('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!category) {
      // Auto generate slug
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated || 'category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isAr ? 'يرجى كتابة اسم القسم' : 'Category name is required');
      return;
    }
    if (!slug.trim()) {
      setError(isAr ? 'يرجى تحديد المعرّف اللطيف (Slug)' : 'Slug is required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const ok = await onSave({
        id: category?.id || category?._id,
        name: name.trim(),
        slug: slug.trim(),
        image: image.trim() || undefined,
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full max-w-lg bg-white dark:bg-[#28211E] rounded-3xl p-6 sm:p-7 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EBDED6] dark:border-[#3D332E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {category
                  ? isAr
                    ? 'تعديل بيانات القسم'
                    : 'Edit Category'
                  : isAr
                  ? 'إضافة قسم جديد'
                  : 'Add New Category'}
              </h3>
              <p className="text-[11px] text-[#988172]">
                {isAr
                  ? 'تنظيم تشكيلات الأزياء وتسهيل تصفحها للبنات'
                  : 'Structure fashion collections for effortless browsing'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#988172]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'اسم القسم' : 'Category Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={isAr ? 'مثال: فساتين البنات' : 'e.g. Occasion Dresses'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'المعرّف في الرابط (Slug)' : 'URL Slug'}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="dresses"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] font-mono focus:outline-hidden focus:border-[#C48D80]"
              required
            />
          </div>

          {/* Image URL & Preset Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center justify-between">
              <span>{isAr ? 'صورة الغلاف' : 'Cover Image'}</span>
              <span className="text-[10px] text-[#988172]">
                {isAr ? 'اختاري قالباً أو اكتبي رابطاً مخصصاً' : 'Pick a preset or enter URL'}
              </span>
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/next/dresses-shop-now.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] font-mono focus:outline-hidden focus:border-[#C48D80]"
            />

            {/* Presets grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className={`text-[10px] p-2 rounded-lg border text-start truncate transition-colors ${
                    image === preset.url
                      ? 'border-[#C48D80] bg-[#FAF7F2] text-[#C48D80] font-bold'
                      : 'border-[#EBDED6] hover:border-[#C48D80] text-[#988172]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border-[#EBDED6] text-xs py-2 px-4"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs py-2 px-5 font-semibold"
            >
              {isSubmitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : category
                ? isAr
                  ? 'تحديث القسم'
                  : 'Update'
                : isAr
                ? 'إضافة القسم'
                : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
