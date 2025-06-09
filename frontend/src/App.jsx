import React, { useEffect, useContext } from "react";
import {
  Routes,
  Route,
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";
import { CssBaseline, Button, Box } from "@mui/material";
import PrivateRoute from "./components/PrivateRoute";
import SideNavbar from "./components/SideNavbar";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Investments from "./pages/Investments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthContext from "./context/AuthContext";
import AuthState from "./context/AuthState.jsx";
import AccountState from "./context/account/AccountState.jsx";
import TransactionState from "./context/transaction/TransactionState.jsx";
import DashboardState from "./context/dashboard/DashboardState.jsx";
import InvestmentState from "./context/investment/InvestmentState.jsx";
import TradeState from "./context/trade/TradeState";
import AccountContext from "./context/account/accountContext";
import TransactionContext from "./context/transaction/transactionContext";
import "./App.css";

const AppContent = () => {
  const authContext = useContext(AuthContext);
  const accountContext = useContext(AccountContext);
  const transactionContext = useContext(TransactionContext);
  const navigate = useNavigate();

  const { isAuthenticated, logout, user, loadUser } = authContext;
  const { clearAccounts } = accountContext;
  const { clearTransactions } = transactionContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logout();
    clearAccounts();
    clearTransactions();
    navigate("/login");
  };

  const guestLinks = (
    <Box>
      <Button color="inherit" component={RouterLink} to="/register">
        註冊
      </Button>
      <Button color="inherit" component={RouterLink} to="/login">
        登入
      </Button>
    </Box>
  );

  return (
    <div className="app-container">
      <CssBaseline />
      {isAuthenticated && <SideNavbar />}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <PrivateRoute>
                <Accounts />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/investments"
            element={
              <PrivateRoute>
                <Investments />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthState>
      <AccountState>
        <TransactionState>
          <DashboardState>
            <InvestmentState>
              <TradeState>
                <AppContent />
              </TradeState>
            </InvestmentState>
          </DashboardState>
        </TransactionState>
      </AccountState>
    </AuthState>
  );
}

export default App;
