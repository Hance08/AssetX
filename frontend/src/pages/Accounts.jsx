import React, { useContext, useEffect } from 'react';
import AccountContext from '../context/account/accountContext';
import AccountForm from '../components/account/AccountForm';
import AccountItem from '../components/account/AccountItem';

const Accounts = () => {
  const accountContext = useContext(AccountContext);
  const { accounts, getAccounts, loading } = accountContext;

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line
  }, []);

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem'
  };

  return (
    <div style={pageStyle}>
      <div>
        <AccountForm />
      </div>
      <div>
        <h1>帳戶列表</h1>
        {accounts !== null && !loading ? (
           (accounts.length > 0) ? (
            accounts.map(account => (
              <AccountItem key={account._id} account={account} />
            ))
           ) : <p>您尚未新增任何帳戶。</p>
        ) : (
          <p>載入中...</p>
        )}
      </div>
    </div>
  );
};

export default Accounts; 