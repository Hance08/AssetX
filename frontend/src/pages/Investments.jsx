import React, { useState, useContext, useEffect } from 'react';
import InvestmentContext from '../context/investment/investmentContext';
import TradeContext from '../context/trade/tradeContext';
import InvestmentForm from '../components/investment/InvestmentForm';
import InvestmentList from '../components/investment/InvestmentList';
import TradeList from '../components/investment/TradeList';
import TradeForm from '../components/investment/TradeForm';

const Investments = () => {
    const investmentContext = useContext(InvestmentContext);
    const { current } = investmentContext;

    const tradeContext = useContext(TradeContext);
    const { getTrades, clearTrades, setCurrentTrade } = tradeContext;

    const [showTradeForm, setShowTradeForm] = useState(false);

    useEffect(() => {
        if (current) {
            getTrades(current._id);
        } else {
            clearTrades();
        }
        setShowTradeForm(false); // 切換投資標的時，總是隱藏表單
        // eslint-disable-next-line
    }, [current]);

    const onEditTrade = (trade) => {
        setCurrentTrade(trade);
        setShowTradeForm(true);
    };

    const onAddNewTrade = () => {
        setCurrentTrade(null); // 確保是新增模式
        setShowTradeForm(true);
    };

    const pageStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '2rem'
    };

    return (
        <div style={pageStyle}>
            <div>
                <InvestmentForm />
                <hr />
                <InvestmentList />
            </div>
            <div>
                {current ? (
                    <div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h2>{current.name} ({current.symbol}) 的詳細資料</h2>
                            <button className="btn btn-primary" onClick={onAddNewTrade}>新增交易</button>
                        </div>

                        {showTradeForm && <TradeForm setShowForm={setShowTradeForm} />}
                        
                        <TradeList onEditTrade={onEditTrade} />
                    </div>
                ) : (
                    <h2>請從左側列表選擇一個投資標的來查看詳細資料，或新增一個標的。</h2>
                )}
            </div>
        </div>
    );
};

export default Investments; 