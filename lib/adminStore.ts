import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface YoutubeStream {
    id: string;
    label: string;
    name: string;
}

export interface AdminSettings {
    // API Keys
    coinGeckoApiKey: string;
    finnhubApiKey: string;
    alphaVantageApiKey: string;
    acledApiKey: string;
    newsApiKey: string;
    theNewsApiKey: string;
    newsDataIoApiKey: string;
    openWeatherMapApiKey: string;
    nasaApiKey: string;

    // YouTube Streams
    youtubeStreams: YoutubeStream[];

    // Advertisements
    adEnabled: boolean;
    adHtmlCode: string;

    // Telegram
    tgBotToken: string;
    tgChannelId: string;
    tgPostTemplate: string;
}

interface AdminState {
    settings: AdminSettings;
    updateSettings: (newSettings: Partial<AdminSettings>) => void;
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

const DEFAULT_SETTINGS: AdminSettings = {
    coinGeckoApiKey: process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '',
    finnhubApiKey: process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '',
    alphaVantageApiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || '',
    acledApiKey: process.env.NEXT_PUBLIC_ACLED_API_KEY || '',
    newsApiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
    theNewsApiKey: process.env.NEXT_PUBLIC_THE_NEWS_API_KEY || '',
    newsDataIoApiKey: process.env.NEXT_PUBLIC_NEWS_DATA_IO_API_KEY || '',
    openWeatherMapApiKey: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || '',
    nasaApiKey: process.env.NEXT_PUBLIC_NASA_API_KEY || '',
    // Using YouTube Channel IDs to always get the active live stream
    youtubeStreams: [
        { id: 'UCNye-wNBqNL5ZzHSJj3l8Bg', label: 'AJE', name: 'AL JAZEERA ENGLISH' },
        { id: 'zplk7DxFla0', label: 'SKY', name: 'SKY NEWS' },
        { id: 'bsp0D0pV4_o', label: 'CBC', name: 'CBC NEWS' },
        { id: 'UCknLrEdhRCp1aegoMqRaCZg', label: 'DW', name: 'DW NEWS' },
    ],
    adEnabled: true,
    adHtmlCode: '<div style="color: #00f0ff; text-align: center; padding: 20px; font-family: monospace;">BUY CYBER-IMPLANTS NOW!<br/>50% OFF AT RIOTDOCS</div>',
    tgBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    tgChannelId: process.env.TELEGRAM_CHANNEL_ID || '',
    tgPostTemplate: '🚨 [CLASSIFIED INTEL]\n\n{title}\n\nSentiment: {sentiment}',
};

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            settings: DEFAULT_SETTINGS,
            updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
            isAuthenticated: false,
            login: (password) => {
                // MVP Password from environment variable
                const adminPass = process.env.ADMIN_PASSWORD || 'classified123';
                if (password === adminPass) {
                    set({ isAuthenticated: true });
                    return true;
                }
                return false;
            },
            logout: () => set({ isAuthenticated: false }),
        }),
        {
            name: 'global-hud-admin-storage',
        }
    )
);
