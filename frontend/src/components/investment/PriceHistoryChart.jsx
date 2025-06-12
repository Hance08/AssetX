import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
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
      const price = payload.find((p) => p.dataKey === "price")?.value;
      const shares = payload.find((p) => p.dataKey === "shares")?.value;
      const type = payload.find((p) => p.dataKey === "shares")?.payload.type;

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="label">{`日期 : ${format(
            new Date(label),
            "yyyy-MM-dd"
          )}`}</p>
          {price && <p className="intro">{`價格 : $${price.toFixed(2)}`}</p>}
          {shares && (
            <p
              className="intro"
              style={{ color: type === "buy" ? "green" : "red" }}
            >
              {`股數 : ${shares} (${type === "buy" ? "買入" : "賣出"})`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
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
          tickFormatter={() => ""}
          tickLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          yAxisId="left"
          dataKey="price"
          domain={["auto", "dataMax + 5"]}
          tickFormatter={(tick) => `$${tick}`}
          tickLine={false}
          stroke="#8884d8"
        />
        <YAxis
          yAxisId="right"
          dataKey="shares"
          orientation="right"
          stroke="#82ca9d"
          tickLine={false}
          domain={[0, 2000]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          yAxisId="right"
          dataKey="shares"
          name="股數"
          fill="#82ca9d"
          radius={[3, 3, 0, 0]}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="price"
          name="股價"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorPrice)"
          activeDot={{ r: 8 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PriceHistoryChart;
