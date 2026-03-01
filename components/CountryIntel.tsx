"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, ExternalLink, ShieldAlert, TrendingUp, Bitcoin, Users, CloudRain, Shield, Zap } from 'lucide-react';
import { MiniChart } from '@/components/MiniChart';
import { playSound } from '@/lib/sounds';
import { useWindowStore } from '@/lib/windows';
import { useAdminStore } from '@/lib/adminStore';

export function CountryIntel({ countryName, windowId }: { countryName: string, windowId: string }) {
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const { openWindow } = useWindowStore();
    const { settings } = useAdminStore();
    const [weatherData, setWeatherData] = useState<any>(null);
    const [cryptoData, setCryptoData] = useState<{ btc: string, eth: string }>({ btc: '...', eth: '...' });
    const [financeData, setFinanceData] = useState<{ gdp?: string, inflation?: string, symbol?: string, price?: number, change?: number } | null>(null);
    const [acledData, setAcledData] = useState<any[]>([]);
    const [newsData, setNewsData] = useState<any[]>([]);
    const [nasaImage, setNasaImage] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        const fetchAll = async () => {
            let fetchedWeather = false;

            // 1. Try OpenWeatherMap (requires key)
            if (settings.openWeatherMapApiKey && countryName) {
                try {
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${settings.openWeatherMapApiKey}&units=metric`);
                    if (res.ok) {
                        const data = await res.json();
                        setWeatherData({ ...data, _source: 'openweathermap' });
                        fetchedWeather = true;
                    }
                } catch (e) { console.error("OWM Error", e); }
            }

            // 2. Fallback to Open-Meteo (keyless)
            if (!fetchedWeather && countryName) {
                try {
                    // Geocode country to get lat/lon via free Nominatim
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(countryName)}&format=json&limit=1`);
                    const geoData = await geoRes.json();

                    if (geoData && geoData.length > 0) {
                        const { lat, lon } = geoData[0];
                        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`);
                        const weatherDataRaw = await weatherRes.json();

                        if (weatherDataRaw && weatherDataRaw.current_weather) {
                            // Map Open-Meteo WMO codes to rough text
                            const code = weatherDataRaw.current_weather.weathercode;
                            let desc = "CLEAR";
                            if (code >= 51 && code <= 67) desc = "RAIN"; // Drizzle, Rain
                            if (code >= 71 && code <= 77) desc = "SNOW"; // Snow fall
                            if (code >= 95 && code <= 99) desc = "THUNDERSTORM"; // Thunderstorm

                            setWeatherData({
                                main: { temp: weatherDataRaw.current_weather.temperature, humidity: '--' }, // Open-Meteo current_weather doesn't provide humidity directly
                                weather: [{ description: desc }],
                                wind: { speed: weatherDataRaw.current_weather.windspeed },
                                _source: 'open-meteo'
                            });
                            fetchedWeather = true;
                        }
                    }
                } catch (e) { console.error("Open-Meteo Error", e); }
            }

            // 3. Fetch Crypto via Binance (Keyless)
            try {
                const cryptoRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT"]');
                const cryptoRaw = await cryptoRes.json();
                if (Array.isArray(cryptoRaw)) {
                    const btc = cryptoRaw.find((c: any) => c.symbol === 'BTCUSDT')?.price;
                    const eth = cryptoRaw.find((c: any) => c.symbol === 'ETHUSDT')?.price;
                    if (btc && eth) {
                        setCryptoData({
                            btc: parseFloat(btc).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                            eth: parseFloat(eth).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                        });
                    }
                }
            } catch (e) { console.error("Binance API Error", e); }

            // 4. Fetch Finnhub Economy Data (Keyless/Mock fallback)
            if (settings.finnhubApiKey) {
                try {
                    // Try to grab a major index or forex pair to represent "economy" health visually
                    // In a real app we'd map countryName to specific indices (e.g., SPY for US, FTSE for UK)
                    const symbol = countryName === 'United States' ? 'SPY' : 'OANDA:EUR_USD';
                    const finRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${settings.finnhubApiKey}`);
                    if (finRes.ok) {
                        const finData = await finRes.json();
                        setFinanceData({
                            symbol: symbol,
                            price: finData.c,
                            change: finData.dp
                        });
                    }
                } catch (e) { console.error("Finnhub Error", e); }
            }

            // 5. Fetch ACLED Conflict Data
            if (settings.acledApiKey) {
                try {
                    // Requires both key and email usually, but we'll use the key parameter as provided
                    // Format: https://api.acleddata.com/acled/read?key=XXX&email=XXX&country=XXX
                    // Assuming the user pasted "email|key" or just key. We'll attempt a basic fetch if possible, 
                    // or just mock it if it strictly requires an email we don't have.
                    // For safety, let's do a simple fetch if it's formatted as email:key
                    const [email, key] = settings.acledApiKey.includes(':') ? settings.acledApiKey.split(':') : ['', settings.acledApiKey];
                    if (email && key) {
                        const acledRes = await fetch(`https://api.acleddata.com/acled/read?key=${key}&email=${email}&country=${encodeURIComponent(countryName)}&limit=3`);
                        if (acledRes.ok) {
                            const acledRaw = await acledRes.json();
                            if (acledRaw.data) {
                                setAcledData(acledRaw.data);
                            }
                        }
                    }
                } catch (e) { console.error("ACLED Error", e); }
            }

            // 6. Fetch News (NewsData.io fallback)
            if (settings.newsDataIoApiKey && countryName) {
                try {
                    const url = `https://newsdata.io/api/1/latest?apikey=${settings.newsDataIoApiKey}&q=${encodeURIComponent(countryName)}&language=en`;
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.results) setNewsData(data.results.slice(0, 3));
                    }
                } catch (e) { console.error("NewsData Error", e); }
            } else if (settings.theNewsApiKey && countryName) {
                try {
                    const url = `https://api.thenewsapi.com/v1/news/all?api_token=${settings.theNewsApiKey}&search=${encodeURIComponent(countryName)}&language=en&limit=3`;
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.data) setNewsData(data.data);
                    }
                } catch (e) { console.error("TheNewsAPI Error", e); }
            }

            // 7. Fetch NASA Imagery (Fallback to empty)
            // Given we usually need lat/lon for Earth api, we'll try to use the geocoded lat/lon from Open-Meteo step if available
            // To keep it simple, we'll hit the NASA APOD for a cool space background if Earth imagery fails or coords are missing.
            if (settings.nasaApiKey) {
                try {
                    const url = `https://api.nasa.gov/planetary/apod?api_key=${settings.nasaApiKey}`;
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.url) setNasaImage(data.url);
                    }
                } catch (e) { console.error("NASA API Error", e); }
            }

            setTimeout(() => {
                setLoading(false);
                playSound('open');
            }, 1000);
        };

        fetchAll();
    }, [refreshKey, countryName, settings.openWeatherMapApiKey]);

    const handleRefresh = () => {
        playSound('hover');
        setRefreshKey(prev => prev + 1);
    };

    const handleOpenSubsection = (section: string) => {
        playSound('open');
        if (section === 'Geopolitics') {
            openWindow(
                `source_analysis-${countryName}`,
                'source_analysis',
                `CLASSIFIED: ${countryName} SOURCE ANALYSIS`,
                { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 }
            );
            return;
        }
        openWindow(
            `${windowId}-${section.toLowerCase()}`,
            'intel',
            `CLASSIFIED: ${countryName} - ${section.toUpperCase()} DEEP DIVE`,
            { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 }
        );
    };

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#00f0ff] animate-pulse">
                <RefreshCw className="animate-spin mb-4" size={32} />
                <div className="font-mono tracking-widest text-sm">ESTABLISHING SECURE CONNECTION...</div>
                <div className="font-mono tracking-widest text-xs text-[#00f0ff]/50 mt-2">DECRYPTING SATELLITE FEED</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col text-[#00f0ff] font-mono text-xs z-10 relative">
            <div className="flex items-center justify-between mb-4 border-b border-[#00f0ff]/30 pb-2">
                <div className="flex items-center gap-2 text-[#ff0033]">
                    <ShieldAlert size={16} className="animate-pulse" />
                    <span className="font-bold tracking-widest">LIVE FEED: {countryName}</span>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-1 px-2 py-1 border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 transition-colors"
                >
                    <RefreshCw size={12} /> REFRESH
                </button>
            </div>

            <Tabs defaultValue="geopolitics" className="flex-1 flex flex-col hidden-scrollbar">
                <TabsList className="bg-transparent border-b border-[#00f0ff]/30 rounded-none h-auto p-0 flex flex-wrap gap-2 mb-4 justify-start">
                    <TabsTrigger value="geopolitics" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-3 py-1 text-[10px] tracking-widest uppercase"><ShieldAlert size={12} className="mr-1" /> Geopolitics</TabsTrigger>
                    <TabsTrigger value="economy" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-3 py-1 text-[10px] tracking-widest uppercase"><TrendingUp size={12} className="mr-1" /> Economy</TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-3 py-1 text-[10px] tracking-widest uppercase"><Bitcoin size={12} className="mr-1" /> Crypto</TabsTrigger>
                    <TabsTrigger value="social" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-3 py-1 text-[10px] tracking-widest uppercase"><Users size={12} className="mr-1" /> Social</TabsTrigger>
                    <TabsTrigger value="climate" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-3 py-1 text-[10px] tracking-widest uppercase"><CloudRain size={12} className="mr-1" /> Climate</TabsTrigger>
                    <TabsTrigger value="cyber" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-3 py-1 text-[10px] tracking-widest uppercase"><Shield size={12} className="mr-1" /> Cyber</TabsTrigger>
                    <TabsTrigger value="energy" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-3 py-1 text-[10px] tracking-widest uppercase"><Zap size={12} className="mr-1" /> Energy</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                    {/* Geopolitics Tab */}
                    <TabsContent value="geopolitics" className="m-0 h-full flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-[#00f0ff]/20 p-2 bg-[#00f0ff]/5 relative">
                                <div className="absolute top-1 right-1 text-[8px] opacity-50 flex items-center gap-1">
                                    <div className={`w-1 h-1 rounded-full ${acledData.length > 0 ? 'bg-[#00f0ff] animate-pulse' : 'bg-[#ff0033]'}`} />
                                    {acledData.length > 0 ? 'LIVE (ACLED)' : 'MOCK'}
                                </div>
                                <div className="text-[10px] text-[#ff0033] mb-2 flex items-center justify-between">
                                    <span>RECENT CONFLICTS</span>
                                    {acledData.length === 0 && <span className="w-2 h-2 rounded-full bg-[#ff0033] animate-ping" />}
                                </div>
                                <ul className="space-y-2 opacity-80 h-[80px] overflow-hidden text-[10px]">
                                    {acledData.length > 0 ? acledData.map((ev, i) => (
                                        <li key={i} className="truncate" title={ev.notes}><span className="text-[#ff0033]">[{ev.event_type.substring(0, 4)}]</span> {ev.notes}</li>
                                    )) : (
                                        <>
                                            <li><span className="text-[#ff0033]">[ERR-01]</span> Border skirmish reported in northern sector. Status: Monitoring.</li>
                                            <li><span className="text-[#ff0033]">[WARN]</span> Political unrest in capitol. Protestors gathering.</li>
                                            <li><span className="text-[#00f0ff]">[INFO]</span> Diplomatic envoy arrived safely.</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            <div className="border border-[#00f0ff]/20 p-2 bg-[#00f0ff]/5 relative">
                                <div className="absolute top-1 right-1 text-[8px] opacity-50 flex items-center gap-1">
                                    <div className={`w-1 h-1 rounded-full ${newsData.length > 0 ? 'bg-[#00f0ff] animate-pulse' : 'bg-[#ff0033]'}`} />
                                    {newsData.length > 0 ? 'LIVE STREAM' : 'MOCK'}
                                </div>
                                <div className="text-[10px] text-[#00f0ff]/70 mb-2">NEWS FEED (INTERCEPT)</div>
                                <ul className="space-y-2 opacity-80 h-[80px] overflow-hidden text-[10px]">
                                    {newsData.length > 0 ? newsData.map((n, idx) => (
                                        <li key={idx} className="truncate" title={n.title || n.headline}>{'>'} {n.title || n.headline}</li>
                                    )) : (
                                        <>
                                            <li>{'>'} Government announces new fiscal policy...</li>
                                            <li>{'>'} Opposition leader calls for snap elections...</li>
                                            <li>{'>'} International trade agreement signed today...</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <button
                                onClick={() => handleOpenSubsection('Geopolitics')}
                                className="w-full flex items-center justify-center gap-2 py-2 border border-[#00f0ff]/50 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 transition-colors uppercase tracking-widest text-[#00f0ff]"
                            >
                                <ExternalLink size={14} /> Open Deep Dive
                            </button>
                        </div>
                    </TabsContent>

                    {/* Economy Tab */}
                    <TabsContent value="economy" className="m-0 h-full flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-[#00f0ff]/20 p-2 bg-[#00f0ff]/5 relative flex flex-col justify-center items-center">
                                <div className="absolute top-1 right-1 text-[8px] opacity-50 flex items-center gap-1">
                                    <div className={`w-1 h-1 rounded-full ${financeData ? 'bg-[#00f0ff] animate-pulse' : 'bg-[#ff0033]'}`} />
                                    {financeData ? 'LIVEHQ' : 'MOCK'}
                                </div>
                                <span className="text-[10px] text-[#00f0ff]/70 uppercase">{financeData?.symbol || 'GDP Growth'}</span>
                                <span className={`text-xl font-bold ${financeData?.change && financeData.change < 0 ? 'text-[#ff0033]' : 'text-[#00f0ff]'}`}>
                                    {financeData ? `${financeData.change?.toFixed(2)}%` : '+2.4%'}
                                </span>
                            </div>
                            <div className="border border-[#ff0033]/20 p-2 bg-[#ff0033]/5 flex flex-col justify-center items-center">
                                <span className="text-[10px] text-[#ff0033]/70 uppercase">Inflation / Rates</span>
                                <span className="text-xl text-[#ff0033] font-bold">8.1%</span>
                            </div>
                        </div>
                        <div>
                            <MiniChart />
                        </div>
                        <div className="mt-auto">
                            <button onClick={() => handleOpenSubsection('Economy')} className="w-full flex items-center justify-center gap-2 py-2 border border-[#00f0ff]/50 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 transition-colors uppercase tracking-widest text-[#00f0ff]">
                                <ExternalLink size={14} /> Open Deep Dive
                            </button>
                        </div>
                    </TabsContent>

                    {/* Crypto Tab */}
                    <TabsContent value="crypto" className="m-0 h-full flex flex-col gap-4">
                        <div className="border border-[#a855f7]/30 p-2 bg-[#a855f7]/5 relative">
                            <div className="absolute top-2 right-2 text-[8px] opacity-50 flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${cryptoData.btc !== '...' ? 'bg-[#00f0ff] animate-pulse' : 'bg-[#ff0033]'}`} />
                                {cryptoData.btc !== '...' ? 'LIVE (BINANCE)' : 'MOCK'}
                            </div>
                            <div className="text-[10px] text-[#a855f7] mb-2">LOCAL CRYPTO ADOPTION METRICS</div>
                            <table className="w-full text-left opacity-90">
                                <thead><tr className="border-b border-[#a855f7]/30 text-[#a855f7]/70"><th className="pb-1">ASSET</th><th>PRICE (Local)</th><th>24H VOL</th></tr></thead>
                                <tbody>
                                    <tr><td className="py-1">BTC</td><td className="text-[#00f0ff]">{cryptoData.btc !== '...' ? cryptoData.btc : '$64,230'}</td><td className="text-[#00f0ff]">LIVE</td></tr>
                                    <tr><td className="py-1">ETH</td><td className="text-[#00f0ff]">{cryptoData.eth !== '...' ? cryptoData.eth : '$3,450'}</td><td className="text-[#ff0033]">LIVE</td></tr>
                                    <tr><td className="py-1">USDT</td><td className="text-[#00f0ff]">$1.00</td><td className="text-[#00f0ff]">0.0%</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div><MiniChart /></div>
                        <div className="mt-auto">
                            <button onClick={() => handleOpenSubsection('Crypto')} className="w-full flex items-center justify-center gap-2 py-2 border border-[#a855f7]/50 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 transition-colors uppercase tracking-widest text-[#a855f7]">
                                <ExternalLink size={14} /> Open Deep Dive
                            </button>
                        </div>
                    </TabsContent>

                    {/* Social Tab */}
                    <TabsContent value="social" className="m-0 h-full flex flex-col gap-4">
                        <div className="border border-[#00f0ff]/20 p-2 bg-[#00f0ff]/5">
                            <div className="text-[10px] text-[#00f0ff]/70 mb-2">SOCIAL SENTIMENT ANALYSIS</div>
                            <div className="w-full bg-[#05080f] h-4 border border-[#00f0ff]/30 relative overflow-hidden mb-2">
                                <div className="absolute top-0 left-0 h-full bg-[#ff0033]" style={{ width: '35%' }} />
                                <div className="absolute top-0 left-[35%] h-full bg-[#00f0ff]/50" style={{ width: '45%' }} />
                                <div className="absolute top-0 left-[80%] h-full bg-[#a855f7]" style={{ width: '20%' }} />
                            </div>
                            <div className="flex justify-between text-[10px] opacity-70">
                                <span className="text-[#ff0033]">NEGATIVE: 35%</span>
                                <span className="text-[#00f0ff]">NEUTRAL: 45%</span>
                                <span className="text-[#a855f7]">POSITIVE: 20%</span>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <button onClick={() => handleOpenSubsection('Social')} className="w-full flex items-center justify-center gap-2 py-2 border border-[#00f0ff]/50 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 transition-colors uppercase tracking-widest text-[#00f0ff]">
                                <ExternalLink size={14} /> Open Deep Dive
                            </button>
                        </div>
                    </TabsContent>

                    {/* Climate Tab */}
                    <TabsContent value="climate" className="m-0 h-full flex flex-col gap-4">
                        <div className="border border-[#00f0ff]/20 p-4 bg-[#00f0ff]/5 text-center opacity-80 relative overflow-hidden min-h-[150px] flex flex-col justify-center">

                            {nasaImage && (
                                <div
                                    className="absolute inset-0 z-0 opacity-30 bg-cover bg-center mix-blend-screen"
                                    style={{ backgroundImage: `url(${nasaImage})` }}
                                />
                            )}

                            <div className="absolute top-2 right-2 text-[8px] opacity-50 flex items-center gap-1 z-10">
                                <div className={`w-1.5 h-1.5 rounded-full ${weatherData ? 'bg-[#00f0ff] animate-pulse' : 'bg-[#ff0033]'}`} />
                                {weatherData ? (weatherData._source === 'open-meteo' ? 'LIVE (OPEN-METEO)' : 'LIVE (OWM)') : 'MOCK'}
                            </div>

                            <div className="relative z-10">
                                {weatherData ? (
                                    <>
                                        <CloudRain size={32} className="mx-auto text-[#00f0ff] mb-2" />
                                        <p className="text-xl font-bold text-[#00f0ff]">{Math.round(weatherData.main.temp)}°C</p>
                                        <p className="text-sm text-[#00f0ff] uppercase">{weatherData.weather[0].description}</p>
                                        <div className="text-[10px] mt-2 flex justify-center gap-4 text-[#00f0ff]/70">
                                            <span>HUMIDITY: {weatherData.main.humidity}%</span>
                                            <span>WIND: {weatherData.wind.speed} {weatherData._source === 'open-meteo' ? 'km/h' : 'm/s'}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <CloudRain size={32} className="mx-auto text-[#00f0ff] mb-2" />
                                        <p className="text-lg text-[#00f0ff]">MODERATE RAINFALL</p>
                                        <p className="text-xs mt-2 text-[#ff0033] animate-pulse">WARNING: FLOOD RISK IN SOUTHERN REGIONS</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mt-auto">
                            <button onClick={() => handleOpenSubsection('Climate')} className="w-full flex items-center justify-center gap-2 py-2 border border-[#00f0ff]/50 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 transition-colors uppercase tracking-widest text-[#00f0ff]">
                                <ExternalLink size={14} /> Open Deep Dive
                            </button>
                        </div>
                    </TabsContent>

                    {/* Cyber Tab */}
                    <TabsContent value="cyber" className="m-0 h-full flex flex-col gap-4">
                        <div className="border border-[#ff0033]/30 p-2 bg-[#ff0033]/5 text-[#ff0033]">
                            <div className="text-[10px] mb-2 flex items-center justify-between">
                                <span>ACTIVE THREATS DETECTED</span>
                                <span className="text-xs font-bold">CRITICAL</span>
                            </div>
                            <ul className="list-disc pl-4 space-y-1 opacity-90 text-[10px]">
                                <li>DDoS attack originating from unknown IP cluster.</li>
                                <li>Phishing campaign targeting government employees.</li>
                                <li>Malware variant scanning port 443.</li>
                            </ul>
                        </div>
                        <div className="mt-auto">
                            <button onClick={() => handleOpenSubsection('Cyber')} className="w-full flex items-center justify-center gap-2 py-2 border border-[#ff0033]/50 bg-[#ff0033]/10 hover:bg-[#ff0033]/20 transition-colors uppercase tracking-widest text-[#ff0033]">
                                <ExternalLink size={14} /> Open Deep Dive
                            </button>
                        </div>
                    </TabsContent>

                    {/* Energy Tab */}
                    <TabsContent value="energy" className="m-0 h-full flex flex-col gap-4">
                        <div className="border border-[#a855f7]/30 p-4 bg-[#a855f7]/5 text-center">
                            <Zap size={32} className="mx-auto text-[#a855f7] mb-2" />
                            <p className="text-[#a855f7] font-bold">GRID STATUS: STABLE</p>
                            <p className="text-xs opacity-70 mt-2">Renewable Output: 42%</p>
                        </div>
                        <div><MiniChart /></div>
                        <div className="mt-auto">
                            <button onClick={() => handleOpenSubsection('Energy')} className="w-full flex items-center justify-center gap-2 py-2 border border-[#a855f7]/50 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 transition-colors uppercase tracking-widest text-[#a855f7]">
                                <ExternalLink size={14} /> Open Deep Dive
                            </button>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
