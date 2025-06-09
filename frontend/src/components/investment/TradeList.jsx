import React, { useContext } from 'react';
import TradeContext from '../../context/trade/tradeContext';
import TradeItem from './TradeItem';

const TradeList = ({ onEditTrade }) => {
    const tradeContext = useContext(TradeContext);
    const { trades, loading } = tradeContext;

    if (loading) {
        return <h4>讀取交易紀錄中...</h4>;
    }

    if (trades.length === 0) {
        return <p>此標的尚無交易紀錄。</p>;
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>日期</th>
                    <th>類型</th>
                    <th>股數</th>
                    <th>價格</th>
                    <th>手續費</th>
                    <th>總金額</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {trades.map(trade => (
                    <TradeItem key={trade._id} trade={trade} onEditClick={onEditTrade} />
                ))}
            </tbody>
        </table>
    );
};

export default TradeList; 