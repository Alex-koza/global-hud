import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    coinGeckoApiKey: '',
    finnhubApiKey: '',
    alphaVantageApiKey: '',
    acledApiKey: '',
    newsApiKey: '',
    theNewsApiKey: '',
    newsDataIoApiKey: '',
    openWeatherMapApiKey: '',
    nasaApiKey: '',
    adEnabled: true,
    adHtmlCode: '<div style="color: #00f0ff; text-align: center; padding: 20px; font-family: monospace;">BUY CYBER-IMPLANTS NOW!<br/>50% OFF AT RIOTDOCS</div>',
    tgBotToken: '',
    tgChannelId: '',
    tgPostTemplate: '🚨 [CLASSIFIED INTEL]\n\n{title}\n\nSentiment: {sentiment}',
};

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            settings: DEFAULT_SETTINGS,
            updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
            isAuthenticated: false,
            login: (password) => {
                // MVP Password
                if (password === 'classified123') {
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
