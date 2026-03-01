"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Terminal, Map, Radio, Database, GlobeLock, Plus, Minimize2, FileText, Activity } from 'lucide-react';
import { useWindowStore, WindowState } from '@/lib/windows';
import { motion } from 'framer-motion';
import { playSound } from '@/lib/sounds';

export function Taskbar() {
    const tTaskbar = useTranslations('Taskbar');
    const tWindows = useTranslations('Windows');
    const [time, setTime] = useState('');
    const [isBlinking, setIsBlinking] = useState(true);

    const { windows, openWindow, minimizeAll, restoreWindow, focusWindow, minimizeWindow } = useWindowStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const inter = setInterval(() => {
            const d = new Date();
            setTime(d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + d.getMilliseconds().toString().padStart(3, '0'));
        }, 50);
        const blinker = setInterval(() => setIsBlinking(b => !b), 1000);

        return () => { clearInterval(inter); clearInterval(blinker); };
    }, []);

    const handleOpenNew = () => {
        playSound('open');
        const id = `term-${Date.now()}`;
        openWindow(id, 'terminal', tWindows('terminal') || 'SYSTEM TERMINAL');
    };

    const handleLanguageSwitch = (locale: string) => {
        playSound('hover');
        router.replace({ pathname }, { locale });
    };

    const renderWindowIcon = (type: string) => {
        switch (type) {
            case 'terminal': return <Terminal size={16} />;
            case 'radar': return <Map size={16} />;
            case 'comms': return <Radio size={16} />;
            case 'database': return <Database size={16} />;
            case 'intel': return <FileText size={16} />;
            case 'source_analysis': return <Radio size={16} />;
            case 'vip_signal': return <Activity size={16} />;
            default: return <Activity size={16} />;
        }
    };

    return (
        <div className="relative w-full h-12 shrink-0 bg-black/80 backdrop-blur-md border-t border-[#00f0ff]/40 flex items-center justify-between px-4 z-50">

            {/* Left: Mission Time */}
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-3 py-1">
                    <GlobeLock className="text-[#00f0ff] animate-pulse" size={16} />
                    <span className="text-[10px] text-[#00f0ff] uppercase tracking-widest">{tTaskbar('mission_time')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isBlinking ? 'bg-[#ff0033] shadow-[0_0_8px_#ff0033]' : 'bg-transparent'}`} />
                    <span className="text-sm font-mono text-[#00f0ff] tracking-widest min-w-[110px]">{time}</span>
                </div>
                <div className="h-4 w-px bg-[#00f0ff]/30 hidden sm:block" />

                {/* Quick Launch Icons */}
                <div className="hidden md:flex gap-2">
                    <button onClick={() => openWindow('global-source', 'source_analysis', tWindows('source_analysis') || 'GLOBAL SOURCE ANALYSIS')} className="p-1 px-2 text-[10px] border border-[#ff0033]/30 text-[#ff0033]/70 hover:text-[#ff0033] hover:bg-[#ff0033]/10 transition-all font-mono tracking-widest whitespace-nowrap">
                        {tWindows('source_analysis') || 'SOURCE ANALYSIS'}
                    </button>
                    <button onClick={() => openWindow('global-vip', 'vip_signal', tWindows('vip_signal') || 'GLOBAL VIP SIGNAL')} className="p-1 px-2 text-[10px] border border-[#a855f7]/30 text-[#a855f7]/70 hover:text-[#a855f7] hover:bg-[#a855f7]/10 transition-all font-mono tracking-widest whitespace-nowrap">
                        {tWindows('vip_signal') || 'VIP SIGNAL'}
                    </button>
                </div>
            </div>

            {/* Center: Open/Minimized Windows */}
            <div className="flex-1 flex justify-center overflow-x-auto px-4 hide-scrollbar">
                <div className="flex gap-2">
                    {windows.map(w => (
                        <button
                            key={w.id}
                            onClick={() => {
                                playSound('hover');
                                if (w.isMinimized) {
                                    restoreWindow(w.id);
                                } else if (w.isFocused) {
                                    minimizeWindow(w.id);
                                } else {
                                    focusWindow(w.id);
                                }
                            }}
                            className={`flex items-center gap-2 px-3 py-1 border transition-all max-w-[150px]
                ${w.isFocused && !w.isMinimized ? 'border-[#00f0ff] bg-[#00f0ff]/20 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                                    : w.isMinimized ? 'border-[#00f0ff]/30 bg-transparent text-[#00f0ff]/50 hover:bg-[#00f0ff]/10'
                                        : 'border-[#00f0ff]/50 bg-[#00f0ff]/5 text-[#00f0ff]/80 hover:bg-[#00f0ff]/20'}`}
                            title={w.title}
                        >
                            {renderWindowIcon(w.type)}
                            <span className="text-[10px] font-mono truncate hidden sm:block">{w.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Actions & Lang */}
            <div className="flex items-center gap-3">
                <button
                    className="p-1.5 border border-[#00f0ff]/30 text-[#00f0ff]/70 hover:text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-all hidden sm:flex items-center gap-1"
                    onClick={() => { playSound('hover'); minimizeAll(); }}
                    title={tTaskbar('minimize_all')}
                >
                    <Minimize2 size={16} />
                </button>

                <button
                    className="p-1.5 border border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/30 hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all flex items-center gap-1"
                    onClick={handleOpenNew}
                    title={tTaskbar('new_window')}
                >
                    <Plus size={16} />
                    <span className="text-[10px] font-bold tracking-widest hidden md:block">{tTaskbar('new_window')}</span>
                </button>

                <div className="h-6 w-px bg-[#00f0ff]/30 mx-1" />

                {/* Language Switcher */}
                <div className="flex gap-1 text-[10px] font-bold font-mono">
                    {['en', 'uk', 'ru'].map(lang => (
                        <button
                            key={lang}
                            onClick={() => handleLanguageSwitch(lang)}
                            className={`uppercase px-1.5 py-0.5 border transition-all ${pathname.startsWith(`/${lang}`) || (lang === 'en' && pathname === '/')
                                ? 'border-[#ff0033] text-[#ff0033] bg-[#ff0033]/10 shadow-[0_0_5px_rgba(255,0,51,0.5)]'
                                : 'border-[#00f0ff]/30 text-[#00f0ff]/50 hover:text-[#00f0ff] hover:border-[#00f0ff]'
                                }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
