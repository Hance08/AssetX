import React, { useState, useContext, useEffect } from 'react';
import AccountContext from '../../context/account/accountContext';

const AccountForm = () => {
  const accountContext = useContext(AccountContext);
  const { addAccount, updateAccount, clearCurrent, current, error, clearErrors } = accountContext;

  useEffect(() => {
    if (error) {
      alert(error);
      // clearErrors(); // Assuming you will add clearErrors to AccountContext
    }
  }, [error]);

  useEffect(() => {
    if (current !== null) {
      setAccount(current);
    } else {
      setAccount({
        name: '',
        initialBalance: 0,
        type: 'asset'
      });
    }
  }, [accountContext, current]);

  const [account, setAccount] = useState({
    name: '',
    initialBalance: 0,
    type: 'asset'
  });

  const { name, initialBalance, type } = account;

  const onChange = e =>
    setAccount({
      ...account,
      [e.target.name]:
        e.target.name === 'initialBalance' ? parseFloat(e.target.value) || 0 : e.target.value
    });

  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      addAccount(account);
    } else {
      updateAccount(account);
    }
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>{current ? '編輯帳戶' : '新增帳戶'}</h2>
      <input
        type="text"
        placeholder="帳戶名稱"
        name="name"
        value={name}
        onChange={onChange}
        required
      />
      <input
        type="number"
        placeholder="初始餘額"
        name="initialBalance"
        value={initialBalance}
        onChange={onChange}
        required
      />
      <h5>帳戶類型</h5>
      <input
        type="radio"
        name="type"
        value="asset"
        checked={type === 'asset'}
        onChange={onChange}
      /> 資產{' '}
      <input
        type="radio"
        name="type"
        value="liability"
        checked={type === 'liability'}
        onChange={onChange}
      /> 負債
      <div>
        <input
          type="submit"
          value={current ? '更新帳戶' : '新增帳戶'}
          className="btn btn-primary btn-block"
        />
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            清除
          </button>
        </div>
      )}
    </form>
  );
};

export default AccountForm; 