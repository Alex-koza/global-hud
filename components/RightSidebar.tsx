import { User, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export function RightSidebar() {
    return (
        <div className="hidden lg:flex w-80 h-full border-l border-[#00f0ff]/30 bg-[#05080f]/90 backdrop-blur-md flex-col p-4 gap-6 overflow-y-auto custom-scrollbar relative z-30 flex-shrink-0">
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

            {/* Profile Section */}
            <div className="flex items-center gap-4 border border-[#00f0ff]/30 p-4 bg-[#00f0ff]/5 relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f0ff]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f0ff]" />

                <div className="w-12 h-12 bg-[#00f0ff]/20 flex items-center justify-center border border-[#00f0ff]/50 shrink-0">
                    <User size={24} className="text-[#00f0ff]" />
                </div>
                <div>
                    <div className="text-xs text-[#00f0ff]/70 tracking-widest uppercase">Operator</div>
                    <div className="text-sm font-bold text-[#00f0ff] uppercase tracking-widest">A.Kozacenko</div>
                    <div className="text-[10px] text-[#ff0033] flex items-center gap-1 mt-1">
                        <ShieldCheck size={10} /> OMEGA CLEARANCE
                    </div>
                </div>
            </div>

            {/* Globe View 01 */}
            <div className="border border-[#00f0ff]/30 p-4 bg-[#00f0ff]/5 relative flex flex-col items-center">
                <div className="absolute top-0 right-0 bg-[#00f0ff] text-[#05080f] text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    VIEW 01
                </div>
                <div className="w-32 h-32 rounded-full border border-[#00f0ff]/50 relative overflow-hidden flex items-center justify-center my-4 globe-container">
                    <div className="absolute inset-0 bg-[#00f0ff]/10" />
                    {/* CSS grid pattern mapping for globe */}
                    <div className="w-full h-full border border-[#00f0ff]/20 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
                        <div className="w-[120%] h-[1px] bg-[#00f0ff]/30 rotate-0 absolute" />
                        <div className="w-[120%] h-[1px] bg-[#00f0ff]/30 rotate-45 absolute" />
                        <div className="w-[120%] h-[1px] bg-[#00f0ff]/30 rotate-90 absolute" />
                        <div className="w-[120%] h-[1px] bg-[#00f0ff]/30 rotate-135 absolute" />
                        <div className="w-[60%] h-[60%] border border-[#00f0ff]/30 rounded-full absolute" />
                    </div>
                </div>
                <div className="w-full flex justify-between text-[10px] text-[#00f0ff]/70 border-t border-[#00f0ff]/30 pt-2">
                    <span>LAT: 45.4215 N</span>
                    <span>LON: 75.6972 W</span>
                </div>
            </div>

            {/* Pressure Bar Chart */}
            <div className="border border-[#00f0ff]/30 p-4 bg-[#00f0ff]/5 relative">
                <div className="text-xs text-[#00f0ff]/70 uppercase tracking-widest mb-4 flex items-center justify-between">
                    <span>System Pressure</span>
                    <Activity size={12} className="text-[#00f0ff]" />
                </div>
                <div className="flex items-end justify-between h-24 gap-1">
                    {[40, 65, 30, 85, 50, 95, 20, 70, 45, 80].map((val, i) => (
                        <div key={i} className="w-full bg-[#00f0ff]/10 relative group h-full flex items-end">
                            <div
                                className={`w-full transition-all duration-1000 ${val > 80 ? 'bg-[#ff0033]' : 'bg-[#00f0ff]'}`}
                                style={{ height: `${val}%` }}
                            />
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00f0ff] text-[#05080f] text-[10px] font-bold px-1 rounded z-10 transition-opacity">
                                {val}%
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full h-[1px] bg-[#00f0ff]/30 mt-2 relative">
                    <div className="absolute right-0 top-0 w-[20%] h-[1px] bg-[#ff0033] shadow-[0_0_5px_#ff0033]" />
                </div>
            </div>

            {/* Fill Level */}
            <div className="border border-[#00f0ff]/30 p-4 bg-[#00f0ff]/5 relative flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-[#00f0ff]/70 uppercase tracking-widest">
                    <span>Core Fill Level</span>
                    <span className="text-[#00f0ff] font-bold">78%</span>
                </div>
                <div className="w-full h-4 bg-[#00f0ff]/10 border border-[#00f0ff]/30 relative overflow-hidden p-0.5">
                    <div className="h-full bg-[#00f0ff] relative" style={{ width: '78%' }}>
                        <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-50 mix-blend-overlay" />
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse" />
                    </div>
                </div>
                <div className="text-[10px] text-[#ff0033] flex items-center gap-1 mt-1 justify-end">
                    <AlertTriangle size={10} /> OPTIMAL CAPACITY
                </div>
            </div>

            {/* Minor Data Streams */}
            <div className="flex-1 border border-[#00f0ff]/30 p-4 bg-[#00f0ff]/5 overflow-hidden flex flex-col">
                <div className="text-[10px] text-[#00f0ff]/70 uppercase tracking-widest mb-2 border-b border-[#00f0ff]/30 pb-1">
                    Active Daemons
                </div>
                <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 mt-2 flex-1 relative">
                    {[
                        { id: 'SYS_01', status: 'RUN', ping: '12ms' },
                        { id: 'NET_RX', status: 'SYNC', ping: '4ms' },
                        { id: 'SEC_OM', status: 'WARN', ping: '45ms' },
                        { id: 'DB_HXD', status: 'RUN', ping: '8ms' },
                    ].map(d => (
                        <div key={d.id} className="flex justify-between items-center text-[10px] uppercase font-mono">
                            <span className="text-[#00f0ff]">{d.id}</span>
                            <div className="flex items-center gap-2">
                                <span className={d.status === 'WARN' ? 'text-[#ff0033]' : 'text-[#00f0ff]/50'}>{d.status}</span>
                                <span className="text-[#00f0ff]/30 w-8 text-right">{d.ping}</span>
                            </div>
                        </div>
                    ))}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#05080f] to-transparent pointer-events-none" />
                </div>
            </div>

        </div>
    );
}
