"use client";

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/lib/adminStore';
import { useRouter } from '@/i18n/routing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShieldCheck, LogOut, Key, MonitorPlay, Send, Check, Activity } from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';
import { playSound } from '@/lib/sounds';
import html2canvas from 'html2canvas';

export default function AdminDashboard() {
    const { settings, updateSettings, isAuthenticated, logout } = useAdminStore();
    const router = useRouter();
    const [isTestPosting, setIsTestPosting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const handleSave = () => {
        playSound('open');
        // Save logic is handled automatically by Zustand updating individual fields via onChange
        // This button mostly serves as visual feedback for now or we could use local state and save on submit.
        // For simplicity, we are binding inputs directly to Zustand, but a real app might use React Hook Form here.
        alert('SETTINGS SAVED TO SECURE STORAGE');
    };

    const handleLogout = () => {
        playSound('close');
        logout();
        router.push('/admin');
    };

    const handleTestPost = async () => {
        if (!settings.tgBotToken || !settings.tgChannelId) {
            alert('Missing Telegram Bot Token or Channel ID.');
            return;
        }
        playSound('hover');
        setIsTestPosting(true);
        try {
            // Capture the admin dashboard screen
            const canvas = await html2canvas(document.body, { backgroundColor: '#05080f' });
            const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

            const testMsg = settings.tgPostTemplate
                .replace('{title}', 'TEST: SYSTEM CALIBRATION')
                .replace('{sentiment}', 'NEUTRAL')
                .replace('{source}', 'ADMIN_PANEL');

            const res = await fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: settings.tgBotToken,
                    chatId: settings.tgChannelId,
                    text: testMsg,
                    imageBase64
                })
            });

            const data = await res.json();
            if (data.success) {
                playSound('open');
                alert('TEST DISPATCH SUCCESSFUL');
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            playSound('error');
            alert(`TEST DISPATCH FAILED: ${err.message}`);
        } finally {
            setIsTestPosting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05080f] text-[#00f0ff] font-mono p-4 md:p-8">
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

            {/* Live Preview of Ad Banner */}
            <AdBanner />

            <div className="max-w-4xl mx-auto relative z-10 border border-[#00f0ff]/30 bg-[#00f0ff]/5 p-6 backdrop-blur-md">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#00f0ff]/30 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={32} className="text-[#ff0033] animate-pulse" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-widest leading-none">COMMAND CENTER</h1>
                            <p className="text-[10px] text-[#00f0ff]/50 mt-1">SYSTEM CONFIGURATION // OMEGA CLEARANCE</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033]/20 hover:text-[#ff0033] rounded-none font-bold tracking-widest"
                    >
                        <LogOut size={16} className="mr-2" /> TERMINATE SESSION
                    </Button>
                </div>

                {/* Configuration Tabs */}
                <Tabs defaultValue="apikeys" className="w-full">
                    <TabsList className="bg-transparent border-b border-[#00f0ff]/30 rounded-none h-auto p-0 flex flex-wrap gap-2 mb-8 justify-start">
                        <TabsTrigger value="apikeys" className="data-[state=active]:bg-[#00f0ff]/20 data-[state=active]:text-[#00f0ff] border border-transparent data-[state=active]:border-[#00f0ff]/50 rounded-none px-4 py-2 uppercase tracking-widest text-xs">
                            <Key size={14} className="mr-2" /> API Keys
                        </TabsTrigger>
                        <TabsTrigger value="ads" className="data-[state=active]:bg-[#ff0033]/20 data-[state=active]:text-[#ff0033] border border-transparent data-[state=active]:border-[#ff0033]/50 rounded-none px-4 py-2 uppercase tracking-widest text-xs">
                            <MonitorPlay size={14} className="mr-2" /> Advertisements
                        </TabsTrigger>
                        <TabsTrigger value="telegram" className="data-[state=active]:bg-[#a855f7]/20 data-[state=active]:text-[#a855f7] border border-transparent data-[state=active]:border-[#a855f7]/50 rounded-none px-4 py-2 uppercase tracking-widest text-xs">
                            <Send size={14} className="mr-2" /> Telegram Bridge
                        </TabsTrigger>
                    </TabsList>

                    {/* API Keys Tab */}
                    <TabsContent value="apikeys" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="coinGecko" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">CoinGecko API (Pro)</Label>
                                <Input
                                    id="coinGecko"
                                    type="password"
                                    value={settings.coinGeckoApiKey}
                                    onChange={(e) => updateSettings({ coinGeckoApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="CG-XXXXXXXXXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="finnhub" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">Finnhub API</Label>
                                <Input
                                    id="finnhub"
                                    type="password"
                                    value={settings.finnhubApiKey}
                                    onChange={(e) => updateSettings({ finnhubApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="FIN-XXXXXXXXXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acled" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">ACLED Access Key</Label>
                                <Input
                                    id="acled"
                                    type="password"
                                    value={settings.acledApiKey}
                                    onChange={(e) => updateSettings({ acledApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="ACLED-XXXXXXXXXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newsapi" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">NewsAPI Key</Label>
                                <Input
                                    id="newsapi"
                                    type="password"
                                    value={settings.newsApiKey}
                                    onChange={(e) => updateSettings({ newsApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="aff9...fc"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="thenewsapi" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">TheNewsAPI Token</Label>
                                <Input
                                    id="thenewsapi"
                                    type="password"
                                    value={settings.theNewsApiKey}
                                    onChange={(e) => updateSettings({ theNewsApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="ROpRO..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newsdataio" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">NewsData.io PubKey</Label>
                                <Input
                                    id="newsdataio"
                                    type="password"
                                    value={settings.newsDataIoApiKey}
                                    onChange={(e) => updateSettings({ newsDataIoApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="pub_xxx..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="alphavantage" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">Alpha Vantage API</Label>
                                <Input
                                    id="alphavantage"
                                    type="password"
                                    value={settings.alphaVantageApiKey}
                                    onChange={(e) => updateSettings({ alphaVantageApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="WTE...47N"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="openweather" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">OpenWeatherMap API</Label>
                                <Input
                                    id="openweather"
                                    type="password"
                                    value={settings.openWeatherMapApiKey}
                                    onChange={(e) => updateSettings({ openWeatherMapApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="d641..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nasa" className="text-[#00f0ff]/70 text-[10px] uppercase tracking-widest">NASA Exoplanet API Key</Label>
                                <Input
                                    id="nasa"
                                    type="password"
                                    value={settings.nasaApiKey}
                                    onChange={(e) => updateSettings({ nasaApiKey: e.target.value })}
                                    className="bg-[#05080f] border-[#00f0ff]/30 text-[#00f0ff] rounded-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-0"
                                    placeholder="BHGt..."
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-[#00f0ff]/40">Keys are encrypted and stored in local persistance per secure session.</p>
                    </TabsContent>

                    {/* Advertisements Tab */}
                    <TabsContent value="ads" className="space-y-6">
                        <div className="flex items-center gap-3 border border-[#ff0033]/30 bg-[#ff0033]/5 p-4">
                            <input
                                type="checkbox"
                                id="adEnabled"
                                checked={settings.adEnabled}
                                onChange={(e) => updateSettings({ adEnabled: e.target.checked })}
                                className="w-4 h-4 accent-[#ff0033] bg-[#05080f] border-[#ff0033]"
                            />
                            <Label htmlFor="adEnabled" className="text-[#ff0033] text-sm font-bold uppercase tracking-widest cursor-pointer">
                                ENABLE GLOBAL NETWORK INJECTIONS (ADS)
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adHtml" className="text-[#ff0033] text-xs uppercase tracking-widest flex items-center justify-between">
                                <span>INJECTION PAYLOAD (HTML/JS)</span>
                                <span className="text-[10px] text-[#ff0033]/50">300x250 RECOMMENDED</span>
                            </Label>
                            <Textarea
                                id="adHtml"
                                rows={10}
                                value={settings.adHtmlCode}
                                onChange={(e) => updateSettings({ adHtmlCode: e.target.value })}
                                className="bg-[#05080f] border-[#ff0033]/50 text-[#ff0033] font-mono text-sm rounded-none focus-visible:ring-1 focus-visible:ring-[#ff0033] focus-visible:ring-offset-0 custom-scrollbar"
                                placeholder="<!-- Paste AdSense or custom HTML code here -->"
                            />
                        </div>
                    </TabsContent>

                    {/* Telegram Tab */}
                    <TabsContent value="telegram" className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tgBotToken" className="text-[#a855f7] text-[10px] uppercase tracking-widest">BOT TOKEN</Label>
                                <Input
                                    id="tgBotToken"
                                    type="password"
                                    value={settings.tgBotToken}
                                    onChange={(e) => updateSettings({ tgBotToken: e.target.value })}
                                    className="bg-[#05080f] border-[#a855f7]/40 text-[#a855f7] rounded-none focus-visible:ring-1 focus-visible:ring-[#a855f7] focus-visible:ring-offset-0"
                                    placeholder="1234567890:AAHXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tgChannelId" className="text-[#a855f7] text-[10px] uppercase tracking-widest">CHANNEL / CHAT ID</Label>
                                <Input
                                    id="tgChannelId"
                                    value={settings.tgChannelId}
                                    onChange={(e) => updateSettings({ tgChannelId: e.target.value })}
                                    className="bg-[#05080f] border-[#a855f7]/40 text-[#a855f7] rounded-none focus-visible:ring-1 focus-visible:ring-[#a855f7] focus-visible:ring-offset-0"
                                    placeholder="@MySecretChannel or -100XXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tgTemplate" className="text-[#a855f7] text-xs uppercase tracking-widest flex items-center justify-between">
                                    <span>DISPATCH TEMPLATE</span>
                                    <span className="text-[10px] text-[#a855f7]/50">{'{title}'}, {'{sentiment}'}, {'{source}'} available</span>
                                </Label>
                                <Textarea
                                    id="tgTemplate"
                                    rows={6}
                                    value={settings.tgPostTemplate}
                                    onChange={(e) => updateSettings({ tgPostTemplate: e.target.value })}
                                    className="bg-[#05080f] border-[#a855f7]/40 text-[#a855f7] font-mono rounded-none focus-visible:ring-1 focus-visible:ring-[#a855f7] focus-visible:ring-offset-0 custom-scrollbar"
                                    placeholder="🚨 [CLASSIFIED INTEL]&#10;&#10;{title}&#10;&#10;Sentiment: {sentiment}"
                                />
                            </div>

                            <div className="pt-4 border-t border-[#a855f7]/30">
                                <Button
                                    onClick={handleTestPost}
                                    disabled={isTestPosting}
                                    className="w-full bg-[#a855f7]/20 border border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/40 hover:text-[#a855f7] rounded-none font-bold tracking-widest disabled:opacity-50"
                                >
                                    {isTestPosting ? <Activity size={16} className="mr-2 animate-spin" /> : <Send size={16} className="mr-2" />}
                                    {isTestPosting ? 'TRANSMITTING...' : 'DISPATCH TEST SCREENSHOT'}
                                </Button>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>

                {/* Global Action Footer */}
                <div className="mt-8 pt-6 border-t border-[#00f0ff]/30 flex justify-end">
                    <Button
                        onClick={handleSave}
                        className="bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/40 hover:text-[#00f0ff] rounded-none font-bold tracking-widest px-8"
                    >
                        <Check size={16} className="mr-2" /> COMMIT CHANGES
                    </Button>
                </div>

            </div>
        </div>
    );
}
