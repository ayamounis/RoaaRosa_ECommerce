'use client';

import React, { useEffect, useState } from 'react';
import { X, Sparkles, Package } from 'lucide-react';
import { Button } from '@/_Components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryItem } from './CategoryFormDialog';

export interface ProductItem {
  id?: string;
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  quantity?: number;
  stock?: number;
  sold?: number;
  imageCover: string;
  images?: string[];
  ratingsAverage?: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
}

interface ProductFormDialogProps {
  isOpen: boolean;
  product?: ProductItem | null;
  categories: CategoryItem[];
  onClose: () => void;
  onSave: (prod: {
    id?: string;
    title: string;
    description: string;
    price: number;
    priceAfterDiscount?: number;
    categoryId: string;
    imageCover: string;
    stockQuantity?: number;
  }) => Promise<boolean>;
}

const PRESET_COVERS = [
  { label: 'Rose Dress', url: '/images/next/dresses-shop-now.jpg' },
  { label: 'Baker Puffer', url: '/images/next/baker-by-ted-baker.jpg' },
  { label: 'Knit Cardigan', url: '/images/next/jumpers-and-cardigans-shop-now.jpg' },
  { label: 'Jogger Outfit', url: '/images/next/sweat-tops-and-jogger-sets.jpg' },
  { label: 'Baby Romper', url: '/images/next/baby-girls-shop-now.jpg' },
  { label: 'Teen Style', url: '/images/next/older-girls-shop-now.jpg' },
];

export default function ProductFormDialog({
  isOpen,
  product,
  categories,
  onClose,
  onSave,
}: ProductFormDialogProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [priceAfterDiscount, setPriceAfterDiscount] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number | ''>(20);
  const [imageCover, setImageCover] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setPrice(product.price || 0);
      setPriceAfterDiscount(product.priceAfterDiscount || '');
      setCategoryId(product.categoryId || product.category?.id || (categories[0]?.id || ''));
      setStockQuantity(product.quantity || product.stock || 15);
      setImageCover(product.imageCover || '');
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setPriceAfterDiscount('');
      setCategoryId(categories[0]?.id || categories[0]?._id || '');
      setStockQuantity(20);
      setImageCover(PRESET_COVERS[0].url);
    }
    setError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(isAr ? 'يرجى كتابة عنوان المنتج' : 'Product title is required');
      return;
    }
    if (!description.trim()) {
      setError(isAr ? 'يرجى كتابة وصف المنتج' : 'Description is required');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setError(isAr ? 'يرجى كتابة سعر صالح' : 'Valid price is required');
      return;
    }
    if (!categoryId) {
      setError(isAr ? 'يرجى اختيار القسم' : 'Please select a category');
      return;
    }
    if (priceAfterDiscount !== '' && Number(priceAfterDiscount) > Number(price)) {
      setError(isAr ? 'السعر بعد الخصم يجب أن يكون أقل من السعر الأساسي' : 'Discount price must be less than base price');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const ok = await onSave({
        id: product?.id || product?._id,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        priceAfterDiscount: priceAfterDiscount !== '' ? Number(priceAfterDiscount) : undefined,
        categoryId,
        imageCover: imageCover.trim() || PRESET_COVERS[0].url,
        stockQuantity: stockQuantity !== '' ? Number(stockQuantity) : 10,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full max-w-xl bg-white dark:bg-[#28211E] rounded-3xl p-6 sm:p-7 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EBDED6] dark:border-[#3D332E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {product
                  ? isAr
                    ? 'تعديل بيانات المنتج'
                    : 'Edit Product'
                  : isAr
                  ? 'إضافة منتج جديد'
                  : 'Add New Product'}
              </h3>
              <p className="text-[11px] text-[#988172]">
                {isAr
                  ? 'إدارة تفاصيل القطعة وتحديد السعر والمخزون'
                  : 'Manage item details, pricing, and stock count'}
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
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'عنوان المنتج' : 'Product Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? 'مثال: فستان سهرة دانتيل وردي' : 'e.g. Dusty Rose Sparkle Occasion Dress'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'القسم / التصنيف' : 'Category'}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              required
            >
              {categories.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'السعر الأساسي (ج.م)' : 'Base Price (EGP)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="1250"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>

            {/* Discount Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'بعد الخصم (اختياري)' : 'Sale Price (Optional)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceAfterDiscount}
                onChange={(e) =>
                  setPriceAfterDiscount(e.target.value ? parseFloat(e.target.value) : '')
                }
                placeholder="950"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'الكمية بالمخزن' : 'Stock Quantity'}
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}
                placeholder="25"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'وصف القطعة والمواصفات' : 'Description'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isAr
                  ? 'تفاصيل القماش، الملمس، والمقاسات المناسبة...'
                  : 'Fabric composition, texture, delicate embroidery details...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              required
            />
          </div>

          {/* Image Cover Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center justify-between">
              <span>{isAr ? 'صورة الغلاف الرئيسية' : 'Main Cover Image'}</span>
              <span className="text-[10px] text-[#988172]">
                {isAr ? 'اختاري من قوالب رواروسا' : 'Select from collection covers'}
              </span>
            </label>
            <input
              type="text"
              value={imageCover}
              onChange={(e) => setImageCover(e.target.value)}
              placeholder="/images/next/dresses-shop-now.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] font-mono focus:outline-hidden focus:border-[#C48D80]"
              required
            />

            {/* Presets grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImageCover(preset.url)}
                  className={`text-[10px] p-2 rounded-lg border text-start truncate transition-colors ${
                    imageCover === preset.url
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
                : product
                ? isAr
                  ? 'تحديث القطعة'
                  : 'Update Product'
                : isAr
                ? 'إضافة القطعة'
                : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
