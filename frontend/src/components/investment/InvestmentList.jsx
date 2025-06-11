import React, { useContext, useEffect } from "react";
import InvestmentContext from "../../context/investment/investmentContext";
import InvestmentItem from "./InvestmentItem";
import { List, Box, Typography, CircularProgress } from "@mui/material";

const InvestmentList = () => {
  const investmentContext = useContext(InvestmentContext);
  const { investments, getInvestments, loading } = investmentContext;

  useEffect(() => {
    getInvestments();
    // eslint-disable-next-line
  }, []);

  const listHeader = (
    <Box
      sx={{
        display: "flex",
        px: 2,
        py: 1,
        gap: 2,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "grey.100",
      }}
    >
      <Typography sx={{ flex: 2, fontWeight: "bold" }} variant="subtitle2">
        代號
      </Typography>
      <Typography sx={{ flex: 2 }} variant="subtitle2">
        名稱
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "right" }} variant="subtitle2">
        持有股數
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "right" }} variant="subtitle2">
        市價
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "right" }} variant="subtitle2">
        總市值
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "right" }} variant="subtitle2">
        總成本
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "center" }} variant="subtitle2">
        操作
      </Typography>
    </Box>
  );

  if (loading && investments.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {listHeader}
      <List disablePadding>
        {investments.map((inv) => (
          <InvestmentItem key={inv._id} investment={inv} />
        ))}
      </List>
    </>
  );
};

export default InvestmentList;
