
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SectorAllocation } from '../types';

interface SectorChartProps {
  data: SectorAllocation[];
  centerLabel?: string;
}

const COLORS = ['#6366f1', '#3b82f6', '#3FB950', '#F7B92F', '#A371F7', '#DA4AAA', '#F76E2F', '#2FA3F7'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-secondary border border-brand-border p-3 rounded-lg shadow-lg">
          <p className="font-bold text-white">{`${data.sector}`}</p>
          <p className="text-brand-text">{`Value: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.value)}`}</p>
          <p className="text-brand-text-secondary">({data.percentage.toFixed(2)}%)</p>
        </div>
      );
    }
    return null;
};

const getCenterStat = (data: SectorAllocation[], label?: string) => {
  if (label) return label;
  if (!data.length) return '';
  // Show most exposed sector
  const max = data.reduce((a, b) => (a.value > b.value ? a : b));
  return `${max.sector}`;
};

const SectorChartComponent: React.FC<SectorChartProps> = ({ data, centerLabel }) => {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.15" />
          </filter>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="90%"
          fill="#6366f1"
          dataKey="value"
          nameKey="sector"
          stroke="#18181b"
          strokeWidth={2}
          isAnimationActive={true}
          label={({ percent, sector }) => `${sector}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
          filter="url(#shadow)"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconSize={18}
          formatter={value => <span className="font-bold text-white">{value}</span>}
        />
        {/* Centered stat */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xl font-bold fill-brand-accent"
        >
          {getCenterStat(data, centerLabel)}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SectorChartComponent;
