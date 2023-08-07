import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productCreateReviewReducer,
  productTopRatedReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  userLoginReducer,
  userGoogleLoginReducer,
  userRegisterReducer,
  userActivateReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
  orderPayCashOnDeliveryReducer,
} from "./reducers/orderReducers";

import { changeLangReducer } from "./reducers/langReducers";

// We must always add our reducers to the store

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productCreateReview: productCreateReviewReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userGoogleLogin: userGoogleLoginReducer,
  // when we useSelect these, we will reference it by object key
  // useSelect(state => state.userRegister)
  // Then, we destructure the states that are in the userReducer from userRegister
  userRegister: userRegisterReducer,
  userActivate: userActivateReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderPayCashOnDelivery: orderPayCashOnDeliveryReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  changeLang: changeLangReducer,
});

// We can get our cartItems from here, or tokens.
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : [];

// We want to show our initial user info when the app loads
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Since we are saving the shippin info in localStorage, we want to load it from localStorage through store.js
// When our store initializes, if there is anything in the localStorage, we want to add it to initial state
const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

// const languageFromStorage = localStorage.getItem("language")
//   ? JSON.parse(localStorage.getItem("language"))
//   : { lang: "en" }; // Set your default language here, "en" in this case

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
  userGoogleLogin: { userInfo: userInfoFromStorage },
  // changeLang: languageFromStorage,
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
