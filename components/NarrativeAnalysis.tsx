"use client";

import React from 'react';
import { Shield, Target, Zap, Link as LinkIcon, Layers, Brain, Radio } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NarrativeAnalysisProps {
    data: any;
}

export function NarrativeAnalysis({ data }: NarrativeAnalysisProps) {
    const t = useTranslations('Narrative');
    if (!data || !data.analysis) {
        return (
            <div className="flex flex-col items-center justify-center h-full opacity-50 animate-pulse">
                <Brain size={48} className="mb-4" />
                <p>{t('waiting')}</p>
            </div>
        );
    }

    const { analysis } = data;

    return (
        <div className="flex flex-col gap-6 text-[#00f0ff] font-mono pb-8">
            {/* Header Info */}
            <div className="flex items-center gap-3 p-3 bg-[#ff0033]/10 border border-[#ff0033]/30">
                <Shield size={20} className="text-[#ff0033]" />
                <div>
                    <h2 className="text-sm font-bold tracking-widest text-[#ff0033]">{t('title')}</h2>
                    <p className="text-[10px] opacity-70">{t('status')}</p>
                </div>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Narrative */}
                <section className="col-span-full bg-[#05080f] border border-[#00f0ff]/20 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-[#00f0ff]/30 pb-2">
                        <Radio size={14} />
                        <span className="font-bold uppercase tracking-wider">{t('current_narrative')}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/80 italic">
                        "{analysis.current_narrative}"
                    </p>
                </section>

                {/* Primary Goal */}
                <section className="bg-[#05080f] border border-[#ff0033]/20 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-[#ff0033]/30 pb-2">
                        <Target size={14} className="text-[#ff0033]" />
                        <span className="font-bold uppercase tracking-wider">{t('primary_goal')}</span>
                    </div>
                    <p className="text-xs text-white/80">
                        {analysis.primary_goal || "NO DATA"}
                    </p>
                </section>

                {/* Distraction Target */}
                <section className="bg-[#05080f] border border-[#a855f7]/20 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-[#a855f7]/30 pb-2">
                        <Brain size={14} className="text-[#a855f7]" />
                        <span className="font-bold uppercase tracking-wider">{t('distraction_target')}</span>
                    </div>
                    <p className="text-xs text-[#a855f7]/90 italic font-bold">
                        {analysis.distraction_target || "NONE DETECTED"}
                    </p>
                </section>

                {/* Detected Methods */}
                <section className="bg-[#05080f] border border-[#00f0ff]/20 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-[#00f0ff]/30 pb-2">
                        <Zap size={14} className="text-yellow-500" />
                        <span className="font-bold uppercase tracking-wider">{t('detected_methods')}</span>
                    </div>
                    <ul className="space-y-2">
                        {(analysis.detected_methods || []).map((method: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-xs">
                                <span className="text-[#00f0ff] opacity-50">[{i + 1}]</span>
                                <span>{method}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Key Sources */}
                <section className="bg-[#05080f] border border-[#00f0ff]/20 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-[#00f0ff]/30 pb-2">
                        <LinkIcon size={14} />
                        <span className="font-bold uppercase tracking-wider">{t('key_sources')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(analysis.key_sources || []).map((source: any, i: number) => (
                            <a
                                key={i}
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[10px] hover:bg-[#00f0ff]/30 transition-colors"
                            >
                                {source.name}
                            </a>
                        ))}
                    </div>
                </section>

                {/* Alternative Narratives */}
                <section className="bg-[#05080f] border border-[#00f0ff]/20 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-[#00f0ff]/30 pb-2">
                        <Layers size={14} />
                        <span className="font-bold uppercase tracking-wider">{t('alternative_narratives')}</span>
                    </div>
                    <ul className="space-y-3">
                        {(analysis.alternative_narratives || []).map((alt: string, i: number) => (
                            <li key={i} className="text-[11px] leading-relaxed text-white/60 pl-3 border-l border-[#00f0ff]/20">
                                {alt}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Confidence Level */}
                <section className="col-span-full bg-[#05080f] border border-[#00f0ff]/20 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-[#00f0ff]/30 pb-2">
                        <Shield size={14} className="text-green-500" />
                        <span className="font-bold uppercase tracking-wider">{t('confidence_level')}</span>
                    </div>
                    <p className="text-xs text-white/80">
                        {analysis.confidence_level || "UNCERTAIN"}
                    </p>
                </section>
            </div>

            {/* Footer Branding */}
            <div className="flex items-center justify-center opacity-30 gap-2 mt-4">
                <Brain size={12} />
                <span className="text-[8px] tracking-[0.3em] uppercase">{t('footer')}</span>
            </div>
        </div>
    );
}
