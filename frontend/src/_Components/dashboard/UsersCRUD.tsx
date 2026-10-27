'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  ShoppingBag,
  Filter,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/_Components/ui/button';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utils/apiConfig';
import UserFormDialog, { UserItem, UserFormData } from './UserFormDialog';
import UserDetailsModal from './UserDetailsModal';

interface UsersCRUDProps {
  token?: string;
}

export default function UsersCRUD({ token }: UsersCRUDProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', '10');
      if (searchTerm.trim()) {
        params.set('keyword', searchTerm.trim());
      }
      if (roleFilter !== 'ALL') {
        params.set('role', roleFilter);
      }

      const res = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
        headers,
        cache: 'no-store',
      });

      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || [];
        setUsers(list);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
          setTotalCount(json.pagination.total || list.length);
        } else {
          setTotalCount(list.length);
        }
      } else {
        toast.error(isAr ? 'تعذر جلب قائمة المستخدمين' : 'Failed to load users list');
      }
    } catch {
      toast.error(isAr ? 'خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, searchTerm, roleFilter, isAr]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (u: UserItem) => {
    setSelectedUser(u);
    setFormDialogOpen(true);
  };

  const handleOpenDetails = (id: string) => {
    setDetailUserId(id);
    setDetailsModalOpen(true);
  };

  const handleSaveUser = async (data: UserFormData): Promise<boolean> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['token'] = token;
    }

    const isEdit = Boolean(data.id);
    const url = isEdit ? `${API_BASE_URL}/users/${data.id}` : `${API_BASE_URL}/users`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || 'Operation failed');
      }

      toast.success(
        isEdit
          ? isAr
            ? 'تم تحديث بيانات المستخدم بنجاح'
            : 'User account updated successfully'
          : isAr
          ? 'تم إنشاء المستخدم بنجاح'
          : 'User account created successfully'
      );
      fetchUsers();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
      return false;
    }
  };

  const handleToggleActive = async (user: UserItem) => {
    setTogglingId(user.id);
    const targetAction = user.isActive ? 'deactivate' : 'activate';
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const res = await fetch(`${API_BASE_URL}/users/${user.id}/${targetAction}`, {
        method: 'PATCH',
        headers,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to toggle user status');
      }

      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !user.isActive } : u))
      );

      toast.success(
        user.isActive
          ? isAr
            ? `تم تعطيل حساب ${user.name}`
            : `User ${user.name} deactivated`
          : isAr
          ? `تم تفعيل حساب ${user.name}`
          : `User ${user.name} activated`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setIsDeleting(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to delete user');
      }

      toast.success(isAr ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter local status if needed
  const displayUsers = users.filter((u) => {
    if (statusFilter === 'ACTIVE') return u.isActive;
    if (statusFilter === 'INACTIVE') return !u.isActive;
    return true;
  });

  const activeCount = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Counters Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#988172]">
              {isAr ? 'إجمالي الحسابات' : 'Total Accounts'}
            </span>
            <div className="font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1">
              {totalCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80] border border-[#EBDED6] dark:border-[#3D332E]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#988172]">
              {isAr ? 'الحسابات النشطة' : 'Active Accounts'}
            </span>
            <div className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {activeCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 border border-emerald-200 dark:border-emerald-800">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#988172]">
              {isAr ? 'مدراء النظام' : 'Store Admins'}
            </span>
            <div className="font-serif text-2xl font-bold text-[#C48D80] mt-1">
              {adminCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80] border border-[#EBDED6] dark:border-[#3D332E]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="bg-white dark:bg-[#28211E] rounded-3xl p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#988172] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={isAr ? 'البحث بالاسم، البريد أو الهاتف...' : 'Search by name, email, or phone...'}
            className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#988172] text-[11px] hidden sm:inline">{isAr ? 'الدور:' : 'Role:'}</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'ALL' | 'USER' | 'ADMIN');
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
            >
              <option value="ALL">{isAr ? 'جميع الأدوار' : 'All Roles'}</option>
              <option value="USER">{isAr ? 'عملاء المتجر' : 'Customers'}</option>
              <option value="ADMIN">{isAr ? 'المدراء' : 'Admins'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#988172] text-[11px] hidden sm:inline">{isAr ? 'الحالة:' : 'Status:'}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
              className="px-3 py-2 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] text-xs text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80]"
            >
              <option value="ALL">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="ACTIVE">{isAr ? 'نشط فقط' : 'Active only'}</option>
              <option value="INACTIVE">{isAr ? 'معطل فقط' : 'Deactivated'}</option>
            </select>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-2xl border-[#EBDED6] text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
          </Button>

          {/* Add User Button */}
          <Button
            onClick={handleOpenAdd}
            className="rounded-2xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs py-2 px-4 flex items-center gap-2 font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة مستخدم' : 'Add User'}</span>
          </Button>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] flex items-center justify-center text-[#C48D80]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                {isAr ? 'سجل عملاء ومستخدمي متجر رواروسا' : 'Store User Directory'}
              </h3>
              <p className="text-[11px] text-[#988172]">
                {displayUsers.length} {isAr ? 'مستخدم معروض' : 'users listed'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#C48D80] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#988172]">{isAr ? 'جاري جلب بيانات المستخدمين...' : 'Loading users list...'}</p>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <UserX className="w-10 h-10 text-[#988172]/40 mx-auto" />
            <p className="text-xs text-[#988172] font-medium">
              {isAr ? 'لم يتم العثور على أي مستخدمين' : 'No users found'}
            </p>
            <Button
              onClick={handleOpenAdd}
              variant="outline"
              className="text-xs rounded-xl border-[#EBDED6]"
            >
              {isAr ? 'إضافة أول مستخدم' : 'Create first user'}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] border-b border-[#EBDED6] dark:border-[#3D332E] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'المستخدم' : 'Customer'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'الدور' : 'Role'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'حالة الحساب' : 'Status'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'الطلبات' : 'Orders'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'تاريخ التسجيل' : 'Registered'}</th>
                  <th className="py-3.5 px-4 font-semibold text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBDED6]/60 dark:divide-[#3D332E]/60 text-[#2B2320] dark:text-[#FAF6F0]">
                {displayUsers.map((u) => {
                  const initials = u.name
                    ? u.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'RO';

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#1F1917]/50 transition-colors"
                    >
                      {/* User Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-center font-bold font-serif text-[11px] text-[#C48D80] shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-[#2B2320] dark:text-[#FAF6F0] truncate flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {u.role === 'ADMIN' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#C48D80]/15 text-[#C48D80] font-bold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#988172] truncate mt-0.5">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone Column */}
                      <td className="py-3 px-4 text-[#988172]">
                        {u.phone ? (
                          <span className="font-mono text-[11px]">{u.phone}</span>
                        ) : (
                          <span className="text-[10px] text-[#988172]/60 italic">
                            {isAr ? 'غير مسجل' : 'None'}
                          </span>
                        )}
                      </td>

                      {/* Role Column */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            u.role === 'ADMIN'
                              ? 'bg-[#C48D80]/15 text-[#C48D80] border border-[#C48D80]/30'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-[#988172]'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Status Column with Clickable Quick Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          disabled={togglingId === u.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                            u.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                          }`}
                          title={isAr ? 'اضغط للتبديل' : 'Click to toggle status'}
                        >
                          {togglingId === u.id ? (
                            <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                          )}
                          <span>
                            {u.isActive
                              ? isAr
                                ? 'نشط'
                                : 'Active'
                              : isAr
                              ? 'معطل'
                              : 'Inactive'}
                          </span>
                        </button>
                      </td>

                      {/* Orders Count Column */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2B2320] dark:text-[#FAF6F0]">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C48D80]" />
                          <span>{u._count?.orders ?? 0}</span>
                        </div>
                      </td>

                      {/* Creation Date Column */}
                      <td className="py-3 px-4 text-[#988172] text-[11px]">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Customer Details */}
                          <button
                            onClick={() => handleOpenDetails(u.id)}
                            className="p-1.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#1F1917] text-[#988172] hover:text-[#C48D80] transition-colors cursor-pointer"
                            title={isAr ? 'عرض التفاصيل والطلبات' : 'View profile & orders'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#1F1917] text-[#988172] hover:text-[#2B2320] dark:hover:text-[#FAF6F0] transition-colors cursor-pointer"
                            title={isAr ? 'تعديل الحساب' : 'Edit user'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => setDeleteConfirmId(u.id)}
                            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#988172] hover:text-rose-500 transition-colors cursor-pointer"
                            title={isAr ? 'حذف المستخدم' : 'Delete user'}
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#EBDED6] dark:border-[#3D332E] flex items-center justify-between text-xs text-[#988172]">
            <span>
              {isAr
                ? `صفحة ${currentPage} من ${totalPages}`
                : `Page ${currentPage} of ${totalPages}`}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl border-[#EBDED6] text-xs h-8 px-2.5"
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span className="hidden sm:inline">{isAr ? 'السابق' : 'Previous'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-xl border-[#EBDED6] text-xs h-8 px-2.5"
              >
                <span className="hidden sm:inline">{isAr ? 'التالي' : 'Next'}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Form Dialog (Create & Edit) */}
      <UserFormDialog
        isOpen={formDialogOpen}
        user={selectedUser}
        onClose={() => setFormDialogOpen(false)}
        onSave={handleSaveUser}
      />

      {/* User Details Modal (View profile, addresses, orders) */}
      <UserDetailsModal
        isOpen={detailsModalOpen}
        userId={detailUserId}
        token={token}
        onClose={() => {
          setDetailsModalOpen(false);
          setDetailUserId(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={() => !isDeleting && setDeleteConfirmId(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-2xl p-6 z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                  {isAr ? 'تأكيد حذف المستخدم نهائياً' : 'Confirm User Deletion'}
                </h3>
                <p className="text-[11px] text-[#988172]">
                  {isAr
                    ? 'سيتم حذف الحساب بالكامل إذا لم تكن مرتبطة به أي طلبات سابقة.'
                    : 'The account will be deleted permanently if no orders are attached.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#988172] bg-[#FAF7F2] dark:bg-[#1F1917] p-3 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] leading-relaxed">
              {isAr
                ? 'ملاحظة هامة: إذا كان للعميل طلبات شراء سابقة، يفضل تعطيل الحساب بدلاً من حذفه للحفاظ على سجل الفواتير والمبيعات.'
                : 'Note: If the customer has existing orders, you should deactivate the account instead to preserve invoice audit trails.'}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="rounded-2xl border-[#EBDED6] text-xs py-2 px-4"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={() => handleDeleteUser(deleteConfirmId)}
                disabled={isDeleting}
                className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs py-2 px-5 flex items-center gap-2 font-semibold shadow-xs"
              >
                {isDeleting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isAr ? 'حذف نهائي' : 'Delete Account'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
