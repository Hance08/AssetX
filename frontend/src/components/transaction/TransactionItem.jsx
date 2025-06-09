import React, { useContext } from 'react';
import TransactionContext from '../../context/transaction/transactionContext';

const TransactionItem = ({ transaction }) => {
    const transactionContext = useContext(TransactionContext);
    const { deleteTransaction } = transactionContext;

    const { _id, date, notes, amount, accountId, category } = transaction;

    const onDelete = () => {
        deleteTransaction(_id);
    };
    
    // 簡單的日期格式化
    const formattedDate = new Date(date).toLocaleDateString('zh-TW');

    // 根據 amount 的正負來決定是否為支出
    const isExpense = amount < 0;

    const amountStyle = {
        color: isExpense ? 'red' : 'green'
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h4>{category}</h4>
                    <small>帳戶: {accountId ? accountId.name : 'N/A'} | 備註: {notes}</small> <br/>
                    <small>日期: {formattedDate}</small>
                </div>
                <div style={amountStyle}>
                    <h3>{isExpense ? '' : '+'} {amount.toLocaleString()}</h3>
                </div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={onDelete}>刪除</button>
        </div>
    );
};

export default TransactionItem; 