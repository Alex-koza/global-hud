"use client";

import { useEffect } from 'react';
import { useWindowStore } from '@/lib/windows';
import DesktopOS from '@/app/[locale]/(os)/page';

export function DesktopWrapper({ country }: { country: string }) {
    const { openWindow, windows } = useWindowStore();

    useEffect(() => {
        // Open the country intel window on mount if not already open
        const windowId = `intel-${country.toLowerCase()}`;
        const formattedCountry = country.toUpperCase().replace('-', ' ');
        if (!windows.find(w => w.id === windowId)) {
            openWindow(
                windowId,
                'intel',
                `CLASSIFIED: ${formattedCountry} INTEL`,
                { x: Math.random() * 100 + 50, y: Math.random() * 100 + 50 }
            );
        }
    }, [country, openWindow, windows]);

    return <DesktopOS />;
}
