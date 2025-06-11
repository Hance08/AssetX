import React, { useReducer } from "react";
import axios from "axios";
import DividendContext from "./dividendContext";
import dividendReducer from "./dividendReducer";
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
} from "../types";

const DividendState = (props) => {
  const initialState = {
    dividends: [],
    current: null,
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(dividendReducer, initialState);

  const setLoading = () => dispatch({ type: SET_DIVIDEND_LOADING });

  // Get Dividends for a specific investment
  const getDividends = async (investmentId) => {
    setLoading();
    try {
      const res = await axios.get(`/api/dividends/${investmentId}`);
      dispatch({ type: GET_DIVIDENDS_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({
        type: GET_DIVIDENDS_FAIL,
        payload: err.response?.data?.msg,
      });
    }
  };

  // Add Dividend
  const addDividend = async (dividend) => {
    setLoading();
    try {
      const res = await axios.post("/api/dividends", dividend);
      dispatch({ type: ADD_DIVIDEND_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({
        type: ADD_DIVIDEND_FAIL,
        payload: err.response?.data?.msg,
      });
    }
  };

  // Update Dividend
  const updateDividend = async (dividend) => {
    setLoading();
    try {
      const res = await axios.put(
        `/api/dividends/${dividend._id}`,
        dividend
      );
      dispatch({ type: UPDATE_DIVIDEND_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({
        type: UPDATE_DIVIDEND_FAIL,
        payload: err.response?.data?.msg,
      });
    }
  };

  // Delete Dividend
  const deleteDividend = async (id) => {
    setLoading();
    try {
      await axios.delete(`/api/dividends/${id}`);
      dispatch({ type: DELETE_DIVIDEND_SUCCESS, payload: id });
    } catch (err) {
      dispatch({
        type: DELETE_DIVIDEND_FAIL,
        payload: err.response?.data?.msg,
      });
    }
  };

  // Set Current Dividend
  const setCurrentDividend = (dividend) => {
    dispatch({ type: SET_CURRENT_DIVIDEND, payload: dividend });
  };

  // Clear Current Dividend
  const clearCurrentDividend = () => {
    dispatch({ type: CLEAR_CURRENT_DIVIDEND });
  };

  return (
    <DividendContext.Provider
      value={{
        dividends: state.dividends,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getDividends,
        addDividend,
        updateDividend,
        deleteDividend,
        setCurrentDividend,
        clearCurrentDividend,
      }}
    >
      {props.children}
    </DividendContext.Provider>
  );
};

export default DividendState; 