import { Metadata } from 'next';
import { DesktopWrapper } from './DesktopWrapper';

export async function generateMetadata({ params }: { params: { country: string, locale: string } }): Promise<Metadata> {
    const countryFormatted = params.country.toUpperCase();
    return {
        title: `Intelligence Report: ${countryFormatted}`,
        description: `Real-time geopolitical and cybersecurity intelligence for ${countryFormatted}.`,
        openGraph: {
            title: `Intelligence Report: ${countryFormatted} | Global HUD`,
            description: `View live classified data, market trends, and risk analysis for ${countryFormatted}.`,
            images: ['/og-image.jpg'],
        }
    };
}

export default function CountryIntelPage({ params }: { params: { country: string, locale: string } }) {
    // This page renders the exact same DesktopOS, but passing a prop or state 
    // so that the initial load spawns this specific country.
    // Since we rely on Zustand and `DesktopOS` is a client component, 
    // we can just render DesktopOS and rely on a specific query param or effect inside it, 
    // OR we can pass initial windows to DesktopOS.
    // For simplicity without massive refactoring, we'll wrap DesktopOS and use an effect.

    return <DesktopWrapper country={params.country} />;
}
