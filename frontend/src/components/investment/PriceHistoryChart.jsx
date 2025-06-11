import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

const PriceHistoryChart = ({ data }) => {
  // Sort data by date in ascending order
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="label">{`日期 : ${format(
            new Date(label),
            "yyyy-MM-dd"
          )}`}</p>
          <p className="intro">{`價格 : $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={sortedData}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => format(new Date(tick), "MM/dd")}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          dataKey="price"
          domain={["auto", "dataMax + 5"]}
          tickFormatter={(tick) => `$${tick}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          name="股價"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorPrice)"
          activeDot={{ r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PriceHistoryChart;
