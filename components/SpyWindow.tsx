"use client";

import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { useWindowStore } from '@/lib/windows';
import { playSound } from '@/lib/sounds';
import { useTranslations } from 'next-intl';

interface SpyWindowProps {
    id: string;
    title?: string;
    children: React.ReactNode;
    defaultPosition?: { x: number; y: number };
    defaultSize?: { width: number | string; height: number | string };
}

export function SpyWindow({ id, title, children, defaultPosition, defaultSize }: SpyWindowProps) {
    const { windows, closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindowStore();
    const windowState = windows.find(w => w.id === id);
    const tWindows = useTranslations('Windows');
    const tAlerts = useTranslations('Alerts');

    const [isMobile, setIsMobile] = useState(false);
    const [showAccessGranted, setShowAccessGranted] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (windowState && !windowState.isMinimized) {
            const timer = setTimeout(() => setShowAccessGranted(false), 800);
            return () => clearTimeout(timer);
        } else {
            setShowAccessGranted(true);
        }
    }, [windowState?.isMinimized]);

    // Hide if not open at all
    if (!windowState) return null;

    const isMaximized = windowState.isMaximized || isMobile;

    const rndProps = isMaximized ? {
        position: { x: 0, y: 0 },
        size: { width: '100vw', height: '100vh' },
        disableDragging: true,
        enableResizing: false
    } : {
        default: {
            x: defaultPosition?.x || Math.random() * 200 + 100,
            y: defaultPosition?.y || Math.random() * 200 + 50,
            width: defaultSize?.width || 500,
            height: defaultSize?.height || 400,
        },
        minWidth: 300,
        minHeight: 200,
        disableDragging: false,
        enableResizing: true
    };

    return (
        <AnimatePresence>
            {!windowState.isMinimized && (
                <Rnd
                    {...rndProps}
                    bounds="parent"
                    dragHandleClassName="drag-handle"
                    onDragStart={() => focusWindow(id)}
                    onResizeStart={() => focusWindow(id)}
                    style={{ zIndex: windowState.zIndex, position: 'absolute' }}
                >
                    <motion.div
                        layoutId={`window-${id}`}
                        initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`cyber-panel w-full h-full flex flex-col overflow-hidden pointer-events-auto transition-shadow duration-300 ${windowState.isFocused ? 'ring-1 ring-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'opacity-90'
                            }`}
                        onPointerDown={() => focusWindow(id)}
                    >
                        {/* Border Scanline Animation */}
                        <div className="absolute inset-0 pointer-events-none border border-[#00f0ff]/20 animate-pulse [animation-duration:3s]" />

                        {/* Window Header */}
                        <div className="drag-handle h-8 bg-[#00f0ff]/10 border-b border-[#00f0ff]/30 flex items-center justify-between px-3 cursor-move select-none relative z-20">
                            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
                                <div className="w-2 h-2 bg-[#ff0033] animate-pulse rounded-full flex-shrink-0" />
                                <span className="text-[10px] font-bold text-[#ff0033] tracking-widest hidden sm:inline">
                                    {tAlerts('classified')} //
                                </span>
                                <span className="text-xs font-bold tracking-wider text-[#00f0ff] uppercase ml-1">
                                    {title || tWindows(windowState.type as any) || 'UNKNOWN_PROCESS'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4 pointer-events-auto">
                                <button
                                    className="text-[#00f0ff]/70 hover:text-[#00f0ff] transition-transform hover:scale-110"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        playSound('close'); // Minimize sound
                                        minimizeWindow(id);
                                    }}
                                >
                                    <Minus size={14} />
                                </button>
                                {!isMobile && (
                                    <button
                                        className="text-[#00f0ff]/70 hover:text-[#00f0ff] transition-transform hover:scale-110"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            playSound('hover');
                                            if (windowState.isMaximized) restoreWindow(id);
                                            else maximizeWindow(id);
                                        }}
                                    >
                                        <Square size={12} className={windowState.isMaximized ? "fill-[#00f0ff]" : ""} />
                                    </button>
                                )}
                                <button
                                    className="text-[#ff0033]/70 hover:text-[#ff0033] transition-transform hover:scale-125"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        playSound('close');
                                        closeWindow(id);
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Window Content */}
                        <div className="flex-1 overflow-auto relative p-4 bg-[#05080f]/50 custom-scrollbar font-mono text-[10px] sm:text-xs tracking-widest leading-relaxed text-[#00f0ff]">
                            <div className="scanlines opacity-30" />

                            {/* Access Granted Overlay */}
                            <AnimatePresence>
                                {showAccessGranted && (
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 z-50 flex items-center justify-center bg-[#05080f] border border-[#00f0ff]/50"
                                    >
                                        <h2 className="text-2xl font-mono text-[#00f0ff] tracking-widest glitch-text" data-text={tAlerts('access_granted')}>
                                            {tAlerts('access_granted')}
                                        </h2>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative z-10 w-full h-full">
                                {children}
                            </div>
                        </div>

                    </motion.div>
                </Rnd>
            )}
        </AnimatePresence>
    );
}
