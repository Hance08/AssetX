import React, { useState, useContext, useEffect } from "react";
import InvestmentContext from "../context/investment/investmentContext";
import InvestmentForm from "../components/investment/InvestmentForm";
import InvestmentList from "../components/investment/InvestmentList";
import { Container, Button, Box, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Investments = () => {
  const investmentContext = useContext(InvestmentContext);
  const { setCurrentInvestment, investments, loading, getInvestments } =
    investmentContext;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getInvestments();
    // eslint-disable-next-line
  }, []);

  const handleOpen = () => {
    setCurrentInvestment(null); // 確保是新增模式
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // This can be passed to InvestmentItem, if an edit button there should open the main form
  const handleEdit = () => {
    setOpen(true);
  };

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
          新增投資標的
        </Button>
      </Box>

      <InvestmentForm open={open} handleClose={handleClose} />

      <Paper>
        {investments && investments.length > 0 ? (
          <InvestmentList />
        ) : (
          !loading && (
            <Typography sx={{ p: 4, textAlign: "center" }}>
              您尚未新增任何投資標的。
            </Typography>
          )
        )}
      </Paper>
    </Container>
  );
};

export default Investments;
