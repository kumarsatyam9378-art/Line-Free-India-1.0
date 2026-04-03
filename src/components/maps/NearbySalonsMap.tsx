import { useEffect, useMemo, useRef } from 'react';
import { BarberProfile } from '../../store/AppContext';

interface NearbySalonsMapProps {
  salons: BarberProfile[];
  center?: [number, number];
}

declare global {
  interface Window {
    L?: any;
  }
}

const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);

  return new Promise((resolve, reject) => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function NearbySalonsMap({ salons, center = [28.6139, 77.209] }: NearbySalonsMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

  const withCoords = useMemo(
    () => salons.filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number').slice(0, 40),
    [salons],
  );

  useEffect(() => {
    let isMounted = true;

    loadLeaflet()
      .then((L: any) => {
        if (!isMounted || !mapRef.current) return;

        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }

        const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView(center, 12);
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        withCoords.forEach((salon) => {
          const marker = L.marker([salon.lat, salon.lng]).addTo(map);
          marker.bindPopup(`<strong>${salon.salonName || 'Business'}</strong><br/>${salon.location || 'Nearby'}`);
        });
      })
      .catch(() => null);

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [center, withCoords]);

  return (
    <div className="space-y-3">
      <div ref={mapRef} className="h-72 w-full overflow-hidden rounded-2xl border border-border shadow-lg bg-card" />
      <div className="max-h-28 overflow-y-auto rounded-xl border border-border bg-card p-2 text-xs">
        {withCoords.slice(0, 8).map((salon) => (
          <p key={salon.uid} className="py-1">📍 {salon.salonName} — {salon.location || 'Nearby'}</p>
        ))}
      </div>
    </div>
  );
}
