"use client";

import { handleAdsterraAIClick, getAdsterraAIStats } from '../utils/adsterra-ai';
import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation'; // Opsi jika url adalah halaman internal Next.js

export default function AdLinkAI({ 
    url, 
    children, 
    className = '',
    title: customTitle = '',
    debug = false // Tambahan: set ke true hanya saat Anda ingin melihat sisa klik
}) {
    const [stats, setStats] = useState(null);
    const linkRef = useRef(null);
    
    // Perbarui status HANYA saat komponen pertama kali dimuat di layar (Mount)
    // Tidak perlu interval karena stats hanya berubah saat terjadi klik.
    useEffect(() => {
        setStats(getAdsterraAIStats());
    }, []);

    const handleClick = (e) => {
        // 1. Cegah pindah halaman langsung
        e.preventDefault(); 
        
        // ✅ 2. MAGIC TRICK: Cegah klik bocor ke background (Membungkam script Popunder)
        e.stopPropagation();
        if (e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation();
        }

        if (!url) {
            console.warn('AdLinkAI: URL is undefined');
            return;
        }

        try {
            const result = handleAdsterraAIClick(e, url);
            
            if (debug) setStats(getAdsterraAIStats());
            
            if (result.adShown && result.adUrl) {
                window.open(result.adUrl, '_blank', 'noopener,noreferrer');
                setTimeout(() => { window.location.href = url; }, 200);
            } else {
                window.location.href = url;
            }
        } catch (err) {
            console.error("AdLink error", err);
            window.location.href = url;
        }
    };

    // Ambil data untuk mode debug
    const clicksNeeded = stats?.optimizer?.clicksToNextAd ?? 0;
    
    // Tooltip hanya akan muncul jika Anda memasukkan prop `title` secara manual, 
    // ATAU jika mode `debug={true}` diaktifkan. Pengguna biasa tidak akan melihat hitungan iklan.
    const displayTitle = customTitle || (debug ? (clicksNeeded === 0 ? "Ad Ready" : `${clicksNeeded} clicks to ad`) : "");

    return (
        <a
            ref={linkRef}
            href={url}
            onClick={handleClick}
            className={`relative inline-flex items-center gap-2 cursor-pointer ${className}`}
            title={displayTitle}
        >
            {children}
        </a>
    );
}