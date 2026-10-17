export interface CategoryHeroCta {
  label: string;
  href: string;
}

export interface CategoryHeroData {
  id: string;
  title: string;
  navSlug: string;
  headline: string;
  subheadline: string;
  badge: string;
  videoSrc: string;
  posterSrc: string;
  tagPills: string[];
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
    navSlug: 'all',
    headline: 'Softness is not weakness.',
    subheadline:
      'Discover the new season collection of handcrafted silhouettes, pure organic cottons, and timeless charm for girls of every age.',
    badge: "THE GIRLS' NEW SEASON COLLECTION • IN MOTION",
    videoSrc: '/videos/hero-campaign.mp4',
    posterSrc: '/images/next/baker-by-ted-baker.jpg',
    tagPills: ['New Season', 'Organic Cotton', 'Girls Edit', 'Ages 0-16'],
    primaryCta: {
      label: 'Shop Younger Girls (3-7 Yrs)',
      href: '/products?age=younger',
    },
    secondaryCta: {
      label: 'Shop Older Girls (8-16 Yrs)',
      href: '/products?age=older',
    },
    tertiaryCta: {
      label: 'Explore Dresses',
      href: '/products?category=dresses',
    },
    productCategoryFilter: 'all',
    accentColor: '#C48D80',
  },
  'new-in': {
    id: 'new-in',
    title: 'New In',
    navSlug: 'new-in',
    headline: 'Fresh In Bloom.',
    subheadline:
      'Spring/Summer drop just arrived. Lightweight floral prints, pastel palettes, and airy textures made for sunlit adventures.',
    badge: 'SPRING / SUMMER DROP • JUST ARRIVED',
    videoSrc: '/videos/category-newin.mp4',
    posterSrc: '/images/next/new-arrivals.jpg',
    tagPills: ['Just Dropped', 'Spring/Summer', 'Pastel Florals', 'Trending'],
    primaryCta: {
      label: 'Shop New Arrivals',
      href: '/products?sort=-createdAt',
    },
    secondaryCta: {
      label: 'Explore Dresses',
      href: '/products?category=dresses',
    },
    productCategoryFilter: 'new-in',
    accentColor: '#C48D80',
  },
  baby: {
    id: 'baby',
    title: 'Baby (0-2 Yrs)',
    navSlug: 'baby',
    headline: 'Delicate Beginnings.',
    subheadline:
      'Ultra-soft fabrics, hypoallergenic seams, and gentle finishes designed with utmost care for precious newborn and infant skin.',
    badge: '0–2 YEARS • SENSITIVE SKIN SAFE',
    videoSrc: '/videos/age-baby.mp4',
    posterSrc: '/images/next/jojo-maman-b-b.jpg',
    tagPills: ['0-24 Months', '100% Organic', 'Sensory Safe', 'Gift Sets'],
    primaryCta: {
      label: 'Shop Baby (0-2 Yrs)',
      href: '/products?age=baby',
    },
    secondaryCta: {
      label: 'Shop Baby Rompers',
      href: '/products?category=sets&age=baby',
    },
    productCategoryFilter: 'baby',
    accentColor: '#E5C2AF',
  },
  younger: {
    id: 'younger',
    title: 'Younger Girls (3-7 Yrs)',
    navSlug: 'younger',
    headline: 'Little Explorers.',
    subheadline:
      'Playful silhouettes, comfortable twirl dresses, and durable stretch fabrics built for everyday discovery and joy.',
    badge: '3–7 YEARS • PLAYFUL SILHOUETTES',
    videoSrc: '/videos/age-younger.mp4',
    posterSrc: '/images/next/dresses-shop-now.jpg',
    tagPills: ['Ages 3-7', 'Twirl Ready', 'Durable Weaves', 'Everyday Play'],
    primaryCta: {
      label: 'Shop Younger Girls (3-7 Yrs)',
      href: '/products?age=younger',
    },
    secondaryCta: {
      label: 'View Dresses',
      href: '/products?category=dresses&age=younger',
    },
    productCategoryFilter: 'younger',
    accentColor: '#C48D80',
  },
  older: {
    id: 'older',
    title: 'Older Girls (8-16 Yrs)',
    navSlug: 'older',
    headline: 'Confident Everyday Chic.',
    subheadline:
      'Modern heritage tailoring, structured trench coats, relaxed knitwear, and effortless weekend co-ords tailored for older girls.',
    badge: '8–16 YEARS • MODERN HERITAGE',
    videoSrc: '/videos/age-older.mp4',
    posterSrc: '/images/next/baker-by-ted-baker.jpg',
    tagPills: ['Ages 8-16', 'Modern Heritage', 'Smart Casual', 'Weekend Co-ords'],
    primaryCta: {
      label: 'Shop Older Girls (8-16 Yrs)',
      href: '/products?age=older',
    },
    secondaryCta: {
      label: 'Shop Coats & Jackets',
      href: '/products?category=coats&age=older',
    },
    productCategoryFilter: 'older',
    accentColor: '#988172',
  },
  dresses: {
    id: 'dresses',
    title: 'Dresses',
    navSlug: 'dresses',
    headline: 'The Twirl Edit.',
    subheadline:
      'Handcrafted ruffled tiers, delicate broderie anglaise, and fairytale tulle silhouettes for birthdays, celebrations, and sun-soaked days.',
    badge: 'THE DRESS EDIT • HANDCRAFTED',
    videoSrc: '/videos/category-dresses.mp4',
    posterSrc: '/images/next/dresses-shop-now.jpg',
    tagPills: ['Handcrafted', 'Broderie Anglaise', 'Tiered Tulle', 'Occasion Ready'],
    primaryCta: {
      label: 'Explore All Dresses',
      href: '/products?category=dresses',
    },
    secondaryCta: {
      label: 'Shop Occasionwear',
      href: '/products?category=occasions',
    },
    productCategoryFilter: 'dresses',
    accentColor: '#C48D80',
  },
  tops: {
    id: 'tops',
    title: 'Tops & T-Shirts',
    navSlug: 'tops',
    headline: 'Pure Cotton Staples.',
    subheadline:
      'Gentle on skin, breathable, and finished with delicate flutter sleeves, lace trims, and playful hand-drawn botanical illustrations.',
    badge: 'ORGANIC COTTON • DELICATE RUFFLES',
    videoSrc: '/videos/category-tops.mp4',
    posterSrc: '/images/next/tops-and-t-shirts-shop-now.jpg',
    tagPills: ['Breathable Jersey', 'Flutter Sleeves', 'Botanical Prints', 'Multipacks'],
    primaryCta: {
      label: 'Shop Tops & Tees',
      href: '/products?category=tops',
    },
    secondaryCta: {
      label: 'Explore Knitwear',
      href: '/products?category=knitwear',
    },
    productCategoryFilter: 'tops',
    accentColor: '#E5C2AF',
  },
  knitwear: {
    id: 'knitwear',
    title: 'Knitwear',
    navSlug: 'knitwear',
    headline: 'Warm Embrace.',
    subheadline:
      'Textured cable stitches, chunky ribbed cardigans, and featherlight pointelle knits spun from ethically sourced wool and cotton blends.',
    badge: 'COZY KNITWEAR • TEXTURED WEAVES',
    videoSrc: '/videos/category-knitwear.mp4',
    posterSrc: '/images/next/jumpers-and-cardigans-shop-now.jpg',
    tagPills: ['Cable Knit', 'Pointelle Cardigans', 'Chunky Knits', 'Soft Wool Blend'],
    primaryCta: {
      label: 'Explore Knitwear',
      href: '/products?category=knitwear',
    },
    secondaryCta: {
      label: 'Shop Cardigans',
      href: '/products?category=knitwear',
    },
    productCategoryFilter: 'knitwear',
    accentColor: '#988172',
  },
  coats: {
    id: 'coats',
    title: 'Coats & Jackets',
    navSlug: 'coats',
    headline: 'Shielded in Softness.',
    subheadline:
      'Water-resistant quilted parkas, plush faux fur linings, and tailored wool blend jackets crafted to brave the elements in grace.',
    badge: 'OUTERWEAR • TAILORED WARMTH',
    videoSrc: '/videos/category-coats.mp4',
    posterSrc: '/images/next/baker-by-ted-baker.jpg',
    tagPills: ['Water Resistant', 'Faux Fur Lining', 'Tailored Trench', 'Quilted Parkas'],
    primaryCta: {
      label: 'Shop Coats & Jackets',
      href: '/products?category=coats',
    },
    secondaryCta: {
      label: 'Shop Winter Warmth',
      href: '/products?category=coats',
    },
    productCategoryFilter: 'coats',
    accentColor: '#2B2320',
  },
  sets: {
    id: 'sets',
    title: 'Sets & Outfits',
    navSlug: 'sets',
    headline: 'Effortless Harmony.',
    subheadline:
      'Curated 2-piece and 3-piece sets taking the guesswork out of morning dressing. Coordinated tops, bottoms, and matching hair scrunchies.',
    badge: 'CO-ORDS & SETS • EFFORTLESS',
    videoSrc: '/videos/category-sets.mp4',
    posterSrc: '/images/next/sweat-tops-and-jogger-sets.jpg',
    tagPills: ['Matching Sets', '2-Piece & 3-Piece', 'Jogger Sets', 'Easy Styling'],
    primaryCta: {
      label: 'Shop Sets & Outfits',
      href: '/products?category=sets',
    },
    secondaryCta: {
      label: 'Shop Jogger Sets',
      href: '/products?category=sets',
    },
    productCategoryFilter: 'sets',
    accentColor: '#C48D80',
  },
  shoes: {
    id: 'shoes',
    title: 'Shoes & Boots',
    navSlug: 'shoes',
    headline: 'Gentle Steps, Bold Strides.',
    subheadline:
      'Flexible leather soles, cushioned insoles, and supportive arches for little feet. From party ballet flats to sporty weekend sneakers.',
    badge: 'FOOTWEAR • FIRST STRIDES',
    videoSrc: '/videos/category-shoes.mp4',
    posterSrc: '/images/next/sneakers.jpg',
    tagPills: ['Genuine Leather', 'Cushioned Insoles', 'Ballet Flats', 'Sporty Sneakers'],
    primaryCta: {
      label: 'Shop Shoes & Boots',
      href: '/products?category=shoes',
    },
    secondaryCta: {
      label: 'Shop Sneakers',
      href: '/products?category=shoes',
    },
    productCategoryFilter: 'shoes',
    accentColor: '#988172',
  },
  nightwear: {
    id: 'nightwear',
    title: 'Nightwear',
    navSlug: 'nightwear',
    headline: 'Sweetest Slumber.',
    subheadline:
      'Pure brushed organic cotton pyjamas, silky satin lounge sets, and cozy dressing gowns designed for dreamy, undisturbed sleep.',
    badge: 'NIGHTWEAR • 100% ORGANIC COTTON',
    videoSrc: '/videos/category-nightwear.mp4',
    posterSrc: '/images/next/nightwear-shop-now.jpg',
    tagPills: ['100% Organic Cotton', 'Tagless Comfort', 'Lounge Sets', 'Pyjama Multipacks'],
    primaryCta: {
      label: 'Shop Nightwear',
      href: '/products?category=nightwear',
    },
    secondaryCta: {
      label: 'Shop Cotton Pyjamas',
      href: '/products?category=nightwear',
    },
    productCategoryFilter: 'nightwear',
    accentColor: '#E5C2AF',
  },
  occasions: {
    id: 'occasions',
    title: 'Occasions',
    navSlug: 'occasions',
    headline: 'Moments to Remember.',
    subheadline:
      'Shimmering tulle dresses, delicate lace flower girl gowns, and refined accessories created for the memories she will cherish forever.',
    badge: 'PARTY & OCCASIONS • CELEBRATION',
    videoSrc: '/videos/category-occasions.mp4',
    posterSrc: '/images/next/dresses-shop-now.jpg',
    tagPills: ['Flower Girl', 'Party Dresses', 'Shimmering Tulle', 'Celebration'],
    primaryCta: {
      label: 'Shop Occasionwear',
      href: '/products?category=occasions',
    },
    secondaryCta: {
      label: 'Shop Party Dresses',
      href: '/products?category=dresses',
    },
    productCategoryFilter: 'occasions',
    accentColor: '#C48D80',
  },
  sale: {
    id: 'sale',
    title: 'Sale',
    navSlug: 'sale',
    headline: 'Curated Archive.',
    subheadline:
      'Exclusive seasonal archive pieces, limited runs, and coveted classics at up to 40% off. Exceptional craft at gentle prices.',
    badge: 'SEASONAL ARCHIVE • UP TO 40% OFF',
    videoSrc: '/videos/category-sale.mp4',
    posterSrc: '/images/next/reiss.jpg',
    tagPills: ['Up To 40% Off', 'Archive Picks', 'Limited Stock', 'Final Reductions'],
    primaryCta: {
      label: 'Shop All Sale',
      href: '/products?category=sale',
    },
    secondaryCta: {
      label: 'Explore Discounts',
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
