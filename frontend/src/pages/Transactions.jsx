import React, { useContext, useEffect, useState } from "react";
import TransactionContext from "../context/transaction/transactionContext";
import TransactionForm from "../components/transaction/TransactionForm";
import TransactionItem from "../components/transaction/TransactionItem";
import {
  Container,
  Button,
  List,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Transactions = () => {
  const transactionContext = useContext(TransactionContext);
  const { transactions, getTransactions, loading, clearCurrent } =
    transactionContext;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  const handleOpen = () => {
    clearCurrent();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    setOpen(true);
  };

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
      <Typography sx={{ flex: 1.5 }} variant="subtitle2">
        日期
      </Typography>
      <Typography sx={{ flex: 2 }} variant="subtitle2">
        分類
      </Typography>
      <Typography sx={{ flex: 2 }} variant="subtitle2">
        帳戶
      </Typography>
      <Typography sx={{ flex: 1, textAlign: "right" }} variant="subtitle2">
        金額
      </Typography>
      <Typography sx={{ flex: 3, textAlign: "center" }} variant="subtitle2">
        備註
      </Typography>
      <Typography sx={{ flex: 1.5, textAlign: "center" }} variant="subtitle2">
        設定
      </Typography>
    </Box>
  );

  return (
    <Container sx={{ width: "1200px", height: "80vh" }}>
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          新增交易
        </Button>
      </Box>

      <TransactionForm open={open} handleClose={handleClose} />

      <Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : transactions && transactions.length > 0 ? (
          <>
            {listHeader}
            <Box sx={{ maxHeight: "calc(100vh - 280px)", overflow: "auto" }}>
              <List disablePadding>
                {transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                    onEdit={handleEdit}
                  />
                ))}
              </List>
            </Box>
          </>
        ) : (
          <Typography sx={{ p: 4, textAlign: "center" }}>
            您尚未新增任何交易紀錄。
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Transactions;
