'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Star,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/apiConfig';

export interface ChatProduct {
  id?: string;
  _id?: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover?: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  products?: ChatProduct[];
  timestamp: Date;
}

export default function CustomerChatbot() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'bot',
          text: isAr
            ? 'مرحباً بكِ في رواروسا 🌸 أنا مساعدتكِ الذكية لاختيار أجمل الإطلالات والمقاسات لبناتكِ. كيف يمكنني مساعدتكِ اليوم؟'
            : 'Welcome to ROAROSA 🌸 I am your personal AI stylist to help you choose the finest outfits and sizes for girls. How can I assist you today?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isAr, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const quickPrompts = isAr
    ? [
        { label: 'أحدث الفساتين 👗', query: 'أرني أحدث فساتين البنات المتوفرة في المتجر' },
        { label: 'كوبونات الخصم 🏷️', query: 'هل توجد كوبونات خصم أو تخفيضات حالياً؟' },
        { label: 'الأكثر مبيعاً ⭐', query: 'ما هي المنتجات الأكثر مبيعاً وإقبالاً؟' },
        { label: 'سياسة الشحن 🚚', query: 'ما هي مواعيد وتكلفة التوصيل والشحن المجاني؟' },
      ]
    : [
        { label: 'Girls Dresses 👗', query: 'Show me the trending girls dresses available' },
        { label: 'Coupons & Deals 🏷️', query: 'Are there discount coupons or current offers?' },
        { label: 'Best Sellers ⭐', query: 'What are the top selling items?' },
        { label: 'Shipping Info 🚚', query: 'What is your shipping policy and delivery time?' },
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: 'session_web_customer',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch chatbot response');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || (isAr ? 'عذراً، لم أستطع العثور على رد مناسب.' : 'Sorry, I could not find a suitable response.'),
        products: data.products || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Fallback friendly reply
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: isAr
          ? 'يسعدني تقديم المساعدة دائماً! تفضلي بتصفح أقسام الفساتين، التريكو، أو الأطقم عبر القائمة، أو اسأليني عن أي قطعة محددة.'
          : 'I am always happy to help! Feel free to explore our Dresses, Knitwear, and Sets in the main collection, or ask me about any specific item.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: isAr
          ? 'تم بدء محادثة جديدة 🌸 كيف يمكنني مساعدتكِ الآن؟'
          : 'Started a fresh conversation 🌸 How can I help you now?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end'>
      {/* Expanded Chat Drawer / Card */}
      {isOpen && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className='mb-3 w-[92vw] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col bg-white dark:bg-[#28211E] rounded-3xl shadow-2xl border border-[#EBDED6] dark:border-[#3D332E] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5'
        >
          {/* Header */}
          <div className='p-4 bg-gradient-to-r from-[#2B2320] to-[#3D332E] text-white flex items-center justify-between shadow-xs'>
            <div className='flex items-center gap-3'>
              <div className='relative w-10 h-10 rounded-full bg-[#C48D80] flex items-center justify-center text-white shadow-xs'>
                <Sparkles className='w-5 h-5' />
                <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#2B2320]' />
              </div>
              <div>
                <h3 className='font-serif font-bold text-sm tracking-wide flex items-center gap-1.5'>
                  <span>ROAROSA AI</span>
                  <span className='text-[10px] px-1.5 py-0.5 rounded-full bg-[#C48D80]/40 text-[#E5C2AF] font-normal'>
                    {isAr ? 'مساعد ذكي' : 'Assistant'}
                  </span>
                </h3>
                <p className='text-[11px] text-[#EBDED6]/80 flex items-center gap-1'>
                  <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
                  <span>{isAr ? 'متصل الآن • جاهز للمساعدة' : 'Online • Ready to assist'}</span>
                </p>
              </div>
            </div>

            <div className='flex items-center gap-1.5'>
              <button
                onClick={handleReset}
                className='p-1.5 rounded-full text-[#EBDED6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer'
                title={isAr ? 'محادثة جديدة' : 'New chat'}
              >
                <RotateCcw className='w-4 h-4' />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1.5 rounded-full text-[#EBDED6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer'
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className='px-3 py-2 bg-[#FAF7F2] dark:bg-[#1F1917] border-b border-[#EBDED6] dark:border-[#3D332E] flex gap-2 overflow-x-auto no-scrollbar'>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                className='shrink-0 text-[11px] font-medium px-3 py-1 rounded-full bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] hover:border-[#C48D80] hover:text-[#C48D80] transition-colors cursor-pointer shadow-2xs'
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-[#FBF9F3]/60 dark:bg-[#1F1917]/60'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${
                  msg.sender === 'user' ? (isRtl ? 'flex-row' : 'flex-row-reverse') : (isRtl ? 'flex-row-reverse' : 'flex-row')
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#2B2320] text-white'
                      : 'bg-[#C48D80] text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User className='w-3.5 h-3.5' /> : <Bot className='w-3.5 h-3.5' />}
                </div>

                {/* Bubble */}
                <div className='max-w-[82%] space-y-2'>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#C48D80] text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] border border-[#EBDED6] dark:border-[#3D332E] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Product Cards Grid if returned */}
                  {msg.products && msg.products.length > 0 && (
                    <div className='space-y-2 pt-1'>
                      {msg.products.map((prod, pIdx) => {
                        const prodId = prod.id || prod._id;
                        return (
                          <div
                            key={pIdx}
                            className='flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs hover:border-[#C48D80] transition-colors'
                          >
                            {prod.imageCover && (
                              <div className='relative w-12 h-14 rounded-lg overflow-hidden bg-[#FAF7F2] shrink-0'>
                                <Image
                                  src={prod.imageCover}
                                  alt={prod.title}
                                  fill
                                  sizes='48px'
                                  className='object-cover'
                                />
                              </div>
                            )}
                            <div className='flex-1 min-w-0'>
                              <h4 className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] truncate'>
                                {prod.title}
                              </h4>
                              <div className='flex items-center gap-2 mt-0.5'>
                                <span className='text-xs font-bold text-[#C48D80]'>
                                  {prod.priceAfterDiscount || prod.price} EGP
                                </span>
                                {prod.ratingsAverage && (
                                  <div className='flex items-center gap-0.5 text-[10px] text-[#988172]'>
                                    <Star className='w-3 h-3 fill-[#C48D80] text-[#C48D80]' />
                                    <span>{prod.ratingsAverage}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {prodId && (
                              <Link
                                href={`/productDetails/${prodId}`}
                                onClick={() => setIsOpen(false)}
                                className='p-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] hover:bg-[#C48D80] hover:text-white text-[#C48D80] transition-colors shrink-0'
                                title={isAr ? 'عرض المنتج' : 'View product'}
                              >
                                <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span className='block text-[9px] text-[#988172] px-1'>
                    {new Intl.DateTimeFormat(isAr ? 'ar-EG' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className='flex gap-2 items-center text-[#988172] text-xs'>
                <div className='w-7 h-7 rounded-full bg-[#C48D80] text-white flex items-center justify-center shrink-0'>
                  <Bot className='w-3.5 h-3.5 animate-pulse' />
                </div>
                <div className='p-3 bg-white dark:bg-[#28211E] rounded-2xl rounded-tl-none border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex items-center gap-1.5'>
                  <span className='w-2 h-2 rounded-full bg-[#C48D80] animate-bounce' style={{ animationDelay: '0ms' }} />
                  <span className='w-2 h-2 rounded-full bg-[#C48D80] animate-bounce' style={{ animationDelay: '150ms' }} />
                  <span className='w-2 h-2 rounded-full bg-[#C48D80] animate-bounce' style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className='p-3 bg-white dark:bg-[#28211E] border-t border-[#EBDED6] dark:border-[#3D332E]'>
            <div className='relative flex items-center gap-2'>
              <input
                type='text'
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isAr ? 'اكتبي رسالتكِ هنا...' : 'Type your question here...'}
                className='flex-1 h-10 px-3.5 rounded-full text-xs bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] focus:outline-none focus:border-[#C48D80] text-[#2B2320] dark:text-[#FAF6F0] placeholder:text-[#988172]'
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className='w-10 h-10 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0'
                title={isAr ? 'إرسال' : 'Send'}
              >
                <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <p className='text-[9px] text-center text-[#988172] mt-2'>
              {isAr ? 'مدعوم بالذكاء الاصطناعي لمتجر رواروسا للبنات' : 'Powered by ROAROSA AI Girls Fashion Assistant'}
            </p>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ring-4 ring-white/20'
        aria-label='Toggle Customer Chatbot'
      >
        <div className='relative'>
          <MessageCircle className='w-5 h-5 transition-transform group-hover:rotate-6' />
          <span className='absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#C48D80]' />
        </div>
        <span className='font-serif font-semibold text-xs tracking-wide hidden sm:inline'>
          {isAr ? 'مساعدة رواروسا' : 'Chat with Stylist'}
        </span>
        <Sparkles className='w-3.5 h-3.5 text-[#FBF9F3]/90' />
      </button>
    </div>
  );
}
