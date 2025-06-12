import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import DividendContext from "../../context/dividend/dividendContext";

const DividendForm = ({ open, onClose, investmentId }) => {
  const dividendContext = useContext(DividendContext);
  const { addDividend, updateDividend, current, clearCurrentDividend } =
    dividendContext;

  const [dividend, setDividend] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
  });

  useEffect(() => {
    if (current) {
      setDividend({
        date: new Date(current.date).toISOString().slice(0, 10),
        amount: current.amount,
      });
    } else {
      setDividend({
        date: new Date().toISOString().slice(0, 10),
        amount: "",
      });
    }
  }, [current, open]);

  const { date, amount } = dividend;

  const onChange = (e) => {
    setDividend({ ...dividend, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (current) {
      updateDividend({ ...current, ...dividend });
    } else {
      addDividend({ ...dividend, investmentId });
    }
    handleClose();
  };

  const handleClose = () => {
    clearCurrentDividend();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{current ? "編輯配息紀錄" : "新增配息紀錄"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="date"
          name="date"
          label="日期"
          type="date"
          fullWidth
          variant="standard"
          value={date}
          onChange={onChange}
        />
        <TextField
          margin="dense"
          id="amount"
          name="amount"
          label="金額"
          type="number"
          fullWidth
          variant="standard"
          value={amount}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit}>儲存</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DividendForm;
