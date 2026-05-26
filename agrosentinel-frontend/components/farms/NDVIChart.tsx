'use client';

import { Alert } from '@/types';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const NDVIChart = ({ alerts }: { alerts: Alert[] }) => {
  const data = [...alerts]
    .reverse()
    .map((a) => ({ date: new Date(a.analyzed_at).toLocaleDateString(), ndvi: Number(a.ndvi_score.toFixed(3)) }));

  return (
    <div className="h-[260px] w-full border-2 border-charcoal bg-white p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Line type="monotone" dataKey="ndvi" stroke="#1a3d2b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
