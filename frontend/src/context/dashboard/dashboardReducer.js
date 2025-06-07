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
  
  export default (state, action) => {
    switch (action.type) {
      case GET_DASHBOARD_SUMMARY_SUCCESS:
        return {
          ...state,
          summary: action.payload,
          loading: false,
          error: null,
        };
      case GET_MONTHLY_CATEGORY_SUMMARY_SUCCESS:
        return {
            ...state,
            monthlyCategorySummary: action.payload,
            loading: false,
            error: null,
        }
      case GET_ASSET_DISTRIBUTION_SUCCESS:
        return {
            ...state,
            assetDistribution: action.payload,
            loading: false,
            error: null,
        }
      case GET_NET_WORTH_GROWTH_SUCCESS:
        return {
            ...state,
            netWorthGrowth: action.payload,
            loading: false,
            error: null,
        }
      case GET_DASHBOARD_SUMMARY_FAIL:
      case GET_MONTHLY_CATEGORY_SUMMARY_FAIL:
      case GET_ASSET_DISTRIBUTION_FAIL:
      case GET_NET_WORTH_GROWTH_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case SET_DASHBOARD_LOADING:
        return {
          ...state,
          loading: true,
        };
      default:
        return state;
    }
  }; 