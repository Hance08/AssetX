import React, { useContext, useEffect } from 'react';
import TransactionContext from '../context/transaction/transactionContext';
import TransactionForm from '..ˇˇˇˇˇˇˇˇ/components/transaction/TransactionForm';
import TransactionItem from '../components/transaction/TransactionItem';

const Transactions = () => {
    const transactionContext = useContext(TransactionContext);
    const { transactions, getTransactions, loading } = transactionContext;

    useEffect(() => {
        getTransactions();
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
                <TransactionForm />
            </div>
            <div>
                <h1>交易紀錄</h1>
                {transactions.length > 0 && !loading ? (
                    transactions.map(transaction => (
                        <TransactionItem key={transaction._id} transaction={transaction} />
                    ))
                ) : (
                    <p>您尚未新增任何交易紀錄。</p>
                )}
            </div>
        </div>
    );
};

export default Transactions; 