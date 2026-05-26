'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/button';
import { getFarms, createFarm, deleteFarm, getAlerts } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/types';

const DrawFarmModal = dynamic(() => import('@/components/farms/DrawFarmModal').then((m) => m.DrawFarmModal), {
  ssr: false
});

export default function FarmsPage() {
  const { session } = useAuth();
  const token = session?.access_token;

  const [open, setOpen] = useState(false);

  const { data: farms = [], mutate } = useSWR(['farms', token], () => getFarms(token));
  const { data: lastAlerts = {} } = useSWR(
    farms.length ? ['farms-last-alerts', token, farms.map((f) => f.id).join(',')] : null,
    async () => {
      const entries = await Promise.all(
        farms.map(async (f) => {
          const alerts = await getAlerts(f.id, token);
          return [f.id, alerts[0]] as const;
        })
      );
      return Object.fromEntries(entries) as Record<string, Alert | undefined>;
    }
  );

  return (
    <DashboardShell title="Farm Management">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)}>Add Farm</Button>
        </div>

        <div className="overflow-x-auto border-2 border-charcoal bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary text-cream">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Crop Type</th>
                <th className="p-3">Country</th>
                <th className="p-3">Last Alert</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {farms.map((farm) => (
                <tr key={farm.id} className="border-t border-charcoal/20">
                  <td className="p-3">{farm.name}</td>
                  <td className="p-3">{farm.crop_type}</td>
                  <td className="p-3">{farm.country}</td>
                  <td className="p-3">{lastAlerts[farm.id]?.severity || 'No alerts yet'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link href={`/farms/${farm.id}`}>
                        <Button className="bg-white">View</Button>
                      </Link>
                      <Button
                        className="bg-white"
                        onClick={async () => {
                          await mutate(
                            async (current = []) => {
                              const optimistic = current.filter((f) => f.id !== farm.id);
                              await deleteFarm(farm.id, token);
                              return optimistic;
                            },
                            { optimisticData: farms.filter((f) => f.id !== farm.id), rollbackOnError: true, revalidate: true }
                          );
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <DrawFarmModal
          onClose={() => setOpen(false)}
          onSubmit={async (payload) => {
            await mutate(
              async (current = []) => {
                const created = await createFarm(payload, token);
                return [created, ...current];
              },
              { optimisticData: farms, rollbackOnError: true, revalidate: true }
            );
          }}
        />
      )}
    </DashboardShell>
  );
}
