'use client';

import useSWR from 'swr';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AlertsTable } from '@/components/alerts/AlertsTable';
import { getAlerts, getFarms } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AlertsPage() {
  const { session } = useAuth();
  const token = session?.access_token;

  const { data: farms = [] } = useSWR(['farms', token], () => getFarms(token));

  const { data: alerts = [] } = useSWR(
    farms.length ? ['all-alerts', farms.map((f) => f.id).join(','), token] : null,
    async () => {
      const lists = await Promise.all(farms.map((f) => getAlerts(f.id, token)));
      return lists.flat().sort((a, b) => +new Date(b.analyzed_at) - +new Date(a.analyzed_at));
    }
  );

  return (
    <DashboardShell title="All Alerts">
      <AlertsTable alerts={alerts} farms={farms} />
    </DashboardShell>
  );
}
