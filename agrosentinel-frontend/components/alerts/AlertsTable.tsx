'use client';

import { useMemo, useState } from 'react';
import { Alert, Farm } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export const AlertsTable = ({ alerts, farms }: { alerts: Alert[]; farms: Farm[] }) => {
  const [severity, setSeverity] = useState('all');
  const [farm, setFarm] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const passSeverity = severity === 'all' || a.severity === severity;
      const passFarm = farm === 'all' || a.farm_id === farm;
      const date = new Date(a.analyzed_at).getTime();
      const fromOk = !from || date >= new Date(from).getTime();
      const toOk = !to || date <= new Date(to).getTime();
      return passSeverity && passFarm && fromOk && toOk;
    });
  }, [alerts, farm, from, severity, to]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
        <Select value={farm} onChange={(e) => setFarm(e.target.value)}>
          <option value="all">All farms</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Select>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="overflow-x-auto border-2 border-charcoal bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary text-cream">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Farm</th>
              <th className="p-2">Disease</th>
              <th className="p-2">Severity</th>
              <th className="p-2">NDVI</th>
              <th className="p-2">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t-2 border-charcoal/20">
                <td className="p-2">{new Date(a.analyzed_at).toLocaleString()}</td>
                <td className="p-2">{farms.find((f) => f.id === a.farm_id)?.name || '-'}</td>
                <td className="p-2">{a.disease_detected || 'Stress'}</td>
                <td className="p-2">
                  <Badge>{a.severity}</Badge>
                </td>
                <td className="p-2 font-mono">{a.ndvi_score.toFixed(2)}</td>
                <td className="p-2 font-mono">{(a.confidence * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
