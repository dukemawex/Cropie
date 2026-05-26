'use client';

import { useMemo } from 'react';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, Farm } from '@/types';

const severityColor: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#16a34a'
};

export const FarmsMap = ({ farms, alertsByFarm }: { farms: Farm[]; alertsByFarm: Record<string, Alert | undefined> }) => {
  const center = useMemo<[number, number]>(() => {
    const first = farms[0]?.polygon?.coordinates?.[0]?.[0];
    return first ? [first[1], first[0]] : [0.2, 20.0];
  }, [farms]);

  return (
    <div className="panel h-[420px] overflow-hidden p-0">
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {farms.map((farm) => {
          const latlngs = farm.polygon.coordinates[0].map((coord) => [coord[1], coord[0]]) as [number, number][];
          const latest = alertsByFarm[farm.id];
          return (
            <Polygon
              key={farm.id}
              positions={latlngs}
              pathOptions={{
                color: severityColor[latest?.severity || 'low'],
                weight: 2
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};
