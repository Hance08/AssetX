import React, { useContext, useState } from "react";
import AccountContext from "../../context/account/accountContext";
import { ListItem, IconButton, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../common/ConfirmDialog";

const AccountItem = ({ account, onEdit }) => {
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
      <ListItem divider sx={{ display: "flex", px: 2, py: 1.5 }}>
        <Typography sx={{ flex: { xs: 3, md: 2 } }} variant="body1">
          {name}
        </Typography>
        <Typography
          sx={{ flex: { xs: 2, md: 1 } }}
          variant="body2"
          color="text.secondary"
        >
          {type === "asset" ? "資產" : "負債"}
        </Typography>
        <Typography sx={{ flex: 1, textAlign: "right" }} variant="body1">
          {balance !== undefined ? balance.toLocaleString() : "N/A"}
        </Typography>
        <Box
          sx={{
            flex: 2,
            textAlign: "center",
          }}
        >
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
        message={`您確定要刪除帳戶「${name}」嗎？此操作無法復原。`}
      />
    </>
  );
};

export default AccountItem;
