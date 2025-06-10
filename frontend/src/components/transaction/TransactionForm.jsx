import React, { useState, useContext, useEffect } from "react";
import TransactionContext from "../../context/transaction/transactionContext";
import AccountContext from "../../context/account/accountContext";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const TransactionForm = ({ open, handleClose }) => {
  const transactionContext = useContext(TransactionContext);
  const accountContext = useContext(AccountContext);

  const { addTransaction, updateTransaction, current, clearCurrent } =
    transactionContext;
  const { accounts, getAccounts } = accountContext;

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (current) {
      setTransaction({
        ...current,
        date: new Date(current.date).toISOString().slice(0, 10),
        amount: Math.abs(current.amount),
        type: current.amount < 0 ? "expense" : "income",
        accountId: current.accountId._id || current.accountId,
      });
    } else {
      setTransaction({
        notes: "",
        amount: "",
        type: "expense",
        date: new Date().toISOString().slice(0, 10),
        category: "",
        accountId: "",
      });
    }
  }, [current]);

  const [transaction, setTransaction] = useState({
    notes: "",
    amount: "",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    accountId: "",
  });

  const { notes, amount, type, date, category, accountId } = transaction;

  const onChange = (e) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!accountId) {
      return alert("請選擇一個帳戶");
    }

    const transactionData = { ...transaction, amount: parseFloat(amount) };

    if (current === null) {
      addTransaction(transactionData);
    } else {
      updateTransaction(transactionData);
    }
    closeForm();
  };

  const closeForm = () => {
    handleClose();
    clearCurrent();
  };

  return (
    <Dialog open={open} onClose={closeForm}>
      <DialogTitle>{current ? "編輯交易" : "新增交易"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="dense" required>
            <InputLabel>帳戶</InputLabel>
            <Select name="accountId" value={accountId} onChange={onChange}>
              {accounts.map((account) => (
                <MenuItem key={account._id} value={account._id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="date"
            label="日期"
            type="date"
            fullWidth
            value={date}
            onChange={onChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="category"
            label="分類"
            type="text"
            fullWidth
            value={category}
            onChange={onChange}
            required
          />
          <TextField
            margin="dense"
            name="amount"
            label="金額"
            type="number"
            fullWidth
            value={amount}
            onChange={onChange}
            required
          />
          <FormControl component="fieldset" margin="normal">
            <RadioGroup row name="type" value={type} onChange={onChange}>
              <FormControlLabel
                value="expense"
                control={<Radio />}
                label="支出"
              />
              <FormControlLabel
                value="income"
                control={<Radio />}
                label="收入"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            margin="dense"
            name="notes"
            label="備註"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={onChange}
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

export default TransactionForm;
