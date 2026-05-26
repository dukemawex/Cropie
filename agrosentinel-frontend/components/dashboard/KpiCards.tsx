import { Card } from '@/components/ui/card';

export const KpiCards = ({
  totalFarms,
  activeAlerts,
  lastScan,
  avgNdvi
}: {
  totalFarms: number;
  activeAlerts: number;
  lastScan: string;
  avgNdvi: number;
}) => {
  const items = [
    { label: 'Total Farms', value: totalFarms.toString() },
    { label: 'Active Alerts', value: activeAlerts.toString() },
    { label: 'Last Scan', value: lastScan },
    { label: 'Avg NDVI Score', value: avgNdvi.toFixed(2) }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm uppercase tracking-wide">{item.label}</p>
          <p className="mt-2 font-mono text-2xl font-bold">{item.value}</p>
        </Card>
      ))}
    </div>
  );
};
