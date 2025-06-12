import {
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  ADD_SUBCATEGORY_SUCCESS,
  ADD_SUBCATEGORY_FAIL,
  SET_CATEGORY_LOADING,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null,
      };
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        loading: false,
        error: null,
      };
    case ADD_SUBCATEGORY_SUCCESS:
        return {
            ...state,
            categories: state.categories.map(cat => 
                cat._id === action.payload._id ? action.payload : cat
            ),
            loading: false,
            error: null,
        };
    case GET_CATEGORIES_FAIL:
    case ADD_CATEGORY_FAIL:
    case ADD_SUBCATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SET_CATEGORY_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}; 