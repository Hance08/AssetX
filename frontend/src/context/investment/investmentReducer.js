import {
    GET_INVESTMENTS_SUCCESS,
    GET_INVESTMENTS_FAIL,
    ADD_INVESTMENT_SUCCESS,
    ADD_INVESTMENT_FAIL,
    UPDATE_INVESTMENT_SUCCESS,
    UPDATE_INVESTMENT_FAIL,
    DELETE_INVESTMENT_SUCCESS,
    DELETE_INVESTMENT_FAIL,
    SET_CURRENT_INVESTMENT,
    CLEAR_CURRENT_INVESTMENT,
    SET_INVESTMENT_LOADING,
    INVESTMENT_ERROR,
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_INVESTMENTS_SUCCESS:
            return {
                ...state,
                investments: action.payload,
                loading: false,
                error: null,
            };
        case ADD_INVESTMENT_SUCCESS:
            return {
                ...state,
                investments: [...state.investments, action.payload],
                loading: false,
            };
        case UPDATE_INVESTMENT_SUCCESS:
            return {
                ...state,
                investments: state.investments.map(inv =>
                    inv._id === action.payload._id ? action.payload : inv
                ),
                loading: false,
            };
        case DELETE_INVESTMENT_SUCCESS:
            return {
                ...state,
                investments: state.investments.filter(inv => inv._id !== action.payload),
                loading: false,
            };
        case SET_CURRENT_INVESTMENT:
            return {
                ...state,
                current: action.payload,
            };
        case CLEAR_CURRENT_INVESTMENT:
            return {
                ...state,
                current: null,
            };
        case GET_INVESTMENTS_FAIL:
        case ADD_INVESTMENT_FAIL:
        case UPDATE_INVESTMENT_FAIL:
        case DELETE_INVESTMENT_FAIL:
        case INVESTMENT_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case SET_INVESTMENT_LOADING:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
}; 