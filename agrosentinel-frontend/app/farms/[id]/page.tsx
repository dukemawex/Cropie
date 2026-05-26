'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NDVIChart } from '@/components/farms/NDVIChart';
import { analyzeFarm, getAlerts, getFarms } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function FarmDetailPage() {
  const params = useParams<{ id: string }>();
  const farmId = params.id;
  const { session } = useAuth();
  const token = session?.access_token;
  const [loading, setLoading] = useState(false);

  const { data: farms = [] } = useSWR(['farms', token], () => getFarms(token));
  const farm = useMemo(() => farms.find((f) => f.id === farmId), [farms, farmId]);

  const { data: alerts = [], mutate: reloadAlerts } = useSWR(['alerts', farmId, token], () => getAlerts(farmId, token));

  const latest = alerts[0];

  return (
    <DashboardShell title="Farm Detail">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl">{farm?.name || 'Farm'}</h2>
              <p>
                {farm?.crop_type} · {farm?.country}
              </p>
            </div>
            <Button
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await analyzeFarm(farmId, token);
                  await reloadAlerts();
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? 'Running analysis...' : 'Run Analysis Now'}
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-heading text-xl">Latest Satellite Composite</h3>
            {latest?.satellite_image_url ? (
              <img src={latest.satellite_image_url} alt="Latest satellite composite" className="h-[300px] w-full border-2 border-charcoal object-cover" />
            ) : (
              <p>No analysis image available.</p>
            )}
          </Card>

          <Card>
            <h3 className="mb-2 font-heading text-xl">Recommendations</h3>
            <p className="border-2 border-charcoal bg-white p-3">{latest?.recommendation || 'Run analysis to receive recommendations.'}</p>
          </Card>
        </div>

        <Card>
          <h3 className="mb-3 font-heading text-xl">NDVI Trend</h3>
          <NDVIChart alerts={alerts} />
        </Card>

        <Card>
          <h3 className="mb-3 font-heading text-xl">Alert History</h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="border-2 border-charcoal bg-white p-3">
                <p className="font-semibold">{alert.disease_detected || 'Stress signal detected'}</p>
                <p className="text-sm">Severity: {alert.severity}</p>
                <p className="text-sm">NDVI: {alert.ndvi_score.toFixed(2)} · EVI: {alert.evi_score.toFixed(2)}</p>
                <p className="text-xs">{new Date(alert.analyzed_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
