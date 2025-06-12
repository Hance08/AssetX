import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 為不同的資產定義一些顏色
const COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#E91E63",
  "#9C27B0",
  "#795548",
];

const AssetPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>尚無資產紀錄</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={10}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toLocaleString()} 元`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AssetPieChart;
