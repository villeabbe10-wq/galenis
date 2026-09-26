import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pharmacy } from '../../types';

interface InteractiveMapProps {
  pharmacies: Pharmacy[];
  selectedPharmacy?: Pharmacy | null;
  onSelectPharmacy: (p: Pharmacy) => void;
  centerLat?: number;
  centerLng?: number;
  userLocation?: { lat: number; lng: number } | null;
  onLocateUser?: () => void;
  isFullView?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pharmacies,
  selectedPharmacy,
  onSelectPharmacy,
  centerLat = 6.1375, // Lomé default
  centerLng = 1.2125
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Positron / OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m: L.Marker) => m.remove());
    markersRef.current = {};

    pharmacies.forEach(p => {
      const isDeGarde = p.status === 'DE_GARDE' || p.isGuardToday;
      const isOpen = p.status === 'OPEN' || isDeGarde;

      const color = isDeGarde ? '#f59e0b' : isOpen ? '#10b981' : '#64748b';

      const customIcon = L.divIcon({
        className: 'custom-pharmacy-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            ${isDeGarde ? `<div style="position: absolute; inset: -4px; border-radius: 50%; background-color: rgba(245, 158, 11, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="
              background-color: ${color};
              width: 28px;
              height: 28px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              position: relative;
              z-index: 10;
            ">
              ${isDeGarde 
                ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` 
                : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([p.lat, p.lng], { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-xs';
      popupContent.innerHTML = `
        <div style="font-weight: bold; font-size: 13px; margin-bottom: 2px;">${p.name}</div>
        <div style="color: #475569; margin-bottom: 4px;">${p.city} (${p.quarter})</div>
        <div style="font-weight: 700; display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: ${isDeGarde ? '#92400e' : isOpen ? '#065f46' : '#334155'}; background-color: ${isDeGarde ? '#fef3c7' : isOpen ? '#d1fae5' : '#f1f5f9'}; margin-bottom: 6px;">
          ${isDeGarde ? 'DE GARDE 24H' : isOpen ? 'OUVERTE' : 'FERMÉE'}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Tél: ${p.phone}</div>
      `;

      const btn = document.createElement('button');
      btn.textContent = 'Voir détails & Médicaments';
      btn.style.cssText = 'background: #059669; color: white; border: none; border-radius: 6px; padding: 4px 8px; font-weight: 600; cursor: pointer; width: 100%; text-align: center; font-size: 11px;';
      btn.onclick = () => onSelectPharmacy(p);
      popupContent.appendChild(btn);

      marker.bindPopup(popupContent);
      markersRef.current[p.id] = marker;
    });

    if (selectedPharmacy) {
      map.setView([selectedPharmacy.lat, selectedPharmacy.lng], 14, { animate: true });
      const m = markersRef.current[selectedPharmacy.id];
      if (m) {
        m.openPopup();
      }
    } else if (pharmacies.length > 0) {
      // Fit bounds to show all markers
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [pharmacies, selectedPharmacy]);

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-md relative">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5 font-medium">
        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">Légende Togo</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm animate-pulse" />
          <span className="text-amber-800 font-semibold">Pharmacie de Garde</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm" />
          <span className="text-emerald-800 font-semibold">Pharmacie Ouverte</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-400 border border-white shadow-sm" />
          <span className="text-slate-600">Pharmacie Fermée</span>
        </div>
      </div>
    </div>
  );
};
