"use client";

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Taskbar } from '@/components/Taskbar';
import { SpyWindow } from '@/components/SpyWindow';
import { MiniChart } from '@/components/MiniChart';
import { CountryIntel } from '@/components/CountryIntel';
import { SourceAnalysis } from '@/components/SourceAnalysis';
import { VIPSignal } from '@/components/VIPSignal';
import { AdBanner } from '@/components/AdBanner';
import { useWindowStore } from '@/lib/windows';

// Disable SSR for MapBackground since leaflet requires `window`
const MapBackground = dynamic(() => import('@/components/MapBackground'), {
  ssr: false,
});

import { useEffect, useRef } from 'react';

export default function DesktopOS() {
  const t = useTranslations('Desktop');
  const tWindows = useTranslations('Windows');
  const { windows, openWindow } = useWindowStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current && windows.length === 0) {
      initRef.current = true;
      // Stagger window opens for visual effect
      setTimeout(() => openWindow('global-overview', 'radar', t('global_overview'), { x: 50, y: 50 }), 500);
      setTimeout(() => openWindow('system-status', 'database', t('system_status'), { x: 500, y: 150 }), 1000);
      setTimeout(() => openWindow('alert-log', 'terminal', t('alert_log'), { x: 100, y: 350 }), 1500);
    }
  }, [openWindow, t, windows.length]);

  return (
    <main id="spy-os-desktop-main" className="w-screen h-screen relative bg-[#05080f] overflow-hidden select-none">
      {/* Dynamic Background */}
      <MapBackground />

      <div className="absolute inset-0 pointer-events-none z-10 scanlines" />

      {/* Welcome Glitch Text if no windows are open */}
      {windows.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <h1 className="text-6xl font-bold tracking-widest uppercase glitch-text text-[#00f0ff] opacity-80" data-text={t('welcome')}>
            {t('welcome')}
          </h1>
          <p className="mt-4 text-[#a855f7] tracking-[0.5em] animate-pulse text-sm">
            SYSTEM STANDBY
          </p>
        </div>
      )}

      {/* Render all active SpyWindows */}
      {windows.map((w) => (
        <SpyWindow key={w.id} id={w.id} title={w.title}>
          {w.type === 'terminal' && (
            <div className="text-[#00f0ff] font-mono text-xs leading-loose">
              <p>{'> INITIALIZING SECURE SHELL...'}</p>
              <p className="text-[#00f0ff]/50">{'> CONNECTION ESTABLISHED.'}</p>
              <p className="text-[#00f0ff]/50">{'> WAITING FOR INPUT_'}</p>
            </div>
          )}
          {w.type === 'radar' && (
            <div className="flex items-center justify-center h-full">
              <div className="w-32 h-32 rounded-full border-2 border-[#00f0ff]/30 flex items-center justify-center relative">
                <div className="w-24 h-24 rounded-full border border-[#00f0ff]/20" />
                <div className="w-16 h-16 rounded-full border border-[#00f0ff]/10" />
                <div className="absolute inset-0 border-t-2 border-[#ff0033] rounded-full animate-spin [animation-duration:3s]" />
              </div>
            </div>
          )}
          {w.type === 'comms' && (
            <div className="text-[#a855f7] font-mono text-sm leading-snug">
              <p>ENCRYPTED CHANNEL 7A</p>
              <div className="mt-4 h-1 w-full bg-[#a855f7]/20 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-[#a855f7] w-1/3 animate-[slide_2s_infinite]" />
              </div>
            </div>
          )}
          {w.type === 'database' && (
            <div className="text-[#00f0ff] text-xs h-full flex flex-col">
              <table className="w-full text-left">
                <thead><tr className="border-b border-[#00f0ff]/30"><th className="pb-2">ID</th><th>TARGET</th><th>STATUS</th></tr></thead>
                <tbody>
                  <tr className="animate-pulse"><td>001</td><td>SIGMA-9</td><td className="text-[#ff0033]">COMPROMISED</td></tr>
                  <tr><td>002</td><td>ECHO-BASE</td><td className="text-[#a855f7]">SECURE</td></tr>
                  <tr><td>003</td><td>NODE-X</td><td className="text-[#00f0ff]">ONLINE</td></tr>
                </tbody>
              </table>
              <div className="mt-auto">
                <MiniChart />
              </div>
            </div>
          )}
          {w.type === 'intel' && (
            <CountryIntel
              windowId={w.id}
              countryName={w.title.replace('CLASSIFIED: ', '').replace(' INTEL', '')}
            />
          )}
          {w.type === 'source_analysis' && (
            <SourceAnalysis
              country={w.id.includes('-') ? w.id.split('-').slice(1).join(' ') : undefined}
            />
          )}
          {w.type === 'vip_signal' && (
            <VIPSignal />
          )}
        </SpyWindow>
      ))}

      <AdBanner />
      {/* Bottom Taskbar */}
      <Taskbar />

    </main>
  );
}
