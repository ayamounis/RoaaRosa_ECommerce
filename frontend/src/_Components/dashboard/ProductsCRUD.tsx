'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/_Components/ui/button';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utils/apiConfig';
import ProductFormDialog, { ProductItem, SaveProductPayload } from './ProductFormDialog';
import { CategoryItem } from './CategoryFormDialog';

interface ProductsCRUDProps {
  token?: string;
}

export default function ProductsCRUD({ token }: ProductsCRUDProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products?limit=100`, { cache: 'no-store' }),
        fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' }),
      ]);

      if (prodRes.ok) {
        const json = await prodRes.json();
        const list = Array.isArray(json) ? json : json.data || [];
        setProducts(list);
      }

      if (catRes.ok) {
        const catJson = await catRes.json();
        const catList = Array.isArray(catJson) ? catJson : catJson.data || [];
        setCategories(catList);
      }
    } catch {
      toast.error(isAr ? 'خطأ في جلب بيانات المنتجات' : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setSelectedProduct(p);
    setDialogOpen(true);
  };

  const handleSaveProduct = async (prodData: SaveProductPayload): Promise<boolean> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['token'] = token;
    }

    const isEdit = Boolean(prodData.id);
    const url = isEdit
      ? `${API_BASE_URL}/products/${prodData.id}`
      : `${API_BASE_URL}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          title: prodData.title,
          description: prodData.description,
          price: prodData.price,
          priceAfterDiscount: prodData.priceAfterDiscount,
          imageCover: prodData.imageCover,
          images: prodData.images,
          categoryId: prodData.categoryId,
          subcategoryId: prodData.subcategoryId,
          brandId: prodData.brandId,
          sizeId: prodData.sizeId,
          colorId: prodData.colorId,
          stockQuantity: prodData.stockQuantity,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Operation failed');
      }

      toast.success(
        isEdit
          ? isAr
            ? 'تم تحديث المنتج بنجاح'
            : 'Product updated successfully'
          : isAr
          ? 'تمت إضافة القطعة بنجاح'
          : 'Product created successfully'
      );
      fetchData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
      return false;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setIsDeleting(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to delete product');
      }

      toast.success(isAr ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter products
  const filtered = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchTerm =
      p.title.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term));

    const matchCat =
      selectedCategoryFilter === 'all' ||
      p.categoryId === selectedCategoryFilter ||
      p.category?.id === selectedCategoryFilter;

    const stock = p.quantity ?? p.stock ?? 10;
    const matchStock = !onlyLowStock || stock < 5;

    return matchTerm && matchCat && matchStock;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Controls Bar */}
      <div className="bg-white dark:bg-[#28211E] rounded-3xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAr ? 'البحث عن فستان، معطف، تريكو...' : 'Search dresses, coats, knits...'}
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full sm:w-48 px-3.5 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
          >
            <option value="all">{isAr ? 'كافة الأقسام' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Low Stock Toggle Button */}
          <button
            type="button"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              onlyLowStock
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-600 font-bold'
                : 'border-[#EBDED6] dark:border-[#3D332E] text-[#988172] hover:text-[#2B2320]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{isAr ? 'المخزون المنخفض (< 5)' : 'Low Stock Only (< 5)'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="rounded-2xl border-[#EBDED6] text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="rounded-2xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs py-2 px-4 flex items-center gap-2 font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة منتج جديد' : 'Add Product'}</span>
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'كتالوج وتشكيلات أزياء البنات' : 'Product Inventory'}
              </h3>
              <p className="text-[11px] text-[#988172]">
                {filtered.length} {isAr ? 'قطعة معروضة' : 'items matching filter'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#C48D80] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#988172]">{isAr ? 'جاري جلب المنتجات...' : 'Loading products...'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Package className="w-10 h-10 text-[#988172]/40 mx-auto" />
            <p className="text-xs text-[#988172] font-medium">
              {isAr ? 'لا توجد منتجات تطابق البحث' : 'No products found'}
            </p>
            <Button
              onClick={handleOpenAdd}
              variant="outline"
              className="text-xs rounded-xl border-[#EBDED6]"
            >
              {isAr ? 'إضافة أول منتج' : 'Create first product'}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] border-b border-[#EBDED6] dark:border-[#3D332E] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'القطعة' : 'Item'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'القسم' : 'Category'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'السعر' : 'Price'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'المخزون' : 'Stock'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'المبيعات' : 'Sold'}</th>
                  <th className="py-3.5 px-4 font-semibold text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBDED6]/60 dark:divide-[#3D332E]/60 text-[#2B2320] dark:text-[#FAF6F0]">
                {filtered.map((prod) => {
                  const id = prod.id || prod._id || '';
                  const stock = prod.quantity ?? prod.stock ?? 10;
                  const isLow = stock < 5;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-[#FAF7F2]/40 dark:hover:bg-[#1F1917]/40 transition-colors"
                    >
                      {/* Item Preview */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-xl overflow-hidden relative bg-[#FAF7F2] border border-[#EBDED6] shrink-0">
                            <Image
                              src={prod.imageCover || '/images/next/dresses-shop-now.jpg'}
                              alt={prod.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs font-serif text-[#2B2320] dark:text-[#FAF6F0] truncate max-w-[200px]">
                              {prod.title}
                            </p>
                            <p className="text-[10px] text-[#988172] line-clamp-1 max-w-[200px]">
                              {prod.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-[#988172]">
                          {prod.category?.name || (isAr ? 'أزياء عامة' : 'Fashion')}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-xs font-serif text-[#2B2320] dark:text-[#FAF6F0]">
                            {prod.priceAfterDiscount
                              ? prod.priceAfterDiscount.toLocaleString()
                              : prod.price.toLocaleString()}{' '}
                            <span className="text-[10px] font-normal text-[#988172]">
                              {isAr ? 'ج.م' : 'EGP'}
                            </span>
                          </span>
                          {prod.priceAfterDiscount && (
                            <span className="block text-[10px] line-through text-[#988172]">
                              {prod.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isLow
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isLow ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          <span>
                            {stock} {isAr ? 'قطعة' : 'units'}
                          </span>
                        </span>
                      </td>

                      {/* Sold */}
                      <td className="py-3.5 px-4 font-mono text-xs text-[#988172]">
                        {prod.sold || 0}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#1F1917] text-[#988172] hover:text-[#C48D80] transition-colors cursor-pointer"
                            title={isAr ? 'تعديل المنتج' : 'Edit Product'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(id)}
                            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#988172] hover:text-rose-600 transition-colors cursor-pointer"
                            title={isAr ? 'حذف المنتج' : 'Delete Product'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Dialog */}
      <ProductFormDialog
        isOpen={dialogOpen}
        product={selectedProduct}
        categories={categories}
        token={token}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="w-full max-w-sm bg-white dark:bg-[#28211E] rounded-3xl p-6 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xl space-y-4 text-center animate-in zoom-in-95"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'تأكيد حذف المنتج؟' : 'Delete Product?'}
            </h4>
            <p className="text-xs text-[#988172] leading-relaxed">
              {isAr
                ? 'هل أنتِ متأكدة من حذف هذه القطعة من المتجر نهائياً؟ لن تظهر للعميلات بعد الحذف.'
                : 'Are you sure you want to delete this piece? It will be permanently removed from the storefront.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="rounded-xl border-[#EBDED6] text-xs py-2 px-4"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                disabled={isDeleting}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs py-2 px-5 font-semibold"
              >
                {isDeleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : isAr ? 'نعم، احذف' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
