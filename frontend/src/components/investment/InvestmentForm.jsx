import React, { useState, useContext, useEffect } from "react";
import InvestmentContext from "../../context/investment/investmentContext";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const InvestmentForm = ({ open, handleClose }) => {
  const investmentContext = useContext(InvestmentContext);
  const { addInvestment, updateInvestment, clearCurrentInvestment, current } =
    investmentContext;

  const [investment, setInvestment] = useState({
    name: "",
    symbol: "",
  });

  useEffect(() => {
    if (current !== null) {
      setInvestment(current);
    } else {
      setInvestment({
        name: "",
        symbol: "",
      });
    }
  }, [current]);

  const { name, symbol } = investment;

  const onChange = (e) =>
    setInvestment({
      ...investment,
      [e.target.name]: e.target.value.toUpperCase(),
    });

  const onSubmit = (e) => {
    e.preventDefault();
    if (current === null) {
      addInvestment(investment);
    } else {
      updateInvestment(investment);
    }
    closeForm();
  };

  const closeForm = () => {
    clearCurrentInvestment();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={closeForm}>
      <DialogTitle>{current ? "編輯投資標的" : "新增投資標的"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="股票名稱 (例如: 台積電)"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={onChange}
            required
          />
          <TextField
            margin="dense"
            name="symbol"
            label="股票代號 (例如: 2330.TW)"
            type="text"
            fullWidth
            variant="standard"
            value={symbol}
            onChange={onChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>取消</Button>
          <Button type="submit" variant="contained">
            {current ? "更新" : "新增"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InvestmentForm;
