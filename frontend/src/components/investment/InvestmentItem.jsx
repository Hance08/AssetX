import React, { useContext } from 'react';
import InvestmentContext from '../../context/investment/investmentContext';

const InvestmentItem = ({ investment }) => {
    const investmentContext = useContext(InvestmentContext);
    const { deleteInvestment, setCurrentInvestment, clearCurrentInvestment, current } = investmentContext;

    const { _id, name, symbol } = investment;

    const onDelete = () => {
        deleteInvestment(_id);
        clearCurrentInvestment();
    };

    const onEdit = () => {
        setCurrentInvestment(investment);
    };

    const itemStyle = {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    return (
        <li className={`list-group-item ${current && current._id === _id ? 'active' : ''}`} style={itemStyle}>
            <span onClick={onEdit}>
                {name} ({symbol})
            </span>
            <div>
                <button className="btn btn-secondary btn-sm" onClick={onEdit}>編輯</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>刪除</button>
            </div>
        </li>
    );
};

export default InvestmentItem; 