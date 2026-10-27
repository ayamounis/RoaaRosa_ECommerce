'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  FolderTree,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/_Components/ui/button';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utils/apiConfig';
import CategoryFormDialog, { CategoryItem } from './CategoryFormDialog';

interface CategoriesCRUDProps {
  token?: string;
}

export default function CategoriesCRUD({ token }: CategoriesCRUDProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || [];
        setCategories(list);
      } else {
        toast.error(isAr ? 'تعذر جلب الأقسام' : 'Failed to load categories');
      }
    } catch {
      toast.error(isAr ? 'خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setDialogOpen(true);
  };

  const handleSaveCategory = async (catData: {
    id?: string;
    name: string;
    slug: string;
    image?: string;
  }): Promise<boolean> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['token'] = token;
    }

    const isEdit = Boolean(catData.id);
    const url = isEdit
      ? `${API_BASE_URL}/categories/${catData.id}`
      : `${API_BASE_URL}/categories`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          name: catData.name,
          slug: catData.slug,
          image: catData.image,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || 'Operation failed');
      }

      toast.success(
        isEdit
          ? isAr
            ? 'تم تحديث القسم بنجاح'
            : 'Category updated successfully'
          : isAr
          ? 'تم إنشاء القسم بنجاح'
          : 'Category created successfully'
      );
      fetchCategories();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
      return false;
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setIsDeleting(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to delete category');
      }

      toast.success(isAr ? 'تم حذف القسم بنجاح' : 'Category deleted successfully');
      setCategories((prev) => prev.filter((c) => (c.id || c._id) !== id));
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.slug && c.slug.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white dark:bg-[#28211E] rounded-3xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'البحث في الأقسام والتصنيفات...' : 'Search categories or slugs...'}
            className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={fetchCategories}
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
            <span>{isAr ? 'إضافة قسم جديد' : 'New Category'}</span>
          </Button>
        </div>
      </div>

      {/* Categories Table / Card Grid */}
      <div className="bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'قائمة أقسام وتصنيفات المتجر' : 'Category Directory'}
              </h3>
              <p className="text-[11px] text-[#988172]">
                {filtered.length} {isAr ? 'أقسام متوفرة' : 'categories listed'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#C48D80] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#988172]">{isAr ? 'جاري جلب الأقسام...' : 'Loading categories...'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FolderTree className="w-10 h-10 text-[#988172]/40 mx-auto" />
            <p className="text-xs text-[#988172] font-medium">
              {isAr ? 'لم يتم العثور على أي أقسام مطابقة' : 'No categories found'}
            </p>
            <Button
              onClick={handleOpenAdd}
              variant="outline"
              className="text-xs rounded-xl border-[#EBDED6]"
            >
              {isAr ? 'إنشاء أول قسم' : 'Create first category'}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] border-b border-[#EBDED6] dark:border-[#3D332E] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'الغلاف' : 'Cover'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'القسم' : 'Category Name'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'المعرّف (Slug)' : 'Slug'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'المنتجات التابعة' : 'Products'}</th>
                  <th className="py-3.5 px-4 font-semibold text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBDED6]/60 dark:divide-[#3D332E]/60 text-[#2B2320] dark:text-[#FAF6F0]">
                {filtered.map((cat) => {
                  const id = cat.id || cat._id || '';
                  return (
                    <tr
                      key={id}
                      className="hover:bg-[#FAF7F2]/40 dark:hover:bg-[#1F1917]/40 transition-colors"
                    >
                      {/* Image */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-[#FAF7F2] border border-[#EBDED6] shrink-0">
                          <Image
                            src={cat.image || '/images/next/dresses-shop-now.jpg'}
                            alt={cat.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-semibold font-serif text-sm">
                        {cat.name}
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-4 font-mono text-xs text-[#988172]">
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
                          {cat.slug}
                        </span>
                      </td>

                      {/* Products Count */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold text-[#C48D80] px-2.5 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6]">
                          {cat._count?.products !== undefined
                            ? `${cat._count.products} ${isAr ? 'قطعة' : 'items'}`
                            : isAr
                            ? 'تشكيلة نشطة'
                            : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#1F1917] text-[#988172] hover:text-[#C48D80] transition-colors cursor-pointer"
                            title={isAr ? 'تعديل القسم' : 'Edit Category'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(id)}
                            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#988172] hover:text-rose-600 transition-colors cursor-pointer"
                            title={isAr ? 'حذف القسم' : 'Delete Category'}
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

      {/* Form Dialog for Add/Edit */}
      <CategoryFormDialog
        isOpen={dialogOpen}
        category={selectedCategory}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCategory}
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
              {isAr ? 'تأكيد حذف القسم؟' : 'Confirm Category Deletion?'}
            </h4>
            <p className="text-xs text-[#988172] leading-relaxed">
              {isAr
                ? 'هل أنتِ متأكدة من رغبتكِ في حذف هذا القسم؟ لن يتم حذف المنتجات ولكن سيتم فك ارتباطها بهذا القسم.'
                : 'Are you sure you want to delete this category? Products linked to it will need reclassification.'}
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
                onClick={() => handleDeleteCategory(deleteConfirmId)}
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
