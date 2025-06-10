import React, { useState, useContext, useEffect } from "react";
import TradeContext from "../../context/trade/tradeContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const TradeForm = ({ open, onClose, investmentId }) => {
  const tradeContext = useContext(TradeContext);
  const { addTrade, updateTrade, clearCurrentTrade, currentTrade } =
    tradeContext;

  const [trade, setTrade] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "buy",
    shares: "",
    price: "",
    fee: "",
  });

  useEffect(() => {
    if (currentTrade) {
      const formattedDate = new Date(currentTrade.date)
        .toISOString()
        .slice(0, 10);
      setTrade({ ...currentTrade, date: formattedDate });
    } else {
      setTrade({
        date: new Date().toISOString().slice(0, 10),
        type: "buy",
        shares: "",
        price: "",
        fee: "0",
      });
    }
  }, [currentTrade, open]);

  const { date, type, shares, price, fee } = trade;

  const onChange = (e) =>
    setTrade({ ...trade, [e.target.name]: e.target.value });

  const handleClose = () => {
    clearCurrentTrade();
    onClose();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const tradeData = {
      ...trade,
      investmentId: investmentId, // Use prop directly
      shares: parseFloat(shares),
      price: parseFloat(price),
      fee: parseFloat(fee) || 0,
    };

    if (currentTrade === null) {
      addTrade(tradeData);
    } else {
      updateTrade({ ...tradeData, _id: currentTrade._id });
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {currentTrade ? "編輯交易紀錄" : "新增交易紀錄"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="trade-form"
          onSubmit={onSubmit}
          sx={{ mt: 2 }}
        >
          <TextField
            margin="dense"
            label="日期"
            type="date"
            fullWidth
            variant="outlined"
            name="date"
            value={date}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel>類型</InputLabel>
            <Select name="type" value={type} onChange={onChange} label="類型">
              <MenuItem value="buy">買入</MenuItem>
              <MenuItem value="sell">賣出</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="股數"
            type="number"
            fullWidth
            variant="outlined"
            name="shares"
            value={shares}
            onChange={onChange}
            required
            inputProps={{ step: "any" }}
          />
          <TextField
            margin="dense"
            label="每股價格"
            type="number"
            fullWidth
            variant="outlined"
            name="price"
            value={price}
            onChange={onChange}
            required
            inputProps={{ step: "0.01" }}
          />
          <TextField
            margin="dense"
            label="手續費"
            type="number"
            fullWidth
            variant="outlined"
            name="fee"
            value={fee}
            onChange={onChange}
            inputProps={{ step: "0.01" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button type="submit" form="trade-form" variant="contained">
          {currentTrade ? "更新交易" : "新增交易"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeForm;
