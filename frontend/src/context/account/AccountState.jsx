import React, { useReducer } from 'react';
import axios from 'axios';
import AccountContext from './accountContext';
import accountReducer from './accountReducer';
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

const AccountState = props => {
  const initialState = {
    accounts: [],
    current: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(accountReducer, initialState);

  // Get Accounts
  const getAccounts = async () => {
    try {
      const res = await axios.get('/api/accounts');
      dispatch({
        type: GET_ACCOUNTS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: err.response.data
      });
    }
  };

  // Add Account
  const addAccount = async account => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/accounts', account, config);
      dispatch({
        type: ADD_ACCOUNT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: err.response.data
      });
    }
  };

  // Delete Account
  const deleteAccount = async id => {
    try {
      await axios.delete(`/api/accounts/${id}`);
      dispatch({
        type: DELETE_ACCOUNT,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: err.response.data
      });
    }
  };
  
  // Update Account
  const updateAccount = async account => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.put(`/api/accounts/${account._id}`, account, config);
        dispatch({
            type: UPDATE_ACCOUNT,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ACCOUNT_ERROR,
            payload: err.response.data
        });
    }
  }

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // Clear Accounts
  const clearAccounts = () => {
      dispatch({ type: CLEAR_ACCOUNTS })
  }

  // Set Current Account
  const setCurrent = account => {
      dispatch({ type: SET_CURRENT_ACCOUNT, payload: account });
  }

  // Clear Current Account
  const clearCurrent = () => {
      dispatch({ type: CLEAR_CURRENT_ACCOUNT });
  }


  return (
    <AccountContext.Provider
      value={{
        accounts: state.accounts,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getAccounts,
        addAccount,
        deleteAccount,
        updateAccount,
        clearAccounts,
        setCurrent,
        clearCurrent,
        clearErrors
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountState; 