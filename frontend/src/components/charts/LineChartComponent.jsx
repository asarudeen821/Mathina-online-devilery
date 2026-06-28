import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * LineChartComponent - For showing trends over time
 * Use case: "Is our traffic improving?", revenue growth, customer acquisition trends
 */
const LineChartComponent = ({ 
  data, 
  dataKey, 
  nameKey, 
  title, 
  color = '#10b981',
  height = 300,
  showDots = true
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
        <LineChart data={formattedData}>
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3}
            dot={showDots ? { fill: color, r: 5 } : false}
            activeDot={{ r: 7 }}
            name={title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
