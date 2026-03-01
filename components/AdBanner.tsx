"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { X, Minus, Megaphone } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { playSound } from '@/lib/sounds';

export function AdBanner() {
    const { settings } = useAdminStore();
    const [isVisible, setIsVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);

    // Close ad banner completely
    const handleClose = () => {
        playSound('close');
        setIsVisible(false);
    };

    if (!settings.adEnabled || !isVisible) return null;

    return (
        <AnimatePresence>
            <Rnd
                default={{
                    x: window.innerWidth - 320,
                    y: window.innerHeight - 270,
                    width: 300,
                    height: 250,
                }}
                minWidth={200}
                minHeight={100}
                bounds="window"
                dragHandleClassName="ad-drag-handle"
                style={{ zIndex: 9999, position: 'fixed' }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`cyber-panel w-full h-full flex flex-col overflow-hidden ring-1 ring-[#ff0033]/50 shadow-[0_0_15px_rgba(255,0,51,0.2)] bg-[#05080f]/90 relative`}
                >
                    {/* Animated Glow Border */}
                    <div className="absolute inset-0 pointer-events-none border border-[#ff0033]/30 animate-pulse [animation-duration:2s]" />

                    {/* Ad Header */}
                    <div className="ad-drag-handle h-6 bg-[#ff0033]/20 border-b border-[#ff0033]/40 flex items-center justify-between px-2 cursor-move select-none relative z-20">
                        <div className="flex items-center gap-1 text-[#ff0033]">
                            <Megaphone size={12} className="animate-pulse" />
                            <span className="text-[9px] font-bold tracking-widest uppercase">SPONSORED SEC-FEED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="text-[#ff0033]/70 hover:text-[#ff0033] transition-transform hover:scale-110"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    playSound('hover');
                                    setIsMinimized(!isMinimized);
                                }}
                            >
                                <Minus size={12} />
                            </button>
                            <button
                                className="text-[#ff0033]/70 hover:text-[#ff0033] transition-transform hover:scale-125"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClose();
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Ad Content */}
                    <AnimatePresence>
                        {!isMinimized && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="flex-1 relative overflow-auto custom-scrollbar p-2"
                            >
                                <div className="scanlines z-10 pointer-events-none" />

                                {/* Render raw HTML from admin settings safely */}
                                <div
                                    className="w-full h-full relative z-0"
                                    dangerouslySetInnerHTML={{ __html: settings.adHtmlCode }}
                                />

                                <div className="absolute bottom-1 right-1 text-[8px] text-[#ff0033]/40 font-mono z-20 pointer-events-none">
                                    AD_SYS_V2.1 // DEPLOYED
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </Rnd>
        </AnimatePresence>
    );
}
