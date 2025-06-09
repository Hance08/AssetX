import React, { useContext, useEffect } from 'react';
import InvestmentContext from '../../context/investment/investmentContext';
import InvestmentItem from './InvestmentItem';

const InvestmentList = () => {
    const investmentContext = useContext(InvestmentContext);
    const { investments, getInvestments, loading } = investmentContext;

    useEffect(() => {
        getInvestments();
        // eslint-disable-next-line
    }, []);

    if (loading && investments.length === 0) {
        return <h4>讀取中...</h4>;
    }

    return (
        <div>
            <h2>投資標的列表</h2>
            {investments.length > 0 ? (
                <ul className="list-group">
                    {investments.map(inv => (
                        <InvestmentItem key={inv._id} investment={inv} />
                    ))}
                </ul>
            ) : (
                <p>尚未新增任何投資標的。</p>
            )}
        </div>
    );
};

export default InvestmentList; 