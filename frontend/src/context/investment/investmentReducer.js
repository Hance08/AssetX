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
    GET_INVESTMENT_SUCCESS,
    GET_INVESTMENT_FAIL,
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
        case GET_INVESTMENTS_FAIL:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case GET_INVESTMENT_SUCCESS:
            return {
                ...state,
                investments: state.investments.some(
                    (inv) => inv._id === action.payload._id
                )
                    ? state.investments.map((inv) =>
                        inv._id === action.payload._id ? action.payload : inv
                    )
                    : [...state.investments, action.payload],
                loading: false,
                error: null,
            };
        case ADD_INVESTMENT_SUCCESS:
            return {
                ...state,
                investments: [...state.investments, action.payload],
                loading: false,
                error: null,
            };
        case UPDATE_INVESTMENT_SUCCESS:
            return {
                ...state,
                investments: state.investments.map(inv =>
                    inv._id === action.payload._id ? action.payload : inv
                ),
                loading: false,
                error: null,
            };
        case DELETE_INVESTMENT_SUCCESS:
            return {
                ...state,
                investments: state.investments.filter(inv => inv._id !== action.payload),
                loading: false,
                error: null,
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
        case SET_INVESTMENT_LOADING:
            return {
                ...state,
                loading: true,
            };
        case INVESTMENT_ERROR:
        case GET_INVESTMENT_FAIL:
        case ADD_INVESTMENT_FAIL:
        case DELETE_INVESTMENT_FAIL:
        case UPDATE_INVESTMENT_FAIL:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
}; 