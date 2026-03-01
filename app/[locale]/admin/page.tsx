"use client";

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { useRouter } from '@/i18n/routing';
import { Lock, LogIn, AlertTriangle } from 'lucide-react';
import { playSound } from '@/lib/sounds';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { login, isAuthenticated } = useAdminStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/admin/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            playSound('open');
            router.push('/admin/dashboard');
        } else {
            playSound('error');
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#05080f] flex items-center justify-center p-4 font-mono select-none">
            <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

            <div className={`cyber-panel w-full max-w-md p-8 relative z-10 transition-all duration-300 ${error ? 'ring-[#ff0033] shadow-[0_0_20px_rgba(255,0,51,0.5)]' : 'ring-[#00f0ff]/50'}`}>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#00f0ff]/10 rounded-full flex items-center justify-center mb-4 border border-[#00f0ff]/50">
                        <Lock size={32} className="text-[#00f0ff] animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#00f0ff] tracking-widest text-center">RESTRICTED ACCESS</h1>
                    <p className="text-[10px] text-[#00f0ff]/50 mt-2 text-center uppercase">Admin Override Terminal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="ENTER CLEARANCE CODE..."
                                className={`w-full bg-[#00f0ff]/5 border ${error ? 'border-[#ff0033] text-[#ff0033]' : 'border-[#00f0ff]/30 text-[#00f0ff]'} p-3 pl-10 focus:outline-none focus:border-[#00f0ff] transition-colors`}
                            />
                            <Lock size={16} className={`absolute left-3 top-3.5 ${error ? 'text-[#ff0033]' : 'text-[#00f0ff]/50'}`} />
                        </div>
                        {error && (
                            <p className="text-[10px] text-[#ff0033] mt-2 flex items-center gap-1 animate-pulse">
                                <AlertTriangle size={10} /> ACCESS DENIED. INTRUSION ATTEMPT LOGGED.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] py-3 font-bold tracking-widest hover:bg-[#00f0ff]/30 transition-all flex items-center justify-center gap-2 group"
                    >
                        <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                        INITIALIZE UPLINK
                    </button>
                </form>
            </div>
        </div>
    );
}
