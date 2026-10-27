'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  RefreshCw,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  X,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Send,
  Sparkles,
  Inbox,
  Globe2,
  Building2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/_Components/ui/button';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utils/apiConfig';

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

interface MailboxViewProps {
  token?: string;
  onUpdateUnreadCount?: (count: number) => void;
}

export default function MailboxView({ token, onUpdateUnreadCount }: MailboxViewProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UNREAD' | 'READ' | 'B2B'>('ALL');
  const [activeMessage, setActiveMessage] = useState<ContactMessageItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [copiedReply, setCopiedReply] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const statusQuery = (selectedStatus !== 'ALL' && selectedStatus !== 'B2B') ? `?status=${selectedStatus}` : '';
      const res = await fetch(`${API_BASE_URL}/contact${statusQuery}`, {
        headers,
        cache: 'no-store',
      });

      if (res.ok) {
        const json = await res.json();
        const list: ContactMessageItem[] = json.messages || json.data || [];
        setMessages(list);

        if (typeof json.unreadCount === 'number') {
          onUpdateUnreadCount?.(json.unreadCount);
        }

        // Auto-select first message on desktop if none selected yet
        if (!activeMessage && list.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 768) {
          setActiveMessage(list[0]);
          if (list[0].status === 'UNREAD') {
            handleMarkAsReadSilently(list[0].id);
          }
        }
      } else {
        toast.error(isAr ? 'تعذر جلب رسائل البريد' : 'Failed to fetch mailbox messages');
      }
    } catch {
      toast.error(isAr ? 'خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedStatus]);

  const handleMarkAsReadSilently = async (id: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }
      await fetch(`${API_BASE_URL}/contact/${id}/read`, {
        method: 'PATCH',
        headers,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'READ' } : m))
      );
    } catch {}
  };

  const handleSelectMessage = (msg: ContactMessageItem) => {
    setActiveMessage(msg);
    setQuickReplyText('');
    if (msg.status === 'UNREAD') {
      handleMarkAsReadSilently(msg.id);
      setActiveMessage({ ...msg, status: 'READ' });
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['token'] = token;
      }

      const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        toast.success(isAr ? 'تم حذف الرسالة بنجاح' : 'Message deleted successfully');
        const remaining = messages.filter((m) => m.id !== id);
        setMessages(remaining);
        if (activeMessage?.id === id) {
          setActiveMessage(remaining.length > 0 ? remaining[0] : null);
        }
        setDeleteConfirmId(null);
      } else {
        toast.error(isAr ? 'فشل حذف الرسالة' : 'Failed to delete message');
      }
    } catch {
      toast.error(isAr ? 'حدث خطأ غير متوقع' : 'Unexpected error');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'reply') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      toast.success(isAr ? 'تم نسخ البريد الإلكتروني' : 'Email copied to clipboard');
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedReply(true);
      toast.success(isAr ? 'تم نسخ نص الرد' : 'Reply text copied');
      setTimeout(() => setCopiedReply(false), 2000);
    }
  };

  const isMsgB2B = (m: ContactMessageItem) =>
    m.subject.toLowerCase().includes('[b2b') ||
    m.message.includes('🏢') ||
    m.subject.toLowerCase().includes('export') ||
    m.subject.toLowerCase().includes('استيراد');

  const b2bCount = messages.filter(isMsgB2B).length;

  const filteredMessages = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.subject.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (selectedStatus === 'B2B') {
      return isMsgB2B(m);
    }

    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length;

  const quickReplyTemplates = isAr
    ? (activeMessage && isMsgB2B(activeMessage)
        ? [
            'أهلاً بكم، نسعد باهتمامكم باستيراد وتوزيع أزياء رواروسا من القطن المصري الفاخر. نرفق لكم كتالوج التشكيلات وعرض أسعار الجملة التفضيلية.',
            'شكراً لتواصلكم معنا. طلب الاستيراد الخاص بمؤسستكم قيد المراجعة لدى قسم التصدير الدولي وسنوافيكم بمسودة العرض خلال 24 ساعة.',
            'مرحباً، تم استلام بيانات متجركم وسيتم تجهيز حزمة العينات الملموسة (Swatches) للشحن المباشر إلى عنوانكم عبر البريد السريع.',
          ]
        : [
            'شكراً لتواصلكِ معنا، تم استلام استفساركِ وسيقوم فريقنا بمتابعة طلبكِ فوراً.',
            'أهلاً بكِ، نسعد بخدمتكِ ويسرنا الرد على استفساركِ.',
            'مرحباً بكِ، تم فحص استفساركِ وجاري اتخاذ اللازم لتوفير الخدمة بأفضل صورة.',
          ])
    : (activeMessage && isMsgB2B(activeMessage)
        ? [
            'Thank you for your wholesale inquiry. We are pleased to share our seasonal export lookbook and tiered volume pricing.',
            'Hello, your B2B boutique profile has been reviewed by our Global Export desk. We have attached the current catalog.',
            'Thank you for reaching out! We are preparing the fabric swatches and sample pack for dispatch via express courier.',
          ]
        : [
            'Thank you for contacting us! We have received your inquiry and our team is looking into it.',
            'Hello! It is a pleasure to assist you. We are glad to answer your questions.',
            'Hello, we have noted your request and are taking necessary actions right away.',
          ]);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Outlook / Gmail 2-Column Split Master-Detail Container */}
      {/* Fixed: style={{ direction: 'ltr' }} guarantees LEFT is List and RIGHT is Reader */}
      <div
        style={{ direction: 'ltr' }}
        className="bg-white dark:bg-[#28211E] rounded-3xl border border-[#EBDED6] dark:border-[#3D332E] shadow-sm flex flex-col md:flex-row h-[740px] overflow-hidden"
      >
        {/* ========================================================================= */}
        {/* LEFT PANE: Messages List (Outlook / Gmail Inbox List)                     */}
        {/* ========================================================================= */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className={`w-full md:w-[380px] lg:w-[420px] shrink-0 border-r border-[#EBDED6] dark:border-[#3D332E] flex flex-col h-full bg-white dark:bg-[#28211E] transition-all duration-200 ${
            activeMessage ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Left Pane Header & Controls */}
          <div className="p-4 border-b border-[#EBDED6] dark:border-[#3D332E] space-y-3 shrink-0 bg-[#FAF7F2]/40 dark:bg-[#1F1917]/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#C48D80]/15 text-[#C48D80] flex items-center justify-center font-bold">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                    {isAr ? 'صندوق الوارد' : 'Inbox Mailbox'}
                  </h3>
                  <p className="text-[10px] text-[#988172]">
                    {filteredMessages.length} {isAr ? 'رسالة' : 'messages'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C48D80] text-white">
                    {unreadCount} {isAr ? 'جديدة' : 'unread'}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchMessages}
                  disabled={loading}
                  className="w-8 h-8 rounded-xl text-[#988172] hover:text-[#2B2320]"
                  title={isAr ? 'تحديث البريد' : 'Refresh'}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#988172] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? 'بحث بالمرسل، الإيميل، الموضوع...' : 'Search messages...'}
                className="w-full ps-9 pe-8 py-2 text-xs rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[#988172] hover:text-[#2B2320]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pb-0.5 scrollbar-none">
              <button
                onClick={() => setSelectedStatus('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'ALL'
                    ? 'bg-[#C48D80] text-white shadow-2xs font-bold'
                    : 'bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] hover:text-[#2B2320]'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSelectedStatus('UNREAD')}
                className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  selectedStatus === 'UNREAD'
                    ? 'bg-[#C48D80] text-white shadow-2xs font-bold'
                    : 'bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] hover:text-[#2B2320]'
                }`}
              >
                <span>{isAr ? 'غير مقروءة' : 'Unread'}</span>
                {unreadCount > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                      selectedStatus === 'UNREAD'
                        ? 'bg-white text-[#C48D80]'
                        : 'bg-[#C48D80] text-white'
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedStatus('READ')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'READ'
                    ? 'bg-[#C48D80] text-white shadow-2xs font-bold'
                    : 'bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] hover:text-[#2B2320]'
                }`}
              >
                {isAr ? 'تمت القراءة' : 'Read'}
              </button>
              <button
                onClick={() => setSelectedStatus('B2B')}
                className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  selectedStatus === 'B2B'
                    ? 'bg-amber-600 text-white shadow-2xs font-bold'
                    : 'bg-[#FAF7F2] dark:bg-[#1F1917] text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                }`}
              >
                <Globe2 className="w-3 h-3" />
                <span>{isAr ? 'استيراد B2B' : 'B2B Export'}</span>
                {b2bCount > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                      selectedStatus === 'B2B' ? 'bg-white text-amber-700' : 'bg-amber-500/20 text-amber-800 dark:text-amber-200'
                    }`}
                  >
                    {b2bCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Messages Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EBDED6]/50 dark:divide-[#3D332E]/50">
            {loading ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-7 h-7 border-2 border-[#C48D80] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#988172]">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <Mail className="w-8 h-8 text-[#988172]/40 mx-auto" />
                <p className="text-xs text-[#988172] font-medium">
                  {isAr ? 'لا توجد رسائل مطابقة' : 'No messages found'}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = activeMessage?.id === msg.id;
                const isUnread = msg.status === 'UNREAD';
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-all duration-150 flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-[#FAF7F2] dark:bg-[#1F1917] border-s-4 border-[#C48D80]'
                        : 'hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1F1917]/60'
                    } ${isUnread ? 'font-semibold' : ''}`}
                  >
                    {/* Sender Initials Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-transform group-hover:scale-105 ${
                        isUnread
                          ? 'bg-[#C48D80] text-white shadow-xs'
                          : 'bg-[#FAF7F2] dark:bg-[#2B2320] text-[#988172] border border-[#EBDED6] dark:border-[#3D332E]'
                      }`}
                    >
                      {getInitials(msg.name)}
                    </div>

                    {/* Email preview details */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#C48D80] shrink-0" />
                          )}
                          <span
                            className={`text-xs truncate ${
                              isUnread
                                ? 'font-bold text-[#2B2320] dark:text-[#FAF6F0]'
                                : 'text-[#2B2320]/80 dark:text-[#FAF6F0]/80'
                            }`}
                          >
                            {msg.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#988172] shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString(
                            isAr ? 'ar-EG' : 'en-US',
                            { month: 'short', day: 'numeric' }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 min-w-0">
                        {isMsgB2B(msg) && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                            <Globe2 className="w-2.5 h-2.5" />
                            <span>B2B</span>
                          </span>
                        )}
                        <h4
                          className={`text-xs truncate ${
                            isUnread
                              ? 'font-bold text-[#2B2320] dark:text-[#FAF6F0]'
                              : 'font-medium text-[#2B2320]/75 dark:text-[#FAF6F0]/75'
                          }`}
                        >
                          {msg.subject}
                        </h4>
                      </div>

                      <p className="text-[11px] text-[#988172] line-clamp-1 leading-normal font-normal">
                        {msg.message}
                      </p>
                    </div>

                    {/* Quick delete icon on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(msg.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#988172] hover:text-rose-600 transition-opacity rounded-md"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANE: Message Content & Quick Reply (Outlook / Gmail Detail Pane)   */}
        {/* ========================================================================= */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className={`flex-1 flex flex-col h-full bg-[#FAF7F2]/20 dark:bg-[#1F1917]/20 overflow-hidden ${
            activeMessage ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeMessage ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Right Pane Top Action Bar */}
              <div className="p-3.5 sm:p-4 border-b border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  {/* Mobile Back Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveMessage(null)}
                    className="md:hidden text-xs rounded-xl p-2 text-[#988172]"
                  >
                    {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    <span className="ms-1">{isAr ? 'الرسائل' : 'Back'}</span>
                  </Button>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      activeMessage.status === 'UNREAD'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {activeMessage.status === 'UNREAD'
                      ? isAr
                        ? 'غير مقروءة'
                        : 'Unread'
                      : isAr
                      ? 'تمت القراءة'
                      : 'Read'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(activeMessage.email, 'email')}
                    className="rounded-xl border-[#EBDED6] text-xs h-8 px-2.5"
                    title={isAr ? 'نسخ البريد' : 'Copy Email'}
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline ms-1.5">{isAr ? 'نسخ الإيميل' : 'Copy Email'}</span>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs h-8 px-3 font-semibold"
                  >
                    <a
                      href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                        activeMessage.subject
                      )}&body=${encodeURIComponent(
                        quickReplyText
                          ? `${quickReplyText}\n\n---\n${isAr ? 'الرسالة السابقة:' : 'Original Message:'}\n${activeMessage.message}`
                          : `\n\n---\n${isAr ? 'الرسالة السابقة:' : 'Original Message:'}\n${activeMessage.message}`
                      )}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="ms-1.5">{isAr ? 'الرد عبر البريد' : 'Reply Email'}</span>
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirmId(activeMessage.id)}
                    className="w-8 h-8 rounded-xl text-[#988172] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title={isAr ? 'حذف الرسالة' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Message Content Viewport (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Subject Heading */}
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0] tracking-tight">
                    {activeMessage.subject}
                  </h2>
                </div>

                {/* B2B Highlight Banner if wholesale */}
                {isMsgB2B(activeMessage) && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between flex-wrap gap-2.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-900 dark:text-amber-100 flex items-center gap-1.5">
                          <span>{isAr ? 'طلب شراكة استيراد وتوريد بالجملة' : 'B2B Wholesale & Export Inquiry'}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 font-mono">
                            Priority B2B
                          </span>
                        </div>
                        <p className="text-[10px] text-[#988172]">
                          {isAr ? 'تم استلام هذا الطلب من بوابة المستوردين الدولية لرواروسا' : 'Submitted via Global B2B Export Portal'}
                        </p>
                      </div>
                    </div>

                    {activeMessage.phone && (
                      <a
                        href={`https://wa.me/${activeMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          isAr
                            ? `مرحباً، نتواصل معكم من قسم التصدير الدولي لرواروسا بخصوص طلب استيراد الأزياء بالجملة لمؤسستكم (${activeMessage.name}).`
                            : `Hello, reaching out from ROAROSA Global Export regarding your wholesale boutique inquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{isAr ? 'محادثة واتساب مباشرة' : 'WhatsApp Buyer'}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Sender Metadata Box */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#C48D80] text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
                      {getInitials(activeMessage.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                          {activeMessage.name}
                        </h4>
                        <span className="text-[11px] text-[#988172]">
                          &lt;{activeMessage.email}&gt;
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#988172] mt-0.5">
                        {activeMessage.phone && (
                          <a
                            href={`tel:${activeMessage.phone}`}
                            className="flex items-center gap-1 hover:text-[#C48D80] transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{activeMessage.phone}</span>
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(activeMessage.createdAt).toLocaleString(
                              isAr ? 'ar-EG' : 'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Content Container */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#988172] pb-2 border-b border-[#EBDED6]/50 dark:border-[#3D332E]/50">
                    <span className="font-medium">{isAr ? 'نص الرسالة والاستفسار:' : 'Message Content:'}</span>
                  </div>
                  <div className="text-sm text-[#2B2320] dark:text-[#FAF6F0] leading-relaxed whitespace-pre-wrap select-text">
                    {activeMessage.message}
                  </div>
                </div>

                {/* In-Pane Quick Reply Box (Outlook / Gmail Composer) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#C48D80]" />
                      <h4 className="text-xs font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                        {isAr ? 'الرد السريع المباشر' : 'Quick Reply Composer'}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#988172]">
                      {isAr ? 'قوالب جاهزة:' : 'Templates:'}
                    </span>
                  </div>

                  {/* Ready template chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {quickReplyTemplates.map((tpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuickReplyText(tpl)}
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] text-[#988172] hover:text-[#C48D80] hover:border-[#C48D80] transition-colors text-start"
                      >
                        <Sparkles className="w-2.5 h-2.5 inline me-1 text-[#C48D80]" />
                        {tpl.slice(0, 38)}...
                      </button>
                    ))}
                  </div>

                  {/* Reply Textarea */}
                  <textarea
                    rows={3}
                    value={quickReplyText}
                    onChange={(e) => setQuickReplyText(e.target.value)}
                    placeholder={
                      isAr
                        ? 'اكتبي نص الرد هنا للعميلة...'
                        : 'Type your reply message here...'
                    }
                    className="w-full p-3 text-xs rounded-xl border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2]/50 dark:bg-[#1F1917]/50 text-[#2B2320] dark:text-[#FAF6F0] focus:outline-hidden focus:border-[#C48D80] transition-colors resize-none leading-relaxed"
                  />

                  {/* Reply Action Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(quickReplyText, 'reply')}
                      disabled={!quickReplyText}
                      className="rounded-xl border-[#EBDED6] text-xs h-8 px-3"
                    >
                      {copiedReply ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="ms-1.5">{isAr ? 'نسخ نص الرد' : 'Copy Text'}</span>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs h-8 px-4 font-semibold"
                    >
                      <a
                        href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                          activeMessage.subject
                        )}&body=${encodeURIComponent(
                          quickReplyText
                            ? `${quickReplyText}\n\n---\n${isAr ? 'الرسالة السابقة:' : 'Original Message:'}\n${activeMessage.message}`
                            : `\n\n---\n${isAr ? 'الرسالة السابقة:' : 'Original Message:'}\n${activeMessage.message}`
                        )}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="ms-1.5">{isAr ? 'إرسال عبر برنامج البريد' : 'Send via Email'}</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Outlook Empty State when no email selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm flex items-center justify-center text-[#C48D80]">
                <MailOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">
                  {isAr ? 'اختر رسالة لعرض محتواها' : 'Select a message to view'}
                </h3>
                <p className="text-xs text-[#988172] leading-relaxed">
                  {isAr
                    ? 'انقر على أي رسالة من القائمة بالجانب لعرض كامل تفاصيلها، معلومات المرسل، وكتابة رد مباشر.'
                    : 'Click on any message from the left list to see its complete details and compose a quick reply.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

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
              {isAr ? 'حذف هذه الرسالة؟' : 'Delete Message?'}
            </h4>
            <p className="text-xs text-[#988172]">
              {isAr
                ? 'هل أنتِ متأكدة من حذف هذه الرسالة نهائياً من صندوق الوارد؟'
                : 'Are you sure you want to delete this message from the mailbox?'}
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
                onClick={() => handleDelete(deleteConfirmId)}
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
