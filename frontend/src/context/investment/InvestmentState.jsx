import React, { useReducer } from 'react';
import axios from 'axios';
import InvestmentContext from './investmentContext';
import investmentReducer from './investmentReducer';
import {
    GET_INVESTMENTS_SUCCESS,
    ADD_INVESTMENT_SUCCESS,
    DELETE_INVESTMENT_SUCCESS,
    UPDATE_INVESTMENT_SUCCESS,
    SET_CURRENT_INVESTMENT,
    CLEAR_CURRENT_INVESTMENT,
    SET_INVESTMENT_LOADING,
    INVESTMENT_ERROR,
} from '../types';

const InvestmentState = props => {
    const initialState = {
        investments: [],
        current: null,
        loading: true,
        error: null
    };

    const [state, dispatch] = useReducer(investmentReducer, initialState);

    // 加載動畫
    const setLoading = () => dispatch({ type: SET_INVESTMENT_LOADING });

    // 取得所有投資標的
    const getInvestments = async () => {
        setLoading();
        try {
            const res = await axios.get('/api/investments');
            dispatch({ type: GET_INVESTMENTS_SUCCESS, payload: res.data });
        } catch (err) {
            dispatch({ type: INVESTMENT_ERROR, payload: err.response.data.msg });
        }
    };

    // 新增投資標的
    const addInvestment = async investment => {
        setLoading();
        try {
            const res = await axios.post('/api/investments', investment);
            dispatch({ type: ADD_INVESTMENT_SUCCESS, payload: res.data });
        } catch (err) {
            dispatch({ type: INVESTMENT_ERROR, payload: err.response.data.msg });
        }
    };

    // 刪除投資標的
    const deleteInvestment = async id => {
        setLoading();
        try {
            await axios.delete(`/api/investments/${id}`);
            dispatch({ type: DELETE_INVESTMENT_SUCCESS, payload: id });
        } catch (err) {
            dispatch({ type: INVESTMENT_ERROR, payload: err.response.data.msg });
        }
    };

    // 更新投資標的
    const updateInvestment = async investment => {
        setLoading();
        try {
            const res = await axios.put(`/api/investments/${investment._id}`, investment);
            dispatch({ type: UPDATE_INVESTMENT_SUCCESS, payload: res.data });
        } catch (err) {
            dispatch({ type: INVESTMENT_ERROR, payload: err.response.data.msg });
        }
    };

    // 設定當前選中的標的
    const setCurrentInvestment = investment => {
        dispatch({ type: SET_CURRENT_INVESTMENT, payload: investment });
    };

    // 清除當前選中的標的
    const clearCurrentInvestment = () => {
        dispatch({ type: CLEAR_CURRENT_INVESTMENT });
    };

    return (
        <InvestmentContext.Provider
            value={{
                investments: state.investments,
                current: state.current,
                loading: state.loading,
                error: state.error,
                getInvestments,
                addInvestment,
                deleteInvestment,
                updateInvestment,
                setCurrentInvestment,
                clearCurrentInvestment
            }}
        >
            {props.children}
        </InvestmentContext.Provider>
    );
};

export default InvestmentState; 