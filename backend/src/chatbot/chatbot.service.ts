import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessageDto } from './dto/chat-message.dto';

type Intent =
  | 'greeting'
  | 'order_info'
  | 'price_inquiry'
  | 'availability'
  | 'categories'
  | 'product_search'
  | 'fallback';

@Injectable()
export class ChatbotService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  // ──────────────────────────────────────────────────────────────
  // Public entry point
  // ──────────────────────────────────────────────────────────────

  async processMessage(dto: ChatMessageDto): Promise<{
    reply: string;
    products?: any[];
    sessionId?: string;
  }> {
    const { message, sessionId } = dto;
    const isArabic = this.isArabicMessage(message);
    const intent = this.detectIntent(message);

    switch (intent) {
      case 'greeting':
        return { reply: this.greetingReply(isArabic), sessionId };

      case 'order_info':
        return { reply: this.orderInfoReply(isArabic), sessionId };

      case 'price_inquiry': {
        const products = await this.searchProducts(message);
        return {
          reply: this.priceReply(isArabic, products),
          products,
          sessionId,
        };
      }

      case 'availability': {
        const products = await this.searchProducts(message);
        return {
          reply: this.availabilityReply(isArabic, products),
          products,
          sessionId,
        };
      }

      case 'categories': {
        const categories = await this.prisma.category.findMany({
          where: { isActive: true },
          select: { id: true, name: true },
          take: 20,
        });
        return {
          reply: this.categoriesReply(isArabic, categories),
          sessionId,
        };
      }

      case 'product_search': {
        const products = await this.searchProducts(message);
        return {
          reply: this.productSearchReply(isArabic, products, message),
          products,
          sessionId,
        };
      }

      default:
        return { reply: this.fallbackReply(isArabic), sessionId };
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Intent detection
  // ──────────────────────────────────────────────────────────────

  private detectIntent(message: string): Intent {
    const lower = message.toLowerCase();
    const words = lower.split(/[\s,?.!;:()"\-_]+/);

    const greetingKeywords = [
      'hello', 'hey', 'مرحبا', 'هلو', 'أهلا', 'اهلا', 'السلام',
    ];
    const isGreeting = greetingKeywords.some((kw) => lower.includes(kw)) || words.includes('hi');

    const orderKeywords = [
      'order', 'orders', 'طلب', 'طلباتي', 'أوردر', 'شحن', 'delivery',
      'shipping', 'track',
    ];
    const priceKeywords = [
      'price', 'cost', 'how much', 'سعر', 'بكام', 'بكم', 'الثمن', 'تمن',
    ];
    const availabilityKeywords = [
      'available', 'stock', 'in stock', 'متاح', 'موجود', 'فاضل', 'size',
      'مقاس',
    ];
    const categoryKeywords = [
      'category', 'categories', 'what do you sell', 'تصنيف', 'أقسام',
      'اقسام', 'ايه عندكو',
    ];

    if (orderKeywords.some((kw) => lower.includes(kw))) return 'order_info';
    if (priceKeywords.some((kw) => lower.includes(kw))) return 'price_inquiry';
    if (availabilityKeywords.some((kw) => lower.includes(kw))) return 'availability';
    if (categoryKeywords.some((kw) => lower.includes(kw))) return 'categories';
    if (isGreeting && words.length <= 4) return 'greeting';

    const trimmed = message.trim();
    if (trimmed.length >= 2) return 'product_search';

    return 'fallback';
  }

  // ──────────────────────────────────────────────────────────────
  // Language detection
  // ──────────────────────────────────────────────────────────────

  private isArabicMessage(message: string): boolean {
    return /[\u0600-\u06FF]/.test(message);
  }

  // ──────────────────────────────────────────────────────────────
  // DB queries
  // ──────────────────────────────────────────────────────────────

  private extractKeywords(message: string): string[] {
    // Remove common stop-words and split by whitespace / punctuation
    const stopWords = new Set([
      'do', 'you', 'have', 'is', 'the', 'a', 'an', 'are', 'what', 'show',
      'me', 'find', 'get', 'i', 'want', 'looking', 'for', 'any', 'هل',
      'عندكم', 'عندك', 'في', 'فيه', 'ممكن', 'اريد', 'أريد', 'ابحث', 'عن',
    ]);

    return message
      .split(/[\s,،.?؟!]+/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2 && !stopWords.has(w.toLowerCase()));
  }

  private async searchProducts(message: string): Promise<any[]> {
    const keywords = this.extractKeywords(message);
    if (keywords.length === 0) return [];

    // Build OR conditions for all extracted keywords
    const orConditions = keywords.flatMap((kw) => [
      { title: { contains: kw, mode: 'insensitive' as const } },
      { description: { contains: kw, mode: 'insensitive' as const } },
    ]);

    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: orConditions,
      },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        priceAfterDiscount: true,
        imageCover: true,
        ratingsAverage: true,
        ratingsQuantity: true,
        variants: {
          where: { isActive: true },
          select: {
            stockQuantity: true,
            size: { select: { name: true, code: true } },
            color: { select: { name: true, hexCode: true } },
          },
          take: 3,
        },
      },
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Reply builders
  // ──────────────────────────────────────────────────────────────

  private greetingReply(isArabic: boolean): string {
    return isArabic
      ? 'أهلاً وسهلاً! 👗 أنا مساعدك الذكي للتسوق. كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في البحث عن منتجات، الأسعار، والتوفر.'
      : 'Hello! 👗 I\'m your smart shopping assistant. How can I help you today? I can help you find products, check prices, and more!';
  }

  private orderInfoReply(isArabic: boolean): string {
    return isArabic
      ? 'لعرض طلباتك وتتبع الشحن، يرجى تسجيل الدخول إلى حسابك أولاً. 🔐\nبعد تسجيل الدخول ستجد جميع تفاصيل طلباتك في قسم "طلباتي".'
      : 'To view your orders and track shipping, please log in to your account first. 🔐\nAfter logging in, you\'ll find all your order details in the "My Orders" section.';
  }

  private priceReply(isArabic: boolean, products: any[]): string {
    if (products.length === 0) {
      return isArabic
        ? 'لم أجد منتجات مطابقة. حاول البحث باسم المنتج أو التصنيف مثل "فساتين" أو "تيشيرت".'
        : 'I couldn\'t find matching products. Try searching by product name or category like "dresses" or "t-shirts".';
    }

    const lines = products.map((p) => {
      const price = Number(p.priceAfterDiscount ?? p.price).toFixed(2);
      const original =
        p.priceAfterDiscount && Number(p.priceAfterDiscount) < Number(p.price)
          ? ` (~~${Number(p.price).toFixed(2)} EGP~~)`
          : '';
      return `• **${p.title}** — ${price} EGP${original}`;
    });

    return isArabic
      ? `إليك أسعار المنتجات التي وجدتها:\n\n${lines.join('\n')}`
      : `Here are the prices for the products I found:\n\n${lines.join('\n')}`;
  }

  private availabilityReply(isArabic: boolean, products: any[]): string {
    if (products.length === 0) {
      return isArabic
        ? 'لم أجد منتجات مطابقة. جرب البحث بكلمات مختلفة.'
        : 'I couldn\'t find matching products. Try different keywords.';
    }

    const lines = products.map((p) => {
      const totalStock = p.variants.reduce(
        (sum: number, v: any) => sum + (v.stockQuantity ?? 0),
        0,
      );
      const inStock = totalStock > 0;
      const sizesAvailable = [
        ...new Set(
          p.variants
            .filter((v: any) => v.stockQuantity > 0)
            .map((v: any) => v.size?.name)
            .filter(Boolean),
        ),
      ].join(', ');

      const stockLabel = isArabic
        ? inStock
          ? `✅ متاح (${totalStock} قطعة)`
          : '❌ غير متاح حالياً'
        : inStock
        ? `✅ In Stock (${totalStock} units)`
        : '❌ Out of Stock';

      const sizeLine = sizesAvailable
        ? isArabic
          ? ` — المقاسات: ${sizesAvailable}`
          : ` — Sizes: ${sizesAvailable}`
        : '';

      return `• **${p.title}** — ${stockLabel}${sizeLine}`;
    });

    return isArabic
      ? `إليك معلومات التوفر:\n\n${lines.join('\n')}`
      : `Here is the availability information:\n\n${lines.join('\n')}`;
  }

  private categoriesReply(
    isArabic: boolean,
    categories: { id: string; name: string }[],
  ): string {
    if (categories.length === 0) {
      return isArabic
        ? 'لا توجد تصنيفات متاحة حالياً.'
        : 'No categories available at the moment.';
    }

    const list = categories.map((c) => `• ${c.name}`).join('\n');

    return isArabic
      ? `نحن نبيع في التصنيفات التالية 🛍️:\n\n${list}\n\nأخبرني بما تبحث عنه وسأجد لك المنتجات المناسبة!`
      : `We sell in the following categories 🛍️:\n\n${list}\n\nTell me what you're looking for and I'll find the right products for you!`;
  }

  private productSearchReply(
    isArabic: boolean,
    products: any[],
    originalMessage: string,
  ): string {
    if (products.length === 0) {
      return isArabic
        ? `لم أجد منتجات تطابق "${originalMessage}". جرب كلمات بحث مختلفة، أو اسألني عن التصنيفات المتاحة.`
        : `I couldn't find products matching "${originalMessage}". Try different search terms, or ask me about available categories.`;
    }

    const lines = products.map((p) => {
      const price = Number(p.priceAfterDiscount ?? p.price).toFixed(2);
      const rating =
        Number(p.ratingsAverage) > 0
          ? ` ⭐ ${Number(p.ratingsAverage).toFixed(1)}`
          : '';
      return `• **${p.title}** — ${price} EGP${rating}`;
    });

    return isArabic
      ? `وجدت ${products.length} منتج(ات) لك 🎉:\n\n${lines.join('\n')}\n\nهل تريد معرفة المزيد عن أي منتج؟`
      : `I found ${products.length} product(s) for you 🎉:\n\n${lines.join('\n')}\n\nWould you like to know more about any product?`;
  }

  private fallbackReply(isArabic: boolean): string {
    return isArabic
      ? 'مرحباً! 👋 يمكنني مساعدتك في:\n• البحث عن منتجات\n• معرفة الأسعار\n• التحقق من التوفر والمقاسات\n• عرض تصنيفات المتجر\n\nماذا تريد أن تعرف؟'
      : 'Hello! 👋 I can help you with:\n• Searching for products\n• Checking prices\n• Checking availability and sizes\n• Browsing store categories\n\nWhat would you like to know?';
  }
}
