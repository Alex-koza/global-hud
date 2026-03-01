"use client";

import { Map, Zap, DollarSign, CloudLightning, ShieldAlert, Users, Fuel } from 'lucide-react';
import { useWindowStore } from '@/lib/windows';

export function MapControls() {
    const { mapLayers, toggleMapLayer } = useWindowStore();

    const layers = [
        { id: 'conflicts', label: 'Conflicts', icon: <Map size={14} />, color: '#ff0033' },
        { id: 'crypto', label: 'Crypto Heatmap', icon: <DollarSign size={14} />, color: '#00f0ff' },
        { id: 'finance', label: 'Financial Markets', icon: <DollarSign size={14} />, color: '#00ccff' },
        { id: 'climate', label: 'Climate Threats', icon: <CloudLightning size={14} />, color: '#a855f7' },
        { id: 'cyber', label: 'Cyber Attacks', icon: <ShieldAlert size={14} />, color: '#ffcc00' },
        { id: 'migration', label: 'Migration Flows', icon: <Users size={14} />, color: '#00ffcc' },
        { id: 'energy', label: 'Energy & Supply', icon: <Fuel size={14} />, color: '#ff9900' },
    ];

    return (
        <div className="absolute left-4 top-16 w-48 border border-[#00f0ff]/30 bg-[#05080f]/80 backdrop-blur-sm p-3 z-[400] overflow-hidden">
            <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
            <div className="text-[10px] text-[#00f0ff]/70 tracking-widest uppercase mb-3 border-b border-[#00f0ff]/30 pb-1">
                Active Uplinks
            </div>
            <div className="flex flex-col gap-2 relative z-10">
                {layers.map((layer) => {
                    const isActive = mapLayers[layer.id as keyof typeof mapLayers];
                    return (
                        <button
                            key={layer.id}
                            onClick={() => toggleMapLayer(layer.id as keyof typeof mapLayers)}
                            className={`flex items-center justify-between p-2 border transition-all text-[10px] uppercase font-bold tracking-widest ${isActive
                                    ? `bg-[${layer.color}]/20 border-[${layer.color}] text-[${layer.color}] shadow-[0_0_10px_${layer.color}40]`
                                    : 'bg-[#00f0ff]/5 border-[#00f0ff]/20 text-[#00f0ff]/50 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/50'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {layer.icon}
                                <span>{layer.label}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : 'opacity-20'}`} style={{ backgroundColor: layer.color }} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
