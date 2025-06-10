import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const NetWorthTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>尚無足夠的歷史資料可繪製趨勢圖</p>;
  }

  // 格式化數據，將後端來的 date 字串轉換成 rechart 需要的格式 (例如: '23/12')
  const formattedData = data.map((item) => ({
    ...item,
    // 從 "2023-12-31T16:00:00.000Z" 中取出 年/月
    name: new Date(item.date).toLocaleDateString("zh-TW", {
      year: "2-digit",
      month: "2-digit",
    }),
    淨值: item.netWorth, // 將 netWorth 欄位重新命名以符合圖例
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedData}
        margin={{
          top: 30,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis width={50} tickFormatter={(value) => value.toLocaleString()} />
        <Tooltip formatter={(value) => `${value.toLocaleString()} 元`} />
        <Line
          type="monotone"
          dataKey="淨值"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NetWorthTrendChart;
