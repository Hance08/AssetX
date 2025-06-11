import React, { useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthContext from "../context/AuthContext";
import AccountContext from "../context/account/accountContext";
import TransactionContext from "../context/transaction/transactionContext";

const SideNavbar = () => {
  const authContext = useContext(AuthContext);
  const accountContext = useContext(AccountContext);
  const transactionContext = useContext(TransactionContext);
  const navigate = useNavigate();

  const { logout } = authContext;
  const { clearAccounts } = accountContext;
  const { clearTransactions } = transactionContext;

  const mainNavLinks = [
    { text: "儀表板", icon: <DashboardIcon />, to: "/" },
    { text: "帳戶管理", icon: <AccountBalanceWalletIcon />, to: "/accounts" },
    { text: "收支紀錄", icon: <ReceiptIcon />, to: "/transactions" },
    { text: "投資追蹤", icon: <ShowChartIcon />, to: "/investments" },
  ];

  const onLogout = () => {
    logout();
    if (clearAccounts) clearAccounts();
    if (clearTransactions) clearTransactions();
    navigate("/login");
  };

  return (
    <Drawer
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
      classes={{ paper: "drawer-paper" }}
    >
      <div>
        <Toolbar disableGutters>
          <SavingsRoundedIcon sx={{ ml: 2, mr: 3.5, fontSize: "30px" }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            AssetX
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {mainNavLinks.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.to}>
                <ListItemIcon sx={{ color: "black" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Divider />
        <List>
          <ListItem key="logout" disablePadding>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="登出" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default SideNavbar;
