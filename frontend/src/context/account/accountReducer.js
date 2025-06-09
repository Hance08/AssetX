import {
  GET_ACCOUNTS,
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  UPDATE_ACCOUNT,
  ACCOUNT_ERROR,
  CLEAR_ACCOUNTS,
  SET_CURRENT_ACCOUNT,
  CLEAR_CURRENT_ACCOUNT,
  CLEAR_ERRORS
} from './types';

const accountReducer = (state, action) => {
  switch (action.type) {
    case GET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload,
        loading: false
      };
    case ADD_ACCOUNT:
      return {
        ...state,
        accounts: [...state.accounts, action.payload],
        loading: false
      };
    case UPDATE_ACCOUNT:
        return {
            ...state,
            accounts: state.accounts.map(account =>
                account._id === action.payload._id ? action.payload : account
            ),
            loading: false
        }
    case DELETE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(
          account => account._id !== action.payload
        ),
        loading: false
      };
    case CLEAR_ACCOUNTS:
      return {
        ...state,
        accounts: [],
        current: null,
        error: null,
      }
    case SET_CURRENT_ACCOUNT:
        return {
            ...state,
            current: action.payload
        }
    case CLEAR_CURRENT_ACCOUNT:
        return {
            ...state,
            current: null
        }
    case ACCOUNT_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default accountReducer; 