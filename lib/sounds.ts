import { Howl, Howler } from 'howler';

const SOUNDS = {
    hover: '/sounds/hover.mp3',
    open: '/sounds/open.mp3',
    close: '/sounds/close.mp3',
    error: '/sounds/error.mp3',
    scan: '/sounds/scan.mp3',
};

const howls: Record<string, Howl> = {};

if (typeof window !== 'undefined') {
    Object.entries(SOUNDS).forEach(([key, src]) => {
        howls[key] = new Howl({
            src: [src],
            volume: 0.3,
            onloaderror: () => {
                // Fallback or warning if sounds not placed in public folder yet
            }
        });
    });
}

export const playSound = (type: keyof typeof SOUNDS | 'hover' | 'open' | 'close' | 'error' | 'scan') => {
    if (typeof window !== 'undefined' && howls[type]) {
        howls[type].play();
    }
};
