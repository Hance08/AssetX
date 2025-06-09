import React from "react";
import { Link as RouterLink } from "react-router-dom";
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
import PaidIcon from "@mui/icons-material/Paid";
import "./SideNavbar.css";

const SideNavbar = () => {
  const mainNavLinks = [
    { text: "儀表板", icon: <DashboardIcon />, to: "/" },
    { text: "帳戶管理", icon: <AccountBalanceWalletIcon />, to: "/accounts" },
    { text: "收支紀錄", icon: <ReceiptIcon />, to: "/transactions" },
    { text: "投資追蹤", icon: <ShowChartIcon />, to: "/investments" },
  ];

  return (
    <Drawer
      className="drawer-permanent"
      variant="permanent"
      anchor="left"
      classes={{ paper: "drawer-paper" }}
    >
      <Toolbar>
        <PaidIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap>
          AssetX
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {mainNavLinks.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNavbar;
