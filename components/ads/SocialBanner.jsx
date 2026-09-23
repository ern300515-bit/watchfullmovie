"use client";

import { useEffect } from "react";

export default function SocialBanner({ scriptSrc }) {
  useEffect(() => {
    if (!scriptSrc || typeof window === "undefined") return;

    const width = window.innerWidth;
    const isMobile = width < 768;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Mobile portrait: disabled.
    // Mobile landscape, tablet, and desktop: enabled.
    if (isMobile && isPortrait) {
      return;
    }

    // Prevent duplicate injection.
    const selector = 'script[data-animefilm-social-banner="true"]';

    if (document.querySelector(selector)) {
      return;
    }

    // Give Next.js time to finish the initial render/navigation
    // before loading the third-party social banner.
    const timer = window.setTimeout(() => {
      if (document.querySelector(selector)) {
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = scriptSrc;
      script.async = true;
      script.setAttribute("data-animefilm-social-banner", "true");

      document.body.appendChild(script);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [scriptSrc]);

  return null;
}
