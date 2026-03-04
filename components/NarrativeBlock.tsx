"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Brain, Shield, ExternalLink } from 'lucide-react';
import { SpyWindow } from './SpyWindow';
import { NarrativeAnalysis } from './NarrativeAnalysis';

export function NarrativeBlock() {
    const t = useTranslations('Narrative');
    const locale = useLocale();
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/narrative', {
                    method: 'POST',
                    body: JSON.stringify({ newsData: {}, locale })
                });
                const analysis = await res.json();
                setData(analysis);
            } catch (e) {
                console.error("Narrative Fetch Error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 600000);
        return () => clearInterval(interval);
    }, [locale]);

    return (
        <>
            <div
                onClick={() => setIsWindowOpen(true)}
                className="absolute top-4 right-4 z-[400] w-[240px] bg-black/80 backdrop-blur-md border border-[#00f0ff]/40 p-3 cursor-pointer hover:border-[#ff0033] transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Brain size={14} className="text-[#ff0033] animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest text-[#00f0ff] uppercase">{t('operations')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-white/50 uppercase">{t('risk')}:</span>
                        <div className="flex gap-0.5">
                            <div className={`w-1.5 h-3 ${data?.risk === 'HIGH' ? 'bg-[#ff0033] shadow-[0_0_5px_#ff0033]' : 'bg-[#ff0033]/20'}`} />
                            <div className={`w-1.5 h-3 ${data?.risk === 'MEDIUM' || data?.risk === 'HIGH' ? 'bg-yellow-500 shadow-[0_0_5px_#eab308]' : 'bg-yellow-500/20'}`} />
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-[#00f0ff]/20 mb-2" />

                <p className="text-[10px] leading-tight text-white/80 font-mono mb-2 h-[2.4em] overflow-hidden">
                    {loading ? "INITIALIZING SCAN..." : data?.summary}
                </p>

                <div className="flex items-center justify-between text-[8px] font-bold tracking-tighter text-[#00f0ff]/60 uppercase">
                    <span>OLLAMA // NARRATIVE_DESK</span>
                    <span className="group-hover:text-[#ff0033] transition-colors flex items-center gap-0.5">
                        [ {t('risk')}: {data?.risk || '---'} ] <ExternalLink size={8} />
                    </span>
                </div>
            </div>

            {isWindowOpen && (
                <SpyWindow
                    id="narrative-analysis"
                    title={t('title')}
                    onClose={() => setIsWindowOpen(false)}
                >
                    <NarrativeAnalysis data={data} />
                </SpyWindow>
            )}
        </>
    );
}
