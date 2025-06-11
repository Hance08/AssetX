import React, { useContext } from "react";
import TradeContext from "../../context/trade/tradeContext";
import TradeItem from "./TradeItem";
import { List, Box, Typography, CircularProgress } from "@mui/material";

const TradeList = ({ onEditTrade }) => {
  const tradeContext = useContext(TradeContext);
  const { trades, loading } = tradeContext;

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
      <Typography sx={{ flex: 2 }} variant="subtitle2">
        日期
      </Typography>
      <Typography sx={{ flex: 1 }} variant="subtitle2">
        類型
      </Typography>
      <Typography sx={{ flex: 1.5, textAlign: "right" }} variant="subtitle2">
        股數
      </Typography>
      <Typography sx={{ flex: 1.5, textAlign: "right" }} variant="subtitle2">
        股價
      </Typography>
      <Typography sx={{ flex: 1.5, textAlign: "right" }} variant="subtitle2">
        手續費
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "right" }} variant="subtitle2">
        總金額
      </Typography>
      <Typography sx={{ flex: 1.5, textAlign: "center" }} variant="subtitle2">
        操作
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (trades.length === 0) {
    return (
      <Typography sx={{ p: 4, textAlign: "center" }}>
        此標的尚無交易紀錄。
      </Typography>
    );
  }

  return (
    <>
      {listHeader}
      <List disablePadding sx={{ maxHeight: "50vh", overflow: "auto" }}>
        {trades.map((trade) => (
          <TradeItem key={trade._id} trade={trade} onEditClick={onEditTrade} />
        ))}
      </List>
    </>
  );
};

export default TradeList;
