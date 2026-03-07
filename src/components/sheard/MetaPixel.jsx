"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const FB_PIXEL_ID = "1224264679775845";

// Pageview Tracker functions (Temporarily Disabled)
export const pageview = () => {
    // if (typeof window !== "undefined" && window.fbq) {
    //     window.fbq("track", "PageView");
    // }
};

// Custom Event Tracker function (Temporarily Disabled)
export const fbEvent = (name, options = {}) => {
    // if (typeof window !== "undefined" && window.fbq) {
    //     window.fbq("track", name, options);
    // }
};

export default function MetaPixel() {
    /* 
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Fire the pageview event on route change
        pageview();
    }, [pathname, searchParams]);
    */

    return null; /*
        <>
            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    alt="facebook pixel"
                    src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                />
            </noscript>
        </>
    );
    */
}
