import React, { useContext, useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import InvestmentContext from "../context/investment/investmentContext";
import TradeContext from "../context/trade/tradeContext";
import DividendContext from "../context/dividend/dividendContext";
import TradeList from "../components/investment/TradeList";
import TradeForm from "../components/investment/TradeForm";
import DividendList from "../components/investment/DividendList";
import DividendForm from "../components/investment/DividendForm";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const InvestmentDetail = () => {
  const { investmentId } = useParams();
  const investmentContext = useContext(InvestmentContext);
  const tradeContext = useContext(TradeContext);
  const dividendContext = useContext(DividendContext);

  const {
    current: currentInvestment, // Use current from context
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

  const {
    dividends,
    getDividends,
    loading: dividendLoading,
    setCurrentDividend,
    clearCurrentDividend,
  } = dividendContext;

  const [showTradeForm, setShowTradeForm] = useState(false);
  const [showDividendForm, setShowDividendForm] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    getInvestment(investmentId);
    getTrades(investmentId);
    getDividends(investmentId);
    // eslint-disable-next-line
  }, [investmentId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onEditTrade = (trade) => {
    setCurrentTrade(trade);
    setShowTradeForm(true);
  };

  const onAddNewTrade = () => {
    clearCurrentTrade();
    setShowTradeForm(true);
  };

  const onEditDividend = (dividend) => {
    setCurrentDividend(dividend);
    setShowDividendForm(true);
  };

  const onAddNewDividend = () => {
    clearCurrentDividend();
    setShowDividendForm(true);
  };

  if (investmentLoading || !currentInvestment) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ width: "1160px", height: "90vh" }}>
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
        <Box>
          <Button variant="outlined" onClick={onAddNewDividend} sx={{ mr: 2 }}>
            新增配息
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to={`/investment-report/${investmentId}`}
            sx={{ mr: 2 }}
          >
            投資報表
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNewTrade}
          >
            新增交易
          </Button>
        </Box>
      </Box>

      <TradeForm
        open={showTradeForm}
        onClose={() => setShowTradeForm(false)}
        investmentId={investmentId}
      />
      <DividendForm
        open={showDividendForm}
        onClose={() => setShowDividendForm(false)}
        investmentId={investmentId}
      />

      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="investment tabs"
          >
            <Tab label="交易紀錄" />
            <Tab label="配息紀錄" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          {tradeLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TradeList trades={trades} onEditTrade={onEditTrade} />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          {dividendLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DividendList
              dividends={dividends}
              onEditDividend={onEditDividend}
            />
          )}
        </CustomTabPanel>
      </Paper>
    </Container>
  );
};

export default InvestmentDetail;
