import React, { useContext, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InvestmentContext from "../context/investment/investmentContext";
import TradeContext from "../context/trade/tradeContext";
import DividendContext from "../context/dividend/dividendContext";
import PriceHistoryChart from "../components/investment/PriceHistoryChart";

const InvestmentReport = () => {
  const { investmentId } = useParams();
  const investmentContext = useContext(InvestmentContext);
  const tradeContext = useContext(TradeContext);
  const dividendContext = useContext(DividendContext);

  const {
    current: currentInvestment,
    getInvestment,
    loading: investmentLoading,
  } = investmentContext;
  const { trades, getTrades, loading: tradeLoading } = tradeContext;
  const { dividends, getDividends, loading: dividendLoading } = dividendContext;

  useEffect(() => {
    getInvestment(investmentId);
    getTrades(investmentId);
    getDividends(investmentId);
    // eslint-disable-next-line
  }, [investmentId]);

  const totalDividends = useMemo(() => {
    if (!dividends || dividends.length === 0) {
      return 0;
    }
    return dividends.reduce((acc, curr) => acc + curr.amount, 0);
  }, [dividends]);

  const yieldThisYear = useMemo(() => {
    if (
      !dividends ||
      dividends.length === 0 ||
      !currentInvestment ||
      currentInvestment.totalCost === 0
    ) {
      return {
        yieldRate: "0.00%",
        totalDividendsThisYear: 0,
      };
    }

    const currentYear = new Date().getFullYear();
    const dividendsThisYear = dividends.filter(
      (d) => new Date(d.date).getFullYear() === currentYear
    );
    const totalDividendsThisYear = dividendsThisYear.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    const yieldRate =
      (totalDividendsThisYear / currentInvestment.totalCost) * 100;
    return {
      yieldRate: `${yieldRate.toFixed(2)}%`,
      totalDividendsThisYear,
    };
  }, [dividends, currentInvestment]);

  if (investmentLoading || !currentInvestment || dividendLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, valueColor }) => (
    <Card>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ color: valueColor }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container sx={{ width: "1150px", height: "80vh" }}>
      <Button
        component={RouterLink}
        to={`/investment/${investmentId}`}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        返回投資細節
      </Button>
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1">
          {currentInvestment.name} ({currentInvestment.symbol})
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "28px" }}>
          <StatCard
            title="目前總股數"
            value={`${currentInvestment.totalShares.toLocaleString()} 股`}
          />
          <StatCard
            title="總投入成本"
            value={`${currentInvestment.totalCost.toLocaleString()}`}
          />
          <StatCard
            title="累計總配息"
            value={`${totalDividends.toLocaleString()}`}
            valueColor="green"
          />
          <StatCard
            title="今年總配息"
            value={`${yieldThisYear.totalDividendsThisYear.toLocaleString()}`}
            valueColor="green"
          />
          <StatCard
            title="今年殖利率"
            value={yieldThisYear.yieldRate}
            valueColor="green"
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">股價走勢圖</Typography>
              {tradeLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : trades && trades.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <PriceHistoryChart data={trades} />
                </Box>
              ) : (
                <Typography sx={{ p: 4, textAlign: "center" }}>
                  尚無交易紀錄可繪製圖表。
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default InvestmentReport;
