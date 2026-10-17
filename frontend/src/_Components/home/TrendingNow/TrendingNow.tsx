import Image from "next/image";
import Link from "next/link";

interface TrendingItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  alt: string;
}

const TRENDING_ITEMS: TrendingItem[] = [
  {
    id: "sets",
    title: "SETS & OUTFITS",
    subtitle: "SHOP NOW",
    href: "/products?category=sets",
    image: "/images/next/sets-and-outfits-shop-now.jpg",
    alt: "Young girl smiling in mint rabbit hoodie and checkered pants set",
  },
  {
    id: "knitwear",
    title: "COSY KNITWEAR",
    subtitle: "SHOP NOW",
    href: "/products?category=knitwear",
    image: "/images/next/jumpers-and-cardigans-shop-now.jpg",
    alt: "Two young girls in cozy floral knitwear and cardigans",
  },
  {
    id: "denim",
    title: "DENIM & CASUALS",
    subtitle: "SHOP NOW",
    href: "/products?category=all",
    image: "/images/next/denim-shop-now.jpg",
    alt: "Young girl in striped collar knit and wide-leg denim",
  },
];

export default function TrendingNow() {
  return (
    <section className="w-full bg-[#F8F8F8] py-8 md:py-12 border-y border-neutral-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-4 md:mb-6" data-aos="fade-up">
          <h2 className="text-xl md:text-2xl lg:text-[26px] font-black text-[#222222] tracking-tight uppercase font-sans">
            TRENDING NOW
          </h2>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {TRENDING_ITEMS.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative block aspect-[4/5] w-full overflow-hidden bg-neutral-200"
              data-aos="fade-up"
              data-aos-delay={index * 120}
            >
              {/* Product / Editorial Image */}
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index === 0}
              />

              {/* Bottom Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Editorial Captions Matching Next Direct */}
              <div className="absolute bottom-5 left-5 right-5 text-white z-10 pointer-events-none">
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide leading-tight drop-shadow-sm">
                  {item.title}
                </h3>
                <span className="inline-block mt-1.5 text-xs font-semibold tracking-wider uppercase underline underline-offset-4 text-white/95 group-hover:text-white transition-all">
                  {item.subtitle}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
