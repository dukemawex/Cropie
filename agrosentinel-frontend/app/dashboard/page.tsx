'use client';

import useSWR from 'swr';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { AlertsFeed } from '@/components/dashboard/AlertsFeed';
import { FarmsMap } from '@/components/dashboard/FarmsMap';
import { getFarms, getAlerts } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/types';

export default function DashboardPage() {
  const { session } = useAuth();
  const token = session?.access_token;

  const { data: farms = [] } = useSWR(['farms', token], () => getFarms(token), {
    refreshInterval: 30000
  });

  const { data: alertsByFarm = {} } = useSWR(
    farms.length ? ['alerts-by-farm', token, farms.map((f) => f.id).join(',')] : null,
    async () => {
      const entries = await Promise.all(
        farms.map(async (farm) => {
          const alerts = await getAlerts(farm.id, token);
          return [farm.id, alerts[0]] as const;
        })
      );
      return Object.fromEntries(entries) as Record<string, Alert | undefined>;
    },
    { refreshInterval: 30000 }
  );

  const latestAlerts = Object.values(alertsByFarm).filter(Boolean) as Alert[];
  const avgNdvi = latestAlerts.length
    ? latestAlerts.reduce((sum, a) => sum + (a.ndvi_score || 0), 0) / latestAlerts.length
    : 0;

  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-6">
        <KpiCards
          totalFarms={farms.length}
          activeAlerts={latestAlerts.filter((a) => ['high', 'critical'].includes(a.severity)).length}
          lastScan={latestAlerts[0] ? new Date(latestAlerts[0].analyzed_at).toLocaleString() : 'No scans'}
          avgNdvi={avgNdvi}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <AlertsFeed alerts={latestAlerts} />
          <div>
            <h3 className="mb-2 font-heading text-xl">Farm Severity Map</h3>
            <FarmsMap farms={farms} alertsByFarm={alertsByFarm} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
