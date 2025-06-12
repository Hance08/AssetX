import React, { useState, useContext, useEffect } from "react";
import TransactionContext from "../../context/transaction/transactionContext";
import AccountContext from "../../context/account/accountContext";
import CategorySelectionDialog from "./CategorySelectionDialog";
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
  Box,
  Typography,
} from "@mui/material";

const TransactionForm = ({ open, handleClose }) => {
  const transactionContext = useContext(TransactionContext);
  const accountContext = useContext(AccountContext);

  const { addTransaction, updateTransaction, current, clearCurrent } =
    transactionContext;
  const { accounts, getAccounts } = accountContext;

  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getAccounts();
    }
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    if (current) {
      setTransaction({
        ...current,
        date: new Date(current.date).toISOString().slice(0, 10),
        amount: Math.abs(current.amount),
        type: current.amount < 0 ? "expense" : "income",
        accountId: current.accountId._id || current.accountId,
        subcategory: current.subcategory || "",
      });
    } else {
      setTransaction({
        notes: "",
        amount: "",
        type: "expense",
        date: new Date().toISOString().slice(0, 10),
        category: "",
        subcategory: "",
        accountId: accounts && accounts.length > 0 ? accounts[0]._id : "",
      });
    }
  }, [current, open, accounts]);

  const [transaction, setTransaction] = useState({
    notes: "",
    amount: "",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    subcategory: "",
    accountId: "",
  });

  const { notes, amount, type, date, category, subcategory, accountId } =
    transaction;

  const onChange = (e) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategorySelect = (selectedCategory, selectedSubcategory) => {
    setTransaction({
      ...transaction,
      category: selectedCategory,
      subcategory: selectedSubcategory,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!accountId) {
      return alert("請選擇一個帳戶");
    }
    if (!category || !subcategory) {
      return alert("請選擇交易分類");
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
    <>
      <Dialog open={open} onClose={closeForm}>
        <DialogTitle>{current ? "編輯交易" : "新增交易"}</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense" required>
              <InputLabel sx={{ bgcolor: "background.paper", px: 1 }}>
                帳戶
              </InputLabel>
              <Select name="accountId" value={accountId} onChange={onChange}>
                {accounts.map((account) => (
                  <MenuItem key={account._id} value={account._id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                margin="dense"
                name="date"
                label="日期"
                type="date"
                sx={{ flexGrow: 2 }}
                value={date}
                onChange={onChange}
                required
                // InputLabelProps={{ shrink: true }}
              />

              <Button
                variant="outlined"
                sx={{ flexGrow: 1 }}
                onClick={() => setCategoryDialogOpen(true)}
              >
                {category && subcategory ? `${subcategory}` : "選擇分類"}
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                margin="dense"
                name="amount"
                label="金額"
                type="number"
                sx={{ flexGrow: 1 }}
                value={amount}
                onChange={onChange}
                required
              />
              <FormControl component="fieldset" margin="dense">
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
            <Button onClick={closeForm}>取消</Button>
            <Button type="submit" variant="contained">
              {current ? "更新" : "新增"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <CategorySelectionDialog
        open={isCategoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        onSelect={handleCategorySelect}
        transactionType={type}
      />
    </>
  );
};

export default TransactionForm;
