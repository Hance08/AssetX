import React, { useContext, useState } from "react";
import TransactionContext from "../../context/transaction/transactionContext";
import { ListItem, IconButton, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ConfirmDialog from "../common/ConfirmDialog";
import moment from "moment";

const TransactionItem = ({ transaction, onEdit }) => {
  const transactionContext = useContext(TransactionContext);
  const { deleteTransaction, setCurrent, clearCurrent } = transactionContext;

  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    _id,
    date,
    notes,
    amount,
    accountId,
    category,
    subcategory,
    isTransfer,
    fromAccount,
    toAccount,
    transferId,
  } = transaction;

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const onDeleteConfirm = () => {
    // If it's a transfer, the delete action might need to be handled differently,
    // e.g., deleting both linked transactions. For now, we delete by the provided id,
    // assuming the backend handles the pair deletion if given a transferId.
    deleteTransaction(_id, transferId);
    clearCurrent();
    handleCloseDialog();
  };

  const handleEdit = () => {
    setCurrent(transaction);
    onEdit();
  };

  const amountColor = isTransfer
    ? "text.primary"
    : amount < 0
    ? "error.main"
    : "success.main";

  return (
    <>
      <ListItem divider sx={{ display: "flex", px: 2, py: 1.5, gap: 2 }}>
        <Typography sx={{ flex: 1.5 }} variant="body2">
          {moment(date).format("YYYY-MM-DD")}
        </Typography>

        {isTransfer ? (
          <>
            <Typography
              sx={{ flex: 1.5, display: "flex", alignItems: "center" }}
              variant="body1"
            >
              帳戶轉帳
            </Typography>
            <Typography sx={{ flex: 1 }} variant="body2" color="text.secondary">
              <CompareArrowsIcon />
            </Typography>
            <Typography
              sx={{ flex: 1.5 }}
              variant="body2"
              color="text.secondary"
            >
              {toAccount}
            </Typography>
          </>
        ) : (
          <>
            <Typography sx={{ flex: 1.5 }} variant="body1">
              {category}
            </Typography>
            <Typography sx={{ flex: 1 }} variant="body2" color="text.secondary">
              {subcategory}
            </Typography>
            <Typography
              sx={{ flex: 1.5 }}
              variant="body2"
              color="text.secondary"
            >
              {accountId ? accountId.name : "N/A"}
            </Typography>
          </>
        )}

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
        {isTransfer ? (
          <Typography
            sx={{ flex: 3, wordBreak: "break-word", textAlign: "center" }}
            variant="body2"
            color="text.secondary"
          >
            {fromAccount} → {toAccount}
          </Typography>
        ) : (
          <Typography
            sx={{ flex: 3, wordBreak: "break-word", textAlign: "center" }}
            variant="body2"
            color="text.secondary"
          >
            {notes}
          </Typography>
        )}
        <Box sx={{ flex: 1.5, textAlign: "center" }}>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={handleEdit}
            size="small"
            disabled={isTransfer}
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
        message={`您確定要刪除這筆紀錄嗎？此操作將無法復原。`}
      />
    </>
  );
};

export default TransactionItem;
