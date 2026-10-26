'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRtl: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Header
    brandSlogan: 'Softness is not weakness',
    allGirls: 'All Girls',
    newIn: 'New In',
    baby: 'Baby (0-2 Yrs)',
    younger: 'Younger Girls (3-7 Yrs)',
    older: 'Older Girls (8-16 Yrs)',
    dresses: 'Dresses',
    tops: 'Tops & T-Shirts',
    knitwear: 'Knitwear',
    coats: 'Coats & Jackets',
    sets: 'Sets & Outfits',
    nightwear: 'Nightwear',
    occasions: 'Occasions',
    sale: 'Sale',
    searchPlaceholder: "Search for girls' dresses, coats, knitwear...",
    myAccount: 'My Account',
    profileSettings: 'Profile Settings',
    myOrders: 'My Orders',
    dashboard: 'Admin Dashboard',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    register: 'Register',
    favourites: 'Favourites',
    bag: 'Bag',
    cart: 'Shopping Bag',

    // Cart Page
    emptyBagTitle: 'Your Bag is Empty',
    emptyBagDesc: 'Explore our curated girls’ dresses, knitwear, and occasion collections to fill your bag with gentle essentials.',
    startShopping: 'Start Shopping',
    reviewCheckout: 'Review & Checkout',
    items: 'items',
    item: 'item',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    freeExpress: 'Free Express',
    taxesIncluded: 'Included',
    taxesDuties: 'Taxes & Duties',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    clearBag: 'Clear Shopping Bag',
    removeFromBag: 'Remove From Bag',
    couponCode: 'Discount Coupon',
    applyCoupon: 'Apply',
    couponPlaceholder: 'Enter promo code (e.g. ROAROSA10)',
    couponApplied: 'Coupon applied successfully!',
    freeShippingPromo: 'Add {amount} EGP more for FREE Express Shipping!',
    freeShippingUnlocked: '🎉 You have unlocked FREE Express Shipping!',
    secureCheckout: '100% Secure Checkout',
    expressDelivery: 'Express Delivery across Egypt',
    easyReturns: '14-Day Free Returns',

    // Auth
    login: 'Login',
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Enter your credentials to access your gentle wardrobe',
    registerTitle: 'Create an Account',
    registerSubtitle: 'Join ROAROSA family and discover bespoke collections',
    email: 'Email Address',
    password: 'Password',
    rePassword: 'Confirm Password',
    name: 'Full Name',
    phone: 'Phone Number',
    forgetPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    continueWithGoogle: 'Continue with Google',
    orContinueWith: 'or continue with email',
    loginSuccess: 'Signed in successfully!',
    loginFailed: 'Invalid email or password.',
    registerSuccess: 'Account created successfully! Please sign in.',

    // Chatbot
    chatTitle: 'ROAROSA Stylist & Assistant',
    chatSubtitle: 'Ask anything about sizes, fabrics, and orders',
    online: 'Online',
    chatPlaceholder: 'Type a message in Arabic or English...',
    send: 'Send',
    quickQuestions: 'Quick Inquiries',
    quickDress: 'What girls dresses are trending? 👗',
    quickCoupons: 'Are there discount coupons available? 🏷️',
    quickBestSeller: 'Show me best seller items ⭐',
    quickDelivery: 'What is your shipping policy? 🚚',
    viewProduct: 'View Details',

    // Dashboard
    dashTitle: 'Management Dashboard',
    dashSubtitle: 'Live performance analytics, store metrics, and inventory control',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    pendingOrders: 'Pending Orders',
    totalCustomers: 'Total Customers',
    totalProducts: 'Total Products',
    lowStock: 'Low Stock Alerts',
    monthlySales: 'Monthly Sales Performance',
    recentOrders: 'Recent Orders',
    topProducts: 'Top Selling Products',
    orderId: 'Order ID',
    customer: 'Customer',
    date: 'Date',
    amount: 'Amount',
    payment: 'Payment',
    status: 'Status',
    paid: 'PAID',
    unpaid: 'UNPAID',
    pending: 'PENDING',
    delivered: 'DELIVERED',
    soldCount: 'Units Sold',
    price: 'Price',
    viewAll: 'View All',
  },
  ar: {
    // Navigation & Header
    brandSlogan: 'الرقة ليست ضعفاً',
    allGirls: 'كل تشكيلات البنات',
    newIn: 'وصل حديثاً',
    baby: 'الرضع (0-2 سنة)',
    younger: 'البنات الصغيرات (3-7 سنوات)',
    older: 'البنات الكبار (8-16 سنة)',
    dresses: 'فساتين',
    tops: 'بلوزات وتيشيرتات',
    knitwear: 'ملابس صوف وتريكو',
    coats: 'معاطف وجواكت',
    sets: 'أطقم وتنسيقات',
    nightwear: 'ملابس نوم وبيجامات',
    occasions: 'مناسبات وسهرات',
    sale: 'تخفيضات',
    searchPlaceholder: 'ابحثي عن فساتين، معاطف، تريكو، بيجامات...',
    myAccount: 'حسابي',
    profileSettings: 'إعدادات الحساب',
    myOrders: 'طلباتي',
    dashboard: 'لوحة التحكم (الإدارة)',
    signOut: 'تسجيل الخروج',
    signIn: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    favourites: 'المفضلة',
    bag: 'حقيبة التسوق',
    cart: 'حقيبة التسوق',

    // Cart Page
    emptyBagTitle: 'حقيبة التسوق فارغة',
    emptyBagDesc: 'استكشفي تشكيلاتنا الراقية من فساتين البنات، التريكو، وملابس المناسبات لملء حقيبتك بأرق الموديلات.',
    startShopping: 'ابدئي التسوق الآن',
    reviewCheckout: 'مراجعة الطلب وإتمام الشراء',
    items: 'قطع',
    item: 'قطعة',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    delivery: 'الشحن والتوصيل',
    freeExpress: 'شحن سريع مجاني',
    taxesIncluded: 'شاملة',
    taxesDuties: 'الضرائب والرسوم',
    total: 'الإجمالي النهائي',
    proceedToCheckout: 'متابعة الدفع الآمن',
    clearBag: 'تفريغ حقيبة التسوق',
    removeFromBag: 'حذف من الحقيبة',
    couponCode: 'كوبون الخصم',
    applyCoupon: 'تطبيق',
    couponPlaceholder: 'أدخلي كود الخصم (مثال: ROAROSA10)',
    couponApplied: 'تم تطبيق كود الخصم بنجاح!',
    freeShippingPromo: 'أضيفي منتجات بقيمة {amount} جنيه للشحن السريع المجاني!',
    freeShippingUnlocked: '🎉 مبروك! حصلتِ على شحن سريع مجاني لطلبك!',
    secureCheckout: 'دفع إلكتروني آمن 100%',
    expressDelivery: 'توصيل سريع لجميع أنحاء مصر',
    easyReturns: 'إرجاع واستبدال مجاني خلال 14 يوماً',

    // Auth
    login: 'تسجيل الدخول',
    loginTitle: 'أهلاً بعودتك',
    loginSubtitle: 'سجّلي دخولك للوصول إلى حقيبة التسوق ومتابعة طلباتك',
    registerTitle: 'إنشاء حساب جديد',
    registerSubtitle: 'انضمي لعائلة رواروسا واستمتعي بتجربة تسوق فريدة ومميزة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rePassword: 'تأكيد كلمة المرور',
    name: 'الاسم بالكامل',
    phone: 'رقم الهاتف',
    forgetPassword: 'نسيتِ كلمة المرور؟',
    dontHaveAccount: 'ليس لديكِ حساب؟',
    alreadyHaveAccount: 'لديكِ حساب بالفعل؟',
    continueWithGoogle: 'المتابعة باستخدام Google',
    orContinueWith: 'أو بالبريد الإلكتروني',
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    loginFailed: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    registerSuccess: 'تم إنشاء الحساب بنجاح! سجلي دخولك الآن.',

    // Chatbot
    chatTitle: 'المساعد الذكي • ROAROSA',
    chatSubtitle: 'إجابات فورية عن المقاسات، الخامات، والأسعار',
    online: 'متصل الآن',
    chatPlaceholder: 'اكتبي رسالتك بالعربية أو الإنجليزية...',
    send: 'إرسال',
    quickQuestions: 'أسئلة مقترحة',
    quickDress: 'ما هي أحدث فساتين البنات المتوفرة؟ 👗',
    quickCoupons: 'هل توجد كوبونات خصم حالياً؟ 🏷️',
    quickBestSeller: 'أرني المنتجات الأكثر مبيعاً ⭐',
    quickDelivery: 'ما هي مواعيد وسياسة التوصيل؟ 🚚',
    viewProduct: 'عرض التفاصيل',

    // Dashboard
    dashTitle: 'لوحة التحكم الإدارية',
    dashSubtitle: 'تحليلات الأداء المباشرة، إحصائيات المتجر وإدارة المخزون والطلبات',
    totalRevenue: 'إجمالي المبيعات والأرباح',
    totalOrders: 'إجمالي الطلبات',
    pendingOrders: 'طلبات قيد المراجعة',
    totalCustomers: 'إجمالي العملاء',
    totalProducts: 'إجمالي المنتجات',
    lowStock: 'تنبيهات انخفاض المخزون',
    monthlySales: 'حركة المبيعات الشهرية',
    recentOrders: 'أحدث الطلبات الواردة',
    topProducts: 'المنتجات الأكثر مبيعاً',
    orderId: 'رقم الطلب',
    customer: 'العميل',
    date: 'التاريخ',
    amount: 'المبلغ',
    payment: 'الدفع',
    status: 'الحالة',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    pending: 'معلق',
    delivered: 'تم التوصيل',
    soldCount: 'القطع المباعة',
    price: 'السعر',
    viewAll: 'عرض الكل',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  direction: 'rtl',
  isRtl: true,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('roarosa_lang') as Language | null;
    if (saved === 'en' || saved === 'ar') {
      setLanguageState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    } else {
      // Default to Arabic as requested
      setLanguageState('ar');
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('roarosa_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] ?? fallback ?? key;
  };

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRtl,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
