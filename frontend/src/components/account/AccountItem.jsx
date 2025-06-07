import React, { useContext } from 'react';
import AccountContext from '../../context/account/accountContext';

const AccountItem = ({ account }) => {
  const accountContext = useContext(AccountContext);
  const { deleteAccount, setCurrent, clearCurrent } = accountContext;

  const { _id, name, balance, type } = account;

  const onDelete = () => {
    deleteAccount(_id);
    clearCurrent();
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h3>{name}</h3>
      <p>類型: {type === 'asset' ? '資產' : '負債'}</p>
      <p>餘額: {(balance || 0).toLocaleString()}</p>
      <p>
        <button className="btn btn-sm" onClick={() => setCurrent(account)}>編輯</button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>刪除</button>
      </p>
    </div>
  );
};

export default AccountItem; 