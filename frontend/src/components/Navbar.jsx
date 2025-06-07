import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AccountContext from '../context/account/accountContext';
import TransactionContext from '../context/transaction/transactionContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const accountContext = useContext(AccountContext);
  const transactionContext = useContext(TransactionContext);

  const { isAuthenticated, logout, user } = authContext;
  const { clearAccounts } = accountContext;
  const { clearTransactions } = transactionContext;

  const onLogout = () => {
    logout();
    clearAccounts();
    clearTransactions();
  };

  const authLinks = (
    <>
      <li>Hello {user && user.username}</li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">登出</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li><Link to="/register">註冊</Link></li>
      <li><Link to="/login">登入</Link></li>
    </>
  );
  
  const mainNavLinks = (
    <>
        <li><Link to="/">儀表板</Link></li>
        <li><Link to="/accounts">帳戶管理</Link></li>
        <li><Link to="/transactions">收支紀錄</Link></li>
        <li><Link to="/investments">投資追蹤</Link></li>
    </>
  )

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    background: '#333',
    padding: '1rem',
    listStyle: 'none'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none'
  };

  return (
    <nav style={{ background: '#333', color: 'white' }}>
      <h1>
        <Link to="/" style={linkStyle}>
            <i className="fas fa-wallet" /> AssetX
        </Link>
      </h1>
      <ul style={navStyle}>
        {isAuthenticated && mainNavLinks}
        {isAuthenticated ? authLinks : guestLinks}
      </ul>
    </nav>
  );
};

export default Navbar; 