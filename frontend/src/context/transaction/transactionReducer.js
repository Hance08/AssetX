import {
    GET_TRANSACTIONS,
    ADD_TRANSACTION,
    DELETE_TRANSACTION,
    UPDATE_TRANSACTION,
    TRANSACTION_ERROR,
    CLEAR_TRANSACTIONS
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
        case DELETE_TRANSACTION:
            return {
                ...state,
                transactions: state.transactions.filter(
                    transaction => transaction._id !== action.payload
                ),
                loading: false
            };
        case CLEAR_TRANSACTIONS:
            return {
                ...state,
                transactions: [],
                error: null,
            }
        case TRANSACTION_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default transactionReducer; 