"use client";

import { useAdminStore } from '@/lib/adminStore';

export function AdBanner() {
    const { settings } = useAdminStore();

    if (!settings.adEnabled || !settings.adHtmlCode) return null;

    return (
        <div className="w-full h-24 shrink-0 bg-[#05080f] border-t-2 border-b-2 border-[#00f0ff]/50 relative overflow-hidden flex items-center justify-center pointer-events-auto z-40">
            {/* Animated Glow and Scanlines */}
            <div className="absolute inset-0 pointer-events-none shadow-[0_0_30px_rgba(0,240,255,0.2)_inset]" />
            <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#00f0ff]/80 animate-pulse" />
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#00f0ff]/80 animate-pulse" />

            {/* Render Ad Content */}
            <div
                className="w-full text-center flex items-center justify-center relative z-10 p-2"
                dangerouslySetInnerHTML={{ __html: settings.adHtmlCode }}
            />
        </div>
    );
}
