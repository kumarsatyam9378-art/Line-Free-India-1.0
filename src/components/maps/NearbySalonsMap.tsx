import { BarberProfile } from '../../store/AppContext';

interface NearbySalonsMapProps {
  salons: BarberProfile[];
  center?: [number, number];
}

export default function NearbySalonsMap({ salons, center = [28.6139, 77.209] }: NearbySalonsMapProps) {
  const withCoords = salons.filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number');
  const [lat, lng] = center;
  const bbox = `${lng - 0.05}%2C${lat - 0.03}%2C${lng + 0.05}%2C${lat + 0.03}`;

  return (
    <div className="space-y-3">
      <div className="h-72 w-full overflow-hidden rounded-2xl border border-border shadow-lg bg-card">
        <iframe
          title="Nearby salons map"
          className="h-full w-full"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`}
        />
      </div>
      <div className="max-h-28 overflow-y-auto rounded-xl border border-border bg-card p-2 text-xs">
        {withCoords.slice(0, 8).map((salon) => (
          <p key={salon.uid} className="py-1">📍 {salon.salonName} — {salon.location || 'Nearby'}</p>
        ))}
      </div>
    </div>
  );
}
