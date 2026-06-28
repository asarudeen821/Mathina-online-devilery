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
 * PercentStackedBarChartComponent - 100% Stacked Bar for comparing composition percentages
 * Use case: Percentage distribution of sales by product in each region
 */

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
];

const PercentStackedBarChartComponent = ({ 
  data, 
  dataKeys, 
  nameKey, 
  title, 
  height = 350
}) => {
  // Transform data for 100% stacked bar chart
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
    existing._total = (existing._total || 0) + value;
    return acc;
  }, []);

  // Calculate percentages
  const percentageData = formattedData.map(item => {
    const percentageItem = { name: item.name };
    Object.keys(item).forEach(key => {
      if (key === 'name' || key === '_total') {
        percentageItem[key] = item[key];
      } else {
        percentageItem[key] = item._total > 0 ? ((item[key] / item._total) * 100).toFixed(1) : 0;
      }
    });
    return percentageItem;
  });

  // Get unique categories
  const categories = dataKeys || [...new Set(data.map(item => 
    item._id?.category || item.category || 'Unknown'
  ))];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">Percentage distribution across categories</p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={percentageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
          />
          <YAxis 
            stroke="#6b7280" 
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              stackId="stack"
              fill={COLORS[index % COLORS.length]}
              name={category}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PercentStackedBarChartComponent;
