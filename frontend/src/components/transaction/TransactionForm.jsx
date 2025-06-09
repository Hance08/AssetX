import React, { useState, useContext, useEffect } from 'react';
import TransactionContext from '../../context/transaction/transactionContext';
import AccountContext from '../../context/account/accountContext';

const TransactionForm = () => {
    const transactionContext = useContext(TransactionContext);
    const accountContext = useContext(AccountContext);

    const { addTransaction } = transactionContext;
    const { accounts, getAccounts } = accountContext;

    useEffect(() => {
        getAccounts();
        // eslint-disable-next-line
    }, []);
    
    const [transaction, setTransaction] = useState({
        notes: '',
        amount: 0,
        type: 'expense',
        date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
        category: 'food',
        accountId: ''
    });

    const { notes, amount, type, date, category, accountId } = transaction;

    const onChange = e => {
        setTransaction({ 
            ...transaction, 
            [e.target.name]: e.target.name === 'amount' ? parseFloat(e.target.value) || 0 : e.target.value 
        });
    }

    const onSubmit = e => {
        e.preventDefault();
        if(!accountId){
            return alert('請選擇一個帳戶');
        }
        addTransaction(transaction);
        // Clear form
        setTransaction({
            notes: '',
            amount: 0,
            type: 'expense',
            date: new Date().toISOString().slice(0, 10),
            category: 'food',
            accountId: ''
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>新增交易</h2>
            <select name="accountId" value={accountId} onChange={onChange} required>
                <option value="" disabled>-- 請選擇帳戶 --</option>
                {accounts.map(account => (
                    <option key={account._id} value={account._id}>
                        {account.name}
                    </option>
                ))}
            </select>
            <input type="text" placeholder="備註" name="notes" value={notes} onChange={onChange} />
            <input type="number" placeholder="金額" name="amount" value={amount} onChange={onChange} required />
            <input type="date" name="date" value={date} onChange={onChange} required />
            
            <h5>類型</h5>
            <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={onChange} /> 支出{' '}
            <input type="radio" name="type" value="income" checked={type === 'income'} onChange={onChange} /> 收入

            <h5>分類</h5>
            <input type="text" placeholder="分類" name="category" value={category} onChange={onChange} required />
            
            <div>
                <input type="submit" value="新增交易" className="btn btn-primary btn-block" />
            </div>
        </form>
    );
};

export default TransactionForm; 