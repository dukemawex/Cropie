import { Alert } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AlertsFeed = ({ alerts }: { alerts: Alert[] }) => (
  <Card>
    <h3 className="mb-4 font-heading text-xl">Recent Alerts</h3>
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <p className="text-sm">No recent alerts.</p>
      ) : (
        alerts.slice(0, 8).map((alert) => (
          <div key={alert.id} className="flex items-center justify-between border-2 border-charcoal bg-white p-3">
            <div>
              <p className="font-semibold">{alert.disease_detected || 'Crop stress pattern detected'}</p>
              <p className="text-xs">{new Date(alert.analyzed_at).toLocaleString()}</p>
            </div>
            <Badge>{alert.severity}</Badge>
          </div>
        ))
      )}
    </div>
  </Card>
);
