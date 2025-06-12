import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { Box, Typography } from "@mui/material";

const MonthlyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography>本月尚無收支紀錄</Typography>
      </Box>
    );
  }

  // Find the max value from data to set the Y-axis domain dynamically
  const maxValue = Math.max(
    ...data.map((d) => d.income),
    ...data.map((d) => d.expense)
  );
  const domainMax = Math.ceil(maxValue / 500) * 500;

  // Generate ticks for the Y-axis
  const yAxisTicks = [];
  for (let i = 0; i <= domainMax; i += 500) {
    yAxisTicks.push(i);
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 10,
          bottom: 10,
        }}
      >
        <XAxis dataKey="day" />
        <YAxis
          ticks={yAxisTicks}
          domain={[0, domainMax]}
          allowDataOverflow={true}
        />
        <Tooltip />
        <Bar dataKey="income" fill="#82ca9d" name="收入" barSize={20} />
        <Bar dataKey="expense" fill="#ff6961" name="支出" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyBarChart;
