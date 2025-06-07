import {
    GET_TRADES_SUCCESS,
    GET_TRADES_FAIL,
    ADD_TRADE_SUCCESS,
    ADD_TRADE_FAIL,
    UPDATE_TRADE_SUCCESS,
    UPDATE_TRADE_FAIL,
    DELETE_TRADE_SUCCESS,
    DELETE_TRADE_FAIL,
    SET_CURRENT_TRADE,
    CLEAR_CURRENT_TRADE,
    SET_TRADE_LOADING,
    CLEAR_TRADES,
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_TRADES_SUCCESS:
            return {
                ...state,
                trades: action.payload,
                loading: false,
                error: null,
            };
        case ADD_TRADE_SUCCESS:
            return {
                ...state,
                trades: [...state.trades, action.payload],
                loading: false,
            };
        case UPDATE_TRADE_SUCCESS:
            return {
                ...state,
                trades: state.trades.map(trade =>
                    trade._id === action.payload._id ? action.payload : trade
                ),
                loading: false,
            };
        case DELETE_TRADE_SUCCESS:
            return {
                ...state,
                trades: state.trades.filter(trade => trade._id !== action.payload),
                loading: false,
            };
        case SET_CURRENT_TRADE:
            return {
                ...state,
                currentTrade: action.payload,
            };
        case CLEAR_CURRENT_TRADE:
            return {
                ...state,
                currentTrade: null,
            };
        case CLEAR_TRADES:
            return {
                ...state,
                trades: [],
                loading: false,
                error: null
            };
        case GET_TRADES_FAIL:
        case ADD_TRADE_FAIL:
        case UPDATE_TRADE_FAIL:
        case DELETE_TRADE_FAIL:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case SET_TRADE_LOADING:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
}; 