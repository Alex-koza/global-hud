"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useWindowStore } from "@/lib/windows";
import { useTranslations } from "next-intl";
import { playSound } from "@/lib/sounds";

export default function MapBackground() {
    const [geoData, setGeoData] = useState<any>(null);
    const { openWindow } = useWindowStore();
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

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            click: () => handleCountryClick(feature),
        });
    };

    const geoJsonStyle = {
        fillColor: "#000000",
        weight: 2,
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
            </MapContainer>
        </div>
    );
}
