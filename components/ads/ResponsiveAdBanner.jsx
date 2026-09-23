"use client";

import { useState, useEffect } from 'react';
import AdBanner from './AdBanner';

export default function ResponsiveAdBanner({ 
  adId, 
  scriptKey, 
  className = '',
  desktopHeight = 90,
  desktopWidth = 728,
  mobileHeight = 50,
  mobileWidth = 320,
  hideOnMobile = false,
}) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Mencegah mismatch saat SSR (Server-Side Rendering)
  if (!isClient) {
    return <div style={{ height: `${desktopHeight}px` }} className={className} />;
  }

  // Jika hideOnMobile bernilai true dan sedang diakses lewat HP
  if (hideOnMobile && isMobile) {
    return null;
  }

  return (
    <AdBanner
      adId={adId}
      scriptKey={scriptKey}
      height={isMobile ? mobileHeight : desktopHeight}
      width={isMobile ? mobileWidth : desktopWidth}
      className={className}
    />
  );
}