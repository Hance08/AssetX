import React, { useContext, useState } from "react";
import TransactionContext from "../../context/transaction/transactionContext";
import { ListItem, IconButton, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../common/ConfirmDialog";
import moment from "moment";

const TransactionItem = ({ transaction, onEdit }) => {
  const transactionContext = useContext(TransactionContext);
  const { deleteTransaction, setCurrent, clearCurrent } = transactionContext;

  const [dialogOpen, setDialogOpen] = useState(false);

  const { _id, date, notes, amount, accountId, category } = transaction;

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const onDeleteConfirm = () => {
    deleteTransaction(_id);
    clearCurrent();
    handleCloseDialog();
  };

  const handleEdit = () => {
    setCurrent(transaction);
    onEdit();
  };

  const isExpense = amount < 0;
  const amountColor = isExpense ? "error.main" : "success.main";

  return (
    <>
      <ListItem divider sx={{ display: "flex", px: 2, py: 1.5, gap: 2 }}>
        <Typography sx={{ flex: 1.5 }} variant="body2">
          {moment(date).format("YYYY-MM-DD")}
        </Typography>
        <Typography sx={{ flex: 2 }} variant="body1">
          {category}
        </Typography>
        <Typography sx={{ flex: 2 }} variant="body2" color="text.secondary">
          {accountId ? accountId.name : "N/A"}
        </Typography>
        <Typography
          sx={{
            flex: 1,
            textAlign: "right",
            fontWeight: "bold",
            color: amountColor,
          }}
        >
          {amount.toLocaleString()}
        </Typography>
        <Typography
          sx={{ flex: 3, wordBreak: "break-word", textAlign: "center" }}
          variant="body2"
          color="text.secondary"
        >
          {notes}
        </Typography>
        <Box sx={{ flex: 1.5, textAlign: "center" }}>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={handleEdit}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleOpenDialog}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={onDeleteConfirm}
        title="確認刪除"
        message={`您確定要刪除這筆交易紀錄嗎？此操作會影響帳戶餘額。`}
      />
    </>
  );
};

export default TransactionItem;
