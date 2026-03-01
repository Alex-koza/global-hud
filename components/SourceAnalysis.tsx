"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw, Activity, RadioTower } from 'lucide-react';
import { playSound } from '@/lib/sounds';
import { useAdminStore } from '@/lib/adminStore';
import html2canvas from 'html2canvas';

interface NewsItem {
    id: number;
    title: string;
    source: string;
    time: string;
    sentiment: 'positive' | 'negative' | 'neutral';
}

export function SourceAnalysis({ country }: { country?: string }) {
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState<NewsItem[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { settings } = useAdminStore();

    // Simulated fetching from TheNewsAPI / NewsData.io
    const fetchData = async () => {
        setLoading(true);
        playSound('hover');

        try {
            if (settings.newsDataIoApiKey) {
                // Fetch real news
                const url = country
                    ? `https://newsdata.io/api/1/latest?apikey=${settings.newsDataIoApiKey}&q=${encodeURIComponent(country)}&language=en`
                    : `https://newsdata.io/api/1/latest?apikey=${settings.newsDataIoApiKey}&category=world&language=en`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.status === 'success' && data.results) {
                    const mappedNews: NewsItem[] = data.results.slice(0, 15).map((article: any, idx: number) => {
                        // Simple heuristic for sentiment
                        const text = (article.title + " " + (article.description || "")).toLowerCase();
                        let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
                        if (text.match(/(crash|die|kill|attack|plunge|drop|leak|hack|threat|war)/)) sentiment = 'negative';
                        if (text.match(/(soar|surge|growth|peace|deal|profit|gain|win)/)) sentiment = 'positive';

                        return {
                            id: idx + Date.now(),
                            title: article.title,
                            source: article.source_id || 'UNKNOWN',
                            time: article.pubDate || new Date().toISOString(),
                            sentiment
                        }
                    });
                    setNews(mappedNews);
                } else {
                    throw new Error("NewsData API Error");
                }
            } else {
                // Fallback to Mocks
                await new Promise(r => setTimeout(r, 1500));
                const mockNews: NewsItem[] = [
                    { id: Math.random(), title: `[${country || 'GLOBAL'}] Classified documents leaked via dark net forums.`, source: 'SEC-NET', time: new Date().toISOString(), sentiment: 'negative' },
                    { id: Math.random(), title: `Central bank of ${country || 'key region'} announces sudden rate hike.`, source: 'FIN-OP', time: new Date().toISOString(), sentiment: 'neutral' },
                    { id: Math.random(), title: `Diplomatic channels restored after major grid failure over ${country || 'the continent'}.`, source: 'DIPLO-MON', time: new Date().toISOString(), sentiment: 'positive' },
                    { id: Math.random(), title: `Unidentified aerial phenomena reported near border.`, source: 'AIR-DEF', time: new Date().toISOString(), sentiment: 'neutral' },
                ];
                setNews(mockNews.sort(() => 0.5 - Math.random()).slice(0, 3));
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
        playSound('open'); // Scan beep

        const criticalItem = news.find(n => n.sentiment === 'negative');
        if (criticalItem && settings.tgBotToken && settings.tgChannelId && !loading && news.length > 0) {
            try {
                const msg = settings.tgPostTemplate
                    .replace('{title}', criticalItem.title)
                    .replace('{sentiment}', 'CRITICAL / NEGATIVE')
                    .replace('{source}', criticalItem.source);

                let imageBase64;
                const container = document.getElementById('spy-os-desktop-main');
                if (container) {
                    const canvas = await html2canvas(container, { backgroundColor: '#05080f' });
                    imageBase64 = canvas.toDataURL('image/jpeg', 0.6);
                }

                fetch('/api/telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: settings.tgBotToken,
                        chatId: settings.tgChannelId,
                        text: msg,
                        imageBase64
                    })
                }).catch(console.error); // silent fire-and-forget
            } catch (err) {
                console.error('Auto-post failed', err);
            }
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [country]);

    // Waveform visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let phase = 0;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;

            const centerY = canvas.height / 2;
            const amplitude = loading ? 5 : 20 + Math.sin(phase) * 10;

            for (let x = 0; x < canvas.width; x++) {
                const y = centerY + Math.sin(x * 0.05 + phase) * amplitude * Math.sin(x * 0.01);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Secondary wave
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
            for (let x = 0; x < canvas.width; x++) {
                const y = centerY + Math.cos(x * 0.04 - phase * 1.5) * (amplitude * 0.8) * Math.cos(x * 0.02);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            phase += 0.1;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [loading]);

    return (
        <div className="flex flex-col h-full text-[#00f0ff] font-mono text-xs z-10 relative">
            <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/30 pb-2">
                <div className="flex items-center gap-2">
                    <RadioTower size={16} className={loading ? "animate-pulse" : ""} />
                    <span className="font-bold tracking-widest uppercase">
                        {country ? `${country} INTERCEPT` : 'GLOBAL INTERCEPT'}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] opacity-70">
                    <div className={`w-2 h-2 rounded-full ${settings.newsDataIoApiKey ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_5px_#00f0ff]' : 'bg-[#ff0033]'}`} />
                    <span>{settings.newsDataIoApiKey ? 'LIVE_STREAM' : 'MOCK_DATA'}</span>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-1 px-2 py-1 border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> SCAN
                </button>
            </div>

            <div className="h-20 w-full mb-4 border border-[#00f0ff]/20 bg-[#05080f] p-1 relative">
                <div className="absolute top-1 left-1 text-[8px] text-[#00f0ff]/50">FREQ: {loading ? 'SCANNING...' : '874.2 MHz'}</div>
                <canvas ref={canvasRef} width={400} height={80} className="w-full h-full" />
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar flex flex-col gap-2">
                {loading && news.length === 0 ? (
                    <div className="text-center opacity-50 mt-10">DECRYPTING PACKETS...</div>
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="p-2 border border-[#00f0ff]/20 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 transition-colors">
                            <div className="flex justify-between items-start mb-1 text-[10px] opacity-70">
                                <span>{item.source} \\ {new Date(item.time).toLocaleTimeString()}</span>
                                <span className={`px-1 ${item.sentiment === 'negative' ? 'bg-[#ff0033]/20 text-[#ff0033]' :
                                    item.sentiment === 'positive' ? 'bg-[#a855f7]/20 text-[#a855f7]' :
                                        'bg-[#00f0ff]/20 text-[#00f0ff]'
                                    }`}>
                                    {item.sentiment.toUpperCase()}
                                </span>
                            </div>
                            <div className="text-[#00f0ff] uppercase">{'>'} {item.title}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
