import React, { useState, useContext, useEffect } from "react";
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
  FormLabel,
} from "@mui/material";

const AccountForm = ({ open, handleClose }) => {
  const accountContext = useContext(AccountContext);
  const { addAccount, updateAccount, clearCurrent, current } = accountContext;

  useEffect(() => {
    if (current !== null) {
      setAccount(current);
    } else {
      setAccount({
        name: "",
        initialBalance: 0,
        type: "asset",
        balance: 0,
      });
    }
  }, [accountContext, current]);

  const [account, setAccount] = useState({
    name: "",
    initialBalance: 0,
    type: "asset",
    balance: 0,
  });

  const { name, initialBalance, type } = account;

  const onChange = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: name === "initialBalance" ? parseFloat(value) : value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const accountData = {
      name: account.name,
      type: account.type,
      // 如果是編輯，我們傳遞 balance，如果是新增，傳遞 initialBalance
      balance: current ? account.balance : account.initialBalance,
    };

    if (current === null) {
      addAccount({ name, initialBalance, type });
    } else {
      updateAccount({ ...account, balance: account.balance });
    }
    closeForm();
  };

  const closeForm = () => {
    handleClose();
    clearCurrent();
  };

  return (
    <Dialog open={open} onClose={closeForm}>
      <DialogTitle>{current ? "編輯帳戶" : "新增帳戶"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            autoComplete="off"
            margin="dense"
            name="name"
            label="帳戶名稱"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={onChange}
            required
          />
          <TextField
            margin="dense"
            name="initialBalance"
            label="調整餘額"
            type="number"
            fullWidth
            variant="standard"
            value={initialBalance}
            onChange={onChange}
            required
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">帳戶類型</FormLabel>
            <RadioGroup row name="type" value={type} onChange={onChange}>
              <FormControlLabel
                value="asset"
                control={<Radio />}
                label="資產"
              />
              <FormControlLabel
                value="liability"
                control={<Radio />}
                label="負債"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>取消</Button>
          <Button type="submit" variant="contained">
            {current ? "更新帳戶" : "新增帳戶"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountForm;
