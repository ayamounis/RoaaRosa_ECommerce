import Footer from "@/_Components/layout/Footer/Footer";
import TopHeader from "@/_Components/layout/TopHeader/TopHeader";
import { Toaster } from "@/_Components/ui/sonner";
import MainProvider from "@/Provider/MainProvider";
import type { Metadata } from "next";
import { Suspense } from 'react';
import { Playfair_Display, Poppins } from 'next/font/google';
import Navbar from "../_Components/layout/Navbar/Navbar";
import "./globals.css";
import BottomFilter from "@/_Components/shared/BottomFilter/BottomFilter";
import { ThemeProvider } from "@/_Components/theme-provider";
import AOSInit from "@/_Components/shared/AOSInit/AOSInit";
import ScrollToTop from "@/_Components/shared/ScrollToTop/ScrollToTop";
import CustomerChatbot from "@/_Components/chatbot/CustomerChatbot";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["100", "200", '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap'
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roarosa-girls.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ROAROSA | Luxury Girls' Clothing & Everyday Grace",
    template: "%s | ROAROSA",
  },
  description: "Discover ROAROSA — luxury girls' fashion inspired by softness and timeless elegance. Explore baby, younger, and older girls' dresses, coats, knitwear, and occasionwear.",
  keywords: [
    "ROAROSA",
    "Girls Clothing",
    "Girls Fashion",
    "Baby Girls Clothing",
    "Younger Girls Fashion",
    "Older Girls Clothing",
    "Occasionwear Girls",
    "Next Direct Girls",
    "Egypt Girls Clothes"
  ],
  authors: [{ name: "ROAROSA Design Team", url: siteUrl }],
  creator: "ROAROSA",
  publisher: "ROAROSA",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "ROAROSA | Luxury Girls' Clothing & Everyday Grace",
    description: "Softness is not weakness. Shop premium girls' collections with express delivery across Egypt.",
    siteName: "ROAROSA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROAROSA | Luxury Girls' Clothing & Everyday Grace",
    description: "Softness is not weakness. Shop premium girls' collections with express delivery across Egypt.",
    creator: "@RoarosaBrand",
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
    "name": "ROAROSA",
    "slogan": "Softness is not weakness",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": `${siteUrl}/logo.png`,
    "description": "Discover ROAROSA luxury girls' fashion with timeless fabrics and delicate elegance.",
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
        className={`${poppins.variable} ${playfair.variable} bg-background text-foreground antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AOSInit />
          <MainProvider>
            <TopHeader />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster />
            <Footer />
            <ScrollToTop />
            <CustomerChatbot />
            <Suspense fallback={null}>
              <BottomFilter />
            </Suspense>
          </MainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
