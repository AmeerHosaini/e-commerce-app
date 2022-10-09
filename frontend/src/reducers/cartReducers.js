import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/CartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      // check for existing items in the cart
      const item = action.payload;
      const existItem = state.cartItems.find(
        (id) => id.product === item.product
      );

      if (existItem) {
        // map through current item
        return {
          ...state,
          cartItems: state.cartItems.map((id) =>
            id.product === existItem.product ? item : id
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    default:
      return state;
  }
};
