import React, { useContext } from 'react';
import TradeContext from '../../context/trade/tradeContext';

const TradeItem = ({ trade, onEditClick }) => {
    const tradeContext = useContext(TradeContext);
    const { deleteTrade } = tradeContext;
    
    const { _id, date, type, shares, price, fee } = trade;

    const formattedDate = new Date(date).toLocaleDateString('zh-TW');
    const tradeType = type === 'buy' ? '買入' : '賣出';
    const totalCost = (shares * price) + fee;

    const typeStyle = {
        color: type === 'buy' ? 'red' : 'green'
    };

    const onDelete = () => {
        deleteTrade(_id);
    }

    return (
        <tr>
            <td>{formattedDate}</td>
            <td style={typeStyle}>{tradeType}</td>
            <td>{shares.toLocaleString()}</td>
            <td>{price.toLocaleString()}</td>
            <td>{fee.toLocaleString()}</td>
            <td>{totalCost.toLocaleString()}</td>
            <td>
                <button className="btn btn-secondary btn-sm" onClick={() => onEditClick(trade)}>編輯</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>刪除</button>
            </td>
        </tr>
    );
};

export default TradeItem; 