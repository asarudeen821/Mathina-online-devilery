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
 * StackedBarChartComponent - For comparing composition across groups
 * Use case: Sales by product in each region, revenue by category over time
 */

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
];

const StackedBarChartComponent = ({ 
  data, 
  dataKeys, 
  nameKey, 
  title, 
  height = 350,
  stackId = 'stack'
}) => {
  // Transform data for stacked bar chart
  const formattedData = data.reduce((acc, item) => {
    const date = item._id?.date || item.date || item.month || 'Unknown';
    const category = item._id?.category || item.category || 'Unknown';
    const value = item.revenue || item.count || 0;
    
    let existing = acc.find(d => d.name === date);
    if (!existing) {
      existing = { name: date };
      acc.push(existing);
    }
    
    existing[category] = value;
    return acc;
  }, []);

  // Get unique categories for dataKeys if not provided
  const categories = dataKeys || [...new Set(data.map(item => 
    item._id?.category || item.category || 'Unknown'
  ))];

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
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              stackId={stackId}
              fill={COLORS[index % COLORS.length]}
              name={category}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChartComponent;
