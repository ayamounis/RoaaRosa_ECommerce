'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { X, Package, Image as ImageIcon, Plus, Trash2, Tag, Shirt, Layers } from 'lucide-react';
import { Button } from '@/_Components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryItem } from './CategoryFormDialog';
import ColorPalettePicker, { ColorItem } from './ColorPalettePicker';
import { API_BASE_URL } from '@/utils/apiConfig';

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
  subcategoryId?: string;
  subCategory?: {
    id: string;
    name: string;
  };
  brandId?: string;
  brand?: {
    id: string;
    name: string;
  };
  variants?: Array<{
    id?: string;
    sizeId?: string;
    colorId?: string;
    size?: { id: string; name: string; code: string };
    color?: { id: string; name: string; hexCode: string };
  }>;
}

export interface SaveProductPayload {
  id?: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
  sizeId?: string;
  colorId?: string;
  stockQuantity?: number;
}

interface ProductFormDialogProps {
  isOpen: boolean;
  product?: ProductItem | null;
  categories: CategoryItem[];
  token?: string;
  onClose: () => void;
  onSave: (prod: SaveProductPayload) => Promise<boolean>;
}

export interface SubCategoryItem {
  id: string;
  name: string;
  categoryId?: string;
}

export interface BrandItem {
  id: string;
  name: string;
}

export interface SizeItem {
  id: string;
  name: string;
  code: string;
}

const PRESET_COVERS = [
  { label: 'Rose Dress', url: '/images/next/dresses-shop-now.jpg' },
  { label: 'Baker Puffer', url: '/images/next/baker-by-ted-baker.jpg' },
  { label: 'Knit Cardigan', url: '/images/next/jumpers-and-cardigans-shop-now.jpg' },
  { label: 'Jogger Outfit', url: '/images/next/sweat-tops-and-jogger-sets.jpg' },
  { label: 'Baby Romper', url: '/images/next/baby-girls-shop-now.jpg' },
  { label: 'Teen Style', url: '/images/next/older-girls-shop-now.jpg' },
];

// UUID validation helper: guarantees mock/placeholder IDs never fail NestJS @IsUUID('4')
const isValidUUID = (id?: string): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export default function ProductFormDialog({
  isOpen,
  product,
  categories,
  token,
  onClose,
  onSave,
}: ProductFormDialogProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  // Core Fields (from API Payload)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [priceAfterDiscount, setPriceAfterDiscount] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number | ''>(25);
  const [imageCover, setImageCover] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Relation Fields
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(null);

  // Dynamic Options from API
  const [subcategories, setSubcategories] = useState<SubCategoryItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [sizes, setSizes] = useState<SizeItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch options from backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/subcategories`, { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setSubcategories(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/brands`, { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setBrands(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/products/meta/sizes`, { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setSizes(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Initialize Form ONLY when product changes or dialog opens (prevents race condition when options finish loading)
  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setPrice(product.price || 0);
      setPriceAfterDiscount(product.priceAfterDiscount ?? '');
      setCategoryId(product.categoryId || product.category?.id || (categories[0]?.id || ''));
      setSubcategoryId(product.subcategoryId || product.subCategory?.id || '');
      setBrandId(product.brandId || product.brand?.id || '');
      setStockQuantity(product.quantity || product.stock || 25);
      setImageCover(product.imageCover || '');
      setGalleryImages(
        product.images && product.images.length > 0 ? product.images : [product.imageCover || '']
      );

      const firstVar = product.variants?.[0];
      if (firstVar) {
        if (firstVar.sizeId) setSizeId(firstVar.sizeId);
        if (firstVar.color) {
          setSelectedColor({
            id: firstVar.color.id || firstVar.colorId,
            name: firstVar.color.name,
            hexCode: firstVar.color.hexCode,
          });
        }
      }
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setPriceAfterDiscount('');
      setCategoryId(categories[0]?.id || categories[0]?._id || '');
      setSubcategoryId('');
      setBrandId('');
      setSizeId('');
      setSelectedColor(null);
      setStockQuantity(25);
      setImageCover(PRESET_COVERS[0].url);
      setGalleryImages([PRESET_COVERS[0].url]);
    }
    setError('');
  }, [product, isOpen]); // ONLY depend on product and isOpen

  // Filter subcategories by chosen category if available
  const filteredSubcategories = useMemo(() => {
    if (!categoryId) return subcategories;
    const matched = subcategories.filter((s) => s.categoryId === categoryId);
    return matched.length > 0 ? matched : subcategories;
  }, [subcategories, categoryId]);

  if (!isOpen) return null;

  const handleAddGalleryImage = () => {
    if (!newImageUrl.trim()) return;
    if (!galleryImages.includes(newImageUrl.trim())) {
      setGalleryImages([...galleryImages, newImageUrl.trim()]);
    }
    setNewImageUrl('');
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== idxToRemove));
  };

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
      setError(isAr ? 'يرجى اختيار القسم الرئيسي' : 'Please select a category');
      return;
    }
    if (priceAfterDiscount !== '' && Number(priceAfterDiscount) > Number(price)) {
      setError(isAr ? 'السعر بعد الخصم يجب أن يكون أقل من السعر الأساسي' : 'Discount price must be less than base price');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const finalCover = imageCover.trim() || galleryImages[0] || PRESET_COVERS[0].url;
    const finalImages = galleryImages.length > 0 ? galleryImages : [finalCover];

    try {
      const ok = await onSave({
        id: product?.id || product?._id,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        priceAfterDiscount: priceAfterDiscount !== '' ? Number(priceAfterDiscount) : undefined,
        imageCover: finalCover,
        images: finalImages,
        categoryId,
        subcategoryId: isValidUUID(subcategoryId) ? subcategoryId : undefined,
        brandId: isValidUUID(brandId) ? brandId : undefined,
        sizeId: isValidUUID(sizeId) ? sizeId : undefined,
        colorId: isValidUUID(selectedColor?.id) ? selectedColor!.id : undefined,
        stockQuantity: stockQuantity !== '' ? Number(stockQuantity) : 25,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full max-w-2xl bg-white dark:bg-[#28211E] rounded-3xl p-5 sm:p-7 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EBDED6] dark:border-[#3D332E]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-2">
                <span>
                  {product
                    ? isAr
                      ? 'تعديل بيانات المنتج'
                      : 'Edit Product'
                    : isAr
                    ? 'إضافة قطعة جديدة'
                    : 'Add New Product'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#C48D80] font-mono border border-[#C48D80]/20">
                  Full API Schema
                </span>
              </h3>
              <p className="text-[11px] text-[#988172]">
                {isAr
                  ? 'إدارة تفاصيل القطعة، التصنيفات، المقاسات، ولوحة الألوان السريعة'
                  : 'Manage product details, categories, sizing, and quick-save color palette'}
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

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Title & Description */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C48D80]" />
                <span>{isAr ? 'عنوان المنتج (title)' : 'Product Title'}</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isAr ? 'مثال: Classic Cotton Crewneck T-Shirt' : 'e.g. Classic Cotton Crewneck T-Shirt'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'وصف القطعة والمواصفات (description)' : 'Description'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isAr
                    ? 'مثال: Premium 100% Egyptian combed cotton crewneck t-shirt with ribbed collar.'
                    : 'e.g. Premium 100% Egyptian combed cotton crewneck t-shirt with ribbed collar.'
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>
          </div>

          {/* Section 2: Pricing & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'السعر الأساسي (price)' : 'Base Price (EGP)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="450"
                className="w-full px-3 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              />
            </div>

            {/* Discount Price */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'بعد الخصم (priceAfterDiscount)' : 'Sale Price (Optional)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceAfterDiscount}
                onChange={(e) =>
                  setPriceAfterDiscount(e.target.value ? parseFloat(e.target.value) : '')
                }
                placeholder="350"
                className="w-full px-3 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'الكمية بالمخزن (stockQuantity)' : 'Stock Quantity'}
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}
                placeholder="25"
                className="w-full px-3 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              />
            </div>
          </div>

          {/* Section 3: Categories & Brand Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Main Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#C48D80]" />
                <span>{isAr ? 'القسم (categoryId)' : 'Category'}</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                required
              >
                {categories.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SubCategory */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'القسم الفرعي (subcategoryId)' : 'Subcategory'}
              </label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              >
                <option value="">{isAr ? '-- اختياري / بدون قسم فرعي --' : '-- None / Optional --'}</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'العلامة / البراند (brandId)' : 'Brand'}
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
              >
                <option value="">{isAr ? '-- بدون علامة تجارية --' : '-- Default / None --'}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Size Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-[#C48D80]" />
              <span>{isAr ? 'المقاس الافتراضي (sizeId)' : 'Default Size'}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.length > 0 ? (
                sizes.map((s) => {
                  const isSelected = sizeId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeId(isSelected ? '' : s.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C48D80] bg-[#C48D80] text-white font-bold shadow-xs'
                          : 'border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-[#2B2320] dark:text-[#FAF6F0] hover:border-[#C48D80]'
                      }`}
                    >
                      {s.code || s.name}
                    </button>
                  );
                })
              ) : (
                <span className="text-[11px] text-[#988172]">
                  {isAr ? 'لا توجد مقاسات مسجلة حالياً' : 'No size options recorded'}
                </span>
              )}
            </div>
          </div>

          {/* Section 5: Color Palette with Quick-Save Feature */}
          <ColorPalettePicker
            selectedColorId={selectedColor?.id}
            selectedHex={selectedColor?.hexCode}
            onSelectColor={(col) => setSelectedColor(col)}
            token={token}
          />

          {/* Section 6: Image Cover & Gallery Images */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
            {/* imageCover */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#C48D80]" />
                  <span>{isAr ? 'صورة الغلاف (imageCover)' : 'Hero Image Cover'}</span>
                </span>
                <span className="text-[10px] text-[#988172]">
                  {isAr ? 'اختاري قالباً سريعاً:' : 'Presets:'}
                </span>
              </label>

              <input
                type="text"
                value={imageCover}
                onChange={(e) => setImageCover(e.target.value)}
                placeholder="/uploads/products/crewneck-front.jpg"
                className="w-full px-3 py-2 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-xs text-[#2B2320] dark:text-[#FAF6F0] font-mono focus:outline-hidden focus:border-[#C48D80]"
                required
              />

              {/* Presets */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setImageCover(preset.url);
                      if (!galleryImages.includes(preset.url)) {
                        setGalleryImages([...galleryImages, preset.url]);
                      }
                    }}
                    className={`text-[9px] p-1.5 rounded-lg border text-center truncate transition-colors cursor-pointer ${
                      imageCover === preset.url
                        ? 'border-[#C48D80] bg-[#FAF7F2] text-[#C48D80] font-bold'
                        : 'border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-[#988172]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* images array (Gallery Images) */}
            <div className="space-y-2 pt-2 border-t border-[#EBDED6] dark:border-[#3D332E]">
              <label className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center justify-between">
                <span>{isAr ? 'ألبوم صور المنتج الإضافية (images[])' : 'Gallery Images (images[])'}</span>
                <span className="text-[10px] text-[#988172]">{galleryImages.length} {isAr ? 'صور مضافة' : 'images'}</span>
              </label>

              {/* Add Image input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="/uploads/products/crewneck-back.jpg"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-xs font-mono text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
                />
                <Button
                  type="button"
                  onClick={handleAddGalleryImage}
                  variant="outline"
                  className="rounded-xl border-[#C48D80] text-[#C48D80] hover:bg-[#FAF7F2] text-xs h-8 px-3 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة صورة' : 'Add'}</span>
                </Button>
              </div>

              {/* Gallery preview list */}
              {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={`${img}-${idx}`}
                      className="group relative flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs"
                    >
                      <span className="font-mono text-[10px] text-[#988172] max-w-[150px] truncate">
                        {img}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="text-neutral-400 hover:text-rose-500 cursor-pointer p-0.5"
                        title={isAr ? 'حذف الصورة' : 'Remove image'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EBDED6] dark:border-[#3D332E]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border-[#EBDED6] text-xs py-2 px-4 cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs py-2 px-6 font-semibold shadow-xs cursor-pointer"
            >
              {isSubmitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : product
                ? isAr
                  ? 'تحديث بيانات القطعة'
                  : 'Update Product'
                : isAr
                ? 'إضافة القطعة إلى الكتالوج'
                : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
