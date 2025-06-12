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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

const TransferForm = ({ open, handleClose }) => {
  const transactionContext = useContext(TransactionContext);
  const accountContext = useContext(AccountContext);

  const { transferFunds } = transactionContext;
  const { accounts, getAccounts } = accountContext;

  useEffect(() => {
    if (open) {
      getAccounts();
    }
    // eslint-disable-next-line
  }, [open]);

  const [transfer, setTransfer] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const { fromAccountId, toAccountId, amount, date, notes } = transfer;

  const onChange = (e) => {
    setTransfer({
      ...transfer,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId) {
      return alert("請選擇轉出和轉入帳戶");
    }
    if (fromAccountId === toAccountId) {
      return alert("轉出和轉入帳戶不能相同");
    }
    transferFunds({ ...transfer, amount: parseFloat(amount) });
    handleClose();
    // Clear form
    setTransfer({
      fromAccountId: "",
      toAccountId: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>新增轉帳</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl fullWidth margin="dense" required>
              <InputLabel sx={{ bgcolor: "background.paper", px: 1 }}>
                從 帳戶
              </InputLabel>
              <Select
                name="fromAccountId"
                value={fromAccountId}
                onChange={onChange}
              >
                {accounts.map((account) => (
                  <MenuItem key={account._id} value={account._id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box textAlign="center" my={1}>
              <Typography variant="h6">→</Typography>
            </Box>
            <FormControl fullWidth margin="dense" required>
              <InputLabel sx={{ bgcolor: "background.paper", px: 1 }}>
                至 帳戶
              </InputLabel>
              <Select
                name="toAccountId"
                value={toAccountId}
                onChange={onChange}
              >
                {accounts.map((account) => (
                  <MenuItem key={account._id} value={account._id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
              name="amount"
              label="金額"
              type="number"
              fullWidth
              value={amount}
              onChange={onChange}
              required
            />
          </Box>
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
          <Button onClick={handleClose}>取消</Button>
          <Button type="submit" variant="contained">
            建立轉帳
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferForm;
