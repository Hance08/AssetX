import {
    GET_TRANSACTIONS,
    ADD_TRANSACTION,
    DELETE_TRANSACTION_SUCCESS,
    DELETE_TRANSACTION_FAIL,
    UPDATE_TRANSACTION,
    TRANSACTION_ERROR,
    CLEAR_TRANSACTIONS,
    SET_CURRENT,
    CLEAR_CURRENT,
    SET_LOADING,
} from './types';

const transactionReducer = (state, action) => {
    switch (action.type) {
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
                loading: false
            };
        case ADD_TRANSACTION:
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
                loading: false
            };
        case UPDATE_TRANSACTION:
            return {
                ...state,
                transactions: state.transactions.map(transaction =>
                    transaction._id === action.payload._id ? action.payload : transaction
                ),
                loading: false
            };
        case DELETE_TRANSACTION_SUCCESS:
            return {
                ...state,
                transactions: state.transactions.filter((transaction) => {
                    if (action.isTransfer) {
                        return transaction.transferId !== action.payload;
                    }
                    return transaction._id !== action.payload;
                }),
                loading: false,
            };
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            };
        case CLEAR_CURRENT:
            return {
                ...state,
                current: null
            };
        case CLEAR_TRANSACTIONS:
            return {
                ...state,
                transactions: [],
                error: null,
            }
        case TRANSACTION_ERROR:
        case DELETE_TRANSACTION_FAIL:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default transactionReducer; 