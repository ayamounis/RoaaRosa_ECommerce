export const dynamic = 'force-dynamic';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/seo.config';

export const alt = `${siteConfig.name} - ${siteConfig.slogan}`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1E1715',
          backgroundImage:
            'radial-gradient(circle at 50% 25%, rgba(196, 141, 128, 0.22) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(196, 141, 128, 0.12) 0%, transparent 50%)',
          color: '#FAF6F0',
          fontFamily: 'serif',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Subtle Decorative Border Frame */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: '1px solid rgba(196, 141, 128, 0.35)',
            borderRadius: 16,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: '1px solid rgba(196, 141, 128, 0.15)',
            borderRadius: 12,
            display: 'flex',
          }}
        />

        {/* Brand Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(196, 141, 128, 0.18)',
            border: '1px solid rgba(196, 141, 128, 0.5)',
            color: '#C48D80',
            padding: '8px 24px',
            borderRadius: '9999px',
            fontSize: '16px',
            letterSpacing: '5px',
            marginBottom: '28px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          ROAROSA • LUXURY GIRLS&apos; FASHION
        </div>

        {/* Main Monogram & Brand Name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '76px',
              fontWeight: '700',
              textAlign: 'center',
              letterSpacing: '8px',
              color: '#FAF6F0',
              lineHeight: 1.1,
            }}
          >
            ROAROSA
          </div>
          <div
            style={{
              fontSize: '26px',
              fontStyle: 'italic',
              color: '#C48D80',
              marginTop: '10px',
              letterSpacing: '2px',
            }}
          >
            Softness is not weakness
          </div>
        </div>

        {/* Subtitle / Description */}
        <div
          style={{
            fontSize: '20px',
            color: '#D1C7BD',
            textAlign: 'center',
            maxWidth: '820px',
            lineHeight: 1.5,
            marginTop: '12px',
          }}
        >
          Curated elegance, timeless fabrics, and delicate everyday grace for Baby (0-2Y), Younger (3-6Y), and Older Girls (7-14Y).
        </div>

        {/* Footer Features */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginTop: '44px',
            fontSize: '15px',
            color: '#A89B93',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex' }}>Premium Fabrics</div>
          <div style={{ display: 'flex', color: '#C48D80' }}>•</div>
          <div style={{ display: 'flex' }}>Express Delivery Egypt</div>
          <div style={{ display: 'flex', color: '#C48D80' }}>•</div>
          <div style={{ display: 'flex' }}>Cash & ValU Accepted</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
