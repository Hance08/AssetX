import React, { useContext, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DashboardContext from "../context/dashboard/dashboardContext";
import InvestmentContext from "../context/investment/investmentContext";
import NetWorthTrendChart from "../components/dashboard/NetWorthTrendChart";
import MonthlyBarChart from "../components/dashboard/MonthlyBarChart";

const Dashboard = () => {
  const dashboardContext = useContext(DashboardContext);
  const {
    summary,
    monthlySummary,
    assetDistribution,
    netWorthGrowth,
    dailyFlow,
    loading,
    getDashboardSummary,
    getMonthlySummary,
    getAssetDistribution,
    getNetWorthGrowth,
    getDailyFlow,
  } = dashboardContext;

  const investmentContext = useContext(InvestmentContext);
  const { investments, getInvestments } = investmentContext;

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    getDashboardSummary();
    getMonthlySummary(year, month);
    getAssetDistribution();
    getNetWorthGrowth();
    getDailyFlow(year, month);
    getInvestments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const investmentDistributionData = useMemo(() => {
    if (!investments || investments.length === 0) {
      return [];
    }
    return investments
      .filter((inv) => inv.totalShares > 0)
      .map((inv) => ({
        name: inv.name,
        value: inv.totalShares,
      }));
  }, [investments]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4560",
  ];

  if (loading && !summary) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  const SummaryCard = ({ title, value, color }) => (
    <Card sx={{ width: 232, height: 151 }}>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ color }}>
          {value ? value.toLocaleString() : 0}
        </Typography>
      </CardContent>
    </Card>
  );

  const ChartCard = ({ data, dataKey, nameKey }) => {
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
          <Typography>沒有資料</Typography>
        </Box>
      );
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
            cornerRadius={5}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box sx={{ display: "flex", gap: "40px" }}>
      {/* Left Column Group */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <Box sx={{ display: "flex", gap: "28px" }}>
          {/* First sub-column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              height: "270px",
            }}
          >
            <SummaryCard
              title="總資產"
              value={summary?.totalAssets || 0}
              color="green"
            />
            <SummaryCard
              title="總負債"
              value={summary?.totalLiabilities || 0}
              color="red"
            />
          </Box>
          {/* Second sub-column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              height: "270px",
            }}
          >
            <Card sx={{ width: 232, height: 151 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  本月收支
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box>
                    {/* <Typography color="text.secondary">收入</Typography> */}
                    <Typography variant="h4" sx={{ color: "green" }}>
                      {monthlySummary?.totalIncome.toLocaleString() || 0}
                    </Typography>
                  </Box>
                  <Box>
                    {/* <Typography color="text.secondary">支出</Typography> */}
                    <Typography variant="h4" sx={{ color: "red" }}>
                      {monthlySummary?.totalExpense.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <SummaryCard title="淨值" value={summary?.netWorth} color="blue" />
          </Box>
        </Box>
        <Card sx={{ width: 492, height: 358 }}>
          <CardContent>
            <Typography variant="h6">淨值成長圖</Typography>
            <NetWorthTrendChart data={netWorthGrowth} />
          </CardContent>
        </Card>
      </Box>

      {/* Right Column Group */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "28px" }}>
          <Card sx={{ width: 281, height: 270 }}>
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" align="center">
                資產分佈
              </Typography>
              <Box sx={{ flexGrow: 1, width: "100%", minHeight: 0 }}>
                <ChartCard
                  data={assetDistribution}
                  dataKey="value"
                  nameKey="name"
                />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: 281, height: 270 }}>
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" align="center">
                投資分佈
              </Typography>
              <Box sx={{ flexGrow: 1, width: "100%", minHeight: 0 }}>
                <ChartCard
                  data={investmentDistributionData}
                  dataKey="value"
                  nameKey="name"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "28px" }}>
          <Card sx={{ width: 590, height: 358 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                本月每日收支
              </Typography>
              <MonthlyBarChart data={dailyFlow} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
