import React, { useContext, useEffect, useState } from "react";
import TransactionContext from "../context/transaction/transactionContext";
import TransactionForm from "../components/transaction/TransactionForm";
import TransferForm from "../components/transaction/TransferForm";
import TransactionItem from "../components/transaction/TransactionItem";
import {
  Container,
  Button,
  List,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const Transactions = () => {
  const transactionContext = useContext(TransactionContext);
  const { transactions, getTransactions, loading, clearCurrent } =
    transactionContext;

  const [formOpen, setFormOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [processedTransactions, setProcessedTransactions] = useState([]);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    getTransactions({ year, month });
    // eslint-disable-next-line
  }, [selectedDate]);

  useEffect(() => {
    if (transactions) {
      const processed = [];
      const handledTransferIds = new Set();

      for (const transaction of transactions) {
        if (
          transaction.transferId &&
          !handledTransferIds.has(transaction.transferId)
        ) {
          const pair = transactions.find(
            (t) =>
              t.transferId === transaction.transferId &&
              t._id !== transaction._id
          );
          if (pair) {
            const from = transaction.amount < 0 ? transaction : pair;
            const to = transaction.amount > 0 ? transaction : pair;
            processed.push({
              _id: from._id, // Use one of the ids as key
              isTransfer: true,
              date: from.date,
              amount: Math.abs(from.amount),
              fromAccount: from.accountId.name,
              toAccount: to.accountId.name,
              notes: from.notes || to.notes,
              transferId: from.transferId,
            });
            handledTransferIds.add(transaction.transferId);
          } else {
            // If pair is not found (e.g., in another month), show as normal
            processed.push(transaction);
          }
        } else if (!transaction.transferId) {
          processed.push(transaction);
        }
      }
      setProcessedTransactions(processed);
    }
  }, [transactions]);

  const handleOpenForm = () => {
    clearCurrent();
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleOpenTransfer = () => {
    setTransferOpen(true);
  };

  const handleCloseTransfer = () => {
    setTransferOpen(false);
  };

  const handleDateChange = (type, value) => {
    const newDate = new Date(selectedDate);
    if (type === "year") {
      newDate.setFullYear(value);
    } else {
      newDate.setMonth(value - 1);
    }
    setSelectedDate(newDate);
  };

  const handleEdit = () => {
    setFormOpen(true);
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
      <Typography sx={{ flex: 1.5 }} variant="subtitle2">
        分類
      </Typography>
      <Typography sx={{ flex: 1 }} variant="subtitle2">
        細項
      </Typography>
      <Typography sx={{ flex: 1.5 }} variant="subtitle2">
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

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years.reverse();
  };

  return (
    <Container sx={{ width: "1150px", height: "80vh" }}>
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleOpenForm}
          >
            新增交易
          </Button>
          <Button
            startIcon={<CompareArrowsIcon />}
            variant="contained"
            onClick={handleOpenTransfer}
          >
            新增轉帳
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl variant="outlined" size="small">
            <Select
              value={selectedDate.getFullYear()}
              onChange={(e) => handleDateChange("year", e.target.value)}
            >
              {generateYearOptions().map((year) => (
                <MenuItem key={year} value={year}>
                  {year} 年
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small">
            <Select
              value={selectedDate.getMonth() + 1}
              onChange={(e) => handleDateChange("month", e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} 月
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TransactionForm open={formOpen} handleClose={handleCloseForm} />
      <TransferForm open={transferOpen} handleClose={handleCloseTransfer} />

      <Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : processedTransactions && processedTransactions.length > 0 ? (
          <>
            {listHeader}
            <Box sx={{ maxHeight: "calc(100vh - 280px)", overflow: "auto" }}>
              <List disablePadding>
                {processedTransactions.map((transaction) => (
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
