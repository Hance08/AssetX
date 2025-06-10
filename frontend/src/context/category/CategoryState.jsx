import React, { useReducer } from "react";
import axios from "axios";
import CategoryContext from "./categoryContext";
import categoryReducer from "./categoryReducer";
import {
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  ADD_SUBCATEGORY_SUCCESS,
  ADD_SUBCATEGORY_FAIL,
  SET_CATEGORY_LOADING,
} from "../types";

const CategoryState = (props) => {
  const initialState = {
    categories: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const getCategories = async () => {
    try {
      dispatch({ type: SET_CATEGORY_LOADING });
      const res = await axios.get("/api/categories");
      dispatch({ type: GET_CATEGORIES_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({
        type: GET_CATEGORIES_FAIL,
        payload: err.response?.data?.msg || "伺服器錯誤",
      });
    }
  };

  const addCategory = async (name) => {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/categories", { name }, config);
      dispatch({ type: ADD_CATEGORY_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({
        type: ADD_CATEGORY_FAIL,
        payload: err.response?.data?.msg || "伺服器錯誤",
      });
    }
  };

  const addSubcategory = async (categoryId, subcategory) => {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post(
        `/api/categories/${categoryId}/subcategories`,
        { subcategory },
        config
      );
      dispatch({ type: ADD_SUBCATEGORY_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({
        type: ADD_SUBCATEGORY_FAIL,
        payload: err.response?.data?.msg || "伺服器錯誤",
      });
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories: state.categories,
        loading: state.loading,
        error: state.error,
        getCategories,
        addCategory,
        addSubcategory,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
