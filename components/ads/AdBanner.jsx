"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdBanner({ 
    adId = 'default', 
    scriptKey, 
    height = 90, 
    width = 728, 
    className = '' 
}) {
    const pathname = usePathname();
    const [renderKey, setRenderKey] = useState("");

    useEffect(() => {
        // Cache Buster: Memaksa iframe re-render saat pindah rute
        setRenderKey(`${pathname}-${Date.now()}`);
    }, [pathname]);

    // Mencegah error Hydration (Server Side vs Client Side mismatch)
    if (!renderKey || !scriptKey) return null; 

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    margin: 0; 
                    padding: 0; 
                    overflow: hidden; 
                    background: transparent; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
        </head>
        <body>
            <script type="text/javascript">
                atOptions = {
                    'key' : '${scriptKey}',
                    'format' : 'iframe',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//fundingfashioned.com/${scriptKey}/invoke.js"></script>
        </body>
        </html>
    `;

    return (
        <div className={`flex justify-center items-center my-4 ${className}`} id={`ad-${adId}`}>
            <iframe
                key={renderKey}
                srcDoc={htmlContent}
                width={width}
                height={height}
                style={{ border: 'none', overflow: 'hidden', backgroundColor: 'transparent' }}
                scrolling="no"
                title={`Adsterra Banner ${scriptKey}`}
            />
        </div>
    );
}