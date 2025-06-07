import React, { useState, useContext, useEffect } from 'react';
import InvestmentContext from '../../context/investment/investmentContext';

const InvestmentForm = () => {
    const investmentContext = useContext(InvestmentContext);
    const { addInvestment, updateInvestment, clearCurrentInvestment, current } = investmentContext;

    const [investment, setInvestment] = useState({
        name: '',
        symbol: ''
    });

    useEffect(() => {
        if (current !== null) {
            setInvestment(current);
        } else {
            setInvestment({
                name: '',
                symbol: ''
            });
        }
    }, [investmentContext, current]);

    const { name, symbol } = investment;

    const onChange = e => setInvestment({ ...investment, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (current === null) {
            addInvestment(investment);
        } else {
            updateInvestment(investment);
        }
        clearForm();
    };

    const clearForm = () => {
        clearCurrentInvestment();
    };

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? '編輯投資標的' : '新增投資標的'}</h2>
            <input
                type="text"
                placeholder="股票名稱 (例如: 台積電)"
                name="name"
                value={name}
                onChange={onChange}
                required
            />
            <input
                type="text"
                placeholder="股票代號 (例如: 2330)"
                name="symbol"
                value={symbol}
                onChange={onChange}
                required
            />
            <div>
                <input
                    type="submit"
                    value={current ? '更新標的' : '新增標的'}
                    className="btn btn-primary btn-block"
                />
            </div>
            {current && (
                <div>
                    <button className="btn btn-light btn-block" onClick={clearForm}>
                        取消編輯
                    </button>
                </div>
            )}
        </form>
    );
};

export default InvestmentForm; 