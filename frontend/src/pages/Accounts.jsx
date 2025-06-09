import React, { useContext, useEffect, useState } from "react";
import AccountContext from "../context/account/accountContext";
import AccountForm from "../components/account/AccountForm";
import AccountItem from "../components/account/AccountItem";
import {
  Container,
  Button,
  List,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Accounts = () => {
  const accountContext = useContext(AccountContext);
  const { accounts, getAccounts, loading, clearCurrent } = accountContext;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line
  }, []);

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
    <Container sx={{ width: "900px", alignSelf: "flex-start" }}>
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
          新增帳戶
        </Button>
      </Box>

      <AccountForm open={open} handleClose={handleClose} />

      <Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : accounts && accounts.length > 0 ? (
          <>
            {listHeader}
            <Box sx={{ maxHeight: 330, overflow: "auto" }}>
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
          </>
        ) : (
          <Typography sx={{ p: 4, textAlign: "center" }}>
            您尚未新增任何帳戶。
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Accounts;
