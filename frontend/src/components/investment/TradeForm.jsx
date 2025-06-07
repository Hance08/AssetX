import React, { useState, useContext, useEffect } from 'react';
import InvestmentContext from '../../context/investment/investmentContext';
import TradeContext from '../../context/trade/tradeContext';

const TradeForm = ({ setShowForm }) => {
    const investmentContext = useContext(InvestmentContext);
    const tradeContext = useContext(TradeContext);

    const { current: currentInvestment } = investmentContext;
    const { addTrade, updateTrade, clearCurrentTrade, currentTrade } = tradeContext;

    const [trade, setTrade] = useState({
        date: new Date().toISOString().slice(0, 10),
        type: 'buy',
        shares: '',
        price: '',
        fee: ''
    });

    useEffect(() => {
        if (currentTrade) {
            // 如果是編輯模式，格式化日期以符合 <input type="date">
            const formattedDate = new Date(currentTrade.date).toISOString().slice(0, 10);
            setTrade({ ...currentTrade, date: formattedDate });
        } else {
            // 新增模式的預設值
            setTrade({
                date: new Date().toISOString().slice(0, 10),
                type: 'buy',
                shares: '',
                price: '',
                fee: ''
            });
        }
    }, [currentTrade]);

    const { date, type, shares, price, fee } = trade;

    const onChange = e => setTrade({ ...trade, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        const tradeData = { ...trade, investmentId: currentInvestment._id };
        
        if (currentTrade === null) {
            addTrade(tradeData);
        } else {
            updateTrade({ ...tradeData, _id: currentTrade._id });
        }
        closeForm();
    };

    const closeForm = () => {
        clearCurrentTrade();
        if (setShowForm) {
            setShowForm(false);
        }
    };

    return (
        <div style={{border: '1px solid #ccc', padding: '1rem', marginTop: '1rem', marginBottom: '1rem'}}>
            <form onSubmit={onSubmit}>
                <h4 className="text-primary">{currentTrade ? '編輯交易紀錄' : '新增交易紀錄'}</h4>
                <div className="form-group">
                    <label htmlFor="date">日期</label>
                    <input type="date" name="date" value={date} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="type">類型</label>
                    <select name="type" value={type} onChange={onChange} required>
                        <option value="buy">買入</option>
                        <option value="sell">賣出</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="shares">股數</label>
                    <input type="number" placeholder="股數" name="shares" value={shares} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="price">價格</label>
                    <input type="number" step="0.01" placeholder="每股價格" name="price" value={price} onChange={onChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="fee">手續費</label>
                    <input type="number" placeholder="手續費" name="fee" value={fee} onChange={onChange} />
                </div>
                <input
                    type="submit"
                    value={currentTrade ? '更新交易' : '新增交易'}
                    className="btn btn-primary btn-sm"
                />
                <button className="btn btn-light btn-sm" onClick={closeForm}>
                    取消
                </button>
            </form>
        </div>
    );
};

export default TradeForm; 