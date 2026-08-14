import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function AnalyticsPanel({ analytics }) {
  const data = useMemo(() => {
    if (!analytics?.conceptCounts) return [];
    return Object.entries(analytics.conceptCounts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [analytics]);

  // Hoist max computation out of render loop — O(n) instead of O(n²)
  const maxCount = useMemo(() => {
    if (!data.length) return 10;
    return Math.max(10, ...data.map((d) => d.count));
  }, [data]);

  if (!data.length) {
    return (
      <div className="analytics-list">
        <p style={{ color: '#68736f' }}>No learning sessions yet.</p>
      </div>
    );
  }

  return (
    <div className="recharts-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 24, left: -12 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(23, 35, 31, 0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#53615c' }}
            axisLine={{ stroke: '#ded7cb' }}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#53615c' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#17231f',
              border: 'none',
              borderRadius: '8px',
              color: '#f8f4ec',
              fontSize: '0.85rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
            itemStyle={{ color: '#d8f07c' }}
            cursor={{ fill: 'rgba(216, 240, 124, 0.08)' }}
          />
          <Bar
            dataKey="count"
            fill="#7b9f27"
            radius={[4, 4, 0, 0]}
            maxBarSize={42}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed numbers below the chart */}
      <div className="analytics-list" style={{ marginTop: '12px' }}>
        {data.map(({ name, count }) => (
          <div key={name}>
            <span>{name}</span>
            <meter min="0" max={maxCount} value={count} />
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsPanel;
