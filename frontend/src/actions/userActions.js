import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_DETAILS_RESET,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_RESET,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
} from "../constants/userConstant";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstant";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    // When we are sending data, we want to send in the headers a content type of application json
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // We will get id, name, isAdmin, token in data
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg,
    });
  }
};

export const logout = () => (dispatch) => {
  // Remove the user from localstorage first
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  // We use reset because when we logout from one profile and log back in with another profile, we will see his orders and profile information
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  // For UI Purpose: If a user can see the users list, which is available to the admin, we don't want that to happen
  // Even though, navigate("/login") will solve the problem. But we are double checking
  // Even if another user sees that list, he won't do anything because he does not have the token
  dispatch({ type: USER_LIST_RESET });
  document.location.href = "/login";
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users",
      { name, email, password },
      config
    );
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    // After user registers, login the user rightaway
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg,
    });
  }
};

// We want to send a token
export const getUserDetails = (id) => async (dispatch, getState) => {
  // We can get userInfo from getState which has token in it
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // The id might be profile if we call it from profile screen
    const { data } = await axios.get(`/api/users/${id}`, config);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // The second argument is the data we want to update with
    const { data } = await axios.patch(`/api/users/profile`, user, config);

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg,
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/users", config);

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg,
    });
  }
};

export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${userId}`, config);

    // We won't send a payload, because we have a success state
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg,
    });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(`/api/users/${user._id}`, user, config);

    dispatch({ type: USER_UPDATE_SUCCESS });
    // We want to pass the updated data into user details
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.msg,
    });
  }
};
