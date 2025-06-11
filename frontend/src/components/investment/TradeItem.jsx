import React, { useContext, useState } from "react";
import TradeContext from "../../context/trade/tradeContext";
import { ListItem, IconButton, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../common/ConfirmDialog";
import moment from "moment";

const TradeItem = ({ trade, onEditClick }) => {
  const tradeContext = useContext(TradeContext);
  const { deleteTrade } = tradeContext;

  const [dialogOpen, setDialogOpen] = useState(false);

  const { _id, date, type, shares, price, fee } = trade;

  const tradeType = type === "buy" ? "買入" : "賣出";
  const totalAmount =
    type === "buy" ? shares * price + fee : shares * price - fee;
  const typeColor = type === "buy" ? "error.main" : "success.main";

  const onDeleteConfirm = () => {
    deleteTrade(_id);
    setDialogOpen(false);
  };

  return (
    <>
      <ListItem divider sx={{ display: "flex", px: 2, py: 1.5, gap: 2 }}>
        <Typography sx={{ flex: 2 }} variant="body2">
          {moment(date).format("YYYY-MM-DD")}
        </Typography>
        <Typography sx={{ flex: 1, color: typeColor }} variant="body1">
          {tradeType}
        </Typography>
        <Typography sx={{ flex: 1.5, textAlign: "right" }} variant="body2">
          {shares.toLocaleString()}股
        </Typography>
        <Typography sx={{ flex: 1.5, textAlign: "right" }} variant="body2">
          {price.toLocaleString()}
        </Typography>
        <Typography sx={{ flex: 1.5, textAlign: "right" }} variant="body2">
          {fee.toLocaleString()}
        </Typography>
        <Typography
          sx={{ flex: 2, textAlign: "right", fontWeight: "bold" }}
          variant="body1"
        >
          {totalAmount.toLocaleString()}
        </Typography>
        <Box sx={{ flex: 1.5, textAlign: "center" }}>
          <IconButton
            onClick={() => onEditClick(trade)}
            size="small"
            aria-label="編輯"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => setDialogOpen(true)}
            size="small"
            aria-label="刪除"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleConfirm={onDeleteConfirm}
        title="確認刪除交易"
        message="您確定要刪除這筆交易紀錄嗎？此操作無法復原。"
      />
    </>
  );
};

export default TradeItem;
