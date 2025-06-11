import {
    GET_DIVIDENDS_SUCCESS,
    GET_DIVIDENDS_FAIL,
    ADD_DIVIDEND_SUCCESS,
    ADD_DIVIDEND_FAIL,
    UPDATE_DIVIDEND_SUCCESS,
    UPDATE_DIVIDEND_FAIL,
    DELETE_DIVIDEND_SUCCESS,
    DELETE_DIVIDEND_FAIL,
    SET_CURRENT_DIVIDEND,
    CLEAR_CURRENT_DIVIDEND,
    SET_DIVIDEND_LOADING,
    DIVIDEND_ERROR,
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_DIVIDENDS_SUCCESS:
            return {
                ...state,
                dividends: action.payload,
                loading: false,
                error: null,
            };
        case ADD_DIVIDEND_SUCCESS:
            return {
                ...state,
                dividends: [action.payload, ...state.dividends],
                loading: false,
                error: null,
            };
        case UPDATE_DIVIDEND_SUCCESS:
            return {
                ...state,
                dividends: state.dividends.map(div =>
                    div._id === action.payload._id ? action.payload : div
                ),
                loading: false,
                error: null,
            };
        case DELETE_DIVIDEND_SUCCESS:
            return {
                ...state,
                dividends: state.dividends.filter(div => div._id !== action.payload),
                loading: false,
                error: null,
            };
        case SET_CURRENT_DIVIDEND:
            return {
                ...state,
                current: action.payload,
            };
        case CLEAR_CURRENT_DIVIDEND:
            return {
                ...state,
                current: null,
            };
        case SET_DIVIDEND_LOADING:
            return {
                ...state,
                loading: true,
            };
        case GET_DIVIDENDS_FAIL:
        case ADD_DIVIDEND_FAIL:
        case UPDATE_DIVIDEND_FAIL:
        case DELETE_DIVIDEND_FAIL:
        case DIVIDEND_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
}; 