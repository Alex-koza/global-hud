"use client";

import { useEffect } from 'react';
import { Terminal, AlertTriangle } from 'lucide-react';
import { playSound } from '@/lib/sounds';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Attempt to play error beep
        playSound('error');
        console.error(error);
    }, [error]);

    return (
        <div className="w-screen h-screen bg-[#ff0033]/10 flex flex-col items-center justify-center p-4 font-mono select-none relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

            <div className="border-2 border-[#ff0033] bg-[#05080f] p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(255,0,51,0.5)] z-10 animate-pulse relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#ff0033] animate-[scan_2s_linear_infinite]" />

                <div className="flex items-center gap-4 mb-6 border-b border-[#ff0033]/50 pb-4">
                    <AlertTriangle size={48} className="text-[#ff0033] animate-bounce" />
                    <div>
                        <h1 className="text-3xl font-bold text-[#ff0033] tracking-widest glitch-text" data-text="CRITICAL SYSTEM FAILURE">
                            CRITICAL SYSTEM FAILURE
                        </h1>
                        <p className="text-xs text-[#ff0033]/70 uppercase tracking-widest mt-1">Fatal Exception Logged in Mainframe</p>
                    </div>
                </div>

                <div className="bg-black/50 p-4 border border-[#ff0033]/30 text-[#ff0033] font-mono text-sm mb-8 overflow-auto max-h-48 custom-scrollbar">
                    <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                        <Terminal size={12} />
                        <span>ERROR TRACE:</span>
                    </div>
                    <p>{error.message || "Unknown segmentation fault."}</p>
                    {error.digest && <p className="mt-2 opacity-50">DIGEST: {error.digest}</p>}
                </div>

                <div className="flex gap-4">
                    <button
                        className="flex-1 bg-[#ff0033]/20 hover:bg-[#ff0033] border border-[#ff0033] text-[#ff0033] hover:text-white px-6 py-3 font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group"
                        onClick={reset}
                    >
                        <Terminal size={18} className="group-hover:animate-spin" />
                        REBOOT SYSTEM
                    </button>

                    <button
                        className="flex-1 bg-transparent hover:bg-white/10 border border-white/30 text-white/50 hover:text-white px-6 py-3 font-bold tracking-widest uppercase transition-all"
                        onClick={() => window.location.href = '/'}
                    >
                        RETURN TO SAFE MODE
                    </button>
                </div>
            </div>
        </div>
    );
}
