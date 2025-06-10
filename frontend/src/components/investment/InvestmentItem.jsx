import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvestmentContext from "../../context/investment/investmentContext";
import { ListItem, IconButton, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewIcon from "@mui/icons-material/Pageview";
import ConfirmDialog from "../common/ConfirmDialog";

const InvestmentItem = ({ investment }) => {
  const investmentContext = useContext(InvestmentContext);
  const { deleteInvestment, setCurrentInvestment, clearCurrentInvestment } =
    investmentContext;
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const { _id, name, symbol, totalShares, totalCost } = investment;

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
      <ListItem divider sx={{ display: "flex", px: 2, py: 1.5, gap: 2 }}>
        <Typography sx={{ flex: 2, fontWeight: "bold" }} variant="body1">
          {symbol}
        </Typography>
        <Typography sx={{ flex: 2 }} variant="body1">
          {name}
        </Typography>
        <Typography sx={{ flex: 2, textAlign: "right" }} variant="body2">
          {totalShares || 0} 股
        </Typography>
        <Typography sx={{ flex: 2, textAlign: "right" }} variant="body2">
          {totalCost ? totalCost.toLocaleString() : 0}
        </Typography>
        <Box sx={{ flex: 2, textAlign: "center" }}>
          <IconButton
            onClick={handleViewDetails}
            size="small"
            aria-label="查看詳情"
          >
            <PageviewIcon />
          </IconButton>
          <IconButton onClick={onEdit} size="small" aria-label="編輯名稱/代號">
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
