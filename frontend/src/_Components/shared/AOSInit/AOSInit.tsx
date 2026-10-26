'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 40,
      easing: 'ease-out',
      mirror: false,
      delay: 0,
    });
  }, []);

  useEffect(() => {
    // Re-calculate element positions and trigger AOS animations on route navigation
    const timeout = setTimeout(() => {
      AOS.refresh();
    }, 150);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
