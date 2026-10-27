import Footer from "@/_Components/layout/Footer/Footer";
import TopHeader from "@/_Components/layout/TopHeader/TopHeader";
import { Toaster } from "@/_Components/ui/sonner";
import MainProvider from "@/Provider/MainProvider";
import type { Metadata } from "next";
import { Suspense } from 'react';
import { Playfair_Display, Poppins, IBM_Plex_Sans_Arabic } from 'next/font/google';
import Navbar from "../_Components/layout/Navbar/Navbar";
import "./globals.css";
import BottomFilter from "@/_Components/shared/BottomFilter/BottomFilter";
import { ThemeProvider } from "@/_Components/theme-provider";
import AOSInit from "@/_Components/shared/AOSInit/AOSInit";
import ScrollToTop from "@/_Components/shared/ScrollToTop/ScrollToTop";
import WebMcpBridge from "@/_Components/shared/WebMcpBridge";
import CustomerChatbot from "@/_Components/chatbot/CustomerChatbot";
import { constructMetadata, generateStoreJsonLd } from "@/config/seo.config";

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

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateStoreJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} ${ibmPlexArabic.variable} bg-background text-foreground antialiased overflow-x-hidden`}
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
            <WebMcpBridge />
            <Suspense fallback={null}>
              <BottomFilter />
            </Suspense>
          </MainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
