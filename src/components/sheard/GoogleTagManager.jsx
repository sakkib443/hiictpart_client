"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GTM_ID = "GTM-MJ8GRP2J";

// This component sends a virtual pageview on every client-side route change
// so GTM can track SPA (Single Page App) navigations correctly
export default function GTMPageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({
                event: "page_view",
                page: pathname,
            });
        }
    }, [pathname]);

    return null;
}

// Export the GTM_ID so layout.js can use it
export { GTM_ID };
