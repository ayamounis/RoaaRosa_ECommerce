import type { Viewport } from 'next';
import { siteConfig } from '@/config/seo.config';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.backgroundColor },
    { media: '(prefers-color-scheme: dark)', color: '#1E1715' },
  ],
  colorScheme: 'light dark',
};
