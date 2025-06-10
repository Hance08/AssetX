import React, { useReducer, useContext } from "react";
import axios from "axios";
import TransactionContext from "./transactionContext";
import transactionReducer from "./transactionReducer";
import AccountContext from "../account/accountContext"; // 引入 AccountContext
import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  UPDATE_TRANSACTION,
  TRANSACTION_ERROR,
  CLEAR_TRANSACTIONS,
  SET_CURRENT_TRANSACTION,
  CLEAR_CURRENT_TRANSACTION,
  DELETE_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_FAIL,
} from "./types";

const TransactionState = (props) => {
  const initialState = {
    transactions: [],
    current: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // 引入 getAccounts 函式
  const { getAccounts } = useContext(AccountContext);

  // Get Transactions
  const getTransactions = async (params = {}) => {
    try {
      const res = await axios.get("/api/transactions", { params });
      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.data,
      });
    }
  };

  // Add Transaction
  const addTransaction = async (transaction) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/transactions", transaction, config);
      dispatch({
        type: ADD_TRANSACTION,
        payload: res.data,
      });
      // 新增成功後，更新帳戶餘額
      getAccounts();
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.data,
      });
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id, transferId) => {
    try {
      // If transferId is present, we tell the backend to delete both transfer records
      const url = transferId
        ? `/api/transactions/transfer/${transferId}`
        : `/api/transactions/${id}`;
      await axios.delete(url);

      dispatch({
        type: DELETE_TRANSACTION_SUCCESS,
        payload: transferId || id, // Send transferId or id to reducer
        isTransfer: !!transferId, // Flag to indicate if it was a transfer
      });
    } catch (err) {
      dispatch({
        type: DELETE_TRANSACTION_FAIL,
        payload: err.response?.data?.msg || "Server Error",
      });
    }
  };

  // Update Transaction (Note: Updating might affect two accounts, so refreshing is important)
  const updateTransaction = async (transaction) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `/api/transactions/${transaction._id}`,
        transaction,
        config
      );
      dispatch({
        type: UPDATE_TRANSACTION,
        payload: res.data,
      });
      getAccounts();
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.data,
      });
    }
  };

  // Set Current Transaction
  const setCurrent = (transaction) => {
    dispatch({ type: SET_CURRENT_TRANSACTION, payload: transaction });
  };

  // Clear Current Transaction
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT_TRANSACTION });
  };

  // Transfer Funds
  const transferFunds = async (transferData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.post("/api/transactions/transfer", transferData, config);
      // 轉帳成功後，重新取得所有交易紀錄和帳戶資料
      getTransactions();
      getAccounts();
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.data,
      });
    }
  };

  // Clear Transactions
  const clearTransactions = () => {
    dispatch({ type: CLEAR_TRANSACTIONS });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        clearTransactions,
        setCurrent,
        clearCurrent,
        transferFunds,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;
