import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
    <nav>
      <ul style={navStyle}>
        <li><Link to="/" style={linkStyle}>儀表板</Link></li>
        <li><Link to="/accounts" style={linkStyle}>帳戶管理</Link></li>
        <li><Link to="/transactions" style={linkStyle}>收支紀錄</Link></li>
        <li><Link to="/investments" style={linkStyle}>投資追蹤</Link></li>
        <li><Link to="/login" style={linkStyle}>登入</Link></li>
        <li><Link to="/register" style={linkStyle}>註冊</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; 