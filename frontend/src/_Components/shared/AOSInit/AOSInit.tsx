'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 50,
      easing: 'ease-out-cubic',
      mirror: true,
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
