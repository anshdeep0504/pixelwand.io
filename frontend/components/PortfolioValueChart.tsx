import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';

interface PortfolioValueChartProps {
  data: { date: string; value: number }[];
}

const PortfolioValueChart: React.FC<PortfolioValueChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-bold text-white mb-2">Portfolio Value Over Time</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <Tooltip contentStyle={{ background: '#18181b', border: 'none', color: '#fff' }} />
          <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioValueChart; 