'use client';

import React, { useState } from 'react';
import { Mail, Send, Phone, User, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_Components/ui/dialog';
import { Button } from '@/_Components/ui/button';

interface ContactUsDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ContactUsDialog({ trigger, open: controlledOpen, onOpenChange: setControlledOpen }: ContactUsDialogProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      toast.success(
        isAr
          ? 'تم إرسال رسالتك بنجاح! سيقوم فريق خدمة العملاء بالتواصل معك قريباً.'
          : 'Your message has been sent successfully! Our customer care team will contact you shortly.'
      );
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
      }, 1800);
    } catch (err: unknown) {
      console.error(err);
      toast.error(
        isAr ? 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً' : 'Failed to send your inquiry. Please try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => {
      setIsOpen(val);
      if (!val) resetForm();
    }}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <button className='hover:text-white transition-colors cursor-pointer text-start'>
            {isAr ? 'تواصل معنا (خدمة العملاء)' : 'Contact Us (Customer Care)'}
          </button>
        </DialogTrigger>
      )}

      <DialogContent
        dir={isRtl ? 'rtl' : 'ltr'}
        className='max-w-lg w-[95vw] sm:w-full bg-[#FAF9F5] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] p-6 sm:p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]'
      >
        <DialogHeader className='space-y-2 text-start'>
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C48D80]/15 text-[#C48D80] text-xs font-semibold w-fit'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>{isAr ? 'صندوق خدمة العملاء والردود السريعة' : 'ROAROSA Concierge & Support'}</span>
          </div>
          <DialogTitle className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            {isAr ? 'تواصل مع فريق رواروسا' : 'Get in Touch with Us'}
          </DialogTitle>
          <DialogDescription className='text-xs text-[#988172] leading-relaxed'>
            {isAr
              ? 'هل لديك استفسار عن مقاسات البنات، طلب مخصص لمناسبة خاصة، أو اقتراح؟ يسعدنا دائماً الاستماع إليك.'
              : 'Have a question about girls sizing, special occasion orders, or store feedback? We are always here to help.'}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className='py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300'>
            <div className='w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center'>
              <CheckCircle2 className='w-9 h-9' />
            </div>
            <h3 className='font-serif text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              {isAr ? 'تم استلام رسالتك بعناية' : 'Message Received!'}
            </h3>
            <p className='text-xs text-[#988172] max-w-sm mx-auto'>
              {isAr
                ? 'شكراً لتواصلكِ معنا، تم تسجيل رسالتك في صندوق بريد الإدارة وسيتم الرد عبر بريدك الإلكتروني خلال 24 ساعة.'
                : 'Thank you for contacting us. Your inquiry has been routed to our admin mailbox and our team will respond within 24 hours.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
            {/* Name & Phone */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                  <User className='w-3.5 h-3.5 text-[#C48D80]' />
                  <span>{isAr ? 'الاسم الكامل' : 'Full Name'} *</span>
                </label>
                <input
                  type='text'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'سارة محمد' : 'Sarah Smith'}
                  className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 focus:outline-none focus:ring-1 focus:ring-[#C48D80]'
                />
              </div>

              <div className='space-y-1'>
                <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                  <Phone className='w-3.5 h-3.5 text-[#C48D80]' />
                  <span>{isAr ? 'رقم الهاتف' : 'Phone Number'}</span>
                </label>
                <input
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='+20 120 000 0000'
                  dir='ltr'
                  className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 focus:outline-none focus:ring-1 focus:ring-[#C48D80]'
                />
              </div>
            </div>

            {/* Email */}
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                <Mail className='w-3.5 h-3.5 text-[#C48D80]' />
                <span>{isAr ? 'البريد الإلكتروني' : 'Email Address'} *</span>
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='sarah@example.com'
                dir='ltr'
                className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 focus:outline-none focus:ring-1 focus:ring-[#C48D80]'
              />
            </div>

            {/* Subject */}
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] flex items-center gap-1.5'>
                <MessageSquare className='w-3.5 h-3.5 text-[#C48D80]' />
                <span>{isAr ? 'موضوع الرسالة' : 'Subject'} *</span>
              </label>
              <input
                type='text'
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={isAr ? 'استفسار عن مقاسات فساتين المناسبات' : 'Inquiry about occasion dresses'}
                className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 focus:outline-none focus:ring-1 focus:ring-[#C48D80]'
              />
            </div>

            {/* Message */}
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'نص الرسالة أو الاستفسار' : 'Message Details'} *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتبي استفساركِ بالتفصيل هنا...'
                    : 'Please let us know how we can assist you with sizes, orders, or delivery...'
                }
                className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] text-xs text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]/50 focus:outline-none focus:ring-1 focus:ring-[#C48D80] resize-none'
              />
            </div>

            {/* Actions */}
            <div className='pt-2 flex items-center justify-end gap-2.5'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsOpen(false)}
                className='h-10 px-5 rounded-full border-[#EBDED6] dark:border-[#3D332E] text-xs'
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type='submit'
                disabled={submitting}
                className='h-10 px-6 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer shadow-xs'
              >
                {submitting ? (
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ) : (
                  <>
                    <Send className='w-3.5 h-3.5' />
                    <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
