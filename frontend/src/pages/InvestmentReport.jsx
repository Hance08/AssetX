import React, { useContext, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InvestmentContext from "../context/investment/investmentContext";
import TradeContext from "../context/trade/tradeContext";
import PriceHistoryChart from "../components/investment/PriceHistoryChart";

const InvestmentReport = () => {
  const { investmentId } = useParams();
  const investmentContext = useContext(InvestmentContext);
  const tradeContext = useContext(TradeContext);

  const {
    current: currentInvestment,
    getInvestment,
    loading: investmentLoading,
  } = investmentContext;
  const { trades, getTrades, loading: tradeLoading } = tradeContext;

  useEffect(() => {
    getInvestment(investmentId);
    getTrades(investmentId);
    // eslint-disable-next-line
  }, [investmentId]);

  if (investmentLoading || !currentInvestment) {
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
    <Container sx={{ width: "1170px", height: "80vh" }}>
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
          {currentInvestment.name}
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
            value={`$${currentInvestment.totalCost.toLocaleString()}`}
          />
        </Box>
        <Box sx={{ width: "80%" }}>
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
