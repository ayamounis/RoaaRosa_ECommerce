export interface CategoryHeroCta {
  label: string;
  labelAr?: string;
  href: string;
}

export interface CategoryHeroData {
  id: string;
  title: string;
  titleAr?: string;
  navSlug: string;
  headline: string;
  headlineAr?: string;
  subheadline: string;
  subheadlineAr?: string;
  badge: string;
  badgeAr?: string;
  videoSrc: string;
  posterSrc: string;
  tagPills: string[];
  tagPillsAr?: string[];
  primaryCta: CategoryHeroCta;
  secondaryCta: CategoryHeroCta;
  tertiaryCta?: CategoryHeroCta;
  productCategoryFilter: string;
  accentColor?: string;
}

export const CATEGORY_HERO_CONFIGS: Record<string, CategoryHeroData> = {
  all: {
    id: 'all',
    title: 'All Girls',
    titleAr: 'جميع تشكيلات البنات',
    navSlug: 'all',
    headline: 'Softness is not weakness.',
    headlineAr: 'الرقة ليست ضعفاً.',
    subheadline:
      'Discover the new season collection of handcrafted silhouettes, pure organic cottons, and timeless charm for girls of every age.',
    subheadlineAr:
      'اكتشفي تشكيلة الموسم الجديد من التصاميم المصنوعة بعناية، والقطن العضوي الصافي، والأناقة التي تدوم طويلاً للبنات من مختلف الأعمار.',
    badge: "THE GIRLS' NEW SEASON COLLECTION • IN MOTION",
    badgeAr: 'تشكيلة البنات للموسم الجديد • أناقة وحيوية',
    videoSrc: '/videos/hero-campaign.mp4',
    posterSrc: '/images/next/baker-by-ted-baker.jpg',
    tagPills: ['New Season', 'Organic Cotton', 'Girls Edit', 'Ages 0-16'],
    tagPillsAr: ['الموسم الجديد', 'قطن عضوي', 'مختارات البنات', 'الأعمار 0-16'],
    primaryCta: {
      label: 'Shop Younger Girls (3-7 Yrs)',
      labelAr: 'تسوق للبنات الصغيرات (3-7 سنوات)',
      href: '/products?age=younger',
    },
    secondaryCta: {
      label: 'Shop Older Girls (8-16 Yrs)',
      labelAr: 'تسوق للبنات الكبار (8-16 سنة)',
      href: '/products?age=older',
    },
    tertiaryCta: {
      label: 'Explore Dresses',
      labelAr: 'استكشاف الفساتين',
      href: '/products?category=dresses',
    },
    productCategoryFilter: 'all',
    accentColor: '#C48D80',
  },
  'new-in': {
    id: 'new-in',
    title: 'New In',
    titleAr: 'وصل حديثاً',
    navSlug: 'new-in',
    headline: 'Fresh In Bloom.',
    headlineAr: 'أناقة الربيع المتفتحة.',
    subheadline:
      'Spring/Summer drop just arrived. Lightweight floral prints, pastel palettes, and airy textures made for sunlit adventures.',
    subheadlineAr:
      'وصلت تشكيلة الربيع والصيف للتو! طبعات زهور خفيفة، ألوان باستيل ناعمة، وخامات منسوجة لأيام مليئة بالبهجة والمرح.',
    badge: 'SPRING / SUMMER DROP • JUST ARRIVED',
    badgeAr: 'تشكيلة الربيع والصيف • وصلت حديثاً',
    videoSrc: '/videos/category-newin.mp4',
    posterSrc: '/images/next/new-arrivals.jpg',
    tagPills: ['Just Dropped', 'Spring/Summer', 'Pastel Florals', 'Trending'],
    tagPillsAr: ['وصل حديثاً', 'ربيع / صيف', 'زهور باستيل', 'الأكثر طلباً'],
    primaryCta: {
      label: 'Shop New Arrivals',
      labelAr: 'تسوق أحدث المنتجات',
      href: '/products?sort=-createdAt',
    },
    secondaryCta: {
      label: 'Explore Dresses',
      labelAr: 'استكشاف الفساتين',
      href: '/products?category=dresses',
    },
    productCategoryFilter: 'new-in',
    accentColor: '#C48D80',
  },
  baby: {
    id: 'baby',
    title: 'Baby (0-2 Yrs)',
    titleAr: 'الرضع (0-2 سنة)',
    navSlug: 'baby',
    headline: 'Delicate Beginnings.',
    headlineAr: 'بدايات رقيقة بأقصى درجات النعومة.',
    subheadline:
      'Ultra-soft fabrics, hypoallergenic seams, and gentle finishes designed with utmost care for precious newborn and infant skin.',
    subheadlineAr:
      'أقمشة فائقة النعومة، خياطة مضادة للحساسية، ولمسات نهائية هادئة مصممة بعناية لبشرة المواليد والأطفال الرضع الرقيقة.',
    badge: '0–2 YEARS • SENSITIVE SKIN SAFE',
    badgeAr: '0 - 2 سنة • آمنة ومختبرة للبشرة الحساسة',
    videoSrc: '/videos/age-baby.mp4',
    posterSrc: '/images/next/jojo-maman-b-b.jpg',
    tagPills: ['0-24 Months', '100% Organic', 'Sensory Safe', 'Gift Sets'],
    tagPillsAr: ['0 - 24 شهر', '100% قطن عضوي', 'مضاد للحساسية', 'أطقم هدايا'],
    primaryCta: {
      label: 'Shop Baby (0-2 Yrs)',
      labelAr: 'تسوق للرضع (0-2 سنة)',
      href: '/products?age=baby',
    },
    secondaryCta: {
      label: 'Shop Baby Rompers',
      labelAr: 'تسوق سالوبيت وأطقم رضع',
      href: '/products?category=sets&age=baby',
    },
    productCategoryFilter: 'baby',
    accentColor: '#E5C2AF',
  },
  younger: {
    id: 'younger',
    title: 'Younger Girls (3-7 Yrs)',
    titleAr: 'البنات الصغيرات (3-7 سنوات)',
    navSlug: 'younger',
    headline: 'Little Explorers.',
    headlineAr: 'مستكشفات صغيرات بأناقة مبهجة.',
    subheadline:
      'Playful silhouettes, comfortable twirl dresses, and durable stretch fabrics built for everyday discovery and joy.',
    subheadlineAr:
      'تصاميم مرحة، فساتين واسعة تدور مع الحركة، وخامات متينة مطاطة مصنوعة للاستكشاف اليومي والسعادة.',
    badge: '3–7 YEARS • PLAYFUL SILHOUETTES',
    badgeAr: '3 - 7 سنوات • تصاميم مبهجة ومريحة',
    videoSrc: '/videos/age-younger.mp4',
    posterSrc: '/images/next/dresses-shop-now.jpg',
    tagPills: ['Ages 3-7', 'Twirl Ready', 'Durable Weaves', 'Everyday Play'],
    tagPillsAr: ['الأعمار 3-7', 'جاهزة للدوران', 'حياكة متينة', 'للعب اليومي'],
    primaryCta: {
      label: 'Shop Younger Girls (3-7 Yrs)',
      labelAr: 'تسوق للبنات الصغيرات (3-7 سنوات)',
      href: '/products?age=younger',
    },
    secondaryCta: {
      label: 'View Dresses',
      labelAr: 'عرض الفساتين',
      href: '/products?category=dresses&age=younger',
    },
    productCategoryFilter: 'younger',
    accentColor: '#C48D80',
  },
  older: {
    id: 'older',
    title: 'Older Girls (8-16 Yrs)',
    titleAr: 'البنات الكبار (8-16 سنة)',
    navSlug: 'older',
    headline: 'Confident Everyday Chic.',
    headlineAr: 'شياكة عصرية وثقة يومية.',
    subheadline:
      'Modern heritage tailoring, structured trench coats, relaxed knitwear, and effortless weekend co-ords tailored for older girls.',
    subheadlineAr:
      'تفصيل كلاسيكي عصري، معاطف ترنش راقية، تريكو خفيف، وأطقم عطلة مريحة مصممة للبنات الكبار.',
    badge: '8–16 YEARS • MODERN HERITAGE',
    badgeAr: '8 - 16 سنة • كلاسيكية وعصرية',
    videoSrc: '/videos/age-older.mp4',
    posterSrc: '/images/next/baker-by-ted-baker.jpg',
    tagPills: ['Ages 8-16', 'Modern Heritage', 'Smart Casual', 'Weekend Co-ords'],
    tagPillsAr: ['الأعمار 8-16', 'طراز راقٍ', 'كاجوال أنيق', 'تنسيقات عصرية'],
    primaryCta: {
      label: 'Shop Older Girls (8-16 Yrs)',
      labelAr: 'تسوق للبنات الكبار (8-16 سنة)',
      href: '/products?age=older',
    },
    secondaryCta: {
      label: 'Shop Coats & Jackets',
      labelAr: 'تسوق المعاطف والجواكت',
      href: '/products?category=coats&age=older',
    },
    productCategoryFilter: 'older',
    accentColor: '#988172',
  },
  dresses: {
    id: 'dresses',
    title: 'Dresses',
    titleAr: 'فساتين',
    navSlug: 'dresses',
    headline: 'The Twirl Edit.',
    headlineAr: 'مجموعة الفساتين واللفات الرقيقة.',
    subheadline:
      'Handcrafted ruffled tiers, delicate broderie anglaise, and fairytale tulle silhouettes for birthdays, celebrations, and sun-soaked days.',
    subheadlineAr:
      'طبقات كشكش يدوية، تطريزات إنجليزية ناعمة، وتول خيالي لأعياد الميلاد والاحتفالات والأيام المشمسة.',
    badge: 'THE DRESS EDIT • HANDCRAFTED',
    badgeAr: 'تشكيلة الفساتين • صناعة يدوية فاخرة',
    videoSrc: '/videos/category-dresses.mp4',
    posterSrc: '/images/next/dresses-shop-now.jpg',
    tagPills: ['Handcrafted', 'Broderie Anglaise', 'Tiered Tulle', 'Occasion Ready'],
    tagPillsAr: ['صناعة يدوية', 'تطريز ناعم', 'تول متعدد الطبقات', 'للمناسبات'],
    primaryCta: {
      label: 'Explore All Dresses',
      labelAr: 'استكشاف جميع الفساتين',
      href: '/products?category=dresses',
    },
    secondaryCta: {
      label: 'Shop Occasionwear',
      labelAr: 'تسوق ملابس المناسبات',
      href: '/products?category=occasions',
    },
    productCategoryFilter: 'dresses',
    accentColor: '#C48D80',
  },
  tops: {
    id: 'tops',
    title: 'Tops & T-Shirts',
    titleAr: 'بلوزات وتيشيرتات',
    navSlug: 'tops',
    headline: 'Pure Cotton Staples.',
    headlineAr: 'أساسيات القطن الطبيعي الصافي.',
    subheadline:
      'Gentle on skin, breathable, and finished with delicate flutter sleeves, lace trims, and playful hand-drawn botanical illustrations.',
    subheadlineAr:
      'رقيقة على البشرة، خفيفة ومسامية، مزينة بأكمام فراشة رقيقة وحواف دانتيل ورسومات نباتية يدوية مبهجة.',
    badge: 'ORGANIC COTTON • DELICATE RUFFLES',
    badgeAr: 'قطن عضوي • كشكش رقيق ومريح',
    videoSrc: '/videos/category-tops.mp4',
    posterSrc: '/images/next/tops-and-t-shirts-shop-now.jpg',
    tagPills: ['Breathable Jersey', 'Flutter Sleeves', 'Botanical Prints', 'Multipacks'],
    tagPillsAr: ['جيرسيه خفيف', 'أكمام فراشة', 'طبعات نباتية', 'عبوات توفير'],
    primaryCta: {
      label: 'Shop Tops & Tees',
      labelAr: 'تسوق البلوزات والتيشيرتات',
      href: '/products?category=tops',
    },
    secondaryCta: {
      label: 'Explore Knitwear',
      labelAr: 'استكشاف التريكو',
      href: '/products?category=knitwear',
    },
    productCategoryFilter: 'tops',
    accentColor: '#E5C2AF',
  },
  knitwear: {
    id: 'knitwear',
    title: 'Knitwear',
    titleAr: 'ملابس صوف وتريكو',
    navSlug: 'knitwear',
    headline: 'Warm Embrace.',
    headlineAr: 'دفء ناعم يعانق طفولتها.',
    subheadline:
      'Textured cable stitches, chunky ribbed cardigans, and featherlight pointelle knits spun from ethically sourced wool and cotton blends.',
    subheadlineAr:
      'غرز ضفيرة مجسمة، كارديجان مضلع سميك، وتريكو مخرم خفيف مغزول من الصوف الناعم ومزيج القطن الطبيعي.',
    badge: 'COZY KNITWEAR • TEXTURED WEAVES',
    badgeAr: 'تريكو دافئ • نسج مريح وفاخر',
    videoSrc: '/videos/category-knitwear.mp4',
    posterSrc: '/images/next/jumpers-and-cardigans-shop-now.jpg',
    tagPills: ['Cable Knit', 'Pointelle Cardigans', 'Chunky Knits', 'Soft Wool Blend'],
    tagPillsAr: ['تريكو ضفائر', 'كارديجان مخرم', 'صوف ناعم', 'مزيج قطني دافئ'],
    primaryCta: {
      label: 'Explore Knitwear',
      labelAr: 'استكشاف تشكيلة التريكو',
      href: '/products?category=knitwear',
    },
    secondaryCta: {
      label: 'Shop Cardigans',
      labelAr: 'تسوق الكارديجان',
      href: '/products?category=knitwear',
    },
    productCategoryFilter: 'knitwear',
    accentColor: '#988172',
  },
  coats: {
    id: 'coats',
    title: 'Coats & Jackets',
    titleAr: 'معاطف وجواكت',
    navSlug: 'coats',
    headline: 'Shielded in Softness.',
    headlineAr: 'حماية متكاملة بلمسة من الرقة.',
    subheadline:
      'Water-resistant quilted parkas, plush faux fur linings, and tailored wool blend jackets crafted to brave the elements in grace.',
    subheadlineAr:
      'باركا مبطنة مقاومة للماء، بطانات فرو صناعي فائقة النعومة، وجواكت صوف راقية لمواجهة الشتاء بأناقة.',
    badge: 'OUTERWEAR • TAILORED WARMTH',
    badgeAr: 'ملابس شتوية • دفء وفخامة',
    videoSrc: '/videos/category-coats.mp4',
    posterSrc: '/images/next/baker-by-ted-baker.jpg',
    tagPills: ['Water Resistant', 'Faux Fur Lining', 'Tailored Trench', 'Quilted Parkas'],
    tagPillsAr: ['مقاوم للماء', 'فرو ناعم', 'معاطف ترنش', 'باركا مبطنة'],
    primaryCta: {
      label: 'Shop Coats & Jackets',
      labelAr: 'تسوق المعاطف والجواكت',
      href: '/products?category=coats',
    },
    secondaryCta: {
      label: 'Shop Winter Warmth',
      labelAr: 'تسوق أزياء الشتاء الدافئة',
      href: '/products?category=coats',
    },
    productCategoryFilter: 'coats',
    accentColor: '#2B2320',
  },
  sets: {
    id: 'sets',
    title: 'Sets & Outfits',
    titleAr: 'أطقم وتنسيقات',
    navSlug: 'sets',
    headline: 'Effortless Harmony.',
    headlineAr: 'تناغم أنيق بدون مجهود.',
    subheadline:
      'Curated 2-piece and 3-piece sets taking the guesswork out of morning dressing. Coordinated tops, bottoms, and matching hair scrunchies.',
    subheadlineAr:
      'أطقم منسقة من قطعتين وثلاث قطع تجعل اختيار ملابس الصباح متعة يومية. بلوزات وبناطيل متناسقة مع ربطات شعر مطابقة.',
    badge: 'CO-ORDS & SETS • EFFORTLESS',
    badgeAr: 'أطقم وتنسيقات • شياكة فورية',
    videoSrc: '/videos/category-sets.mp4',
    posterSrc: '/images/next/sweat-tops-and-jogger-sets.jpg',
    tagPills: ['Matching Sets', '2-Piece & 3-Piece', 'Jogger Sets', 'Easy Styling'],
    tagPillsAr: ['أطقم متطابقة', 'قطعتين وثلاث قطع', 'أطقم جوجر', 'تنسيق سهل'],
    primaryCta: {
      label: 'Shop Sets & Outfits',
      labelAr: 'تسوق الأطقم والتنسيقات',
      href: '/products?category=sets',
    },
    secondaryCta: {
      label: 'Shop Jogger Sets',
      labelAr: 'تسوق أطقم الجوجر المريحة',
      href: '/products?category=sets',
    },
    productCategoryFilter: 'sets',
    accentColor: '#C48D80',
  },
  nightwear: {
    id: 'nightwear',
    title: 'Nightwear',
    titleAr: 'ملابس نوم وبيجامات',
    navSlug: 'nightwear',
    headline: 'Sweetest Slumber.',
    headlineAr: 'أحلام هادئة ونوم عميق.',
    subheadline:
      'Pure brushed organic cotton pyjamas, silky satin lounge sets, and cozy dressing gowns designed for dreamy, undisturbed sleep.',
    subheadlineAr:
      'بيجامات قطن عضوي ممشط، أطقم ساتان ناعمة، وروب منزلي دافئ لنوم هانئ ومريح طوال الليل.',
    badge: 'NIGHTWEAR • 100% ORGANIC COTTON',
    badgeAr: 'ملابس نوم • 100% قطن عضوي ناعم',
    videoSrc: '/videos/category-nightwear.mp4',
    posterSrc: '/images/next/nightwear-shop-now.jpg',
    tagPills: ['100% Organic Cotton', 'Tagless Comfort', 'Lounge Sets', 'Pyjama Multipacks'],
    tagPillsAr: ['100% قطن عضوي', 'بدون تيكيت للمزيد من الراحة', 'أطقم منزلية', 'بيجامات توفير'],
    primaryCta: {
      label: 'Shop Nightwear',
      labelAr: 'تسوق ملابس النوم',
      href: '/products?category=nightwear',
    },
    secondaryCta: {
      label: 'Shop Cotton Pyjamas',
      labelAr: 'تسوق بيجامات القطن',
      href: '/products?category=nightwear',
    },
    productCategoryFilter: 'nightwear',
    accentColor: '#E5C2AF',
  },
  occasions: {
    id: 'occasions',
    title: 'Occasions',
    titleAr: 'مناسبات وسهرات',
    navSlug: 'occasions',
    headline: 'Moments to Remember.',
    headlineAr: 'لحظات سعيدة لا تُنسى.',
    subheadline:
      'Shimmering tulle dresses, delicate lace flower girl gowns, and refined accessories created for the memories she will cherish forever.',
    subheadlineAr:
      'فساتين تول براقة، فساتين وصيفات العروس من الدانتيل الناعم، وإكسسوارات راقية لذكريات تدوم في القلب دائماً.',
    badge: 'PARTY & OCCASIONS • CELEBRATION',
    badgeAr: 'حفلات ومناسبات • أناقة ملكية',
    videoSrc: '/videos/category-occasions.mp4',
    posterSrc: '/images/next/dresses-shop-now.jpg',
    tagPills: ['Flower Girl', 'Party Dresses', 'Shimmering Tulle', 'Celebration'],
    tagPillsAr: ['وصيفة العروس', 'فساتين حفلات', 'تول براق', 'للاحتفالات'],
    primaryCta: {
      label: 'Shop Occasionwear',
      labelAr: 'تسوق أزياء المناسبات',
      href: '/products?category=occasions',
    },
    secondaryCta: {
      label: 'Shop Party Dresses',
      labelAr: 'تسوق فساتين الحفلات',
      href: '/products?category=dresses',
    },
    productCategoryFilter: 'occasions',
    accentColor: '#C48D80',
  },
  sale: {
    id: 'sale',
    title: 'Sale',
    titleAr: 'تخفيضات وعروض خاصة',
    navSlug: 'sale',
    headline: 'Curated Archive.',
    headlineAr: 'عروض مختارة وتخفيضات مميزة.',
    subheadline:
      'Exclusive seasonal archive pieces, limited runs, and coveted classics at up to 40% off. Exceptional craft at gentle prices.',
    subheadlineAr:
      'قطع موسمية حصرية وموديلات كلاسيكية محبوبة بخصومات تصل حتى 40%. إتقان استثنائي بأسعار رقيقة.',
    badge: 'SEASONAL ARCHIVE • UP TO 40% OFF',
    badgeAr: 'تخفيضات الموسم • خصم حتى 40%',
    videoSrc: '/videos/category-sale.mp4',
    posterSrc: '/images/next/reiss.jpg',
    tagPills: ['Up To 40% Off', 'Archive Picks', 'Limited Stock', 'Final Reductions'],
    tagPillsAr: ['خصم حتى 40%', 'مختارات مميزة', 'كمية محدودة', 'تخفيضات نهائية'],
    primaryCta: {
      label: 'Shop All Sale',
      labelAr: 'تسوق كل التخفيضات',
      href: '/products?category=sale',
    },
    secondaryCta: {
      label: 'Explore Discounts',
      labelAr: 'استكشاف العروض',
      href: '/products?category=sale',
    },
    productCategoryFilter: 'sale',
    accentColor: '#C48D80',
  },
};

export function getCategoryHeroConfig(slug?: string): CategoryHeroData {
  if (!slug) return CATEGORY_HERO_CONFIGS['all'];
  const normalized = slug.toLowerCase().trim();
  return CATEGORY_HERO_CONFIGS[normalized] || CATEGORY_HERO_CONFIGS['all'];
}
