import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  handleClose,
  handleConfirm,
  title,
  message,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
