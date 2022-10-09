import axios from "axios";
import { CART_ADD_ITEM } from "../constants/CartConstants";

export const addToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      quantity,
    },
  });

  // change it to JSON.stringify because we can only save strings into local storage
  localStorage.setItem("cartItems", JSON.stringify(getState.cart.cartItems));
};
