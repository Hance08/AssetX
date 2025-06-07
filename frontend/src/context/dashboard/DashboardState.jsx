import React, { useReducer } from 'react';
import axios from 'axios';
import DashboardContext from './dashboardContext';
import dashboardReducer from './dashboardReducer';
import {
    GET_DASHBOARD_SUMMARY_SUCCESS,
    GET_DASHBOARD_SUMMARY_FAIL,
    GET_MONTHLY_CATEGORY_SUMMARY_SUCCESS,
    GET_MONTHLY_CATEGORY_SUMMARY_FAIL,
    GET_ASSET_DISTRIBUTION_SUCCESS,
    GET_ASSET_DISTRIBUTION_FAIL,
    GET_NET_WORTH_GROWTH_SUCCESS,
    GET_NET_WORTH_GROWTH_FAIL,
    SET_DASHBOARD_LOADING,
} from '../types';

const DashboardState = props => {
    const initialState = {
        summary: null,
        monthlyCategorySummary: [],
        assetDistribution: [],
        netWorthGrowth: [],
        loading: false,
        error: null
    };

    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    // 設定 Loading
    const setLoading = () => dispatch({ type: SET_DASHBOARD_LOADING });

    // 取得儀表板摘要
    const getDashboardSummary = async () => {
        setLoading();
        try {
            const res = await axios.get('/api/dashboard/summary');
            dispatch({
                type: GET_DASHBOARD_SUMMARY_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: GET_DASHBOARD_SUMMARY_FAIL,
                payload: err.response.data.msg
            });
        }
    };

    // 取得月支出分類摘要
    const getMonthlyCategorySummary = async (year, month) => {
        setLoading();
        try {
            const res = await axios.get(`/api/dashboard/monthly-category-summary?year=${year}&month=${month}`);
            dispatch({
                type: GET_MONTHLY_CATEGORY_SUMMARY_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: GET_MONTHLY_CATEGORY_SUMMARY_FAIL,
                payload: err.response.data.msg
            });
        }
    };
    
    // 取得資產分佈
    const getAssetDistribution = async () => {
        setLoading();
        try {
            const res = await axios.get('/api/dashboard/asset-distribution');
            dispatch({
                type: GET_ASSET_DISTRIBUTION_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: GET_ASSET_DISTRIBUTION_FAIL,
                payload: err.response.data.msg
            });
        }
    };

    // 取得淨值成長數據
    const getNetWorthGrowth = async () => {
        setLoading();
        try {
            const res = await axios.get('/api/dashboard/net-worth-growth');
            dispatch({
                type: GET_NET_WORTH_GROWTH_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: GET_NET_WORTH_GROWTH_FAIL,
                payload: err.response.data.msg
            });
        }
    };


    return (
        <DashboardContext.Provider
            value={{
                summary: state.summary,
                monthlyCategorySummary: state.monthlyCategorySummary,
                assetDistribution: state.assetDistribution,
                netWorthGrowth: state.netWorthGrowth,
                loading: state.loading,
                error: state.error,
                getDashboardSummary,
                getMonthlyCategorySummary,
                getAssetDistribution,
                getNetWorthGrowth
            }}
        >
            {props.children}
        </DashboardContext.Provider>
    );
};

export default DashboardState; 