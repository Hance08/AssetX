import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Investments from './pages/Investments';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthState from './context/AuthState.jsx';
import AccountState from './context/account/AccountState.jsx';
import TransactionState from './context/transaction/TransactionState.jsx';
import DashboardState from './context/dashboard/DashboardState.jsx';
import './App.css';

function App() {
  return (
    <AuthState>
      <AccountState>
        <TransactionState>
          <DashboardState>
            <>
              <Navbar />
              <div className="container">
                <Routes>
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
                  <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                  <Route path="/investments" element={<PrivateRoute><Investments /></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </div>
            </>
          </DashboardState>
        </TransactionState>
      </AccountState>
    </AuthState>
  );
}

export default App;
