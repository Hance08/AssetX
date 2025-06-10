import React, { useContext, useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import InvestmentContext from "../context/investment/investmentContext";
import TradeContext from "../context/trade/tradeContext";
import TradeList from "../components/investment/TradeList";
import TradeForm from "../components/investment/TradeForm";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

const InvestmentDetail = () => {
  const { investmentId } = useParams();
  const investmentContext = useContext(InvestmentContext);
  const tradeContext = useContext(TradeContext);

  const {
    investments,
    getInvestment,
    loading: investmentLoading,
  } = investmentContext;
  const {
    trades,
    getTrades,
    loading: tradeLoading,
    setCurrentTrade,
    clearCurrentTrade,
  } = tradeContext;

  const [showTradeForm, setShowTradeForm] = useState(false);

  // Find the specific investment from the list, or fetch if not available
  const currentInvestment = investments.find((inv) => inv._id === investmentId);

  useEffect(() => {
    if (!currentInvestment) {
      getInvestment(investmentId);
    }
    getTrades(investmentId);
    // eslint-disable-next-line
  }, [investmentId]);

  const onEditTrade = (trade) => {
    setCurrentTrade(trade);
    setShowTradeForm(true);
  };

  const onAddNewTrade = () => {
    clearCurrentTrade(); // Use the correct function name
    setShowTradeForm(true);
  };

  if (investmentLoading || !currentInvestment) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ width: "1200px", height: "80vh" }}>
      <Button
        component={RouterLink}
        to="/investments"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        返回投資列表
      </Button>

      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            {currentInvestment.name} ({currentInvestment.symbol})
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            目前持有: {currentInvestment.totalShares} 股 | 總成本:{" "}
            {currentInvestment.totalCost.toLocaleString()}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNewTrade}
        >
          新增交易
        </Button>
      </Box>

      <TradeForm
        open={showTradeForm}
        onClose={() => setShowTradeForm(false)}
        investmentId={investmentId}
      />

      <Paper>
        {tradeLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TradeList trades={trades} onEditTrade={onEditTrade} />
        )}
      </Paper>
    </Container>
  );
};

export default InvestmentDetail;
