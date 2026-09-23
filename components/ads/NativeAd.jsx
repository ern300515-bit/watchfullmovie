//components/ads/NativeAd.jsx

"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://fundingfashioned.com/55765701bc38e419b963983dfa593032/invoke.js";

const CONTAINER_ID =
  "container-55765701bc38e419b963983dfa593032";

export default function NativeAd({ className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Hindari inject script berkali-kali
    if (container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    // Container wajib menggunakan ID dari provider
    container.id = CONTAINER_ID;

    const script = document.createElement("script");

    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = SCRIPT_SRC;

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
        container.dataset.loaded = "false";
      }
    };
  }, []);

  return (
    <div
      className={`w-full flex justify-center my-6 ${className}`}
    >
      <div
        ref={containerRef}
        id={CONTAINER_ID}
        className="w-full flex justify-center items-center overflow-hidden"
      />
    </div>
  );
}