import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * AreaChartComponent - Similar to line but emphasizes volume/total over time
 * Use case: Cumulative revenue, total traffic, growing metrics
 */
const AreaChartComponent = ({ 
  data, 
  dataKey, 
  nameKey, 
  title, 
  color = '#8b5cf6',
  height = 300,
  fillOpacity = 0.3
}) => {
  const formattedData = data.map((item) => ({
    name: item[nameKey] || item._id || item.date || item.month || 'Unknown',
    value: item[dataKey] || item.revenue || item.count || 0,
    ...item,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id={`color${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={fillOpacity + 0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={fillOpacity} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
          />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#color${title.replace(/\s/g, '')})`}
            name={title}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;
