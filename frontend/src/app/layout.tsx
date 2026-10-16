import Footer from "@/_Components/layout/Footer/Footer";
import TopHeader from "@/_Components/layout/TopHeader/TopHeader";
import { Toaster } from "@/_Components/ui/sonner";
import MainProvider from "@/Provider/MainProvider";
import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import Navbar from "../_Components/layout/Navbar/Navbar";
import "./globals.css";
import BottomFilter from "@/_Components/shared/BottomFilter/BottomFilter";
import { ThemeProvider } from "@/_Components/theme-provider";

const poppins = Poppins({ subsets: ['latin'], weight: ["100", "200", '300', '400', '500', '600', '700', '800', '900'], variable: '--font-poppins' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecommerce-exclusive.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Exclusive - Premium Online Shopping Store",
    template: "%s | Exclusive",
  },
  description: "Discover top deals on electronics, fashion, home appliances, and accessories with fast shipping and secure payments on Exclusive Store.",
  keywords: [
    "E-commerce",
    "Online Shopping",
    "Exclusive Deals",
    "Electronics",
    "Fashion",
    "Smartphones",
    "Laptops",
    "Accessories"
  ],
  authors: [{ name: "Fares Elabasery", url: siteUrl }],
  creator: "Exclusive Team",
  publisher: "Exclusive Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Exclusive - Premium Online Shopping Store",
    description: "Shop top-quality electronics, fashion, and home goods with best deals and fast shipping on Exclusive.",
    siteName: "Exclusive Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exclusive - Premium Online Shopping Store",
    description: "Shop top-quality electronics, fashion, and home goods with best deals and fast shipping on Exclusive.",
    creator: "@ExclusiveStore",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "name": "Exclusive",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": `${siteUrl}/logo.png`,
    "description": "Discover top deals on electronics, fashion, home appliances, and accessories with fast shipping and secure payments on Exclusive Store.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem ={false}
          
        >

          <MainProvider>
            <TopHeader />
            <Navbar />
            <div className="container">
              {children}
            </div>
            <Toaster />
            <Footer />
            <BottomFilter />
          </MainProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
