import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * PieChartComponent / DonutChartComponent - For showing "part-to-whole" relationships
 * Use case: Market share, revenue by category, order status distribution
 * Best when you have few categories (≤5) and care about shares
 */

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

const PieChartComponent = ({ 
  data, 
  dataKey, 
  nameKey, 
  title, 
  height = 300,
  isDonut = false,
  showLegend = true
}) => {
  const formattedData = data.map((item, index) => ({
    name: item[nameKey] || item._id || 'Unknown',
    value: item[dataKey] || item.revenue || item.count || 0,
    ...item,
  }));

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Share: <span className="font-semibold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={isDonut ? 60 : 0}
            outerRadius={Math.min(height, 300) / 2 - 20}
            paddingAngle={2}
            dataKey="value"
            label={isDonut}
            labelLine={isDonut}
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-gray-700 text-sm">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      
      {/* Summary stats for donut chart */}
      {isDonut && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default PieChartComponent;
