"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ShieldAlert, TerminalSquare, Rss, ArrowRight } from 'lucide-react';
import { playSound } from '@/lib/sounds';

interface ArticleMeta {
    slug: string;
    title: string;
    date: string;
    author: string;
    category: string;
}

export default function BlogIndex() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const router = useRouter();
    const tWindows = useTranslations('Windows');

    useEffect(() => {
        // Simulate fetching markdown meta from API (MVP we hardcode to simulate reading the fs)
        const fetchArticles = async () => {
            await new Promise(r => setTimeout(r, 1200));
            setArticles([
                { slug: 'quantum-threats', title: 'The Rise of Quantum Encryption Threats', date: '2026-03-01', author: 'Agent K', category: 'Cybersecurity' },
                { slug: 'rare-earth-shifts', title: 'Geopolitical Shifts in Rare Earth Supply Chains', date: '2026-02-28', author: 'Agent M', category: 'Geopolitics' }
            ]);
            setLoading(false);
            playSound('open');
        };
        fetchArticles();
    }, []);

    const handleRead = (slug: string) => {
        playSound('hover');
        router.push(`/blog/${slug}`);
    };

    const handleReturn = () => {
        playSound('close');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#05080f] text-[#00f0ff] font-mono p-4 md:p-8 select-none relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

            <div className="w-full max-w-4xl relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#00f0ff]/30 pb-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Rss size={32} className="text-[#00f0ff]" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-widest leading-none">GLOBAL TRANSMISSIONS</h1>
                            <p className="text-[10px] text-[#00f0ff]/50 mt-1 uppercase">DECLASSIFIED DEBRIEFS & INTELLIGENCE REPORTS</p>
                        </div>
                    </div>
                    <button
                        onClick={handleReturn}
                        className="border border-[#00f0ff]/50 px-4 py-2 hover:bg-[#00f0ff]/20 transition-all font-bold tracking-widest text-[#00f0ff] uppercase text-xs"
                    >
                        RETURN TO OS
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="space-y-6">
                        <div className="h-32 border border-[#00f0ff]/20 bg-[#00f0ff]/5 animate-pulse" />
                        <div className="h-32 border border-[#00f0ff]/20 bg-[#00f0ff]/5 animate-pulse pointer-events-none glitch-skel" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {articles.map((article) => (
                            <div
                                key={article.slug}
                                className="group border border-[#00f0ff]/30 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 p-6 transition-all cursor-pointer shadow-none hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                onClick={() => handleRead(article.slug)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 uppercase tracking-widest">{article.category}</span>
                                        <span className="text-[10px] text-[#00f0ff]/50">{article.date}</span>
                                    </div>
                                    <span className="text-[10px] text-[#00f0ff]/50 font-bold uppercase">AUTH: {article.author}</span>
                                </div>
                                <h2 className="text-xl font-bold mb-2 uppercase group-hover:text-white transition-colors">
                                    {'>'} {article.title}
                                </h2>
                                <div className="flex items-center text-sm text-[#00f0ff] mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    INITIALIZE DECRYPTION <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
