import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * BarChartComponent - For comparing discrete categories or time periods
 * Use case: "Which month had highest sales?", product comparison, regional sales
 */
const BarChartComponent = ({ 
  data, 
  dataKey, 
  nameKey, 
  title, 
  color = '#3b82f6',
  height = 300 
}) => {
  const formattedData = data.map((item) => ({
    name: item[nameKey] || item._id || 'Unknown',
    value: item[dataKey] || item.revenue || item.count || 0,
    ...item,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={formattedData}>
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
          <Bar 
            dataKey="value" 
            fill={color} 
            radius={[4, 4, 0, 0]}
            name={title}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
