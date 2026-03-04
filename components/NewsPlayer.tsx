"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Youtube, Radio, Play, Maximize2 } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export function NewsPlayer() {
    const t = useTranslations('Desktop');
    const { settings } = useAdminStore();
    const [activeStream, setActiveStream] = useState<any>(settings?.youtubeStreams?.[0] || { id: '', label: 'N/A', name: 'NO SIGNAL' });

    if (!settings?.youtubeStreams?.length) {
        return (
            <div className="flex flex-col h-full bg-black/40 border border-[#ff0033]/20 items-center justify-center">
                <Radio size={24} className="text-[#ff0033] animate-pulse mb-2" />
                <span className="text-[10px] text-[#ff0033] uppercase tracking-widest">{t('no_signal')}</span>
            </div>
        );
    }

    const getEmbedUrl = (id: string) => {
        // If it looks like a channel ID, we might need a different handling, 
        // but for live streams usually it's direct video ID or channel live.
        // Simplified for this HUD:
        if (id.length > 15) {
            return `https://www.youtube.com/embed/live_stream?channel=${id}&autoplay=1&mute=1`;
        }
        return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    };

    return (
        <div className="flex flex-col h-full bg-black/40 border border-[#00f0ff]/20">
            {/* Stream Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#00f0ff]/20 bg-[#00f0ff]/5">
                <div className="flex items-center gap-2">
                    <Radio size={14} className="text-[#ff0033] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#00f0ff] uppercase">{t('tactical_stream')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-[#00f0ff]/40">480P // SECURE_UPLINK</span>
                    <Maximize2 size={12} className="text-[#00f0ff]/40 hover:text-[#00f0ff] cursor-pointer" />
                </div>
            </div>

            {/* Video Player Area */}
            <div className="relative flex-1 bg-black group overflow-hidden">
                <iframe
                    key={activeStream.id}
                    className="absolute inset-0 w-full h-full grayscale-[0.3] contrast-[1.2] opacity-80 group-hover:opacity-100 transition-opacity"
                    src={getEmbedUrl(activeStream.id)}
                    title={activeStream.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />

                {/* Overlay Grid/Effects */}
                <div className="absolute inset-0 pointer-events-none border-[10px] border-black/20" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                {/* Channel Label */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-[#ff0033]/40 px-3 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff0033] animate-pulse" />
                    <span className="text-[10px] font-bold font-mono tracking-widest text-white">LIVE: {activeStream.name}</span>
                </div>
            </div>

            {/* Stream Selector */}
            <div className="flex border-t border-[#00f0ff]/20 p-1 gap-1 overflow-x-auto hide-scrollbar bg-black/60">
                {settings.youtubeStreams.map((stream: any) => (
                    <button
                        key={stream.id}
                        onClick={() => setActiveStream(stream)}
                        className={`flex-1 min-w-[60px] py-1.5 px-2 flex flex-col items-center gap-1 transition-all border
                            ${activeStream.id === stream.id
                                ? 'bg-[#00f0ff]/20 border-[#ff0033] text-white'
                                : 'bg-transparent border-[#00f0ff]/10 text-[#00f0ff]/40 hover:bg-[#00f0ff]/10'}`}
                    >
                        <Youtube size={12} className={activeStream.id === stream.id ? 'text-[#ff0033]' : ''} />
                        <span className="text-[8px] font-bold tracking-tighter truncate w-full text-center">
                            {stream.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
