import React, { useContext, useState } from "react";
import AccountContext from "../../context/account/accountContext";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../common/ConfirmDialog";

const AccountCard = ({ account, onEdit }) => {
  const accountContext = useContext(AccountContext);
  const { deleteAccount, setCurrent, clearCurrent } = accountContext;

  const [dialogOpen, setDialogOpen] = useState(false);

  const { _id, name, balance, type } = account;

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const onDeleteConfirm = () => {
    deleteAccount(_id);
    clearCurrent();
    handleCloseDialog();
  };

  const handleEdit = () => {
    setCurrent(account);
    onEdit();
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "30vh",
          height: "100%",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="div">
              {name}
            </Typography>
            <Chip
              label={type === "asset" ? "資產" : "負債"}
              color={type === "asset" ? "success" : "warning"}
              size="small"
            />
          </Box>
          <Typography variant="h4" component="p">
            ${balance !== undefined ? balance.toLocaleString() : "N/A"}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <IconButton aria-label="edit" onClick={handleEdit} size="small">
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={handleOpenDialog}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={onDeleteConfirm}
        title="確認刪除"
        message={`您確定要刪除帳戶「${name}」嗎？此操作無法復原。`}
      />
    </>
  );
};

export default AccountCard;
