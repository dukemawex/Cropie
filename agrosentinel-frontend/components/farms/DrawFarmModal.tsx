'use client';

import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface Props {
  onClose: () => void;
  onSubmit: (payload: { name: string; crop_type: string; country: string; polygon: GeoJSON.Polygon }) => Promise<void>;
}

const DrawControls = ({ onPolygon }: { onPolygon: (p: GeoJSON.Polygon) => void }) => {
  const map = useMap();

  useEffect(() => {
    const drawn = new L.FeatureGroup();
    map.addLayer(drawn);

    const drawControl = new (L.Control as any).Draw({
      draw: {
        polygon: true,
        marker: false,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawn
      }
    });

    map.addControl(drawControl);

    const created = (e: any) => {
      drawn.clearLayers();
      drawn.addLayer(e.layer);
      const geo = e.layer.toGeoJSON().geometry as GeoJSON.Polygon;
      onPolygon(geo);
    };

    const drawCreatedEvent = 'draw:created';
    map.on(drawCreatedEvent, created);

    return () => {
      map.off(drawCreatedEvent, created);
      map.removeControl(drawControl);
      map.removeLayer(drawn);
    };
  }, [map, onPolygon]);

  return null;
};

export const DrawFarmModal = ({ onClose, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState('maize');
  const [country, setCountry] = useState('Kenya');
  const [polygon, setPolygon] = useState<GeoJSON.Polygon | null>(null);
  const [saving, setSaving] = useState(false);

  const center = useMemo<[number, number]>(() => [0.2, 20], []);

  const submit = async () => {
    if (!polygon || !name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        name,
        crop_type: cropType,
        country,
        polygon
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/60 p-4">
      <div className="mx-auto mt-6 max-w-4xl border-2 border-charcoal bg-cream p-4 shadow-panel">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-xl">Draw Farm Boundary</h3>
          <Button onClick={onClose}>Close</Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Farm name" value={name} onChange={(e) => setName(e.target.value)} />
          <Select value={cropType} onChange={(e) => setCropType(e.target.value)}>
            <option value="maize">Maize</option>
            <option value="rice">Rice</option>
            <option value="cassava">Cassava</option>
            <option value="sorghum">Sorghum</option>
          </Select>
          <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>

        <div className="mt-3 h-[420px] border-2 border-charcoal">
          <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FeatureGroup>
              <DrawControls onPolygon={setPolygon} />
            </FeatureGroup>
          </MapContainer>
        </div>

        <div className="mt-3 flex justify-end">
          <Button disabled={!polygon || saving} onClick={submit}>
            {saving ? 'Saving...' : 'Save Farm'}
          </Button>
        </div>
      </div>
    </div>
  );
};
