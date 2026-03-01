import { create } from 'zustand';

export type WindowType = string;

export interface WindowState {
    id: string;
    type: WindowType;
    title: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
    isMinimized?: boolean;
    isMaximized?: boolean;
    isFocused?: boolean;
    zIndex: number;
}

export interface MapLayers {
    conflicts: boolean;
    crypto: boolean;
    finance: boolean;
    climate: boolean;
    cyber: boolean;
    migration: boolean;
    energy: boolean;
}

interface WindowStore {
    windows: WindowState[];
    activeZIndex: number;
    mapLayers: MapLayers;
    selectedCountry: string | null;
    openWindow: (id: string, type: WindowType, title: string, position?: { x: number; y: number }) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    updatePosition: (id: string, position: { x: number; y: number }) => void;
    updateSize: (id: string, size: { width: number; height: number }) => void;
    focusWindow: (id: string) => void;
    minimizeAll: () => void;
    toggleMapLayer: (layer: keyof MapLayers) => void;
    setSelectedCountry: (country: string | null) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
    windows: [],
    activeZIndex: 100,
    mapLayers: {
        conflicts: true,
        crypto: false,
        finance: false,
        climate: false,
        cyber: false,
        migration: false,
        energy: false
    },
    selectedCountry: null,
    openWindow: (id, type, title, position = { x: 100, y: 100 }) => {
        set((state) => {
            const existing = state.windows.find((w) => w.id === id);
            const newZIndex = state.activeZIndex + 1;

            if (existing) {
                return {
                    activeZIndex: newZIndex,
                    windows: state.windows.map(w =>
                        w.id === id
                            ? { ...w, isFocused: true, isMinimized: false, isMaximized: false, zIndex: newZIndex }
                            : { ...w, isFocused: false }
                    )
                };
            }

            return {
                activeZIndex: newZIndex,
                windows: [
                    ...state.windows.map(w => ({ ...w, isFocused: false })),
                    { id, type, title, position, isFocused: true, zIndex: newZIndex }
                ],
            };
        });
    },
    closeWindow: (id) =>
        set((state) => ({
            windows: state.windows.filter((w) => w.id !== id),
        })),
    minimizeWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true, isFocused: false } : w)),
        })),
    maximizeWindow: (id) =>
        set((state) => {
            const newZIndex = state.activeZIndex + 1;
            return {
                activeZIndex: newZIndex,
                windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: true, isFocused: true, zIndex: newZIndex } : { ...w, isFocused: false })),
            }
        }),
    restoreWindow: (id) =>
        set((state) => {
            const newZIndex = state.activeZIndex + 1;
            return {
                activeZIndex: newZIndex,
                windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: false, isMaximized: false, isFocused: true, zIndex: newZIndex } : { ...w, isFocused: false })),
            }
        }),
    updatePosition: (id, position) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
        })),
    updateSize: (id, size) =>
        set((state) => ({
            windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
        })),
    focusWindow: (id) =>
        set((state) => {
            const isAlreadyFocused = state.windows.find(w => w.id === id)?.isFocused;
            if (isAlreadyFocused) return state;

            const newZIndex = state.activeZIndex + 1;
            return {
                activeZIndex: newZIndex,
                windows: state.windows.map(w =>
                    w.id === id ? { ...w, isFocused: true, zIndex: newZIndex } : { ...w, isFocused: false }
                ),
            };
        }),
    minimizeAll: () =>
        set((state) => ({
            windows: state.windows.map((w) => ({ ...w, isMinimized: true, isFocused: false })),
        })),
    toggleMapLayer: (layer) =>
        set((state) => ({
            mapLayers: { ...state.mapLayers, [layer]: !state.mapLayers[layer] }
        })),
    setSelectedCountry: (country) =>
        set({ selectedCountry: country })
}));
