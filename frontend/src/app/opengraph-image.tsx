import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Exclusive - Premium Online Shopping Store';
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
                    backgroundColor: '#0F172A',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(219, 68, 68, 0.15) 2%, transparent 0%)',
                    backgroundSize: '50px 50px',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    padding: '60px',
                }}
            >
                {/* Brand Badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#DB4444',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '30px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        marginBottom: '30px',
                        textTransform: 'uppercase',
                    }}
                >
                    EXCLUSIVE STORE
                </div>

                {/* Main Heading */}
                <div
                    style={{
                        fontSize: '64px',
                        fontWeight: '900',
                        textAlign: 'center',
                        marginBottom: '20px',
                        background: 'linear-gradient(to right, #FFFFFF, #94A3B8)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: 1.2,
                    }}
                >
                    Premium Online Shopping
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: '28px',
                        color: '#94A3B8',
                        textAlign: 'center',
                        maxWidth: '800px',
                        lineHeight: 1.4,
                    }}
                >
                    Discover exclusive deals on Electronics, Fashion, Home & Accessories with fast global shipping.
                </div>

                {/* Footer Tag */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '50px',
                        fontSize: '20px',
                        color: '#DB4444',
                        fontWeight: '600',
                    }}
                >
                    ecommerce-exclusive.vercel.app
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
