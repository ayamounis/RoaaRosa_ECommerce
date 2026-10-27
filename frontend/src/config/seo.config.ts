import type { Metadata } from "next";

export const siteConfig = {
  name: "ROAROSA",
  legalName: "ROAROSA Luxury Girls' Fashion",
  shortName: "ROAROSA",
  slogan: "Softness is not weakness / النعومة ليست ضعفاً",
  defaultTitle: "ROAROSA | Luxury Girls' Clothing & Everyday Grace",
  titleTemplate: "%s | ROAROSA",
  description:
    "Discover ROAROSA — luxury girls' fashion inspired by softness and timeless elegance. Explore curated collections for baby, younger, and older girls including dresses, coats, knitwear, and occasionwear.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://roarosa-girls.vercel.app",
  ogImage: "/opengraph-image",
  themeColor: "#C48D80",
  backgroundColor: "#FAF6F0",
  locale: "en_US",
  alternateLocale: "ar_EG",
  twitterHandle: "@RoarosaBrand",
  currency: "EGP",
  acceptedCurrencies: ["EGP", "USD", "SAR", "AED"],
  keywords: [
    "ROAROSA",
    "RoaaRosa",
    "Girls Clothing",
    "Luxury Girls Fashion",
    "Baby Girls Clothing",
    "Younger Girls Fashion",
    "Older Girls Clothing",
    "Occasionwear Girls",
    "Girls Dresses Egypt",
    "Luxury Kidswear",
    "ملابس بنات",
    "فساتين بنات فاخرة",
    "ملابس أطفال مصر",
  ],
  authors: [
    {
      name: "ROAROSA Design Team",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://roarosa-girls.vercel.app",
    },
  ],
  creator: "ROAROSA",
  publisher: "ROAROSA",
  category: "fashion",
} as const;

/**
 * Standardized favicon & icon configuration for Next.js App Router metadata
 */
export const defaultIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/icon.svg", type: "image/svg+xml" },
    { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  shortcut: "/favicon.ico",
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  ],
};

/**
 * Helper to generate page-specific metadata with consistent defaults
 */
export function constructMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  canonicalUrl,
  noIndex = false,
  keywords = siteConfig.keywords,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: readonly string[] | string[];
} = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
  const pageDescription = description || siteConfig.description;
  const fullCanonicalUrl = canonicalUrl
    ? `${siteConfig.url}${canonicalUrl.startsWith("/") ? canonicalUrl : `/${canonicalUrl}`}`
    : siteConfig.url;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: pageTitle,
      template: siteConfig.titleTemplate,
    },
    description: pageDescription,
    keywords: Array.from(keywords),
    authors: [...siteConfig.authors],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    category: siteConfig.category,
    icons: defaultIcons,
    alternates: {
      canonical: fullCanonicalUrl,
      languages: {
        "en-US": fullCanonicalUrl,
        "ar-EG": `${fullCanonicalUrl}?lang=ar`,
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      alternateLocale: [siteConfig.alternateLocale],
      url: fullCanonicalUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${pageTitle}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      creator: siteConfig.twitterHandle,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generates Schema.org JSON-LD for the OnlineStore and Organization
 */
export function generateStoreJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
          width: "1024",
          height: "1024",
        },
        image: `${siteConfig.url}/logo.png`,
        slogan: siteConfig.slogan,
        sameAs: [
          "https://instagram.com/roarosa",
          "https://facebook.com/roarosa",
          "https://tiktok.com/@roarosa",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "OnlineStore",
        "@id": `${siteConfig.url}/#store`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        parentOrganization: {
          "@id": `${siteConfig.url}/#organization`,
        },
        priceRange: "$$",
        currenciesAccepted: siteConfig.acceptedCurrencies.join(", "),
        paymentAccepted: "Credit Card, Cash on Delivery, ValU, Fawry",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Girls Fashion Collection",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Baby Girls (0-2 Y)",
            },
            {
              "@type": "OfferCatalog",
              name: "Younger Girls (3-6 Y)",
            },
            {
              "@type": "OfferCatalog",
              name: "Older Girls (7-14 Y)",
            },
          ],
        },
      },
    ],
  };
}

/**
 * Generates Schema.org JSON-LD for a single Product
 */
export function generateProductJsonLd(product: {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageCover?: string;
  images?: string[];
  category?: { name: string };
  ratingsAverage?: number;
  ratingsQuantity?: number;
  quantity?: number;
}) {
  const productUrl = `${siteConfig.url}/productDetails/${product.id}`;
  const images = [
    ...(product.imageCover ? [product.imageCover] : []),
    ...(product.images || []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.title,
    description: product.description || `${product.title} - ROAROSA Luxury Girls Collection`,
    image: images.length > 0 ? images : [`${siteConfig.url}/logo.png`],
    category: product.category?.name || "Girls Fashion",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: siteConfig.currency,
      price: product.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability:
        (product.quantity ?? 1) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    ...(product.ratingsAverage
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingsAverage,
            reviewCount: product.ratingsQuantity || 1,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
