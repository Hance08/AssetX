import React, { useContext, useEffect, useState } from "react";
import AccountContext from "../context/account/accountContext";
import AccountForm from "../components/account/AccountForm";
import AccountItem from "../components/account/AccountItem";
import AccountCard from "../components/account/AccountCard";
import {
  Container,
  Button,
  List,
  Typography,
  Box,
  CircularProgress,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

const Accounts = () => {
  const accountContext = useContext(AccountContext);
  const { accounts, getAccounts, loading, clearCurrent } = accountContext;

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line
  }, []);

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleOpen = () => {
    clearCurrent(); // 確保新增時 current 為 null
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
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "grey.100",
      }}
    >
      <Typography sx={{ flex: { xs: 3, md: 2 } }} variant="subtitle2">
        帳戶名稱
      </Typography>
      <Typography
        sx={{ flex: { xs: 1, md: 1 }, textAlign: "left" }}
        variant="subtitle2"
      >
        類型
      </Typography>
      <Typography sx={{ flex: 1, textAlign: "right" }} variant="subtitle2">
        餘額
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "center" }} variant="subtitle2">
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
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          新增帳戶
        </Button>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
        >
          <ToggleButton value="card" aria-label="card">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <AccountForm open={open} handleClose={handleClose} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : accounts && accounts.length > 0 ? (
        viewMode === "card" ? (
          <Box
            sx={{
              maxHeight: "calc(80vh - 150px)",
              overflow: "auto",
              p: 2,
              mx: -1,
            }}
          >
            <Grid container spacing={3}>
              {accounts.map((account) => (
                <Grid item xs={12} sm={6} md={4} key={account._id}>
                  <AccountCard account={account} onEdit={handleEdit} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Paper>
            {listHeader}
            <Box sx={{ maxHeight: 500, overflow: "auto" }}>
              <List disablePadding>
                {accounts.map((account) => (
                  <AccountItem
                    key={account._id}
                    account={account}
                    onEdit={handleEdit}
                  />
                ))}
              </List>
            </Box>
          </Paper>
        )
      ) : (
        <Typography sx={{ p: 4, textAlign: "center" }}>
          您尚未新增任何帳戶。
        </Typography>
      )}
    </Container>
  );
};

export default Accounts;
