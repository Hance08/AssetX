import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvestmentContext from "../../context/investment/investmentContext";
import { ListItem, ListItemText, IconButton, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../common/ConfirmDialog";

const InvestmentItem = ({ investment }) => {
  const investmentContext = useContext(InvestmentContext);
  const { deleteInvestment, setCurrentInvestment, clearCurrentInvestment } =
    investmentContext;
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const { _id, name, symbol, totalShares, totalCost, currentPrice } =
    investment;

  const totalMarketValue = totalShares * currentPrice;

  const onDeleteConfirm = () => {
    deleteInvestment(_id);
    clearCurrentInvestment();
    setDialogOpen(false);
  };

  const onEdit = () => {
    setCurrentInvestment(investment);
    // This will be handled by the parent component, which opens the form
  };

  const handleViewDetails = () => {
    navigate(`/investment/${_id}`);
  };

  return (
    <>
      <ListItem divider sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <ListItemText sx={{ flex: 2, fontWeight: "bold" }} primary={symbol} />
        <ListItemText sx={{ flex: 2 }} primary={name} />
        <ListItemText
          sx={{ flex: 2, textAlign: "right" }}
          primary={totalShares.toLocaleString()}
        />
        <ListItemText
          sx={{ flex: 2, textAlign: "right" }}
          primary={`$${currentPrice.toFixed(2)}`}
        />
        <ListItemText
          sx={{ flex: 2, textAlign: "right" }}
          primary={`$${totalMarketValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
        <ListItemText
          sx={{ flex: 2, textAlign: "right" }}
          primary={`$${totalCost.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
        <Box
          sx={{
            flex: 2,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton onClick={handleViewDetails} size="small">
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={onEdit} size="small">
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => setDialogOpen(true)}
            size="small"
            aria-label="刪除"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleConfirm={onDeleteConfirm}
        title="確認刪除投資標的"
        message={`您確定要刪除「${name} (${symbol})」嗎？這將會刪除其所有相關的交易紀錄，此操作無法復原。`}
      />
    </>
  );
};

export default InvestmentItem;
