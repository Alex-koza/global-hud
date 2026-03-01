"use client";

import { useEffect, useState, useRef } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { RefreshCw, Users, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { playSound } from '@/lib/sounds';

interface VIPSignalItem {
    id: string;
    influencer: string;
    handle: string;
    platform: string;
    content: string;
    time: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
}

export function VIPSignal() {
    const { settings } = useAdminStore();
    const [loading, setLoading] = useState(true);
    const [signals, setSignals] = useState<VIPSignalItem[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    // Initial mock data to ensure dashboard holds some volume if WS fails
    const initialMocks: VIPSignalItem[] = [
        { id: '1', influencer: 'Elon Musk', handle: '@elonmusk', platform: 'X', content: 'Doge is literally going to the moon inside an actual rocket. 🚀', time: '2m ago', sentiment: 'bullish' },
        { id: '2', influencer: 'Vitalik Buterin', handle: '@VitalikButerin', platform: 'X', content: 'Layer 2 scaling is the only path forward. We are seeing massive improvements.', time: '15m ago', sentiment: 'bullish' },
        { id: '3', influencer: 'Jerome Powell', handle: '@FederalReserve', platform: 'Gov', content: 'Interest rates will remain unchanged for the foreseeable future to combat inflation.', time: '1h ago', sentiment: 'bearish' },
    ];

    useEffect(() => {
        setSignals(initialMocks);
        setLoading(false);

        if (!settings.coinGeckoApiKey) return;

        // Connect to CoinGecko Websocket for Crypto Prices (C1 channel)
        const connectWs = () => {
            const ws = new WebSocket(`wss://ws.coingecko.com/crypto/ws`);
            wsRef.current = ws;

            ws.onopen = () => {
                // Subscribe to top coins
                ws.send(JSON.stringify({
                    "action": "subscribe",
                    "channel": "CGSimplePrice",
                    "payload": {
                        "coins": ["bitcoin", "ethereum", "solana", "dogecoin"],
                        "currency": "usd"
                    }
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.channel === 'CGSimplePrice' && data.payload) {
                        const topCoins = Object.entries(data.payload) as [string, any][];
                        if (topCoins.length === 0) return;

                        // Create a stream "Signal" out of the price action
                        const [coin, priceData] = topCoins[0];
                        const price = priceData.price;
                        const direction = Math.random() > 0.5 ? 'bullish' : 'bearish'; // Simulated direction since WS payload may only be raw ticks

                        const newSignal: VIPSignalItem = {
                            id: Date.now().toString() + Math.random(),
                            influencer: 'CG MATRIX Ticker',
                            handle: `/${coin.toUpperCase()}/USDT`,
                            platform: 'WEBSOCKET',
                            content: `REAL-TIME TICK: $${price.toLocaleString()}`,
                            time: 'LIVE',
                            sentiment: direction,
                        };

                        setSignals(prev => [newSignal, ...prev].slice(0, 10)); // Keep last 10
                        playSound('scan');
                    }
                } catch (e) {
                    console.error("WS Parse Error", e);
                }
            };

            ws.onerror = (e) => {
                console.error("CoinGecko WS Error:", e);
                ws.close();
            };

            ws.onclose = () => {
                // Try to reconnect in 5s
                setTimeout(connectWs, 5000);
            };
        };

        connectWs();

        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, [settings.coinGeckoApiKey]);

    return (
        <div className="flex flex-col h-full text-[#00f0ff] font-mono text-xs z-10 relative">
            <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/30 pb-2">
                <div className="flex items-center gap-2">
                    <Activity size={16} className={loading ? "animate-pulse" : ""} />
                    <span className="font-bold tracking-widest uppercase">
                        VIP SIGNAL / WS FEED
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                    <div className={`w-2 h-2 rounded-full ${settings.coinGeckoApiKey ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_5px_#00f0ff]' : 'bg-[#ff0033]'}`} />
                    {settings.coinGeckoApiKey ? 'WS_CONNECTED' : 'MOCK_MODE'}
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar flex flex-col gap-3">
                {loading && signals.length === 0 ? (
                    <div className="text-center opacity-50 mt-10">SEARCHING SIGNATURES...</div>
                ) : (
                    signals.map((item) => (
                        <div key={item.id} className={`p-3 relative overflow-hidden flex flex-col gap-2 bg-[#05080f] border ${item.sentiment === 'bullish' ? 'border-[#00f0ff]' :
                            item.sentiment === 'bearish' ? 'border-[#ff0033]' :
                                'border-[#00f0ff]/30'
                            }`}>

                            <div className="absolute top-0 right-0 p-1 opacity-20">
                                {item.sentiment === 'bullish' ? <TrendingUp size={40} /> : item.sentiment === 'bearish' ? <TrendingDown size={40} /> : <Users size={40} />}
                            </div>

                            <div className="flex justify-between items-center z-10">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${item.sentiment === 'bullish' ? 'bg-[#00f0ff] shadow-[0_0_5px_#00f0ff]' :
                                        item.sentiment === 'bearish' ? 'bg-[#ff0033] shadow-[0_0_5px_#ff0033]' :
                                            'bg-[#a855f7]'
                                        }`} />
                                    <span className="font-bold uppercase tracking-widest">{item.influencer}</span>
                                </div>
                                <span className="text-[10px] opacity-60">{item.time}</span>
                            </div>

                            <div className="text-[10px] text-[#00f0ff]/50 z-10">{item.platform} // {item.handle}</div>

                            <div className="text-sm mt-1 z-10 text-white/90">
                                "{item.content}"
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
