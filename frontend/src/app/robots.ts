import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo.config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/products',
        '/products/*',
        '/productDetails/*',
        '/categories',
        '/categories/*',
      ],
      disallow: [
        '/profile',
        '/profile/*',
        '/cart',
        '/checkout',
        '/checkout/*',
        '/allorders',
        '/allorders/*',
        '/resetPassword',
        '/forgetPassword',
        '/otpValidation',
        '/api/*',
        '/_next/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
