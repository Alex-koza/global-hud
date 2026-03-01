"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useWindowStore } from "@/lib/windows";
import { useTranslations } from "next-intl";
import { playSound } from "@/lib/sounds";

// Mock conflict data
const MOCK_CONFLICTS = [
    { id: 1, lat: 48.3794, lng: 31.1656, intensity: 1.5, name: "Eastern Europe" }, // Ukraine
    { id: 2, lat: 31.0461, lng: 34.8516, intensity: 1.8, name: "Middle East" }, // Israel/Gaza
    { id: 3, lat: 15.0000, lng: 30.0000, intensity: 1.2, name: "Sudan" },
    { id: 4, lat: 23.6345, lng: -102.5528, intensity: 1.0, name: "Mexico" },
    { id: 5, lat: 10.4806, lng: -66.9036, intensity: 0.8, name: "Venezuela" },
    { id: 6, lat: 34.5553, lng: 69.2075, intensity: 1.1, name: "Afghanistan" },
];

const createPulseIcon = (intensity: number) => {
    const size = Math.max(10, intensity * 20);
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            width: ${size}px; 
            height: ${size}px; 
            background: rgba(255, 0, 51, 0.6); 
            border: 2px solid #ff0033;
            border-radius: 50%; 
            box-shadow: 0 0 ${size}px #ff0033;
            animation: pulse-conflict ${2 - intensity * 0.5}s infinite alternate;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

export default function MapBackground() {
    const [geoData, setGeoData] = useState<any>(null);
    const { openWindow, mapLayers, setSelectedCountry } = useWindowStore();
    const tAlerts = useTranslations("Alerts");
    const tWindows = useTranslations("Windows");

    useEffect(() => {
        fetch("/countries.geojson")
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Failed to load map data", err));
    }, []);

    const handleCountryClick = (feature: any) => {
        const countryName = feature.properties?.name || "UNKNOWN";
        const windowId = `intel-${countryName.replace(/\\s+/g, '-').toLowerCase()}`;
        playSound('open');
        openWindow(
            windowId,
            'intel',
            `${tAlerts('classified')}: ${countryName} ${tWindows('intel')}`
        );
    };

    const handleMouseOver = (e: any, feature: any) => {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#00ffff',
            fillColor: '#00f0ff',
            fillOpacity: 0.3,
            dashArray: '',
        });
        layer.bringToFront();
        setSelectedCountry(feature.properties?.name || null);
        playSound('hover');
    };

    const handleMouseOut = (e: any) => {
        const layer = e.target;
        layer.setStyle(geoJsonStyle);
        setSelectedCountry(null);
    };

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            click: () => handleCountryClick(feature),
            mouseover: (e: any) => handleMouseOver(e, feature),
            mouseout: handleMouseOut,
        });

        layer.bindTooltip(
            `<span style="font-family: monospace; color: #00f0ff; letter-spacing: 0.1em; font-weight: bold; background: transparent; text-shadow: 0 0 5px #00f0ff;">${feature.properties?.name || 'UNKNOWN'}</span>`,
            { sticky: true, className: 'country-tooltip', direction: 'auto' }
        );
    };

    const geoJsonStyle = {
        fillColor: "#05080f",
        weight: 1,
        color: "#00f0ff",
        fillOpacity: 0.1,
    };

    return (
        <div className="absolute inset-0 z-0 h-full w-full opacity-40 pointer-events-auto">
            <MapContainer
                center={[20, 0]}
                zoom={3}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                dragging={false}
                attributionControl={false}
                className="h-full w-full bg-[#05080f]"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                />
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={geoJsonStyle}
                        onEachFeature={onEachFeature}
                    />
                )}

                {mapLayers.conflicts && MOCK_CONFLICTS.map(conflict => (
                    <Marker
                        key={conflict.id}
                        position={[conflict.lat, conflict.lng]}
                        icon={createPulseIcon(conflict.intensity)}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1} className="conflict-tooltip">
                            <div className="font-mono text-[10px] text-[#ff0033] font-bold tracking-widest uppercase">
                                ALERT: {conflict.name} <br /> INTENSITY: {conflict.intensity}
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>

            <style jsx global>{`
                @keyframes pulse-conflict {
                    0% { transform: scale(1); opacity: 0.7; }
                    100% { transform: scale(1.35); opacity: 1; }
                }
                .country-tooltip {
                    background: rgba(5, 8, 15, 0.8) !important;
                    border: 1px solid #00f0ff !important;
                    border-radius: 0 !important;
                    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3) !important;
                }
                .conflict-tooltip {
                    background: rgba(5, 8, 15, 0.9) !important;
                    border: 1px solid #ff0033 !important;
                    border-radius: 0 !important;
                    box-shadow: 0 0 10px rgba(255, 0, 51, 0.5) !important;
                }
                .leaflet-tooltip-left::before { border-left-color: #00f0ff !important; }
                .leaflet-tooltip-right::before { border-right-color: #00f0ff !important; }
                .leaflet-tooltip-top::before { border-top-color: #00f0ff !important; }
                .leaflet-tooltip-bottom::before { border-bottom-color: #00f0ff !important; }
            `}</style>
        </div>
    );
}
