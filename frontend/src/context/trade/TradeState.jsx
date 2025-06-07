import React, { useReducer } from 'react';
import axios from 'axios';
import TradeContext from './tradeContext';
import tradeReducer from './tradeReducer';
import {
    GET_TRADES_SUCCESS,
    GET_TRADES_FAIL,
    ADD_TRADE_SUCCESS,
    ADD_TRADE_FAIL,
    UPDATE_TRADE_SUCCESS,
    UPDATE_TRADE_FAIL,
    DELETE_TRADE_SUCCESS,
    DELETE_TRADE_FAIL,
    SET_TRADE_LOADING,
    CLEAR_TRADES,
    SET_CURRENT_TRADE,
    CLEAR_CURRENT_TRADE
} from '../types';

const TradeState = props => {
    const initialState = {
        trades: [],
        currentTrade: null,
        loading: false,
        error: null
    };

    const [state, dispatch] = useReducer(tradeReducer, initialState);

    // 加載動畫
    const setLoading = () => dispatch({ type: SET_TRADE_LOADING });

    // 根據 investmentId 取得交易紀錄
    const getTrades = async (investmentId) => {
        setLoading();
        try {
            const res = await axios.get(`/api/trades/${investmentId}`);
            dispatch({ type: GET_TRADES_SUCCESS, payload: res.data });
        } catch (err) {
            dispatch({ type: GET_TRADES_FAIL, payload: err.response?.data?.msg || '伺服器錯誤' });
        }
    };
    
    // 新增交易紀錄
    const addTrade = async (trade) => {
        setLoading();
        try {
            const res = await axios.post('/api/trades', trade);
            dispatch({ type: ADD_TRADE_SUCCESS, payload: res.data });
        } catch (err) {
            dispatch({ type: ADD_TRADE_FAIL, payload: err.response?.data?.msg || '伺服器錯誤' });
        }
    };

    // 刪除交易紀錄
    const deleteTrade = async (id) => {
        // 不需要 setLoading，讓畫面立即反應
        try {
            await axios.delete(`/api/trades/${id}`);
            dispatch({ type: DELETE_TRADE_SUCCESS, payload: id });
        } catch (err) {
            dispatch({ type: DELETE_TRADE_FAIL, payload: err.response?.data?.msg || '伺服器錯誤' });
        }
    };

    // 更新交易紀錄
    const updateTrade = async (trade) => {
        setLoading();
        try {
            const res = await axios.put(`/api/trades/${trade._id}`, trade);
            dispatch({ type: UPDATE_TRADE_SUCCESS, payload: res.data });
        } catch (err) {
            dispatch({ type: UPDATE_TRADE_FAIL, payload: err.response?.data?.msg || '伺服器錯誤' });
        }
    };

    // 設定當前選中的交易
    const setCurrentTrade = trade => {
        dispatch({ type: SET_CURRENT_TRADE, payload: trade });
    };

    // 清除當前選中的交易
    const clearCurrentTrade = () => {
        dispatch({ type: CLEAR_CURRENT_TRADE });
    };

    // 清除交易紀錄 (當切換投資標的時使用)
    const clearTrades = () => {
        dispatch({ type: CLEAR_TRADES });
    };

    return (
        <TradeContext.Provider
            value={{
                trades: state.trades,
                currentTrade: state.currentTrade,
                loading: state.loading,
                error: state.error,
                getTrades,
                addTrade,
                deleteTrade,
                updateTrade,
                clearTrades,
                setCurrentTrade,
                clearCurrentTrade
            }}
        >
            {props.children}
        </TradeContext.Provider>
    );
};

export default TradeState; 