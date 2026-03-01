"use client";

import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { useWindowStore } from '@/lib/windows';

export function LiveNewsFeed() {
    const { selectedCountry } = useWindowStore();
    const [news, setNews] = useState<string[]>([]);

    useEffect(() => {
        // In a real implementation, pull from TheNewsAPI or NewsData.io.
        if (selectedCountry) {
            setNews([
                `[REGIONAL INTEL] Increased diplomatic chatter detected in ${selectedCountry}.`,
                `[REGIONAL INTEL] Border checkpoints reinforced in ${selectedCountry} sector.`,
                `[GLOBAL] Asian markets close 2% lower amidst tech sector volatility.`,
                `[GLOBAL] Cyberspace command flags new widespread phishing campaign targeting IoT.`,
                `[GLOBAL] UN Security Council convenes for emergency session on energy routes.`
            ]);
        } else {
            setNews([
                `[GLOBAL] Asian markets close 2% lower amidst tech sector volatility.`,
                `[GLOBAL] Cyberspace command flags new widespread phishing campaign targeting IoT.`,
                `[GLOBAL] UN Security Council convenes for emergency session on energy routes.`,
                `[GLOBAL] Unidentified seismic activity reported near fault line Alpha.`,
                `[GLOBAL] Cryptographic hash collision detected in legacy banking systems.`
            ]);
        }
    }, [selectedCountry]);

    return (
        <div className="w-full h-10 border-b border-[#00f0ff]/30 bg-[#00f0ff]/10 backdrop-blur-md flex items-center shrink-0 z-40 relative px-4">
            <div className="flex items-center gap-2 text-[#ff0033] font-bold text-xs uppercase tracking-widest shrink-0 border-r border-[#ff0033]/30 pr-4 mr-4 animate-pulse">
                <Radio size={14} /> LIVE FEED
            </div>

            <div className="flex-1 overflow-hidden relative h-full">
                <div className="absolute inset-0 flex items-center whitespace-nowrap animate-marquee">
                    {news.map((item, i) => (
                        <span key={i} className="text-[#00f0ff] text-xs font-mono uppercase tracking-widest mr-16">
                            {item}
                        </span>
                    ))}
                    {/* Duplicate for seamless infinite scrolling */}
                    {news.map((item, i) => (
                        <span key={`dup-${i}`} className="text-[#00f0ff] text-xs font-mono uppercase tracking-widest mr-16">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                    width: max-content;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
